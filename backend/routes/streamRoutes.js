// express
const express = require('express')
const router = express.Router()
// controllers
const { getStreams, postStream, putStream, deleteStream } = require('../controllers/streamController')
const {protect} = require('../middleware/authMiddleware')
// export router
module.exports = router

// GET
router.get('/', getStreams)

// POST
router.post('/', protect, postStream)

// PUT
router.put('/:id', protect, putStream)

// DELETE
router.delete('/:id', protect, deleteStream)