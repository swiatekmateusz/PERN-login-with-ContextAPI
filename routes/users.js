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
    return res.json({ errors: errors.array() })
  }
  const { name, email, password } = req.body

  // Check if email is used
  const queryIsEmailUsed = "SELECT * FROM users WHERE email = $1"
  const user = await runQuery(queryIsEmailUsed, res, [email])

  if (user.length !== 0 || user.id) {
    console.log(user);
    return res.status(400).json({ msg: "User exists" })
  }

  //Hash password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  //Create email token
  const emailToken = jwt.sign({ email }, config.get('jwtSecrets.emailSecret'), { expiresIn: '1h' })

  // Insert new user
  const date = Math.floor(Date.now() / 1000)
  const queryInsertUser = `INSERT INTO users (name,email,password,date) VALUES ($1,$2,$3,to_timestamp($4))`
  const res2 = await runQuery(queryInsertUser, res, [name, email, hashPassword, date])
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
})

// @route POST  api/users
// @desc  Confirm email
// @access Public
router.get('/confirm/:token', (req, res) => {
  const token = req.params.token
  // Verify token
  jwt.verify(token, config.get('jwtSecrets.emailSecret'), async (error, decoded) => {
    // Check if errrs
    if (error !== null) {
      if (error.message === 'jwt expired') return res.status(401).send('Link expired')
      if (error.message === 'invalid token' || error.message === 'jwt malformed') return res.status(401).send('Invalid link')
      else return res.status(401).json({ error })
    }
    // If no error
    if (decoded) {
      const { email } = decoded
      const query = "UPDATE users SET emailconfirmed = 'true' WHERE email = $1"
      //Update confirmation to true for email from token
      const response = await runQuery(query, res, [email])
        .then(() => {
          res.redirect('/login')
        }).catch(err => {
          res.status(404).json(err)
        })
    }
  })
})

module.exports = router