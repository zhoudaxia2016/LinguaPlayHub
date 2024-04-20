import './index.less'
import React, {useEffect, useState} from 'react'
import Section from './Section'

export default function Read() {
  const [sentences, setSentences] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/parsetext', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text: `輝かしい夏の日のことでありました。少年が、外で遊んでいますと、花で飾られた、柩をのせた自動車が、往来を走ってゆきました。そして、道の上へ、一枝の白い花を落として去ったのです。
　これを見つけた子供たちは、方々から、走り寄りましたが、いちばんはやかった少年が、その花を拾ったのでした。なんという花か、わからなかったけれど、それは、香いの高いみごとな花でありました。
　拾われなかった子供たちは、うらやましそうに、その花を見て、残念がりました。
「お葬いの花なんか拾って、縁起がわるいな。」と、一人がいうと、`})
    }).then(async res => {
        const json = await res.json()
        setSentences(json)
      })
  }, [])
  return (
    <div className="read">
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
