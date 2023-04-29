import axios from 'axios'

const API_URL = '/api/streams'

const createStream = async (streamData, token) => {
    let response = await axios.post(API_URL, streamData, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}

const getStreams = async () => {
    let response = await axios.get(API_URL)
    return response.data
}

const getStream = async (id) => {
    let response = await axios.get(API_URL + '/' + id)
    return response.data
}

const getUserStreams = async (id) => {
    let response = await axios.get(API_URL + '/user/' + id)
    return response.data
}

const streamService = {
    createStream,
    getStreams,
    getStream,
    getUserStreams
}

export default streamService