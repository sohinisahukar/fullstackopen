import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  const [filteredPersons, setFilteredPersons] = useState([])

  const hook = () => {
    personService
    .getAll()
    .then(initialPhonebook => {
      setPersons(initialPhonebook)
      setFilteredPersons(initialPhonebook)
    })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    const duplicateName = persons.map(person => person.name).includes(newName)
    const duplicateNumber = persons.map(person => person.number).includes(newNumber)
    if(duplicateName) {
      if(duplicateNumber) {
        alert(`${newName} is already added to phonebook`)
      } else {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
          const person = persons.find(p => p.name === newName)
          personService
          .update(person.id, personObject)
          .then(updatedPerson => {
            console.log(`${updatedPerson.name}'s number updated successfully.`)
            personService
            .getAll()
            .then(updatedPhonebook => {
              setPersons(updatedPhonebook)
              setFilteredPersons(updatedPhonebook)
            })
          })
        } else {
          console.log(`${newName}'s number update aborted.`)
        }
      }  
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setFilteredPersons(filteredPersons.concat(returnedPerson))
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleAddName = (event) => {
    setNewName(event.target.value)
  }

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
    setFilteredPersons(persons.filter(person => 
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    ))
  }

  const handleDeletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if(window.confirm(`Delete ${person.name} ?`)) {   
      personService
        .remove(person.id)
        .then(returnedPerson => {
          console.log(`${returnedPerson.name} has been successfully deleted.`)
          personService
            .getAll()
            .then(updatedPhonebook => {
              setPersons(updatedPhonebook)
              setFilteredPersons(updatedPhonebook)
    })
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      console.log(`deleting ${person.name} was aborted.`)
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} handleFilter={handleFilter}/>
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson}
                  newName={newName}
                  handleAddName={handleAddName}
                  newNumber={newNumber}
                  handleAddNumber={handleAddNumber}
      />
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person => 
          <Person
            key={person.id}
            person={person}
            deletePerson={() => handleDeletePerson(person.id)}
          />
        )}
      </ul>
    </div>
  )
}

export default App