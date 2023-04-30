import axios from 'axios'

const API_URL = '/api/users/streamers'

const getStreamers = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

const getStreamer = async (id) => {
    const response = await axios.get(API_URL + '/' + id)
    return response.data
}

// Patch user
const updateUser = async (user_id, streamer_id, data) => {
    if (user_id != streamer_id) {
      return {}
    }
    const response = await axios.patch('/api/users/' + user_id, data)
    return response.data
  }
  

const streamerService = {
    getStreamers,
    getStreamer,
    updateUser
}

export default streamerService