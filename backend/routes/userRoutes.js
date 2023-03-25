// express
const express = require('express')
const router = express.Router()
// controllers
const { registerUser, loginUser, getUserData, enableStreamerMode, getStreamers, getStreamer } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
// export router
module.exports = router


router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/data', protect, getUserData)
router.put('/streamerMode', protect, enableStreamerMode)
router.get('/streamers', getStreamers)
router.get('/streamers/:id', getStreamer)