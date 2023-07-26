const mongoose = require("mongoose")

const Schema = mongoose.Schema

const MakeSchema = new Schema({
    name: {
        type: String,
        maxLength: 100,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: true,
        maxLength: 100
    }
})

MakeSchema.virtual("url").get(function () {
    return `/catalog/make/${this.id}`
})

module.exports = mongoose.model("Make", MakeSchema)