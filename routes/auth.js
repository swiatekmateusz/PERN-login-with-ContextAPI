const runQuery = require('../config/queries')
const { check, validationResult } = require('express-validator')
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const transporter = require('../config/mail')
const auth = require('../middleware/auth')

// @route GET  api/auth
// @desc  Login user and get token
// @access Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    const query1 = "SELECT id,emailconfirmed,password FROM users WHERE email = $1"
    const res1 = await runQuery(query1, res, [email])
    const user = res1[0]
    // Check if user exists
    if (!user) {
      return res.send("User with that email doesn't exist")
    }

    const { id, emailconfirmed, password: hashPassword } = user
    //Check if user confirmed email
    if (!emailconfirmed) {
      return res.send("You have to confirm your email!")
    }

    // Check corretection of password
    const isMatch = await bcrypt.compare(password, hashPassword)

    if (!isMatch) {
      return res.status(400).send("Invalid password")
    }

    // Send token
    const payload = {
      user: {
        id
      }
    }
    jwt.sign(payload, config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      })
  } catch (error) {
    console.log(error);
    res.send("Server error")
  }
})


router.get('/', auth, async (req, res) => {
  console.log(req.user);
})

module.exports = router