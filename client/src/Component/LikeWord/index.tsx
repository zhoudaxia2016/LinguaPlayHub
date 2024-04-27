import {Button} from "antd"
import React, {useCallback, useEffect, useState} from "react"
import {addWord, deleteWord, searchWord} from '~/Vocab/api'

export default function LikeWord({name, kana}) {
  const [word, setWord] = useState<any>(null)

  const handleClick = useCallback(async () => {
    if (word) {
      deleteWord(word.id)
      setWord(null)
    } else {
      setWord(await addWord(name, kana))
    }
  }, [name, kana, word])

  useEffect(() => {
    (async function() {
      const word = await searchWord(name)
      setWord(word)
    })()
  }, [name])

  return <Button onClick={handleClick}>{word ? '取消收藏' : '收藏'}</Button>
}
