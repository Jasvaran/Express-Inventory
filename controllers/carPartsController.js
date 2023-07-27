const CarPart = require('../models/carParts')
const Category = require('../models/category')
const Make = require('../models/make')
const { body, validationResult } = require('express-validator')
const asyncHandler = require('express-async-handler')
const category = require('../models/category')



exports.index = asyncHandler(async(req, res, next) => {
    const [
        numCarParts,
        numOfCategories,
        numOfMakes
    ] = await Promise.all([
        CarPart.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
        Make.countDocuments({}).exec()
    ]);

    res.render('index', {
        title: 'inventory',
        numCarParts: numCarParts,
        numOfCategories: numOfCategories,
        numOfMakes: numOfMakes
    })
})

exports.carParts_list = asyncHandler(async (req, res, next) => {
    const carparts_list = await CarPart.find({}, "name make")
        .populate("make")
        .sort({name: 1})
        .exec()
    
    res.render("carparts_list", {
        title: "Car Parts List",
        carparts_list: carparts_list
    })
})

exports.carParts_detail = asyncHandler(async(req, res, next) => {
    const carparts_detail = await CarPart.findById(req.params.id)
        .populate("make")
        .populate("category")
        .exec()
    console.log(carparts_detail)
    res.render("carpart_detail", {
        title: "Part Detail",
        carparts_detail: carparts_detail
    })                                      
})

exports.carParts_create_get = asyncHandler(async (req, res, next) => {
    const [AllCategories, AllMakes] = await Promise.all([
        Category.find({}).exec(),
        Make.find({}).exec()
    ])
    res.render("carpart_form", {
        title: "Add Car Part",
        categories: AllCategories,
        makes: AllMakes

    })
})

exports.carParts_create_post = [
    body("name", "Name is required")
        .trim()
        .escape(),
    body("make", "Make is required")
        .trim()
        .escape(),
    body("category", "Category is required")
        .trim()
        .escape(),
    body("price", "price is required")
        .trim()
        .escape(),
    body("stock", "Stock is required")
        .trim()
        .escape(),
    
    
    asyncHandler(async(req, res, next) => {
        console.log(req.file)
        const errors = validationResult(req)


        const carpart = new CarPart({
            name: req.body.name,
            make: req.body.make,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file.filename
        })

        if (!errors.isEmpty()){
            const [AllCategories, AllMakes] = await Promise.all([
                Category.find({}).exec(),
                Make.find({}).exec()
            ])


            res.render("carpart_form", {
                title: "Add Car Part",
                categories: AllCategories,
                makes: AllMakes,
                carpart: carpart,
                errors: errors.array()
            })
            return;
        } else {
            await carpart.save()
            res.redirect(carpart.url)
        }

    })

    

]

exports.carParts_delete_get = asyncHandler(async (req, res, next) => {
    const carPart = await CarPart.findById(req.params.id).exec()

    if (carPart === null){
        res.redirect('/catalog/carparts')
    }
    res.render("carpart_delete", {
        title: "Delet Car Part",
        carpart: carPart
    })
})

exports.carParts_delete_post = asyncHandler(async (req, res, next) => {
    const carPart = await CarPart.findById(req.params.id).exec()

   await CarPart.findByIdAndRemove(carPart)
   res.redirect('/catalog/carparts')

})


exports.carParts_update_get = asyncHandler(async (req, res, next) => {
    const [carPart, allCategories, allMakes] = await Promise.all([
        CarPart.findById(req.params.id)
            .populate("make")
            .populate("category"),
        Category.find({}).exec(),
        Make.find({}).exec()
    ])
    res.render("carpart_form", {
        title: "Update Car Part",
        categories: allCategories,
        makes: allMakes,
        carpart: carPart
    })
})

// hadle update POST request
exports.carParts_update_post = [
    // validate and sanitize data
    body("name", "name is required'")
        .trim()
        .escape(),
    body("make", "make is required")
        .trim()
        .escape(),
    body("category", "category is required")
        .trim()
        .escape(),
    body("price", "price is required")
        .trim()
        .escape(),
    
    // process the post request
    asyncHandler(async(req, res, next) => {
        const [allCategories, allMakes] = await Promise.all([
            Category.find({}).exec(),
            Make.find({}).exec()
        ])

        const errors = validationResult(req)

        const updated_part = new CarPart({
            name: req.body.name,
            make: req.body.make,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            // there are errors
            res.render("carpart_form", {
                title: "Update Car Part",
                categories: allCategories,
                makes: allMakes,
                carpart: updated_part,
                errors: errors.array()

            })
            return;
        } else {
            const updatedpart = await CarPart.findByIdAndUpdate(req.params.id, updated_part, {})

            res.redirect(updatedpart.url)
        }

    })
    
]