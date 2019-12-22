const Pool = require('pg').Pool
const config = require("config")

const pool = new Pool({
  user: config.get('postgresConfig.user'),
  host: config.get('postgresConfig.host'),
  database: config.get('postgresConfig.database'),
  password: config.get('postgresConfig.password'),
  port: config.get('postgresConfig.port'),
})

const runQuery = async (query, res, listOfArgs) => {
  try {
    const resFromDB = await pool.query(query, [...listOfArgs])
    if (resFromDB.rows.length === 1) return resFromDB.rows[0]
    return resFromDB.rows
  } catch (error) {
    return res.status(404).json({ msg: error.message })
  }

}
module.exports = runQuery
