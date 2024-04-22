import React, {useCallback, useContext, useMemo} from 'react'
import {ITag, ReadContext} from '../'
import {Button, Tag} from 'antd'

export default function TextList({onClickText, onDeleteText, texts}) {
  const {tags} = useContext(ReadContext)
  const tagColorMap: Map<number, ITag> = useMemo(() => {
    return new Map(tags.map(tag => ([tag.id, tag])))
  }, [tags])

  const handleDelete = useCallback((e, id) => {
    e.stopPropagation()
    onDeleteText(id)
  }, [])

  return (
    <div className="text-list">
      {texts.length === 0 && <div>暂无文章</div>}
      {texts.map((text, i) => (
        <div className="text-list-item" key={i} onClick={() => onClickText(text)}>
          <div className="text-title">
            {text.title}
            {
              text.tags.length > 0 &&
              <div className="text-tags">
                {
                  text.tags.map(id => {
                    const tag = tagColorMap.get(id)
                    return (
                      <Tag key={id} color={tag?.color}>{tag?.title}</Tag>
                    )
                  })
                }
              </div>
            }
          </div>
          <div className="text-desc">{text.desc}</div>
          <Button className="delete-btn" onClick={(e) => handleDelete(e, text.id)}>删除</Button>
        </div>
      ))}
    </div>
  )
}
