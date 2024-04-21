import {Button, Input} from 'antd'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import TextSave from './TextSave'
import TextList from './TextList'
import MenuContent from './MenuContent'

const { TextArea } = Input

interface IProps {
  sentences: any[],
  onParse: (sentences: any[]) => void,
  onClickText: (text) => void,
}
export default function Aside({sentences, onParse, onClickText}: IProps) {
  const [tags, setTags] = useState<any[]>([])
  const [texts, setTexts] = useState<any[]>([])

  const fetchTextList = useCallback(() => {
    fetch('/api/text').then(async res => {
      const json = await res.json()
      setTexts(json)
    })
  }, [])

  const fetchTags = useCallback(() => {
    fetch('/api/text/tag').then(async res => {
        const json = await res.json()
        setTags(json)
    })
  }, [])

  useEffect(() => {
    fetchTextList()
    fetchTags()
  }, [])

  useEffect(() => {
    fetchTextList()
  }, [fetchTextList])
  const content = useRef('')
  const parseText = useCallback((e) => {
    content.current = e.target.value
    fetch('/api/text/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text: e.target.value.trim()})
    }).then(async res => {
        const json = await res.json()
        onParse(json)
      })
  }, [onParse])

  const handleSave = useCallback((info) => {
    fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...info,
        tags: info.tags && JSON.stringify(info.tags.map(i => tags[i].title)),
        content: content.current,
        tokenization: JSON.stringify(sentences),
      })
    })
  }, [sentences, tags])

  const renderCreateMenu = useCallback(close => {
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
      fetchTextList()
    }
    return (
      <TextSave tags={tags} onSubmit={onSubmit}/>
    )
  }, [tags, handleSave, fetchTextList])

  const renderTextList = useCallback(close => {
    const onClick = (e) => {
      close()
      onClickText(e)
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
      <TextList tags={tags} texts={texts} onClickText={onClick} onDeleteText={onDelete}/>
    )
  }, [tags, texts, onClickText])

  return (
    <div className="read-aside">
      <MenuContent renderContent={renderCreateMenu}>
        <Button className="create-btn" type="primary">创建文章</Button>
      </MenuContent>
      <MenuContent renderContent={renderSaveMenu}>
        <Button className="save-btn" type="primary">保存文章</Button>
      </MenuContent>
      <MenuContent renderContent={renderTextList}>
        <Button className="text-list-btn" type="primary">文章列表</Button>
      </MenuContent>
    </div>
  )
}
