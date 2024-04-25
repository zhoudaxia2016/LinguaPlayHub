import './index.less'
import React, {useMemo} from 'react'
import Content from './Content'

interface IResult {
  id: number,
  title: string,
  html?: string,
  startsWith?: string[],
  contains?: string[],
}
interface IProps {
  activeDicts: string[],
  dicts: any[],
  onClickCloseEntry: (word: string) => void,
  searchResult: Array<IResult>,
}

export default function SearchResult({searchResult, dicts, activeDicts, onClickCloseEntry}: IProps) {
  const renderDicts = useMemo(() => {
    return activeDicts.map(_ => dicts.find(d => d.id === _)).filter(_ => _)
  }, [dicts, activeDicts])
  const res = renderDicts.map(({id, style}) => {
    const {title, html, startsWith = [], contains = []} = searchResult.find(_ => _.id === id) || {}
    const cs = 'query-result' + ((html || startsWith.length > 0 || contains.length > 0) ? ' has-result' : '')
    return (
      <div key={id} className={cs}>
        <div className="dict-name">{title}</div>
        <Content html={html} style={style}/>
        {
          startsWith.length > 0 &&
            <div className="query-result-close">
              <div className="title">相近词条</div>
              <div className="content">
                {startsWith.map((w, i) => <span key={i} className="item" onClick={() => onClickCloseEntry(w)}>{w}</span>)}
              </div>
            </div>
        }
        {
          contains.length > 0 &&
            <div className="query-result-close">
              <div className="title">其他可能词条</div>
              <div className="content">
                {contains.map((w, i) => <span key={i} className="item" onClick={() => onClickCloseEntry(w)}>{w}</span>)}
              </div>
            </div>
        }
      </div>
    )
  })
  return <>{res}</>
}
