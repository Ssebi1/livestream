// async handler
const asyncHandler = require('express-async-handler')
const https = require('https');
const fs = require('fs');

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
  const streams = await Stream.find({}, null, {sort: {createdAt: -1, status: -1}}).populate("user").populate("category")
  res.status(200).send(streams)
})

// @desc Get stream
// @route GET /api/stream/<id>
// @access Public
const getStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.params.id).populate("user").populate("category")
  if (!stream) {
    res.status(400)
    throw new Error('Stream not found')
  }

  if (stream.vod_recording_hls_url === undefined || stream.vod_duration == "0" || stream.vod_duration == "0:0" || stream.vod_duration == "00:00:00" || stream.vod_duration == "00:00" || stream.vod_duration === undefined) {
    try {
      requestResponse = await axios.get('https://api.video.wowza.com/api/v1.10/vod_streams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (requestResponse) {
        vod_stream_id = requestResponse.data.vod_streams.filter(vod => vod.name.startsWith(stream.title)).slice(-1)[0].id
        requestResponse2 = await axios.get('https://api.video.wowza.com/api/v1.10/vod_streams/' + vod_stream_id, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (requestResponse2) {
          stream.vod_recording_hls_url = requestResponse2.data.vod_stream.playback_url
          let vod_duration = requestResponse2.data.vod_stream.duration
          let vod_duration_formatted = '0:0'
          let hours = Math.floor(vod_duration / (60*60))
          let minutes = Math.floor((vod_duration % (60*60)) / 60)
          let seconds = Math.floor((vod_duration % (60*60)) % 60)
          if (hours < 10) hours = '0' + hours
          if (minutes < 10) minutes = '0' + minutes
          if (seconds < 10) seconds = '0' + seconds

          if (hours === 0 || hours === '00') {
            vod_duration_formatted = minutes + ':' + seconds
          } else {
            vod_duration_formatted = hours + ':' + minutes + ':' + seconds
          }
          stream.vod_duration = vod_duration_formatted
          await Stream.findOneAndUpdate({ _id: req.params.id }, {
            'vod_recording_hls_url': requestResponse2.data.vod_stream.playback_url,
            'vod_duration': vod_duration_formatted
          })
        }
      }
    } catch { }
  }

  res.status(200).send(stream)
})

const download_image = (url, image_path) => {
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
}

// @desc Get user streams
// @route GET /api/streams/user/<id>
// @access Public
const getUserStreams = asyncHandler(async (req, res) => {
  const streams = await Stream.find({ user: { _id: req.params.id } }, null, {sort: {createdAt: -1, status: -1}}).populate('category')
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
  let webrtc_application_name = ""
  let webrtc_stream_name = ""
  let hls_url = ""
  let encoder = "other_webrtc"
  let webrtc_publish_stream_name = ""
  if (req.body.engine == 'personal')
    encoder = "other_srt"

  requestResponse = await axios.post('https://api.video.wowza.com/api/v1.10/live_streams', {
    "live_stream": {
      "aspect_ratio_height": 720,
      "aspect_ratio_width": 1080,
      "broadcast_location": "eu_germany",
      "delivery_method": "push",
      "encoder": encoder,
      "name": req.body.title,
      "hosted_page": {
        "enabled": false
      },
      "vod_stream": true
    }
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  console.log(requestResponse)

  if (requestResponse) {
    stream_id = requestResponse.data.live_stream.id
    primary_server = requestResponse.data.live_stream.source_connection_information.primary_server
    host_port = requestResponse.data.live_stream.source_connection_information.host_port
    hls_url = requestResponse.data.live_stream.direct_playback_urls.hls[0].url
    webrtc_url = requestResponse.data.live_stream.direct_playback_urls.webrtc[0].url
    webrtc_application_name = requestResponse.data.live_stream.direct_playback_urls.webrtc[0].application_name
    webrtc_stream_name = requestResponse.data.live_stream.direct_playback_urls.webrtc[0].stream_name
    webrtc_publish_stream_name = requestResponse.data.live_stream.source_connection_information.stream_name
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
    webrtc_url: webrtc_url,
    webrtc_application_name: webrtc_application_name,
    webrtc_stream_name: webrtc_stream_name,
    engine: req.body.engine,
    webrtc_publish_stream_name: webrtc_publish_stream_name
  })
  res.status(200).json(stream)
})

// @desc Start stream
// @route POST /api/streams/start/:id
// @access Private
const startStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.body.id)

  if (!stream) {
    res.status(400)
    throw new Error('Stream not found')
  }

  let wowza_stream_id = stream.id
  let stream_status = stream.status
  if (stream_status === 'created') {
    requestResponse = await axios.put('https://api.video.wowza.com/api/v1.10/live_streams/' + wowza_stream_id + '/start', null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }


  const startTime = new Date().getTime()
  let currentTime = startTime

  while (currentTime < startTime + 1000 * 3000 && stream_status != 'started') {
    stream_status = await getStreamStatus(wowza_stream_id)
    currentTime += 2000
  }

  await Stream.findOneAndUpdate({ _id: req.body.id }, {
    'status': stream_status,
  })
  const updatedStream = await Stream.findOne({ _id: req.body.id }).populate("user").populate("category")

  await User.findOneAndUpdate({_id: stream.user._id}, {
    'streamerMode': true
  })
  res.status(200).send(updatedStream)
})

// @desc End stream
// @route POST /api/streams/end/:id
// @access Private
const endStream = asyncHandler(async (req, res) => {
  const stream = await Stream.findById(req.body.id)
  let stream_status = await getStreamStatus(stream.id)
  if (stream_status === 'stopped') {
    await Stream.findOneAndUpdate({ _id: req.body.id }, {
      'status': 'ended',
    })
    const updatedStream = await Stream.findOne({ _id: req.body.id }).populate("user").populate("category")
    res.status(200).send(updatedStream)
    return
  }

  if (!stream || stream.status !== 'started') {
    res.status(400)
    throw new Error('Stream not found')
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!fs.existsSync('./frontend/public/thumbnail-pictures/' + stream._id + '.png'))
        download_image(stream.thumbnail_url, './frontend/public/thumbnail-pictures/' + stream._id + '.png')
    } else {
      if (!fs.existsSync('./frontend/build/thumbnail-pictures/' + stream._id + '.png'))
        download_image(stream.thumbnail_url, './frontend/build/thumbnail-pictures/' + stream._id + '.png')
    }
    
  } catch {}

  let wowza_stream_id = stream.id
  stream_status = stream.status
  if (stream_status !== 'stopping') {
    requestResponse = await axios.put('https://api.video.wowza.com/api/v1.10/live_streams/' + wowza_stream_id + '/stop', null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }

  const startTime = new Date().getTime()
  let currentTime = startTime

  while(currentTime < startTime + 1000 * 1000 && stream_status != 'stopped') {
    stream_status = await getStreamStatus(wowza_stream_id)
    currentTime += 2000
  }

  await Stream.findOneAndUpdate({ _id: req.body.id }, {
    'status': 'ended',
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

  try {
    requestResponse = await axios.get('https://api.video.wowza.com/api/v1.10/live_streams/' + wowza_stream_id + '/thumbnail_url', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  } catch { }

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
  await stream.remove()

  const streams = await Stream.find()
  if (streams.length == 0) {
    await User.findOneAndUpdate({_id: stream.user._id}, {
      'streamerMode': false
    })
  }
  res.status(200).json(streams)
})

const getStreamStatus = async (streamId) => {
  try {
    requestResponse = await axios.get('https://api.video.wowza.com/api/v1.10/live_streams/' + streamId + '/state', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  } catch {
    return ""
  }

  if (requestResponse) {
    return requestResponse.data.live_stream.state
  }
  return ""
}

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