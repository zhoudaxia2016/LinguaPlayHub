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
  const [searchWord, setSearchWord] = useState('')
  const [resultHtml, setResultHtml] = useState('')
  const [startsWith, setStartsWith] = useState([])
  const [contains, setContains] = useState([])

  const handleSearchWordChange = useCallback((e) => {
    setSearchWord(e.target.value)
  }, [])
  const handleSearch = useCallback((word: string) => {
    fetch(`/api/query?word=${word}&dictId=${activeDicts[0]}`).then(async res => {
      const {html, contains, startsWith} = await res.json()
      setResultHtml(html)
      setStartsWith(startsWith || [])
      setContains(contains || [])
    })
  }, [activeDicts])
  const handleClickCloseEntry = useCallback((word) => {
    setSearchWord(word)
    handleSearch(word)
  }, [handleSearch])

  const handleActiveDictsChange = useCallback((dicts) => {
    setActiveDicts(dicts)
    dictConfig.activeDicts = dicts
  }, [])

  const empty = !resultHtml && startsWith.length === 0 && contains.length === 0

  return (
    <div className="App">
      <div className="app-title">LanguaPlayHub</div>
      <Header activeDicts={activeDicts} searchWord={searchWord} onSearch={handleSearch}
              onActiveDictsChange={handleActiveDictsChange} onSearchWordChange={handleSearchWordChange}/>
      <div className="query-result">
        {empty && <div className="no-result">无结果</div>}
        {resultHtml && <div className="query-html" dangerouslySetInnerHTML={{__html: resultHtml}}></div>}
        {
          startsWith.length > 0 &&
          <div className="query-result-close">
            <div className="title">相近词条</div>
            <div className="content">
              {startsWith.map(w => <span className="item" onClick={() => handleClickCloseEntry(w)}>{w}</span>)}
            </div>
          </div>
        }
        {
          contains.length > 0 &&
          <div className="query-result-close">
            <div className="title">其他可能词条</div>
            <div className="content">
              {contains.map(w => <span className="item" onClick={() => handleClickCloseEntry(w)}>{w}</span>)}
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default App
