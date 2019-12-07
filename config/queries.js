const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

const runQuery = async (query, res, listOfArgs) => {
  try {
    const resFromDB = await pool.query(query, [...listOfArgs])
    return resFromDB.rows
  } catch (error) {
    return res.status(404).json({ msg: error.message })
  }

}
module.exports = runQuery
