const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: ['true', 'Please add a name'],
        default: 'GENERAL'
    },
    image_path: {
        type: String,
        required: ['true', 'Please add a path to image']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Category', categorySchema)