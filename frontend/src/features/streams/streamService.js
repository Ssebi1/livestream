import axios from 'axios'

const API_URL = '/api/streams'

const createStream = async (streamData, token) => {
    const response = await axios.post(API_URL, streamData, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

const getStreams = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

const streamService = {
    createStream,
    getStreams
}

export default streamService