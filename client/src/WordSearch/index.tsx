import React, {useState, useCallback, useEffect} from 'react'
import './index.css'
import Header from './Header'
import SearchResult from './SearchResult'
import {updateStyle} from './api'

const dictConfigJSON = localStorage.getItem('LanguaPlayHub-dictConfig')
const dictConfig: any = dictConfigJSON ? JSON.parse(dictConfigJSON) : {}

window.addEventListener('beforeunload', () => {
  localStorage.setItem('LanguaPlayHub-dictConfig', JSON.stringify(dictConfig))
})


function App() {
  const [activeDicts, setActiveDicts] = useState(dictConfig.activeDicts)
  const [dicts, setDicts] = useState<any[]>([])
  const [searchWord, setSearchWord] = useState('')
  const [searchResult, setSearchResult] = useState([])

  const fetchDicts = useCallback(() => {
    fetch('/api/dict/all').then(async (res) => {
      const json = await res.json()
      setDicts(json)
    })
  }, [])

  useEffect(() => {
    fetchDicts()
  }, [])

  const handleSearchWordChange = useCallback((e) => {
    setSearchWord(e.target.value)
  }, [])
  const handleSearch = useCallback((word: string) => {
    fetch('/api/dict/query', {
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

  const handleUpdateStyle = useCallback(async (id, style) => {
    await updateStyle(id, style)
    fetchDicts()
  }, [])

  const empty = !searchResult.some((_: any) => _.html || _.contains?.length || _.startsWith?.length)

  return (
    <div className="word-search">
      <Header dicts={dicts} activeDicts={activeDicts} searchWord={searchWord} onSearch={handleSearch}
              onActiveDictsChange={handleActiveDictsChange} onSearchWordChange={handleSearchWordChange}
              onUpdateStyle={handleUpdateStyle}/>
      <div className="query-result-wrapper">
        {empty && <div className="no-result">无结果</div>}
        <SearchResult activeDicts={activeDicts} dicts={dicts} searchResult={searchResult} onClickCloseEntry={handleClickCloseEntry}/>
      </div>
    </div>
  )
}

export default App
