const mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: 'Nil'
    }
})

const Form = mongoose.model("Form", formSchema)
module.exports = Form