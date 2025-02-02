require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const routers = require('./routers')
const { getNetworkDetails } = require('./db_type')
const networkDetails = getNetworkDetails()
const dbConfig =
  networkDetails.databaseType === 'build'
    ? config.dbConfig
    : config.dbConfigTest

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use('/api', routers)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message || 'Произошла ошибка на сервере',
  })
})

try {
  const { localIp } = getNetworkDetails()
  app.listen(config.port, localIp, () => {
    console.log(`DB connect http://${dbConfig.host}:${dbConfig.port}`)
    console.log(`Server is running on http://${localIp}:${config.server.port}`)
  })
} catch (error) {
  console.error(error.message)
  // Handle the error appropriately. You might want to exit the process if the IP cannot be determined
}
