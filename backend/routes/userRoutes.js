// express
const express = require('express')
const multer = require('multer')
const router = express.Router()
// controllers
const { registerUser, loginUser, getUserData, enableStreamerMode, getStreamers, getStreamer, uploadProfilePicture, getUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
// export router
module.exports = router
var path = require('path')


router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/data/:id', getUserData)
router.put('/streamerMode', protect, enableStreamerMode)
router.get('/streamers', getStreamers)
router.get('/streamers/:id', getStreamer)

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/public/profile-pictures/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending extension
  }
})
router.post('/upload/profile-picture', multer({ storage: storage }).single('image'), (req, res) => {
    const filename = req.file.filename
    res.status(200).send({filename: '/profile-pictures/' + filename})
})