// express
const express = require('express')
const router = express.Router()
// controllers
const { getCategories, postCategory, putCategory, deleteCategory, getCategory, getUserCategories } = require('../controllers/categoryController')
// export router
module.exports = router

// GET
router.get('/', getCategories)
router.get('/:id', getCategory)
router.get('/user/:id', getUserCategories)

// POST
router.post('/', postCategory)

// PUT
router.put('/:id', putCategory)

// DELETE
router.delete('/:id', deleteCategory)