import ReactDOM from 'react-dom/client'
import { createStore,combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import anecdoteReducer from './reducers/anecdoteReducer.jsx'
import filterReducer from './reducers/filterReducer.jsx'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)