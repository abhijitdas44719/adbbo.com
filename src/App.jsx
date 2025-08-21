import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './components/Home'

import About from './components/About'
import Contact from './components/Contact'
import BusManage from './components/BusManage'
import PriceManage from './components/PriceManage'
import { BusProvider } from './context/BusContext'

function App() {
  return (
    <BusProvider>
      <BrowserRouter>
        <Nav/>
        <Routes>
          <Route path="/" element={<Home/>} />
          
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/bus-manage" element={<BusManage/>} />
          <Route path="/price-manage" element={<PriceManage/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </BusProvider>
  )
}

export default App
