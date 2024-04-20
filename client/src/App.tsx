import './App.less'
import React from 'react'
import WordSearch from './WordSearch'
import Read from './Read'
import Nav from './Nav'
import {Routes, Route} from "react-router-dom"

export default function App() {
  return (
    <div className="app">
      <a className="app-title" href="/">LanguaPlayHub</a>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Nav/>}/>
          <Route path="/wordsearch" element={<WordSearch/>}/>
          <Route path="/read" element={<Read/>}/>
        </Routes>
      </div>
    </div>
  )
}
