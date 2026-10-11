const dns = require('node:dns'); //needed or ig mongoose wont work
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] //password pass to terminal

const url = `mongodb+srv://yamssichloe_db_user:${password}@cluster0.ofsc7cj.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 }) //connection to database

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contacts', contactSchema)

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
})

if(process.argv.length===3){
// empty {} means whole contacts collection; could also do ...find({name: ...})
console.log("phonebook:")
Contact.find({}).then(result => {
    result.forEach(contact=>{
        console.log(`${contact.name} ${contact.number}`)
        })
  mongoose.connection.close()
    })} else if(process.argv.length===5){
contact.save().then(result => {
  console.log(`added ${result.name} number ${result.number} to phonebook`)
  mongoose.connection.close()
})}

