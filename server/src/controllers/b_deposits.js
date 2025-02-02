const { Pool } = require('pg')
const { getNetworkDetails } = require('../db_type')
const config = require('../config')

const networkDetails = getNetworkDetails()
const dbConfig = networkDetails.databaseType === 'build' ? config.dbConfig : config.dbConfigTest

// Создание пула соединений с базой данных
const pool = new Pool(dbConfig)

// Функция для получения данных для графика
async function getDeposits(req, res) {
  try {
    const query = `
      WITH deposit_data AS (
        SELECT 
          id, 
          money, 
          bet, 
          start_date, 
          end_date, 
          comment, 
          profit, 
          position,
          EXTRACT(DAY FROM (end_date - NOW())) AS days_left
        FROM 
          dbo.deposit
        ORDER BY 
          position
      ),
      total_sum AS (
        SELECT 
          SUM(money) AS total_money
        FROM 
          dbo.deposit
      )
      SELECT 
        d.*,
        t.total_money
      FROM 
        deposit_data d,
        total_sum t;
    `

    const { rows } = await pool.query(query)

    res.json(rows)
  } catch (error) {
    console.error('Error while fetching deposits:', error)
    res.status(500).send(error.message)
  }
}

// Добавление соответствующих маршрутов
module.exports = {
  getDeposits,
}
