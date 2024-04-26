import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Popover} from 'antd'
import {queryWord} from '../../WordSearch/utils'
import {defaultWordColor, wordColorMap} from './config'
import LikeWord from '~/Component/LikeWord'
import Storage from '~/helper/Storage'
import TranslateResult from '~/Component/TranslateResult'
import {getDict} from '~/WordSearch/api'

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
const configStorage = new Storage('userConfig', {readOnly: true})
let dictStyle = ''
getDict(configStorage.data.dictId).then(dict => {
  dictStyle = dict.style
})

const isPunct = tag => ['PUNCT', 'SYM'].includes(tag)

export default function Token({token: {text, kana, base, tag, info = ''}}: IProps) {
  const [translation, setTranslation] = useState()

  const handleOpenTooltip = useCallback(async (word) => {
    let translation = dictMap.get(word)
    if (!translation) {
      if (!configStorage.data.dictId) {
        return
      }
      const json = await queryWord(word, [configStorage.data.dictId])
      const result = json.filter(_ => _.html)[0]
      translation = result?.html || ''
      dictMap.set(word, translation)
    }
    setTranslation(translation)
  }, [])

  const tooltip = configStorage.data.dictId ? (
    <div className="word-tooltip">
      <div className="word-base">{base}<LikeWord name={base} kana={kana}/></div>
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
          <TranslateResult html={translation} style={dictStyle}/>
        </div>
      }
    </div>
  ) : (
    <div className="word-tooltip">
      <div className="word-base">{base}<LikeWord name={base} kana={kana}/></div>
      <div>先配置默认词典</div>
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
