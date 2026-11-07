require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger) //executed in order

//phonebook data

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//middleware; functions used for handling requestand responses

function requestLogger(request, response, next){
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next() //goes to new middleware
}

function unknownEndpoint(request, response){
  response.status(404).send({ error: 'unknown endpoint' })
}

//get phonebook

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts=> {
        response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response)=> {
    Contact.findById(request.params.id).then(person=>{
      if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
  })})

app.get('/info', (request, response)=>{
    const formattedTime = new Date(Date.now()).toString()
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p><br/><p>${formattedTime}</p>`)
})

// creating person
app.post('/api/persons', (request, response) => {
  const body = request.body
  //const samePerson = Contact.exists({name: body.name})

  if (!body.name || !body.number) { //if contact is empty
    return response.status(400).json({ 
      error: 'content is missing' 
    })
  } 

  const contact = new Contact ({
    name: body.name,
    number: body.number
  })
  contact.save().then((savedContact)=>{
    response.json(savedContact)
  })
})


//delete

app.delete('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  phonebook = phonebook.filter((contact) => contact.id !== id)
  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT) //listen to request sent to {PORT}
console.log(`Server running on port ${PORT}`)