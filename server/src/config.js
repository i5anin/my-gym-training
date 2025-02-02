module.exports = {
  dbConfigTest: {
    user: process.env.DB_TEST_USER,
    host: process.env.DB_TEST_HOST,
    database: process.env.DB_TEST_NAME,
    password: process.env.DB_TEST_PASSWORD,
    port: process.env.DB_TEST_PORT,
  },
  dbConfig: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  port: process.env.PORT,
}
