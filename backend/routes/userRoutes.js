// express
const express = require('express')
const multer = require('multer')
const router = express.Router()
// controllers
const { registerUser, loginUser, getUserData, enableStreamerMode, getStreamers, getStreamer, uploadProfilePicture, getUser, updateUser } = require('../controllers/userController')
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
router.patch('/:id', updateUser)

var profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/public/profile-pictures/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending extension
  }
})

router.post('/upload/profile-picture', multer({ storage: profileStorage }).single('image'), (req, res) => {
    const filename = req.file.filename
    res.status(200).send({filename: '/profile-pictures/' + filename})
})

var bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/public/banner-pictures/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //Appending extension
  }
})

router.post('/upload/banner-picture', multer({ storage: bannerStorage }).single('image'), (req, res) => {
  const filename = req.file.filename
  res.status(200).send({filename: '/banner-pictures/' + filename})
})