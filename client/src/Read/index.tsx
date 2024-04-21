import './index.less'
import React, {useCallback, useState, useRef} from 'react'
import Section from './Section'
import Aside from './Aside'

export default function Read() {
  const [sentences, setSentences] = useState<any[]>([])
  const handleParse = useCallback((sentences) => {
    setSentences(sentences)
  }, [])

  const gotoText = useCallback(({tokenization}) => {
    setSentences(JSON.parse(tokenization))
  }, [])

  return (
    <div className="read">
      <Aside sentences={sentences} onParse={handleParse} onClickText={gotoText}/>
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
