// async handler
const asyncHandler = require('express-async-handler')

const token = process.env.WOWZA_TOKEN;

// stream model
const Stream = require('../models/streamModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const { default: axios } = require('axios')
const { response } = require('express')

// @desc Get stream
// @route GET /api/streams
// @access Public
const getStreams = asyncHandler(async (req, res) => {
  const streams = await Stream.find().populate("user").populate("category")
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
  const streams = await Stream.find({ user: { _id: req.params.id } })
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

  let stream_id = -1
  let primary_server = ""
  let host_port = 10000
  let webrtc_url = ""
  let hls_url = ""
  if (req.body.engine == 'personal') {
    requestResponse = await axios.post('https://api.video.wowza.com/api/v1.10/live_streams', {
      "live_stream": {
        "aspect_ratio_height": 1920,
        "aspect_ratio_width": 1080,
        "broadcast_location": "eu_germany",
        "delivery_method": "push",
        "encoder": "other_srt",
        "name": req.body.title,
        "transcoder_type": "transcoded",
        "recording": true,
        "low_latency": true,
        "hosted_page": {
          "enabled": false
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (requestResponse) {
      stream_id = requestResponse.data.live_stream.id
      primary_server = requestResponse.data.live_stream.source_connection_information.primary_server
      host_port = requestResponse.data.live_stream.source_connection_information.host_port
      hls_url = requestResponse.data.live_stream.direct_playback_urls.hls[0].url
      webrtc_url = requestResponse.data.live_stream.direct_playback_urls.webrtc[0].url
    }
  }

  const stream = await Stream.create({
    title: req.body.title,
    category: req.body.category,
    user: req.user.id,
    id: stream_id,
    status: 'created',
    primary_server: primary_server,
    host_port: host_port,
    hls_url: hls_url,
    webrtc_url: webrtc_url
  })
  res.status(200).json(stream)
})

// @desc Start stream
// @route POST /api/streams/start/:id
// @access Private
const startStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.body.id)

  if (!stream || stream.status !== 'created') {
    res.status(400)
    throw new Error('Stream not found')
  }


  let wowza_stream_id = stream.id
  let stream_status = stream.status
  requestResponse = await axios.put('https://api.video.wowza.com/api/v1.10/live_streams/' + wowza_stream_id + '/start', null, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (requestResponse) {
    stream_status = 'started'
  }

  await Stream.findOneAndUpdate({ _id: req.body.id }, {
    'status': stream_status,
  })
  const updatedStream = await Stream.findOne({ _id: req.body.id }).populate("user").populate("category")
  res.status(200).send(updatedStream)
})

// @desc End stream
// @route POST /api/streams/end/:id
// @access Private
const endStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.body.id)

  if (!stream || stream.status !== 'started') {
    res.status(400)
    throw new Error('Stream not found')
  }


  let wowza_stream_id = stream.id
  let stream_status = stream.status
  requestResponse = await axios.put('https://api.video.wowza.com/api/v1.10/live_streams/' + wowza_stream_id + '/stop', null, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (requestResponse) {
    stream_status = 'ended'
  }

  await Stream.findOneAndUpdate({ _id: req.body.id }, {
    'status': stream_status,
  })
  const updatedStream = await Stream.findOne({ _id: req.body.id }).populate("user").populate("category")
  res.status(200).send(updatedStream)
})

// @desc Set stream thumbnail
// @route PATCH /api/streams/thumbnail/:id
// @access Private
const setThumbnail = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.body.id)

  if (!stream) {
    res.status(400)
    throw new Error('Stream not found')
  }

  let wowza_stream_id = stream.id
  let thumbnail_url = stream.thumbnail_url

  try{
    requestResponse = await axios.get('https://api.video.wowza.com/api/v1.10/live_streams/' + wowza_stream_id + '/thumbnail_url', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  } catch {}

  if (requestResponse) {
    if (requestResponse.data.live_stream.thumbnail_url != null)
      thumbnail_url = requestResponse.data.live_stream.thumbnail_url
  }

  await Stream.findOneAndUpdate({ _id: req.body.id }, {
    'thumbnail_url': thumbnail_url,
  })
  const updatedStream = await Stream.findOne({ _id: req.body.id }).populate("user").populate("category")
  res.status(200).send(updatedStream)
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
// @route DELETE /api/stream
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
  getUserStreams,
  startStream,
  endStream,
  setThumbnail
}