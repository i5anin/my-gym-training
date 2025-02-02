const { Pool } = require("pg");
const xlsx = require("node-xlsx").default;
const { getNetworkDetails } = require("../db_type");
const config = require("../config");
const { join } = require("path");

const networkDetails = getNetworkDetails();
const dbConfig =
  networkDetails.databaseType === "build"
    ? config.dbConfig
    : config.dbConfigTest;

const pool = new Pool(dbConfig);

// Проверка корректности формата даты
function isValidDateFormat(dateString) {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  return regex.test(dateString);
}

// Преобразование строки в объект Date
function parseDate(dateString) {
  if (!isValidDateFormat(dateString)) {
    return null; // Неверный формат даты
  }

  const [day, month, year] = dateString.split(".").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  ) {
    return date;
  }
  return null; // Некорректная дата
}

// Преобразование строки в число
function parseNumber(str) {
  return parseFloat((str || "0").toString().replace(",", "."));
}

// Чтение данных из XLS файла
function readXLSData(filePath) {
  const workSheets = xlsx.parse(filePath);
  const data = workSheets[0].data;
  data.shift(); // Удаление заголовков столбцов
  return data;
}

// Обработка строки данных
function processRow(row) {
  const [
    _, // Пропускаем первый столбец (индекс)
    date_of_operation,
    date_of_payment,
    card_number,
    status,
    operation_amount,
    operation_currency,
    payment_amount,
    payment_currency,
    cashback,
    category,
    mcc,
    description,
    bonuses,
    rounding,
    total_amount_with_rounding,
  ] = row;

  return {
    date_of_operation,
    date_of_payment,
    card_number,
    status,
    operation_amount: parseNumber(operation_amount),
    operation_currency,
    payment_amount: parseNumber(payment_amount),
    payment_currency,
    cashback: parseNumber(cashback),
    category,
    mcc,
    description,
    bonuses: parseNumber(bonuses),
    rounding: parseNumber(rounding),
    total_amount_with_rounding: parseNumber(total_amount_with_rounding),
  };
}

// Проверка существования записи
async function checkExistingRecord(date_of_operation, date_of_payment) {
  const query = `
    SELECT * FROM dbo.transactions
    WHERE date_of_operation = $1 AND date_of_payment = $2
  `;
  const values = [date_of_operation, date_of_payment];
  const { rows } = await pool.query(query, values);
  return rows;
}

// Обновление записи
async function updateRecord(record) {
  const query = `
    UPDATE dbo.transactions
    SET card_number = $3, status = $4, operation_amount = $5, operation_currency = $6,
        payment_amount = $7, payment_currency = $8, cashback = $9, category = $10,
        mcc = $11, description = $12, bonuses = $13, rounding = $14, total_amount_with_rounding = $15
    WHERE date_of_operation = $1 AND date_of_payment = $2
  `;
  const values = [
    record.date_of_operation,
    record.date_of_payment,
    record.card_number,
    record.status,
    record.operation_amount,
    record.operation_currency,
    record.payment_amount,
    record.payment_currency,
    record.cashback,
    record.category,
    record.mcc,
    record.description,
    record.bonuses,
    record.rounding,
    record.total_amount_with_rounding,
  ];
  await pool.query(query, values);
}

// Вставка новой записи
async function insertRecord(record) {
  const query = `
    INSERT INTO dbo.transactions (
      date_of_operation, date_of_payment, card_number, status, operation_amount,
      operation_currency, payment_amount, payment_currency, cashback, category,
      mcc, description, bonuses, rounding, total_amount_with_rounding
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  `;
  const values = [
    record.date_of_operation,
    record.date_of_payment,
    record.card_number,
    record.status,
    record.operation_amount,
    record.operation_currency,
    record.payment_amount,
    record.payment_currency,
    record.cashback,
    record.category,
    record.mcc,
    record.description,
    record.bonuses,
    record.rounding,
    record.total_amount_with_rounding,
  ];
  await pool.query(query, values);
}

// Основная функция для обновления транзакций
async function updateTransactionsFromXLS(req, res) {
  const filePath = join(__dirname, "..", "..", "operations.xls");
  console.log("filePath=" + filePath);

  try {
    const data = readXLSData(filePath);
    let newRecordsCount = 0;
    let updatedRecordsCount = 0;

    for (let i = 0; i < data.length; i++) {
      let row = data[i].map((cell) => (cell !== null ? cell : "")); // Обработка пустых значений

      const rowNumber = i + 1;
      const date_of_operation = row[1];
      const date_of_payment = row[2];

      // Проверка корректности формата даты операции
      const parsedDateOfOperation = parseDate(date_of_operation);
      if (!parsedDateOfOperation) {
        console.error(
          `Invalid date_of_operation format in row ${rowNumber}: ${date_of_operation}, row data: ${JSON.stringify(
            row
          )}`
        );
        continue; // Пропускаем эту строку
      }

      // Проверка на номер карты вместо даты
      if (
        date_of_payment &&
        typeof date_of_payment === "string" &&
        date_of_payment.startsWith("*")
      ) {
        console.log(
          `Skipping row ${rowNumber} due to partial card number in date_of_payment: ${date_of_payment}`
        );
        continue; // Пропускаем строки с номерами карт
      }

      const parsedDateOfPayment = parseDate(date_of_payment);
      if (!parsedDateOfPayment) {
        console.error(
          `Invalid date_of_payment format in row ${rowNumber}: ${date_of_payment}, row data: ${JSON.stringify(
            row
          )}`
        );
        continue; // Пропускаем эту строку
      }

      // Преобразуем даты в ISO строку
      row[1] = parsedDateOfOperation.toISOString();
      row[2] = parsedDateOfPayment.toISOString();

      const record = processRow(row);

      const existingRows = await checkExistingRecord(
        record.date_of_operation,
        record.date_of_payment
      );

      if (existingRows.length > 0) {
        await updateRecord(record);
        updatedRecordsCount++;
      } else {
        await insertRecord(record);
        newRecordsCount++;
      }
    }

    // Итоговый результат
    const result = {
      newRecordsCount,
      updatedRecordsCount,
      message: "Transaction update process completed.",
    };

    if (newRecordsCount > 0) {
      console.log(`${newRecordsCount} new transactions inserted successfully.`);
    }
    if (updatedRecordsCount > 0) {
      console.log(`${updatedRecordsCount} transactions updated successfully.`);
    }
    if (newRecordsCount === 0 && updatedRecordsCount === 0) {
      console.log("No new or updated transactions.");
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error while updating transactions:", error);
    res.status(500).send("Error while updating transactions.");
  }

  console.log("Transaction update process completed.");
}

async function createAndInsertTransactionsFromXLS() {
  const filePath = "A:\\development\\finance\\server\\operations.xls";
  try {
    // Определение и создание таблицы transactions
    await pool.query(`
        DROP TABLE IF EXISTS dbo.transactions;
        CREATE TABLE dbo.transactions
        (
            transaction_id             SERIAL PRIMARY KEY,
            date_of_operation          TIMESTAMP(6),                --Дата операции
            date_of_payment            DATE,                        --Дата платежа
            card_number                VARCHAR(255),                --Номер карты
            status                     VARCHAR(50),                 --Статус
            operation_amount           NUMERIC(15, 2),              --Сумма операции
            operation_currency         VARCHAR(3),                  --Валюта операции
            payment_amount             NUMERIC(15, 2),              --Сумма платежа
            payment_currency           VARCHAR(3),                  --Валюта платежа
            cashback                   NUMERIC(15, 2),              --Кэшбэк
            category                   VARCHAR(255),                --Категория
            mcc                        VARCHAR(255),                --MCC
            description                TEXT,                        --Описание
            bonuses                    NUMERIC(15, 2),              --Бонусы (включая кэшбэк)
            rounding                   NUMERIC(15, 2),              --Округление на инвесткопилку
            total_amount_with_rounding NUMERIC(15, 2)               --Сумма операции с округлением
        );
    `);
    console.log("Table created successfully.");

    // Путь к файлу XLS
    const workSheets = xlsx.parse(filePath);
    const data = workSheets[0].data;
    data.shift(); // Удаление заголовков столбцов

    // Вставка данных в таблицу transactions
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      row = row.map((cell) => (cell !== null ? cell : "")); // Обработка пустых значений

      const query = `INSERT INTO dbo.transactions (
        date_of_operation, date_of_payment, card_number, status, operation_amount,
        operation_currency, payment_amount, payment_currency, cashback, category,
        mcc, description, bonuses, rounding, total_amount_with_rounding
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;

      await pool.query(query, row);
      console.log(`Inserted row ${i + 1} of ${data.length}`);
    }
    console.log("Transactions inserted successfully.");
  } catch (error) {
    console.error(
      "Error while creating table and inserting transactions:",
      error,
    );
  }
}


module.exports = {
  updateTransactionsFromXLS,
  createAndInsertTransactionsFromXLS
};
