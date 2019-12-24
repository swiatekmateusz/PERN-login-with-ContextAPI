const runQuery = require('../config/queries')
const { check, validationResult } = require('express-validator')
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const transporter = require('../config/mail')

// @route POST  api/users
// @desc  Register a user
// @access Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with minimum 6 characters').isLength({ min: 6 })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body

  // Check if email is used
  const queryIsEmailUsed = "SELECT * FROM users WHERE email = $1"
  const user = await runQuery(queryIsEmailUsed, res, [email])

  if (user.length !== 0 || user.id) {
    return res.status(400).json({ msg: "User exists" })
  }

  //Hash password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  //Create email token
  const emailToken = jwt.sign({ email }, config.get('jwtSecrets.emailSecret'), { expiresIn: '1h' })

  // Robimy link i dodajemy do tabeli z : token,id usera, rodzaj linku(resetPasswd,activeMail)

  // Insert new user
  const date = Math.floor(Date.now() / 1000)
  try {
    const queryInsertUser = `INSERT INTO users (name,email,password,date) VALUES ($1,$2,$3,to_timestamp($4))`
    const addUser = await runQuery(queryInsertUser, res, [name, email, hashPassword, date])
      .then(() => {
        transporter.sendMail({
          to: email,
          subject: 'Confirm email',
          html: `http://localhost:3000/confirm/${emailToken}`
        })
        res.send("Success register")
      }).catch(err => {
        console.log(err);
        res.status(500).send("Server erorr")
      })

    const queryInsertLink = `INSERT INTO links (email,token,typeoflink) VALUES ($1,$2,$3)`
    const addLink = await runQuery(queryInsertLink, res, [email, emailToken, "activeemail"])

  } catch (err) {
    console.log(err);
    res.status(500).send("Server erorr")
  }
})

// api/users/resend/:email
// sprawdzamy email z tabeli users oraz czy juz potwiedzil email, jezeli nie potwiedzil
// usuwamy z drugiej tabeli rekord z takim email, tworzymy nowy link i wysylamy na maila i dodajemy do tabeli

// @route POST  api/users
// @desc  Confirm email
// @access Public
router.get('/confirm/:token', async (req, res) => {
  const token = req.params.token
  // Verify token
  try {
    const getRowWithToken = "SELECT * FROM links WHERE token = $1 AND typeoflink = 'activeemail'"
    const row = await runQuery(getRowWithToken, res, [token]);
    if (row.length === 0) {
      res.status(401).send("Invalid token")
    } else {
      jwt.verify(token, config.get('jwtSecrets.emailSecret'), async (error, decoded) => {
        // Check if errrs
        if (error !== null) {
          // USUWANIE Z BAZY linku dajacego error
          const deleteActiveEmail = "DELETE FROM links WHERE token = $1 AND typeoflink = 'activeemail'"
          const deleteRow = await runQuery(deleteActiveEmail, res, [tpoken])
          if (error.message === 'jwt expired') return res.status(401).send('Link expired')
          if (error.message === 'invalid token' || error.message === 'jwt malformed') return res.status(401).send('Invalid link')
          else return res.status(401).json({ error })
        }
        // If no error
        if (decoded) {
          const { email } = decoded
          const updateActiveEmail = "UPDATE users SET emailconfirmed = 'true' WHERE email = $1"
          //Update confirmation to true for email from token
          const activeemail = await runQuery(updateActiveEmail, res, [email])

          const deleteActiveEmail = "DELETE FROM links WHERE email = $1 AND typeoflink = 'activeemail'"
          const deleteRow = await runQuery(deleteActiveEmail, res, [email])
          res.send("Success confimed")
        }
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server erorr")
  }
})

module.exports = router