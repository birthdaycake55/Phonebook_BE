require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')


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

function errorHandler(error, request, response, next){
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger) //executed in order

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
    Contact.countDocuments({}).then(totalCount=>{
      const formattedTime = new Date(Date.now()).toString()
      response.send(`<p>Phonebook has info for ${totalCount} people</p><br/><p>${formattedTime}</p>`)
    })
})

// creating person
app.post('/api/persons', (request, response) => {
  const body = request.body

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

//updating person

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  
  Contact.findById(request.params.id)
  .then(contact => {
    if (!contact){
      return response.status(404).end()
    }

    contact.number = number

    return contact.save().then((updatedContact)=>{
      response.json(updatedContact)
    })
  })
  .catch(error=>next(error))
})


//delete

app.delete('/api/persons/:id', (request, response, next)=>{
  Contact.findByIdAndDelete(request.params.id)
  .then(result=>{
    response.status(204).end()
  })
  .catch(error=>next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT) //listen to request sent to {PORT}
console.log(`Server running on port ${PORT}`)