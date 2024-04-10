import React, {useState, useCallback} from 'react'
import './App.css'
import Header from './Header'

function App() {
  const [result, setResult] = useState('')
  const [empty, setEmpty] = useState(false)
  const handleSearch = useCallback((word: string) => {
    fetch('/api/query?word=' + word).then(async res => {
      const {empty, html} = await res.json()
      setEmpty(empty)
      setResult(html)
    })
  }, [])

  return (
    <div className="App">
      <div className="app-title">LanguaPlayHub</div>
      <Header onSearch={handleSearch}/>
      {
        empty
          ? <div className="no-result">无结果</div>
          : <div className="query-result" dangerouslySetInnerHTML={{__html: result}}></div>
      }
    </div>
  )
}

export default App
