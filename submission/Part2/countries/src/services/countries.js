import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAllCountries = () => {
    const request = axios.get(baseUrl+'api/all')
    return request.then(response => response.data)
}

const getCountry = (country) => {
    const request = axios.get(baseUrl+`api/name/${country}`)
    return request.then(response => response.data)
}

const getCountryWeather = (lat, lon) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=90de845aa312bb85fbd49bf2b1c39da4`)
    return request.then(response => response.data)
}

export default {getAllCountries, getCountry, getCountryWeather}