require('dotenv').config()
const http = require('http')
const express = require('express')
const { request, response } = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(p => {
        response.json(p)
    })
})

//hmm, mongoDBn koko jostain?
app.get('/info', (request, response) => {
    const amount = Person.countDocuments(p => p == true)
    const info = '<p>Phonebook has info for ' + amount + ' people <br> ' + new Date() + '</p>'
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(p => {
            if (p) {
                response.send(p)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(r => {
            response.status(204).end()
        })
        .catch(error => next(error))

    /*  vanha implementointi..
        const id = Number(request.params.id)
        const person = persons.find(p => p.id === id)
        if (person) {
            persons = persons.filter(p => p.id !== id)
            response.status(204).end()
        } else {
            response.status(404).end()
        }
    */
})

app.post('/api/persons', (request, response) => {
    const personRequest = request.body
    if (personRequest.name && personRequest.number) {
        if (Person.find(p => p.name === personRequest.name)) {
            response.status(400).send({ error: 'Name already in use' })
        } else {
            const person = new Person({
                name: personRequest.name,
                number: personRequest.number,
                //vanha, nyt mongo hoitaa => "id": Math.floor(Math.random() * 10000)
            })
            // ?hakeeko heti mongoDBstä uuden, vai miksi toimii heti?  persons = persons.concat(person)
            person.save().then(savedPerson => {
                response.json(savedPerson)
            })

        }
    } else {
        response.status(400).send({ error: 'Name or number missing' })
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(newP => {
            console.log(newP)
            response.json(newP)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    // siirto oletus virheenkäsittelijälle
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
