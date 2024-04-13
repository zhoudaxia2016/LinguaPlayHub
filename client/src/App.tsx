import React, {useState, useCallback} from 'react'
import './App.css'
import Header from './Header'

const dictConfigJSON = localStorage.getItem('LanguaPlayHub-dictConfig')
const dictConfig: any = dictConfigJSON ? JSON.parse(dictConfigJSON) : {}

window.addEventListener('beforeunload', () => {
  localStorage.setItem('LanguaPlayHub-dictConfig', JSON.stringify(dictConfig))
})


function App() {
  const [activeDicts, setActiveDicts] = useState(dictConfig.activeDicts)
  const [result, setResult] = useState('')
  const [empty, setEmpty] = useState(false)
  const handleSearch = useCallback((word: string) => {
    fetch(`/api/query?word=${word}&dictId=${activeDicts[0]}`).then(async res => {
      const {empty, html} = await res.json()
      setEmpty(empty)
      setResult(html)
    })
  }, [activeDicts])

  const handleActiveDictsChange = useCallback((dicts) => {
    setActiveDicts(dicts)
    dictConfig.activeDicts = dicts
  }, [])

  return (
    <div className="App">
      <div className="app-title">LanguaPlayHub</div>
      <Header activeDicts={activeDicts} onSearch={handleSearch} onActiveDictsChange={handleActiveDictsChange}/>
      {
        empty
          ? <div className="no-result">无结果</div>
          : <div className="query-result" dangerouslySetInnerHTML={{__html: result}}></div>
      }
    </div>
  )
}

export default App
