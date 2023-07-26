const Make = require('../models/make')
const CarPart = require('../models/carParts')

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')


exports.make_list = asyncHandler(async (req, res, next) => {
    const makes = await Make.find({})
        .sort({name: 1})
        .exec()
    res.render("makes_list", {
        title: "All vehicle Makes In System",
        makes: makes
    })
})

exports.make_detail = asyncHandler(async (req, res, next) => {
    const [makedetail, carPartByMake] = await Promise.all([
        Make.findById(req.params.id).exec(),
        CarPart.find({make: req.params.id})
            .populate("make")
            .exec()
    ])
    console.log(carPartByMake)
    res.render('make_detail', {
        title: 'Car Parts By Make / Model',
        carparts: carPartByMake,
        make: makedetail
    })

})

exports.make_create_get = asyncHandler(async (req, res, next) => {
    res.render("make_form", {
        title: "Create new Make and Model"
    })
})

exports.make_create_post = [
    body("name", "name must not be empty")
        .trim()
        .escape(),
    body("year", "year must not be empty")
        .trim()
        .escape(),
    body("model", "Model must not be empty")
        .trim()
        .escape(),
    
    asyncHandler(async(req, res, next) => {

        const errors = validationResult(req)

        const make = new Make({
            name: req.body.name,
            year: req.body.year,
            model: req.body.model
        })

        if (!errors.isEmpty()){
            res.render("make_form", {
                title: "Create new Make and Model",
                make: make,
                errors: errors.array()
            })
            return;
        } else {
            const makeExists = await Make.findOne({
                name: req.body.name,
                year: req.body.year,
                model: req.body.model
            }).exec()
            
            if (makeExists){
                res.redirect(makeExists.url)
            } else {
                await make.save()
                res.redirect(make.url)
            }
        }

    })
    

]

exports.make_delete_get = asyncHandler(async (req, res, next) => {
    const [make, allPartsByMake] = await Promise.all([
        Make.findById(req.params.id).exec(),
        CarPart.find({make: req.params.id}).exec()
    ])
    if (make === null){
        res.redirect('/catalog/makes')
    }
    res.render("make_delete", {
        title: "Delete Make: ",
        make: make,
        allPartsByMake: allPartsByMake
    })

})

exports.make_delete_post = asyncHandler(async (req, res, next) => {
    const [make, allPartsByMake] = await Promise.all([
        Make.findById(req.params.id).exec(),
        CarPart.find({make: req.params.id}).exec()
    ])
    if (allPartsByMake > 0){
        res.render("make_delete", {
            title: "Delete Make: ",
            make: make,
            allPartsByMake: allPartsByMake
        })
        return;
    } else {
        await Make.findByIdAndRemove(req.body.makeid)
        res.redirect('/catalog/makes')
    }
})

exports.make_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Make update GET")
})  

exports.make_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Make udate POST")
})