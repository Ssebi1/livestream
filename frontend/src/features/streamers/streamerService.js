import axios from 'axios'

const API_URL = '/api/users/streamers'

const getStreamers = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

const streamerService = {
    getStreamers
}

export default streamerService