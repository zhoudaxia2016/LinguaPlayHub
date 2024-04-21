import {Button, Input} from 'antd'
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import TextSave from './TextSave'
import TextList from './TextList'
import MenuContent from './MenuContent'
import {ReadContext} from './'

const { TextArea } = Input

export default function Aside() {
  const [texts, setTexts] = useState<any[]>([])
  const {tags, text, setText} = useContext(ReadContext)

  const fetchTextList = useCallback(() => {
    fetch('/api/text').then(async res => {
      const json = await res.json()
      setTexts(json.map(_ => ({
        ..._,
        tags: _.tags ? JSON.parse(_.tags) : []
      })))
    })
  }, [])

  useEffect(() => {
    fetchTextList()
  }, [fetchTextList])

  const parseText = useCallback((e) => {
    const content = e.target.value
    fetch('/api/text/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text: content})
    }).then(async res => {
        const json = await res.json()
        setText({
          content: content,
          tokenization: json,
        })
      })
  }, [])

  const handleSave = useCallback((info) => {
    const tagIds = info.tags || []
    const desc = info.desc || ''
    const title = info.title
    fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        desc,
        content: text.content,
        id: text.id,
        tags: JSON.stringify(tagIds),
        tokenization: JSON.stringify(text.tokenization),
      })
    }).then(async res => {
        const json = await res.json()
        if (json.tokenization) {
          json.tokenization = JSON.parse(json.tokenization)
          json.tags = JSON.parse(json.tags)
        }
        setText(json)
      })
  }, [text, tags])

  const renderParseMenu = useCallback(close => {
    const onPressEnter = (e) => {
      close()
      parseText(e)
    }
    return (
      <TextArea size="large" allowClear style={{ width: 500 }} rows={20}
        onPressEnter={onPressEnter}></TextArea>
    )
  }, [parseText])

  const renderSaveMenu = useCallback(close => {
    const onSubmit = (e) => {
      close()
      handleSave(e)
    }
    return (
      <TextSave onSubmit={onSubmit}/>
    )
  }, [handleSave])

  const renderTextList = useCallback(close => {
    const onClick = (text) => {
      close()
      setText({...text, tokenization: JSON.parse(text.tokenization)})
    }
    const onDelete = (id) => {
      close()
      const index = texts.find(_ => _.id === id)
      texts.splice(index, 1)
      setTexts(texts)
      fetch('/api/text/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id})
      })
    }
    return (
      <TextList texts={texts} onClickText={onClick} onDeleteText={onDelete}/>
    )
  }, [tags, texts])

  const handleToggleTextList = useCallback((isOpen) => {
    if (isOpen) {
      fetchTextList()
    }
  }, [fetchTextList])

  return (
    <div className="read-aside">
      <MenuContent renderContent={renderParseMenu}>
        <Button className="parse-btn" type="primary">解析文章</Button>
      </MenuContent>
      <MenuContent renderContent={renderSaveMenu}>
        <Button className="save-btn" type="primary">
          {text.id ? '保存文章' : '创建文章'}
        </Button>
      </MenuContent>
      <MenuContent renderContent={renderTextList} onOpenChange={handleToggleTextList}>
        <Button className="text-list-btn" type="primary">文章列表</Button>
      </MenuContent>
    </div>
  )
}
