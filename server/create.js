const sqlite3 = require('sqlite3').verbose()

// Подключение к базе данных (или её создание, если она не существует)
let db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error(err.message)
    return
  }
  console.log('Connected to the SQLite database.')
})

// SQL запрос для создания таблицы
const sql = `
    CREATE TABLE IF NOT EXISTS finance
    (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        date        TEXT,
        description TEXT,
        category    TEXT,
        amount      REAL,
        type        TEXT
    )`

// Выполнение SQL запроса
db.run(sql, (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Table created')
  }
})

// Закрытие соединения с базой данных
db.close((err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Closed the database connection.')
})
