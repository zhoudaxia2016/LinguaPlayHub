import './index.less'
import React, {useCallback, useState, useRef, useMemo, useEffect} from 'react'
import Section from './Section'
import Aside from './Aside'

export interface ITag {
  id: number,
  title: string,
  color: string,
}

interface IContext {
  tags: ITag[],
  setTags: (tags: ITag[]) => void,
  text: any,
  setText: any,
}

export const ReadContext = React.createContext<IContext>({
  tags: [],
  setTags: () => {},
  text: null,
  setText: null,
})

export default function Read() {
  const [tags, setTags] = useState<ITag[]>([])
  const [text, setText] = useState<any>({})

  const state = useMemo(() => {
    return {
      tags,
      setTags,
      text,
      setText,
    }
  }, [tags, text])

  useEffect(() => {
    fetch('/api/text/tag').then(async res => {
        const json = await res.json()
        setTags(json)
    })
  }, [])

  return (
    <ReadContext.Provider value={state}>
      <div className="read">
        <Aside/>
        {text.tokenization && text.tokenization.map((sentence, i) => (
          <div key={i} className="text-sentence">
            {sentence.map((section, j) => (
              <Section key={j} tokens={section.tokens}/>
            ))}
          </div>
        ))}
      </div>
    </ReadContext.Provider>
  )
}
