const http = require('http')
const express = require('express')
const { request, response } = require('express')
const app = express()
app.use(express.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "AP",
        "number": "040",
        "id": 5
    },
    {
        "name": "AAP",
        "number": "050",
        "id": 6
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const info = '<p>Phonebook has info for ' + persons.length + ' people <br> ' + new Date() + '</p>'
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.send(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }

})

app.post('/api/persons', (request, response) => {
    const personRequest = request.body
    if (personRequest.name && personRequest.number) {
        if (persons.find(p => p.name === personRequest.name)) {
            response.status(400).send('Name already in use')
        } else {


            const person = {
                "name": personRequest.name,
                "number": personRequest.number,
                "id": Math.floor(Math.random() * 10000)
            }
            persons = persons.concat(person)
            response.json(person)
        }
    } else {
        response.status(400).send('Name or number missing')
    }
})

const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
