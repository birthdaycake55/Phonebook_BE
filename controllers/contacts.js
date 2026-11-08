const contactsRouter = require('express').Router() //performs middleware and routing functions
const Contact = require('../models/contact')

//get phonebook

contactsRouter.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

contactsRouter.get('/', (request, response) => {
  Contact.find({}).then(contacts=> {
        response.json(contacts)
  })
})

contactsRouter.get('/:id', (request, response)=> {
    Contact.findById(request.params.id).then(person=>{
      if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
  })})

contactsRouter.get('/info', (request, response)=>{
    Contact.countDocuments({}).then(totalCount=>{
      const formattedTime = new Date(Date.now()).toString()
      response.send(`<p>Phonebook has info for ${totalCount} people</p><br/><p>${formattedTime}</p>`)
    })
})

// creating person
contactsRouter.post('/', (request, response, next) => {
  const body = request.body

  const contact = new Contact ({
    name: body.name,
    number: body.number
  })
  contact.save().then((savedContact)=>{
    response.json(savedContact)
  })
  .catch(error=>next(error))
})

//updating person

contactsRouter.put('/id', (request, response, next) => {
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

contactsRouter.delete('/:id', (request, response, next)=>{
  Contact.findByIdAndDelete(request.params.id)
  .then(result=>{
    response.status(204).end()
  })
  .catch(error=>next(error))
})

module.exports = contactsRouter