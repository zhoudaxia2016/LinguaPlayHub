import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Button, Tag} from 'antd'

export default function TextList({onClickText, onDeleteText, tags, texts}) {
  const tagColorMap: Map<string, string> = useMemo(() => {
    return new Map(tags.map(tag => ([tag.title, tag.color])))
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
              text.tags &&
              <div className="text-tags">
                {JSON.parse(text.tags).map(tag => (
                  <Tag key={tag} color={tagColorMap.get(tag)}>{tag}</Tag>
                ))}
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
