require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('req-body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformed id' })
    }else if( error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get(('/info'), (request, response) => {
    Person.countDocuments({})
        .then(result => {
            const totCount = result
            const res = {
                requestTime: new Date().toString('en-US'),
                message: `Phonebook has info for ${totCount} people.`
            }
            response.send(`<p>${res.message}</p>
                       <p>${res.requestTime}</p>`)
        })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.statusCode(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(404).json({
            error: 'name or number missing'
        })
    }

    Person.findOne({name: {$regex: new RegExp(`${body.name}$`, 'i')}})
        .then(existingPerson => {
            if(existingPerson) {
                const update = {number: body.number}
                Person.findByIdAndUpdate(existingPerson._id, update, {new: true})
                    .then(updatedPerson => {
                        response.json(updatedPerson)
                    })
                    .catch(error => next(error))
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })
            
                person.save()
                    .then(savedPerson => {
                        response.json(savedPerson)
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))    
})

app.use(errorHandler)

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})