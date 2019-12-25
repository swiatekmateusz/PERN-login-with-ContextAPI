const express = require('express')
const path = require('path')

const app = express()

// Init middleware
app.use(express.json({ extended: false }))

//Routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/email', require('./routes/email'))

const PORT = process.env.PORT || 5000;

app.listen(PORT)