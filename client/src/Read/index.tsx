import './index.less'
import React, {useCallback, useState, useRef} from 'react'
import Section from './Section'
import {Popover, Button, Input} from 'antd'

const { TextArea } = Input

export default function Read() {
  const [sentences, setSentences] = useState<any[]>([])
  const [inputPopoverVisible, setInputPopoverVisible] = useState(false)

  const parseText = useCallback((e) => {
    fetch('/api/parsetext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text: e.target.value.trim()})
    }).then(async res => {
        const json = await res.json()
        setSentences(json)
        setInputPopoverVisible(false)
      })
  }, [])

  const handleOpenInput = useCallback(() => {
    setInputPopoverVisible(true)
  }, [])

  const textarea = <TextArea size="large" allowClear style={{ width: 500 }} rows={20}
                             onPressEnter={parseText}></TextArea>
  return (
    <div className="read">
      <Popover open={inputPopoverVisible} content={textarea} placement="right" trigger="click" onOpenChange={setInputPopoverVisible}>
         <Button className="open-input" type="primary" onClick={handleOpenInput}>点击后输入</Button>
      </Popover>
      {sentences.map((sentence, i) => (
        <div key={i} className="text-sentence">
          {sentence.map((section, j) => (
            <Section key={j} tokens={section.tokens}/>
          ))}
        </div>
      ))}
    </div>
  )
}
