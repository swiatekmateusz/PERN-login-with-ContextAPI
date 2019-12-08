const express = require('express')
const path = require('path')

const app = express()

// Init middleware
app.use(express.json({ extended: false }))

//Routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000;

app.listen(PORT)