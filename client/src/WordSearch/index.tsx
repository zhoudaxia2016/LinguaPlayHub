import React, {useState, useCallback} from 'react'
import './index.css'
import Header from './Header'
import SearchResult from './SearchResult'

const dictConfigJSON = localStorage.getItem('LanguaPlayHub-dictConfig')
const dictConfig: any = dictConfigJSON ? JSON.parse(dictConfigJSON) : {}

window.addEventListener('beforeunload', () => {
  localStorage.setItem('LanguaPlayHub-dictConfig', JSON.stringify(dictConfig))
})


function App() {
  const [activeDicts, setActiveDicts] = useState(dictConfig.activeDicts)
  const [searchWord, setSearchWord] = useState('')
  const [searchResult, setSearchResult] = useState([])

  const handleSearchWordChange = useCallback((e) => {
    setSearchWord(e.target.value)
  }, [])
  const handleSearch = useCallback((word: string) => {
    fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({word, dictList: activeDicts})
    }).then(async res => {
      const json = await res.json()
      setSearchResult(json)
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

  const empty = searchResult.length === 0

  return (
    <div className="App">
      <Header activeDicts={activeDicts} searchWord={searchWord} onSearch={handleSearch}
              onActiveDictsChange={handleActiveDictsChange} onSearchWordChange={handleSearchWordChange}/>
      <div className="query-result-wrapper">
        {empty && <div className="no-result">无结果</div>}
        {!empty && <SearchResult searchResult={searchResult} onClickCloseEntry={handleClickCloseEntry}/>}
      </div>
    </div>
  )
}

export default App
