import React, {useCallback, useState} from 'react'
import {Popover} from 'antd'
import {queryWord} from '../WordSearch/utils'
import {defaultWordColor, WORD_TAG, wordColorMap} from './config'

export interface IToken {
  text: string,
  base1: string,
  base2: string,
  tag1: string,
  tag2: string,
  kana: string,
}

interface IProps {
  token: IToken,
}

const dictMap = new Map()

export default function Token({token: {text, kana, base1, tag1, tag2}}: IProps) {
  const [translation, setTranslation] = useState()

  const handleOpenTooltip = useCallback(async (word) => {
    const translation = dictMap.get(word)
    if (!translation) {
      const json = await queryWord(word, ['9fde35a44061a9e2'])
      const result = json.filter(_ => _.html)[0]
      const translation = result?.html || ''
      dictMap.set(word, translation)
      setTranslation(translation)
    }
  }, [])

  const tooltip = (
    <div className="word-tooltip">
      <div className="word-base">{base1}</div>
      <div className="word-tag">{tag1}</div>
      {
        translation === undefined && <div>加载中...</div>
      }
      {
        translation === '' && <div>无翻译结果</div>
      }
      {
        translation &&
        <div>
          翻译结果
          <div dangerouslySetInnerHTML={{__html: translation}}></div>
        </div>
      }
    </div>
  )

  return (
    <Popover placement="right" content={tooltip} onOpenChange={() => handleOpenTooltip(text)}>
      <span className="word" style={{'--color': wordColorMap[tag2] || defaultWordColor} as React.CSSProperties}>
        <ruby>{text}<rt>{text === kana ? '' : (tag2 === WORD_TAG.verb ? base1 : kana)}</rt></ruby>
      </span>
    </Popover>
  )
}
