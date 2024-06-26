import './index.less'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Input, Select, Popover, ConfigProvider, Button, Modal, Space} from 'antd'
import {dictConfigStorage} from '../'

interface IProps {
  searchWord: string,
  activeDicts: string[],
  dicts: any[],
  onActiveDictsChange: (dicts: string[]) => void,
  onSearch: (word: string) => void,
  onSearchWordChange: (e) => void,
  onUpdateStyle: (id, style) => void,
}

export default function Header({searchWord, activeDicts, dicts, onSearch, onActiveDictsChange, onSearchWordChange, onUpdateStyle}: IProps) {
  const [history, setHistory] = useState(dictConfigStorage.data.history || [])
  const [historyIndex, setHistoryIndex] = useState(history.length - 1)
  const [modal, contextHolder] = Modal.useModal()
  const style = useRef('')

  useEffect(() => {
    if (history.length) {
      onSearchWordChange({target: {value: history[history.length - 1]}})
    }
  }, [])

  const handleSelectDict = useCallback((value) => {
    onActiveDictsChange(value)
  }, [onActiveDictsChange])

  const handleSettingStyle = (dict) => {
    modal.confirm({
      zIndex: 9999,
      title: '设置词典样式',
      width: '60%',
      content: (
        <Input.TextArea rows={30} defaultValue={dict.style} onChange={(e) => style.current = e.target.value}/>
      ),
      closable: true,
      onOk: () => {
        onUpdateStyle(dict.id, style.current)
      },
    })
  }

  const handleSearch = useCallback((value) => {
    onSearch(value)
    const newHistory = [...history].slice(0, historyIndex + 1)
    newHistory.push(value)
    setHistory(newHistory)
    setHistoryIndex(historyIndex + 1)
  }, [onSearch, history, historyIndex])

  useEffect(() => {
    dictConfigStorage.data.history = history
  }, [history])

  const handleLastHistory = useCallback(() => {
    const index = historyIndex - 1
    setHistoryIndex(index)
    onSearchWordChange({target: {value: history[index]}})
  }, [historyIndex, history, onSearchWordChange])

  const handleNextHistory = useCallback(() => {
    const index = historyIndex + 1
    setHistoryIndex(index)
    onSearchWordChange({target: {value: history[index]}})
  }, [historyIndex, history, onSearchWordChange])

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
          <Button type="primary" onClick={() => handleSettingStyle(dict)}>设置样式</Button>
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
      Popover: {zIndexPopup: 8888}
    }
  }

  const noHistory = history.length === 0
  return (
    <ConfigProvider theme={theme}>
      {contextHolder}
      <div className="header">
        <Select className="dict-select" mode="multiple" value={dicts.length ? activeDicts : []} options={options} onChange={handleSelectDict}/>
        <Input.Search className="search-input" value={searchWord} onSearch={handleSearch} onChange={onSearchWordChange}/>
        <Space>
          <Button className="dict-history-btn"
            disabled={noHistory || historyIndex === 0}
            onClick={handleLastHistory}>
            上一条
          </Button>
          <Button className="dict-history-btn"
            disabled={noHistory || historyIndex === history.length - 1}
            onClick={handleNextHistory}>
            下一条
          </Button>
        </Space>
      </div>
    </ConfigProvider>
  )
}
