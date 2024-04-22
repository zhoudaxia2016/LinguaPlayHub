import './index.less'
import React, {useState, useMemo, useEffect} from 'react'
import Section from './Section'
import Aside from './Aside'
import {useSearchParams} from 'react-router-dom'

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
  const [searchParams] = useSearchParams()

  const state = useMemo(() => {
    return {
      tags,
      setTags,
      text,
      setText,
    }
  }, [tags, text])

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      fetch('/api/text/detail?id=' + id).then(async res => {
        const json = await res.json()
        json.tags = JSON.parse(json.tags)
        json.tokenization = JSON.parse(json.tokenization)
        setText(json)
      })
    }
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
