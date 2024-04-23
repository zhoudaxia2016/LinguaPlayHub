import './index.less'
import {Button, message} from 'antd'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import TextSave from './TextSave'
import TextList from './TextList'
import TextParse from './TextParse'
import MenuContent from './MenuContent'
import {ReadContext} from '../'
import {useSearchParams} from 'react-router-dom'
import {getText, deleteText, parseText as parseTextApi, saveText} from '../api'

export default function Aside() {
  const [texts, setTexts] = useState<any[]>([])
  const {tags, text, setText} = useContext(ReadContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [messageApi, contextHolder] = message.useMessage()

  const fetchTextList = useCallback(async () => {
    const texts = await getText()
    setTexts(texts.map(_ => ({
      ..._,
      tags: _.tags ? JSON.parse(_.tags) : []
    })))
  }, [])

  useEffect(() => {
    fetchTextList()
  }, [fetchTextList])

  const parseText = useCallback(async (e) => {
    const content = e.text
    const result = await parseTextApi(content)
    setText({content, tokenization: result})
  }, [])

  const handleSave = useCallback(async (info) => {
    const tagIds = info.tags || []
    const desc = info.desc || ''
    const title = info.title
    if (!text.content) {
      messageApi.open({type: 'warning', content: '请先解析一篇文章'})
      return
    }
    const result = await saveText({
      title,
      desc,
      content: text.content,
      id: text.id,
      tags: JSON.stringify(tagIds),
      tokenization: JSON.stringify(text.tokenization),
    })
    if (result.tokenization) {
      result.tokenization = JSON.parse(result.tokenization)
      result.tags = JSON.parse(result.tags)
    }
    setText(result)
    setSearchParams('id=' + result.id)
  }, [text, tags])

  const renderParseMenu = useCallback(close => {
    const handleParse = (e) => {
      close()
      parseText(e)
    }
    return <TextParse onSubmit={handleParse}/>
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
      setSearchParams('id=' + text.id)
    }
    const onDelete = (id) => {
      close()
      const index = texts.find(_ => _.id === id)
      texts.splice(index, 1)
      setTexts(texts)
      if (searchParams.get('id') === String(id)) {
        setSearchParams('')
        setText({})
      }
      deleteText(id)
    }
    return (
      <TextList texts={texts} onClickText={onClick} onDeleteText={onDelete}/>
    )
  }, [tags, texts, searchParams])

  const handleToggleTextList = useCallback((isOpen) => {
    if (isOpen) {
      fetchTextList()
    }
  }, [fetchTextList])

  return (
    <div className="read-aside">
      {contextHolder}
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
