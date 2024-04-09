import React, {useState, useCallback} from 'react'
import './App.css'
import Header from './Header'

function App() {
  const [result, setResult] = useState('')
  const handleSearch = useCallback((word: string) => {
    fetch('/api/query?word=' + word).then(async res => {
      const json = await res.json()
      setResult(json.html)
    })
  }, [])

  return (
    <div className="App">
      <div className="app-title">LanguaPlayHub</div>
      <Header onSearch={handleSearch}/>
      <div className="query-result" dangerouslySetInnerHTML={{__html: result}}></div>
    </div>
  )
}

export default App
