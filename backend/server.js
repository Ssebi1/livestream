// express
const express = require('express')
// dotenv
const dotenv = require('dotenv').config()
// port
const port = process.env.PORT || 4040
// error handler
const {errorHandler} = require('./middleware/errorMiddleware')
// colors
const colors =  require('colors')
// db connection function
const connectDB = require('./config/db')


// connect to db
connectDB()

// express app
const app = express()

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// user routes
app.use('/api/users', require('./routes/userRoutes'))

// stream routs
app.use('/api/streams', require('./routes/streamRoutes'))

// error handler
app.use(errorHandler)

// start app
app.listen(port, () => {
    console.log('Server started')
})