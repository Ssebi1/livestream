const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async  (req, res) => {
    const { name, email, password } = req.body

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
        following: user.following,
        token: generateToken(user._id)
    })
})

// @desc Enable streamer mode for user
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
    const users = (await User.find())
    for (let i = 0; i < streamers.length; i++) {
        let users_following = users.filter(user => user.following.includes(streamers[i]._id))
        streamers[i].followersNr = users_following.length
    }
    res.status(200).send(streamers)
})

// @desc Get streamer
// @route GET /api/users/streamers
// @access Public
const getStreamer = asyncHandler(async (req, res) => {
    const streamer = await User.findOne({"streamerMode": true, _id: req.params.id})
    
    const users = (await User.find()).filter(user => user.following.includes(streamer._id))
    streamer.followersNr = users.length
    res.status(200).send(streamer)
})

// @desc Update user
// @route PUT /api/users/<id>
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({_id: req.params.id})

    let query = {$set: {}}
    for (let key in req.body) {
        if (key in user)
            query.$set[key] = req.body[key];
    }
        
    
    await User.findOneAndUpdate({_id: req.params.id}, query)
    const updatedUser = await User.findOne({_id: req.params.id})
    res.status(200).send(updatedUser)
})

// @desc Get user data
// @route GET /api/users/data/:id
// @access Public
const getUserData = asyncHandler(async (req, res) => {
    let user = await User.findOne({_id: req.params.id})
    if(user) {
        res.status(200).json({
            _id: user.id,
            name: user.name
        })
    }
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

// @desc Follow user
// @route Post /api/users/follow
// @access Private
const followUser = asyncHandler(async (req, res) => {
    let sourceUser = await User.findOne({_id: req.body.source})
    let following = [... sourceUser.following]
    if (!following.includes(req.body.destination))
        following.push(req.body.destination)

    await User.findOneAndUpdate({_id: req.body.source}, {following: following})
    const updatedUser = await User.findOne({_id: req.body.source})
    res.status(200).send(updatedUser)
})

// @desc Unfollow user
// @route Post /api/users/unfollow
// @access Private
const unfollowUser = asyncHandler(async (req, res) => {
    
    let sourceUser = await User.findOne({_id: req.body.source})
    let following = [... sourceUser.following]
    if (following.includes(req.body.destination))
        following.splice(following.indexOf(req.body.destination), 1)

    await User.findOneAndUpdate({_id: req.body.source}, {following: following})
    const updatedUser = await User.findOne({_id: req.body.source})
    res.status(200).send(updatedUser)
})

module.exports = {
    registerUser,
    loginUser,
    getUserData,
    enableStreamerMode,
    getStreamers,
    getStreamer,
    updateUser,
    followUser,
    unfollowUser
}