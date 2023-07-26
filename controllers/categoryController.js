const Category = require('../models/category')
const CarPart = require('../models/carParts')
const {body, validationResult } = require('express-validator')


const asyncHandler = require('express-async-handler')

// Display List of all categories
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


// Display detail page for each category
exports.category_detail = asyncHandler(async (req, res, next) => {
    // database query for specific category and carpart. [The req.params property is an object containing properties mapped to the named route “parameters”. i.e. '/students/:id' ]
    const [category, carPartsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        CarPart.find({category: req.params.id})
            .populate("make")
            .populate("category")
            .exec()        
    ])

    // no results
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


// display category create form on get
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {
        title: "Create new category"
    })
})

// handle category create on post
exports.category_create_post = [
    // validate and sanitize
    body("name", "category must contain atleast 3 characters")
        .trim()
        .isLength({min: 3})
        .escape(),


    // process request after validation and sanitization
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

// dispaly category delete form on get
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
        await Category.findByIdAndRemove(req.body.categoryid)
        res.redirect('/catalog/categories')
        
    }
})

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    res.render("category_form", {
        title: "Update Category",
        category: category
    })

})

exports.category_update_post = [
    body("name", "category must containt atleast 3 characaters")
        .trim()
        .isLength({min: 3})
        .escape(),

    asyncHandler(async(req, res, next) => {

        const errors = validationResult(req)

        const updated_category = new Category({
            name: req.body.name,
            _id: req.params.id
        })

        if(!errors.isEmpty()){
            res.render("category_form", {
                title: "Update Category",
                category: updated_category
            })
            return;
        } else {
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updated_category, {}).exec()

            res.redirect(updatedCategory.url)
        }
    })

]