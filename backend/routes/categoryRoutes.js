// express
const express = require('express')
const router = express.Router()
// controllers
const { getCategories, postCategory, putCategory, deleteCategory, getCategory } = require('../controllers/categoryController')
// export router
module.exports = router

// GET
router.get('/', getCategories)
router.get('/:id', getCategory)

// POST
router.post('/', postCategory)

// PUT
router.put('/:id', putCategory)

// DELETE
router.delete('/:id', deleteCategory)