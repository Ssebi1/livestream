const mongoose = require('mongoose')

const linkSchema = mongoose.mongoose.Schema({
    type: String,
    url: String
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: ['true', 'Please add a name'],
        unique: true
    },
    email: {
        type: String,
        required: ['true', 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: ['true', 'Please add a password']
    },
    streamerMode: {
        type: Boolean,
        required: false,
        default: true
    },
    description: {
        type: String,
        default: ''
    },
    links: {
        type: [linkSchema],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    followersNr: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)