const express = require('express')
const router = express.Router()

// Аутентификация
const loginController = require('./controllers/b_login')
router.get('/database-info', loginController.getDatabaseInfo)

// Транзакции (форма1 и модальное окно)
const finance = require('./controllers/b_transactions')

router.get('/gym', finance.getWorkoutSets)

router.get('/transactions/:year-:month/sum', finance.getIncomeExpenseProfit)
router.get('/transactions/:year-:month/list', finance.getTransactionsForMonthAndYear)
router.get('/transactions/:year-:month/chart', finance.getChartForMonthAndYear)
router.get('/transactions/id/:id', finance.getTransactionById)
router.get('/transactions/sum', finance.getMonthlyIncomeExpenseProfit)

// Пользовательские метки
const marker = require('./controllers/b_custom_mark')
router.get('/update_my_custom_marker', marker.myCustomMarker)

// Графики и расчёты
const graphic = require('./controllers/b_grafic')
router.get('/chart-data', graphic.getChartData)
router.get('/calculate-time', graphic.calculateTimeToReachTarget)

// Депозиты
const deposits = require('./controllers/b_deposits')
router.get('/deposits', deposits.getDeposits)

// Заполнение и обновление базы данных
const db = require('./controllers/b_excel')
router.get('/crate-database', db.createAndInsertTransactionsFromXLS)
router.get('/update-database', db.updateTransactionsFromXLS)

module.exports = router
