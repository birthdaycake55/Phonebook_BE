const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true

  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v){
        return /\d{2}-\d{5}/.test(v)
      }
    }
  },
})

contactSchema.set('toJSON', { //removing certain properties
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() //better to change to string
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema) //to import