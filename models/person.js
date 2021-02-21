const mongoose = require('mongoose')
const uValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI

console.log('conn to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(console.log('MongoDB connection ok'))
    .catch((error) => {
        console.log('error, no connection to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
    }
})
personSchema.plugin(uValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

