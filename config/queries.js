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
    if (resFromDB.rows.length === 1) return resFromDB.rows[0]
    return resFromDB.rows
  } catch (error) {
    return res.status(404).json({ msg: error.message })
  }

}
module.exports = runQuery
