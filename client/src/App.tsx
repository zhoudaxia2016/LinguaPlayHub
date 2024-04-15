import './App.less'
import React from 'react'
import WordSearch from './WordSearch'
import {NavLink, Routes, Route} from "react-router-dom"

export default function App() {
  return (
    <div className="app">
      <div className="app-title">LanguaPlayHub</div>
      <nav>
        <NavLink to="">首页</NavLink>
        <NavLink to="wordsearch">查词</NavLink>
      </nav>
      <Routes>
        <Route path="/wordsearch" element={<WordSearch/>}/>
      </Routes>
    </div>
  )
}
