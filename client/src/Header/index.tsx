import './index.less'
import React, {useCallback, useEffect, useState} from 'react'
import {Input, Select} from 'antd'

interface IProps {
  onSearch: (word: string) => void,
}

export default function Header({onSearch}: IProps) {
  const [activeDictId, setActiveDictId] = useState(0)
  const [dicts, setDicts] = useState([])
  const handleSelectDict = useCallback((value) => {
    fetch('/api/dict/active', {
      method: 'POST',
      body: JSON.stringify({id: value})
    })
    setActiveDictId(value)
  }, [])
  useEffect(() => {
    fetch('/api/dict/all').then(async (res) => {
      const json = await res.json()
      setDicts(json.map(_ => ({value: _.id, label: _.name})))
    })
    fetch('/api/dict/active').then(async res => {
      const id = await res.text()
      setActiveDictId(Number(id))
    })
  }, [])
  return (
    <div className="header">
      <Select className="dict-select" value={activeDictId} options={dicts} onChange={handleSelectDict}/>
      <Input.Search className="search-input" onSearch={onSearch}/>
    </div>
  )
}
