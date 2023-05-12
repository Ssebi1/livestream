const mongoose = require('mongoose')

const streamSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: ['true', 'Please add a title']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    id: {
        type: String
    },
    status: {
        type: String
    },
    primary_server: {
        type: String
    },
    host_port: {
        type: Number
    },
    webrtc_url: {
        type: String
    },
    hls_url: {
        type: String
    },
    thumbnail_url: {
        type: String
    },
    webrtc_application_name: {
        type: String
    },
    webrtc_stream_name: {
        type: String
    },
    engine: {
        type: String
    },
    vod_recording_hls_url: {
        type: String
    },
    vod_duration: {
        type: String
    },
    webrtc_publish_stream_name: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Stream', streamSchema)