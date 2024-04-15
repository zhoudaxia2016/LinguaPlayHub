import './index.less'
import React from 'react'

interface IResult {
  title: string,
  html?: string,
  startsWith?: string[],
  contains?: string[],
}
interface IProps {
  onClickCloseEntry: (word: string) => void,
  searchResult: Array<IResult>,
}

export default function SearchResult({searchResult, onClickCloseEntry}: IProps) {
  const res = searchResult.map(({title, html, startsWith = [], contains = []}) => {
    if (!html && startsWith.length === 0 && contains.length === 0) {
      return
    }
    return (
      <div key={title} className="query-result">
        <div className="dict-name">{title}</div>
        {html && <div className="query-html" dangerouslySetInnerHTML={{__html: html}}></div>}
        {
          startsWith.length > 0 &&
            <div className="query-result-close">
              <div className="title">相近词条</div>
              <div className="content">
                {startsWith.map(w => <span className="item" onClick={() => onClickCloseEntry(w)}>{w}</span>)}
              </div>
            </div>
        }
        {
          contains.length > 0 &&
            <div className="query-result-close">
              <div className="title">其他可能词条</div>
              <div className="content">
                {contains.map(w => <span className="item" onClick={() => onClickCloseEntry(w)}>{w}</span>)}
              </div>
            </div>
        }
      </div>
    )
  })
  return <>{res}</>
}
