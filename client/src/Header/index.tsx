import './index.less'
import React, {useCallback, useState} from 'react'
import {Input} from 'antd'

interface IProps {
  onSearch: (word: string) => void,
}

export default function Header({onSearch}: IProps) {
  return (
    <div className="header">
      <Input.Search className="search-input" onSearch={onSearch}/>
    </div>
  )
}
