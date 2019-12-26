const runQuery = require('../config/queries')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const transporter = require('../config/mail')
const { check, validationResult } = require('express-validator')

// @route POST api/password
// @desc  Reset password
// @access Public
router.put('/reset/', async (req, res) => {
  const { token, password } = req.body
  try {
    jwt.verify(token, config.get('jwtSecrets.passwordSecret'), async (error, decoded) => {
      // Check if errrs
      if (error !== null) {
        // USUWANIE Z BAZY linku dajacego error
        const deleteResetPassword = "DELETE FROM links WHERE token = $1 AND typeoflink = 'resetpassword'"
        const deleteRow = await runQuery(deleteResetPassword, [token])
        if (deleteRow instanceof Error) throw new Error(deleteRow)

        if (error.message === 'jwt expired') return res.status(401).send('Link expired')
        if (error.message === 'invalid token' || error.message === 'jwt malformed') return res.status(401).send('Invalid link')
        else return res.status(400).send("Invalid token")
      }
      // If no error
      if (decoded) {

        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const { email } = decoded
        const queryUpdatePassword = "UPDATE users SET password = $1 WHERE email = $2"
        const runUpdatePassword = await runQuery(queryUpdatePassword, [hashPassword, email])
        if (runUpdatePassword instanceof Error) throw new Error(runUpdatePassword)

        const deleteResetPassword = "DELETE FROM links WHERE token = $1 AND typeoflink = 'resetpassword'"
        const deleteRow = await runQuery(deleteResetPassword, [token])
        if (deleteRow instanceof Error) throw new Error(deleteRow)

        res.send("Password updated")
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error")
  }
})

// @route GET api/password
// @desc  Check reset token
// @access Public
router.get('/check/:token', async (req, res) => {
  const { token } = req.params
  try {
    jwt.verify(token, config.get('jwtSecrets.passwordSecret'), async (error, decoded) => {
      // Check if errrs
      if (error !== null) {
        // USUWANIE Z BAZY linku dajacego error
        const deleteResetPassword = "DELETE FROM links WHERE token = $1 AND typeoflink = 'resetpassword'"
        const deleteRow = await runQuery(deleteResetPassword, [token])
        if (deleteRow instanceof Error) throw new Error(deleteRow)

        if (error.message === 'jwt expired') return res.status(401).send('Link expired')
        if (error.message === 'invalid token' || error.message === 'jwt malformed') return res.status(401).send('Invalid link')
        else return res.status(400).send("Invalid token")
      }
      // If no error
      if (decoded) {
        const { email } = decoded
        const queryCheckUser = "SELECT id FROM users WHERE email = $1"
        const runCheckUser = await runQuery(queryCheckUser, [email])
        if (runCheckUser instanceof Error) throw new Error(runCheckUser)
        const queryToken = "SELECT email FROM links WHERE token = $1"
        const runToken = await runQuery(queryToken, [token])
        if (runToken instanceof Error) throw new Error(runToken)

        if (runCheckUser.id && runToken.email === email) {
          res.send("Good token")
        } else {
          res.status(400).send("Error")
        }
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error")
  }
})

// @route POST api/password
// @desc  Send reset password link
// @access Public
router.post('/reset', [
  check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { email } = req.body
  try {
    const queryCheckUser = "SELECT id FROM users WHERE email=$1"
    const runCheckUser = await runQuery(queryCheckUser, [email])
    if (runCheckUser instanceof Error) throw runCheckUser

    if (!runCheckUser.id) {
      return res.status(400).send("User with that email doesnt exist")
    }

    // Sprawdzamy czy jest email resetpassword w links
    const queryCheckLink = "SELECT * FROM links WHERE email=$1 AND typeoflink='resetpassword'"
    const runCheckLink = await runQuery(queryCheckLink, [email])
    if (runCheckLink instanceof Error) throw runCheckLink
    if (runCheckLink.email) {
      const deleteOldLink = "DELETE FROM links WHERE email=$1"
      const deleteLink = await runQuery(deleteOldLink, [email])
      if (deleteLink instanceof Error) throw new Error(deleteLink)
    }
    const token = jwt.sign({ email }, config.get('jwtSecrets.passwordSecret'), { expiresIn: '1h' })
    const insertNewLink = "INSERT INTO links (email,token,typeoflink) VALUES ($1,$2,'resetpassword')"
    const insertLink = await runQuery(insertNewLink, [email, token])
    if (insertLink instanceof Error) throw new Error(insertLink)

    transporter.sendMail({
      to: email,
      subject: 'Reset password link',
      html: `http://localhost:3000/reset/${token}`
    })
    // jezeli tak usuwamy, genereujemy i wysylamy nowy i dodajemy
    // jezeli nie generujemy wysylamy dodajemy
    res.send("Success")
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error")
  }
})

module.exports = router