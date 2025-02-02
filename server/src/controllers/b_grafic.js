const { Pool } = require('pg')
const { getNetworkDetails } = require('../db_type')
const config = require('../config')

const networkDetails = getNetworkDetails()
const dbConfig = networkDetails.databaseType === 'build' ? config.dbConfig : config.dbConfigTest

// Создание пула соединений с базой данных
const pool = new Pool(dbConfig)

// Функция для получения данных для графика
async function getChartData(req, res) {
  try {
    const query = `
      SELECT 
        date, 
        money, 
        usd, 
        usd_exchange_rate
      FROM 
        dbo.adjustment_funds
      ORDER BY 
        date;
    `

    const { rows } = await pool.query(query)

    const formattedResults = rows.map((row) => ({
      date: row.date,
      money: parseFloat(row.money).toFixed(2),
      usd: parseFloat(row.usd).toFixed(2),
      usd_exchange_rate: parseFloat(row.usd_exchange_rate).toFixed(4),
    }))

    res.json(formattedResults)
  } catch (error) {
    console.error('Error while fetching chart data:', error)
    res.status(500).send(error.message)
  }
}

async function calculateTimeToReachTarget(req, res) {
  try {
    const query = `
      SELECT 
        date, 
        money, 
        usd, 
        usd_exchange_rate
      FROM 
        dbo.adjustment_funds
      ORDER BY 
        date;
    `

    const { rows } = await pool.query(query)

    if (rows.length === 0) {
      return res.status(404).send('No data found')
    }

    let currentAmount = parseFloat(rows[0].money)
    let startDate = new Date(rows[0].date)
    let endDate = new Date(rows[rows.length - 1].date)
    let targetRow = null

    for (let i = 1; i < rows.length; i++) {
      const nextAmount = parseFloat(rows[i].money)
      const nextDate = new Date(rows[i].date)

      if (nextAmount > currentAmount) {
        endDate = nextDate
        targetRow = rows[i]
        break
      }

      currentAmount = nextAmount
    }

    // Calculate the time difference in days
    const timeDifference = endDate.getTime() - startDate.getTime()
    const daysToReachTarget = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

    const result = [
      {
        date: rows[0].date,
        money: parseFloat(rows[0].money).toFixed(2),
        usd: parseFloat(rows[0].usd).toFixed(2),
        usd_exchange_rate: parseFloat(rows[0].usd_exchange_rate).toFixed(4),
      },
      {
        date: endDate.toISOString(),
        money: targetRow ? parseFloat(targetRow.money).toFixed(2) : currentAmount.toFixed(2),
        usd: targetRow
          ? parseFloat(targetRow.usd).toFixed(2)
          : (currentAmount / parseFloat(rows[rows.length - 1].usd_exchange_rate)).toFixed(2),
        usd_exchange_rate: targetRow
          ? parseFloat(targetRow.usd_exchange_rate).toFixed(4)
          : '100.0000',
      },
    ]

    res.json({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      daysToReachTarget: daysToReachTarget,
      data: result,
    })
  } catch (error) {
    console.error('Error while calculating time to reach target:', error)
    res.status(500).send(error.message)
  }
}

// Добавление соответствующих маршрутов
module.exports = {
  getChartData,
  calculateTimeToReachTarget,
}
