const runQuery = require('../config/queries')
const { check, validationResult } = require('express-validator')
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const transporter = require('../config/mail')

//TO DO
//Argon zamiast bcrypt
// /confirm route

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

  try {
    // Check if email is used
    const queryIsEmailUsed = "SELECT * FROM users WHERE email = $1"
    const res1 = await runQuery(queryIsEmailUsed, res, [email])
    if (res1.length > 0) {
      return res.status(400).json({ msg: "This email have been used arleady" })
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    //Create email token
    const emailToken = jwt.sign({ email }, config.get('emailSecret'), { expiresIn: '1h' })


    // Insert new user
    const date = Math.floor(Date.now() / 1000)
    const queryInsertUser = `INSERT INTO users (name,email,password,date) VALUES ($1,$2,$3,to_timestamp($4))`
    const res2 = await runQuery(queryInsertUser, res, [name, email, hashPassword, date])
      .then(() => {
        transporter.sendMail({
          to: email,
          subject: 'Confirm email',
          html: `http://localhost:5000/api/users/confirm/${emailToken}`
        })
      }).then(() => {
        res.send("Success register")
      }).catch(err => console.log(err))
  } catch (error) {
    //Handle errors
    console.log(error.message);
    res.status(500).send("Server erorr")
  }
})

// @route POST  api/users
// @desc  Confirm email
// @access Public
router.get('/confirm/:token', async (req, res) => {
  const token = req.params.token
  jwt.verify(token, config.get('emailSecret'), async (error, decoded) => {
    if (error !== null) return res.status(401).json({ error })
    if (decoded) {
      const { email } = decoded

      const query = "UPDATE users SET emailconfirmed = 'true' WHERE email = $1"

      const response = await runQuery(query, res, [email])
        .then(() => {
          res.send("Email confirmed")
        }).catch(err => {
          res.status(404).json(err)
        })
    }
  })
})

module.exports = router