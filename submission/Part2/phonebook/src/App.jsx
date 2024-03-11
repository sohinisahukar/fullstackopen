import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import personService from './services/persons'

// eslint-disable-next-line react/prop-types
const Notification = ({message, isError}) => {
  if(message === null) {
    return null
  }
  return (
    <div className={isError ? 'error' : 'notification'}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  const [filteredPersons, setFilteredPersons] = useState([])

  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    isError: false
  })

  const timeout = () => {
    setTimeout(() => {
      setNotificationMessage({
        message: null,
        isError: false
      })
    }, 5000)
  }

  const fetchPhonebook = () => {
    personService
    .getAll()
    .then(initialPhonebook => {
      setPersons(initialPhonebook)
      setFilteredPersons(initialPhonebook)
    })
    .catch(error => {
      console.log(error)
      setNotificationMessage({
        message: `Error occoured during getAll() function call.`,
        isError: true
      })
      timeout()
    })
  }

  useEffect(fetchPhonebook, [])

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
            setNotificationMessage({
              message: `${updatedPerson.name}'s number updated successfully.`,
              isError: false
            })
            timeout()
            //after updating number re-render data with updated info
            fetchPhonebook()
          })
          .catch(error => {
            console.log(error)
            var msg = error.response.status === 404 ? 
              `Information of ${person.name} has already been removed from server.` :
              `Error on update() function call.`
            setNotificationMessage({
              message: msg,
              isError: true
            })
            timeout()
            fetchPhonebook()
          })
        } else {
          console.log(`${newName}'s number update aborted.`)
          setNotificationMessage({
            message: `${newName}'s number update aborted.`,
            isError: false
          })
          timeout()
        }
      }  
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setFilteredPersons(filteredPersons.concat(returnedPerson))
        setNotificationMessage({
          message: `Added ${returnedPerson.name}`,
          isError: false
        })
        timeout()
        fetchPhonebook()
      })
      .catch(error => {
        setNotificationMessage({
          message: error.response.data.error,
          isError: true
        })
        timeout()
        fetchPhonebook()
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
          setNotificationMessage({
            message: `${returnedPerson.name} has been successfully deleted.`,
            isError: false
          })
          timeout()
          //after deleting the record re-render the data
          fetchPhonebook()
        })
        .catch(error => {
          console.log(error)
          setNotificationMessage({
            message: `${person.name} has already been removed from the server.`,
            isError: true
          })
          timeout()
          fetchPhonebook()
        })
    } else {
      console.log(`Deleting ${person.name} was aborted.`)
      setNotificationMessage({
        message: `Deleting ${person.name} was aborted.`,
        isError: false
      })
      timeout()
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage.message} isError={notificationMessage.isError}/>
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