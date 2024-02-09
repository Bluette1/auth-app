const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('./config')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const app = express()

app.use(logger('dev'))

app.use(
  cors({
    origin: '*',
  })
)
const connectDb = async () => {
  await mongoose.connect(config.mongo.uri, {
    autoIndex: true,
    minPoolSize: 50,
    serverSelectionTimeoutMS: 5000,
  })
}

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/login', authRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send({ error: err })
})

module.exports = app
