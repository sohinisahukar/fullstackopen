import React, { useState } from 'react'
import Country from './Country'
import countryService from '../services/countries'

export const SearchResultsList = ({ results }) => {

    if (results.length == 1) {
        return (
            <div>
                <Country
                    country={results[0]}
                />
            </div>
        )
    } else if (results.length > 10) {
        return (
            <div>
                <p>Too many matches, specify another filter</p>
            </div>
        )
    } else {
        const [selectedCountry, setSelectedCountry] = useState(null)
        const [tempInfo, setTempInfo] = useState({
            temp: 0,
            wind: 0,
            icon: 0
        })
        const fetchCountry = (country) => {
            countryService
                .getCountry(country)
                .then(country => {
                    // console.log(country)
                    setSelectedCountry(country)

                    const lat = country.capitalInfo.latlng[0]
                    const lon = country.capitalInfo.latlng[1]
                    countryService
                        .getCountryWeather(lat, lon)
                        .then(result => {
                            console.log(result)
                            setTempInfo({
                                temp: (result.main.temp - 273.15).toFixed(2),
                                wind: result.wind.speed,
                                icon: result.weather[0].icon
                            })
                        })
                })
        }
        return (
            <div>
                { }
                <ul>
                    {
                        results.map(country =>
                            <li>{country.name.common}
                                <button onClick={() => fetchCountry(country.name.common)}>show</button>
                            </li>
                        )
                    }
                </ul>
                <div>
                {selectedCountry && (
                    <div>
                        <Country
                            country={selectedCountry}
                            countryTemp={tempInfo}
                        />
                    </div>
                )}
                </div>
            </div>
        )
    }


}
