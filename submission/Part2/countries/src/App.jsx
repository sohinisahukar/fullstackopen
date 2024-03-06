import { useState} from 'react'
import { SearchBar } from './components/SearchBar'
import { SearchResultsList } from './components/SearchResultsList'
// import countryService from './services/countries'

function App() {
  const [results, setResults] = useState([])

  return (
    <div>
      <div>
        <SearchBar setResults={setResults}/>
        <SearchResultsList results={results}/>
      </div>
    </div>
  )
}

export default App
