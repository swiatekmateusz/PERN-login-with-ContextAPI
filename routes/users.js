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
  const user = await runQuery(queryIsEmailUsed, [email])
  if (user instanceof Error) throw new Error(user)

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
    const queryInsertUser = "INSERT INTO users (name,email,password,date) VALUES ($1,$2,$3,to_timestamp($4))"
    const addUser = await runQuery(queryInsertUser, [name, email, hashPassword, date])
    if (addUser instanceof Error) throw new Error(addUser)
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
    const addLink = await runQuery(queryInsertLink, [email, emailToken, "activeemail"])
    if (addLink instanceof Error) throw new Error(addLink)

  } catch (err) {
    console.log(err);
    res.status(500).send("Server erorr")
  }
})


module.exports = router