// express
const express = require('express')
// dotenv
const dotenv = require('dotenv').config()
// port
const port = process.env.PORT || 4040
// error handler
const { errorHandler } = require('./middleware/errorMiddleware')
// colors
const colors = require('colors')
// db connection function
const connectDB = require('./config/db')

// connect to db
connectDB()

// express app
const app = express()

// body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// user routes
app.use('/api/users', require('./routes/userRoutes'))

// stream routes
app.use('/api/streams', require('./routes/streamRoutes'))

// category routes
app.use('/api/categories', require('./routes/categoryRoutes'))

// error handler
app.use(errorHandler)

// start app
app.listen(port, () => {
    console.log('Server started')
})

// Chat websocket connection
const { Server } = require('socket.io')
const http = require('http');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'https://leven-tv.com',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);
    });

    socket.on('send_message', (data) => {
        const { message, username, room} = data;
        io.in(room).emit('receive_message', data);
    });
});

server.listen(4000)