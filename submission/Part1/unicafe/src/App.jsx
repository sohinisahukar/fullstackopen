import { useState } from 'react'

const Title = ({title}) => {
  return (
    <h1>{title}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClickfunc}>{props.name}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>
        {props.name}
      </td>
      <td>
        {props.value}
      </td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  const avg = (props.good - props.bad) / all
  const pos = (props.good / all) * 100 + " %"

  return (
    <table>
      <StatisticLine name="good" value={props.good}/>
      <StatisticLine name="neutral" value={props.neutral}/>
      <StatisticLine name="bad" value={props.bad}/>
      <StatisticLine name="all" value={all}/>
      <StatisticLine name="average" value={avg}/>
      <StatisticLine name="positive" value={pos}/>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleSetGood = () => {
    setGood(good + 1)
  }

  const handleSetNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleSetBad = () => {
    setBad(bad + 1)
  }

  if(good == 0 && neutral == 0 && bad == 0) {
    return (
      <div>
        <Title title="give feedback"/>
        <Button name="good" onClickfunc={handleSetGood}/>
        <Button name="neutral" onClickfunc={handleSetNeutral}/>
        <Button name="bad" onClickfunc={handleSetBad}/>
        <p>No feedback given</p>
      </div>
    )  
  }

  return (
    <div>
      <Title title="give feedback"/>
      <Button name="good" onClickfunc={handleSetGood}/>
      <Button name="neutral" onClickfunc={handleSetNeutral}/>
      <Button name="bad" onClickfunc={handleSetBad}/>
      <Title title="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App