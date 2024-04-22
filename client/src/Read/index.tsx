import './index.less'
import React, {useState, useMemo, useEffect} from 'react'
import Text from './Text'
import Aside from './Aside'
import {useSearchParams} from 'react-router-dom'
import {getText, getTags} from './api'

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
      getText(id).then(text => {
        text.tags = JSON.parse(text.tags)
        text.tokenization = JSON.parse(text.tokenization)
        setText(text)
      })
    }
    getTags().then(tags => {
      setTags(tags)
    })
  }, [])

  return (
    <ReadContext.Provider value={state}>
      <div className="read">
        <Aside/>
        {text.tokenization && text.tokenization.map((sentence, i) => (
          <div key={i} className="text-sentence">
            {sentence.map((section, j) => (
              <Text key={j} tokens={section.tokens}/>
            ))}
          </div>
        ))}
      </div>
    </ReadContext.Provider>
  )
}
