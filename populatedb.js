#! /usr/bin/env node

console.log('This script populates books, authors, genres, and bookinstances to your db' + 
' Specified database as argument - e.g.: node populatedb ""mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority""')

// Get arguments passed on command line
const userArgs = process.argv.slice(2)

const CarPart = require("./models/carParts")
const Category = require("./models/category")
const Make = require("./models/make")

const carParts = []
const categories = []
const makes = []

const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const mongoDB = userArgs[0]

main().catch((err) => console.log(err))

async function main() {
    console.log('DEBUG: about to connect')
    await mongoose.connect(mongoDB)
    console.log('DEBUG: Should be connected?')
    await createCategories()
    await createMakes()
    await createCarParts()
    console.log('DEBUG: Closing mongoose')
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the same category, regardless of the order
// in which the elements of promise.all's argument complete.

async function categoryCreate(index, name) {
    const category = new Category({
        name: name
    })
    await category.save()
    categories[index] = category
    console.log(`Added category: ${name}`)
}


async function makeCreate(index, name, year, model){
    const make = new Make({
        name: name,
        year: year,
        model: model
    })
    await make.save()
    makes[index] = make
    console.log(`Added make ${make}`)
}

async function carPartsCreate(index, name, make, category, price, stock){
    const carpart = new CarPart({
        name: name,
        make: make,
        category: category,
        price: price,
        stock: stock
    })
    await carpart.save()
    carParts[index] = carpart
    console.log(`Added carpart ${carpart}`)
}


async function createCategories() {
    console.log('Adding Categories')
    await Promise.all([
        categoryCreate(0, 'interior'),
        categoryCreate(1, 'body/exterior'),
        categoryCreate(2, 'wheels'),
    ])
}

async function createMakes(){
    console.log("Adding makes")
    await Promise.all([
        makeCreate(0, 'nissan', 1990, '240sx' ),
        makeCreate(1, 'honda', 2010, 'civic si'),
        makeCreate(2, 'Chevrolet', 2012, 'corvette')
    ])
}

async function createCarParts(){
    console.log(`Adding Car Parts`)
    await Promise.all([
        carPartsCreate(0, 'Nissan 240sx steering wheel', makes[0], categories[0], 135.00, 1),
        carPartsCreate(1, 'Honda civic si driver seat', makes[1], categories[0], 350.00, 2),
        carPartsCreate(2, 'Corvette rear wheel 19x12 ', makes[2], categories[2], 450.00, 6)
    ])
}








