import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const enableStreamerMode  = async (userData) => {
  const response = await axios.put(API_URL + 'streamerMode', userData, {
    headers: { Authorization: `Bearer ${userData.token}` }
  })

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const uploadProfilePicture  = async (data) => {
  const response = await axios.post(API_URL + 'upload/profile-picture', data, { headers: {'Content-Type': 'multipart/form-data'}})
  return response.data
}

const uploadBannerPicture  = async (data) => {
  const response = await axios.post(API_URL + 'upload/banner-picture', data, { headers: {'Content-Type': 'multipart/form-data'}})
  return response.data
}

// Patch user
const updateUser = async (user_id, streamer_id, data) => {
  if (user_id != streamer_id) {
    return {}
  }
  const response = await axios.patch(API_URL + user_id, data)
  return response.data
}

const authService = {
  register,
  logout,
  login,
  uploadProfilePicture,
  uploadBannerPicture,
  updateUser
}

export default authService