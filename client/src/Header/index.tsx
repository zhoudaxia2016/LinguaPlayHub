import './index.less'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Input, Select, Popover, ConfigProvider} from 'antd'

interface IProps {
  searchWord: string,
  activeDicts: string[],
  onActiveDictsChange: (dicts: string[]) => void,
  onSearch: (word: string) => void,
  onSearchWordChange: (e) => void,
}

export default function Header({searchWord, activeDicts, onSearch, onActiveDictsChange, onSearchWordChange}: IProps) {
  const [dicts, setDicts] = useState<any[]>([])
  const handleSelectDict = useCallback((value) => {
    onActiveDictsChange([value])
  }, [onActiveDictsChange])

  useEffect(() => {
    fetch('/api/dict/all').then(async (res) => {
      const json = await res.json()
      setDicts(json)
    })
  }, [])

  const options = useMemo(() => {
    return dicts.map(dict => {
      const popOverContent = (
        <div className="dict-option-tip">
          <div className="dict-option-tip-item description">
            <div>描述</div>
            <div dangerouslySetInnerHTML={{__html: dict.description}}></div>
          </div>
          <div className="dict-option-tip-item">
            <div>创建日期</div>
            <div>{dict.create_date}</div>
          </div>
          <div className="dict-option-tip-item">
            <div>词条数</div>
            <div>{dict.entry}</div>
          </div>
        </div>
      )
      return {
        value: dict.id,
        label: <Popover placement="right" title={dict.title} content={popOverContent}><div>{dict.title}</div></Popover>
      }
    })
  }, [dicts])
  const theme = {
    components: {
      Popover: {zIndexPopup: 9999}
    }
  }
  return (
    <ConfigProvider theme={theme}>
      <div className="header">
        <Select className="dict-select" value={dicts.length ? activeDicts[0] : ''} options={options} onChange={handleSelectDict}/>
        <Input.Search className="search-input" value={searchWord} onSearch={onSearch} onChange={onSearchWordChange}/>
      </div>
    </ConfigProvider>
  )
}
