const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CarPartSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    make: {
        type: Schema.Types.ObjectId,
        ref: "Make",
        required: true,
        maxLength: 100
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    }
})

CarPartSchema.virtual("url").get(function() {
    return `/catalog/carparts/${this.id}`
})

module.exports = mongoose.model("CarPart", CarPartSchema)