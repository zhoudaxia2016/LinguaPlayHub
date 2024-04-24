import './Nav.less'
import React from 'react'
import {NavLink} from "react-router-dom"

const linkConfig = [
  {title: '首页', link: '/',},
  {title: '查词', link: 'wordsearch'},
  {title: '悦读', link: 'read'},
  {title: '词汇', link: 'vocab'},
]

const linkNum = linkConfig.length
const linkMargin = 15
const linkR = 80
const linkTranslation = (linkR + linkMargin) / Math.sin(Math.PI / linkNum)
const style = {
  '--link-num': linkNum,
  '--link-r': linkR + 'px',
  '--link-translation': linkTranslation + 'px',
} as React.CSSProperties

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-list" style={style}>
        {
          linkConfig.map(({title, link}, i) => (
            <div key={i} className="nav-item" style={{'--link-index': i} as React.CSSProperties}>
              <NavLink className="nav-link" to={link}>{title}</NavLink>
            </div>
          ))
        }
      </div>
    </nav>
  )
}
