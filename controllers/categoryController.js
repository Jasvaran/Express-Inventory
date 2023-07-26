const Category = require('../models/category')
const CarPart = require('../models/carParts')
const {body, validationResult } = require('express-validator')


const asyncHandler = require('express-async-handler')


exports.category_list = asyncHandler(async (req, res, next) => {
    const categoryList = await Category.find({}, "name")
        .sort({name: 1})
        .exec()
    console.log(categoryList)
    res.render("category_list", {
        title: "List of Categories",
        categoryList: categoryList
    })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, carPartsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        CarPart.find({category: req.params.id})
            .populate("make")
            .populate("category")
            .exec()        
    ])
    if (category === null){
        const err = new Error("Category not found")
        err.status = 404
        return next(err)
    }
    console.log(category)
    console.log(carPartsInCategory)
    res.render("category_detail", {
        title: "All Items by categories",
        category: category,
        carparts: carPartsInCategory
    })
})

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {
        title: "Create new category"
    })
})

exports.category_create_post = [
    body("name", "category must contain atleast 3 characters")
        .trim()
        .isLength({min: 3})
        .escape(),

    asyncHandler(async(req, res, next) => {

        const errors = validationResult(req)

        const category = new Category({name: req.body.name})

        if (!errors.isEmpty()){
            res.render("category_form", {
                title: "Create new Category",
                category: category,
                errors: errors.array()
            })
            return;
        } else {
            const categoryExists = await Category.findOne({name: req.body.name}).exec()
            if (categoryExists){
                res.redirect(categoryExists.url)
            } else {
                await category.save()
                res.redirect(category.url)
            }
        }

    })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, allPartsByCategoires] = await Promise.all([
        Category.findById(req.params.id).exec(),
        CarPart.find({category: req.params.id})
    ])
    
    if (category === null) {
       res.redirect('/catalog/categories')
    }
    res.render("category_delete", {
        title: "Delete Category: ",
        category: category,
        carparts: allPartsByCategoires

    })

})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, allPartsByCategories] = await Promise.all([
        Category.findById(req.params.id).exec(),
        CarPart.find({category: req.params.id}).exec()

    ])

    if (allPartsByCategories.length > 0){
        res.render("category_delete", {
            title: "Delete Category: ",
            carparts: allPartsByCategories,
            category: category,
        })
        return;
    } else {
        await Category.findByIdAndDelete(req.body.categoryid)
        res.redirect('/catalog/categories')
        
    }
})

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    res.render("category_update", {
        title: "Update Category",
        category: category
    })
    console.log(category)
    res.send("NOT IMPLEMENTED: Category update GET")
})

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category udate POST")
})