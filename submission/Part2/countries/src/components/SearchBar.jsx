import React from 'react'
import { useState } from 'react'
import countryService from '../services/countries'

export const SearchBar = ({setResults}) => {
    const [input, setInput] = useState("")

    const fetchData = (value) => {
        countryService
        .getAllCountries()
        .then(allCountries => {
            const results = allCountries.filter((country) => {
                return(
                    // value &&
                    country &&
                    country.name.common &&
                    country.name.common.toLowerCase().includes(value.toLowerCase())
                )
            })
            // console.log(results)
            setResults(results)
        })
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }

  return (
    <div>
        Find countries
        <input placeholder="Type to search..."
            value={input}
            onChange={(e) => handleChange(e.target.value)}
        />
    </div>
  )
}
