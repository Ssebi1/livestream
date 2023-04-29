// async handler
const asyncHandler = require('express-async-handler')

// stream model
const Stream = require('../models/streamModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')

// @desc Get stream
// @route GET /api/streams
// @access Public
const getStreams = asyncHandler(async (req, res) => {
  const streams = await Stream.find()
  for (let i = 0; i < streams.length; i++) {
    const user = await User.findById(streams[i].user)
    streams[i].user = user
    let category = await Category.findById(streams[i].category)
    if (!category) {
      category = await Category.findOne({ name: 'GENERAL' })
    }
    streams[i].category = category
  }
  res.status(200).send(streams)
})

// @desc Get stream
// @route GET /api/stream/<id>
// @access Public
const getStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.params.id)
  if (!stream) {
    res.status(400)
    throw new Error('Stream not found')
  }
  const user = await User.findById(stream.user)
  stream.user = user
  let category = await Category.findById(stream.category)
  if (!category) {
    category = await Category.findOne({ name: 'GENERAL' })
  }
  stream.category = category
  res.status(200).send(stream)
})

// @desc Get user streams
// @route GET /api/streams/user/<id>
// @access Public
const getUserStreams = asyncHandler(async (req, res) => {
  const streams = await Stream.find({user: {_id: req.params.id}})
  for (let i = 0; i < streams.length; i++) {
    let category = await Category.findById(streams[i].category)
    if (!category) {
      category = await Category.findOne({ name: 'GENERAL' })
    }
    streams[i].category = category
  }
  res.status(200).send(streams)
})

// @desc Post stream
// @route POST /api/streams
// @access Private
const postStream = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.category) {
    res.status(400)
    throw new Error('Missing fields')
  }

  category = await Category.findById(req.body.category)
  if (!category) {
    res.status(400)
    throw new Error('Category not found')
  }

  const stream = await Stream.create({
    title: req.body.title,
    category: req.body.category,
    user: req.user.id
  })
  res.status(200).json(stream)
})

// @desc Update stream
// @route PUT /api/streams/:id
// @access Private
const putStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.params.id)

  if (!stream) {
    res.status(400)
    throw new Error('Stream not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the stream user
  if (stream.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedStream = Stream.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedStream)
})

// @desc Delete stream
// @route DELETE /api/stream/:id
// @access Private
const deleteStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.params.id)

  if (!stream) {
    res.status(400)
    throw new Error('Stream not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the stream user
  if (stream.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await stream.remove()

  res.status(200).json({ id: req.params.id })
})

// export functions
module.exports = {
  getStreams,
  getStream,
  postStream,
  putStream,
  deleteStream,
  getUserStreams
}