const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sohinisahukar:${password}@sohini-fullstackopen.ozfsrvl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=sohini-fullstackopen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length == 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(p => {
          console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
      })
} else if(process.argv.length > 3) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })
      
      person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
}
