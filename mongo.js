// mongodb+srv://fullstack:<password>@hiekkaklusteri.33kk8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@hiekkaklusteri.33kk8.mongodb.net/phonybook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(() => {
        console.log('added person:', name, 'number:', number, 'to phonybook')
        mongoose.connection.close()
    })
} else {
    console.log('phooneboo:')
    Person
        .find({})
        .then(ps => {
            ps.forEach(p => {
                console.log(p)
            })
            mongoose.connection.close()
        })
}

