import axios from 'axios'

const API_URL = '/api/streams'

const createStream = async (streamData, token) => {
    let response = await axios.post(API_URL, streamData, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}

const startStream = async (streamId, token) => {
    let response = await axios.post(API_URL + '/start', {
        'id': streamId
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}

const endStream = async (streamId, token) => {
    let response = await axios.post(API_URL + '/end', {
        'id': streamId
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}

const setThumbnail = async (streamId, token) => {
    let response = await axios.patch(API_URL + '/thumbnail', {
        'id': streamId
    }, {
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
    startStream,
    getStreams,
    getStream,
    getUserStreams,
    endStream,
    setThumbnail
}

export default streamService