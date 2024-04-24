import React, {useCallback, useState} from 'react'
import {Button, Popover} from 'antd'
import {queryWord} from '../../WordSearch/utils'
import {defaultWordColor, wordColorMap} from './config'
import {addWord} from '~/Vocab/api'

export interface IToken {
  text: string,
  base: string,
  tag: string,
  kana: string,
  info: string,
}

interface IProps {
  token: IToken,
}

const dictMap = new Map()

const isPunct = tag => ['PUNCT', 'SYM'].includes(tag)

export default function Token({token: {text, kana, base, tag, info = ''}}: IProps) {
  const [translation, setTranslation] = useState()

  const handleOpenTooltip = useCallback(async (word) => {
    let translation = dictMap.get(word)
    if (!translation) {
      const json = await queryWord(word, ['9fde35a44061a9e2'])
      const result = json.filter(_ => _.html)[0]
      translation = result?.html || ''
      dictMap.set(word, translation)
    }
    setTranslation(translation)
  }, [])

  const handleLikeWord = useCallback(() => {
    addWord(base, kana)
  }, [base, kana])

  const tooltip = (
    <div className="word-tooltip">
      <div className="word-base">{base}<Button onClick={handleLikeWord}>收藏</Button></div>
      <div className="word-tag">{info}</div>
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
    <Popover placement="right" content={tooltip} onOpenChange={() => handleOpenTooltip(base)}>
      <span className="word" style={{'--color': wordColorMap[tag] || defaultWordColor} as React.CSSProperties}>
        <ruby>{text}<rt>{(text === kana || isPunct(tag)) ? '' : kana}</rt></ruby>
      </span>
    </Popover>
  )
}
