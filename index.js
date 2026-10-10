const express = require('express')
const app = express()

app.use(express.json())

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

//get phonebook

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response)=> {
    const id = request.params.id
    const person = phonebook.find(p=>p.id === id)
    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
})

app.get('/info', (request, response)=>{
    const formattedTime = new Date(Date.now()).toString()
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p><br/><p>${formattedTime}</p>`)
})

// creating person

function generateId(){
  return Math.random(1000000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const samePerson = persons.find(p=>p.name === body.name)

  if (!body.name || body.number) { //if contact is empty
    return response.status(400).json({ 
      error: 'content is missing' 
    })
  } else if(samePerson){
    return response.status(400).json({
        error: 'name must be unique'
    })
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = notes.concat(contact)

  response.json(contact)
})


//delete

app.delete('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    phonebook = phonebook.filter(p=>p.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT) //listen to request sent to {PORT}
console.log(`Server running on port ${PORT}`)