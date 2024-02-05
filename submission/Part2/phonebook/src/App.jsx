import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  const [filteredPersons, setFilteredPersons] = useState(persons)

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    const duplicateName = persons.map(person => person.name).includes(newName)
    const duplicateNumber = persons.map(person => person.number).includes(newNumber)
    if(duplicateName || duplicateNumber) {
      const dup = duplicateName ? newName : newNumber
      alert(`${dup} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setFilteredPersons(filteredPersons.concat(personObject))
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

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter}/>
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson}
                  newName={newName}
                  handleAddName={handleAddName}
                  newNumber={newNumber}
                  handleAddNumber={handleAddNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons}/>
    </div>
  )
}

export default App