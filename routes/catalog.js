const express = require('express')
const router = express.Router()
const carParts_controller = require("../controllers/carPartsController")
const category_controller = require("../controllers/categoryController")
const make_controller = require("../controllers/makeController")


// routes for car parts
router.get('/', carParts_controller.index)

router.get('/carparts/create', carParts_controller.carParts_create_get)

router.post('/carparts/create', carParts_controller.carParts_create_post)

router.get('/carparts/:id/delete', carParts_controller.carParts_delete_get,) 

router.post('/carparts/:id/delete', carParts_controller.carParts_delete_post)

router.get('/carparts/:id/update', carParts_controller.carParts_update_get) 

router.post('/carparts/:id/update', carParts_controller.carParts_update_post)

router.get('/carparts/:id/', carParts_controller.carParts_detail)

router.get('/carparts', carParts_controller.carParts_list)


// routes for category

router.get('/category/create', category_controller.category_create_get)

router.post('/category/create', category_controller.category_create_post)

router.get('/category/:id/delete', category_controller.category_delete_get)

router.post('/category/:id/delete', category_controller.category_delete_post)

router.get('/category/:id/update', category_controller.category_update_get)

router.post('/category/:id/update', category_controller.category_update_post)

router.get('/category/:id', category_controller.category_detail)

router.get('/categories', category_controller.category_list)

// routes for make

router.get('/make/create', make_controller.make_create_get)

router.post('/make/create', make_controller.make_create_post)

router.get('/make/:id/delete', make_controller.make_delete_get)

router.post('/make/:id/delete', make_controller.make_delete_post)

router.get('/make/:id/update', make_controller.make_update_get)

router.post('/make/:id/update', make_controller.make_update_post)

router.get('/make/:id', make_controller.make_detail)

router.get('/makes', make_controller.make_list)


module.exports = router

