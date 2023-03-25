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

const streamerService = {
    getStreamers,
    getStreamer
}

export default streamerService