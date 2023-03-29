// async handler
const asyncHandler = require('express-async-handler')

// stream model
const Category = require('../models/categoryModel')

// @desc Get categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
  res.status(200).send(categories)
})

// @desc Get category
// @route GET /api/category/:id
// @access Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    res.status(400)
    throw new Error('Category not found')
  }
  res.status(200).send(category)
})

// @desc Post category
// @route POST /api/categories
// @access Public
const postCategory = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.image_path) {
    res.status(400)
    throw new Error('Missing fields')
  }

  const category = await Category.create({
    name: req.body.name,
    image_path: req.body.image_path
  })
  res.status(200).json(category)
})

// @desc Update category
// @route PUT /api/categories/:id
// @access Public
const putCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(400)
    throw new Error('Category not found')
  }

  const updatedCategory = Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedCategory)
})

// @desc Delete category
// @route DELETE /api/categories/:id
// @access Public
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(400)
    throw new Error('Category not found')
  }

  await category.remove()
  res.status(200).json({ id: req.params.id })
})

// export functions
module.exports = {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory
}