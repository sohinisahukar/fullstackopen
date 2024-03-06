import React from 'react'
import "./Components.css"

const Country = ({country, countryTemp}) => {
    const languages = country.languages
    console.log(countryTemp.icon)
    const imgSrc = `https://openweathermap.org/img/wn/${countryTemp.icon}@2x.png`
    return(
        <>
        <h2>{country.name.common}</h2>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <p>Languages:</p>
            <ul>
                {Object.entries(languages).map(([key, value]) =>
                    <li key={key}>{value}</li>
                )}
            </ul>
        <img className="countryFlag" src={country.flags.svg} alt={country.flags.alt}></img>
        <h3>Weather in {country.capital}</h3>
        <p>temperature {countryTemp.temp} Celcius </p>
        <img src={imgSrc} width="100" height="100"></img>
        <p>wind {countryTemp.wind} m/s</p>
        </>
    )
}

export default Country