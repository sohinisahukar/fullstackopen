import { filterChange } from '../reducers/filterReducer.jsx'
import { useDispatch } from 'react-redux'

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
      dispatch(filterChange(event.target.value))
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter 
        <input
            type='text'
            placeholder='Search anecdotes'
            name='filter'
            onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter