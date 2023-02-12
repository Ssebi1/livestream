const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async  (req, res) => {
    const { name, email, password } = req.body
    console.log(name, email, password)

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Missing fields')
    }

    // Check if user already exists
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error('This email is already used')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(!user) {
        res.status(400)
        throw new Error('Cannot register user')
    }

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    })
})

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        res.status(400)
        throw new Error('Missing fields')
    }
    
    const user = await User.findOne({email})

    if(!user || !(await bcrypt.compare(password, user.password))) {
        res.status(400)
        throw new Error('Cannot login user')
    } 

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        streamerMode: user.streamerMode,
        token: generateToken(user._id)
    })
})

// @desc Get user data
// @route GET /api/users/data
// @access Private
const getUserData = asyncHandler(async (req, res) => {
    if(!req.user) {
        res.status(400)
        throw new Error('Cannot get user data')
    }

    res.status(200).json(req.user)
})

// @desc Ennable streamer mode for user
// @route Put /api/users/enableStreamer
// @access Private
const enableStreamerMode = asyncHandler(async (req, res) => {
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, {"streamerMode": true}, {
        new: true,
      })
    res.status(200).json(updatedUser)
})

// @desc Ennable streamer mode for user
// @route GET /api/users/streamers
// @access Public
const getStreamers = asyncHandler(async (req, res) => {
    const streamers = await User.find({"streamerMode": true})
    res.status(200).send(streamers)
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


module.exports = {
    registerUser,
    loginUser,
    getUserData,
    enableStreamerMode,
    getStreamers
}