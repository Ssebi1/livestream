// express
const express = require('express')
const router = express.Router()
// controllers
const { getStreams, postStream, putStream, deleteStream, getStream, getUserStreams, startStream, endStream, setThumbnail } = require('../controllers/streamController')
const {protect} = require('../middleware/authMiddleware')
// export router
module.exports = router

// GET
router.get('/', getStreams)
router.get('/:id', getStream)
router.get('/user/:id', getUserStreams)

// POST
router.post('/', protect, postStream)
router.post('/start', protect, startStream)
router.post('/end', protect, endStream)

// PUT
router.put('/:id', protect, putStream)

// DELETE
router.delete('/:id', protect, deleteStream)

// PATCH
router.patch('/thumbnail', setThumbnail)