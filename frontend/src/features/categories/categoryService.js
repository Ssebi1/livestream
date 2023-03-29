import axios from 'axios'

const API_URL = '/api/categories'

const getCategories = async () => {
    let response = await axios.get(API_URL)
    return response.data
}

const getCategory = async (id) => {
    let response = await axios.get(API_URL + '/' + id)
    return response.data
}

const categoryService = {
    getCategories,
    getCategory
}

export default categoryService