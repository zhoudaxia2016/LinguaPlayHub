import {Button} from "antd"
import React, {useCallback} from "react"
import {addWord} from '~/Vocab/api'

export default function LikeWord({name, kana}) {
  const handleClick = useCallback(() => {
    addWord(name, kana)
  }, [name, kana])
  return <Button onClick={handleClick}>收藏</Button>
}
