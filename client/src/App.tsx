import './App.less'
import React from 'react'
import WordSearch from './WordSearch'
import Read from './Read'
import Nav from './Nav'
import {Routes, Route} from "react-router-dom"
import {ConfigProvider} from 'antd'
import Palette from './Palette'

const cssVars = Object.keys(Palette).reduce((vars, key) => {
  vars[`--${key}`] = Palette[key]
  return vars
}, {})

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: Palette.bg1,
          colorText: Palette.fg1,
          colorPrimary: Palette.stress2,
          controlOutline: Palette.stress2,
        },
      }}
    >
      <div className="app" style={cssVars}>
        <a className="app-title" href="/">LanguaPlayHub</a>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Nav/>}/>
            <Route path="/wordsearch" element={<WordSearch/>}/>
            <Route path="/read" element={<Read/>}/>
          </Routes>
        </div>
      </div>
    </ConfigProvider>
  )
}
