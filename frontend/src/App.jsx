import React from 'react'
import Navbar from "./Components/Navbar.jsx"
import HomePage from "./Pages/HomePage.jsx"
import SignUpPage from "./Pages/SignUpPage.jsx"
import LoginPage from "./Pages/LoginPage.jsx"
import SettingsPage from "./Pages/SettingsPage.jsx"
import ProfilePage from "./Pages/ProfilePage.jsx"

import {Routes, Route} from "react-router-dom"

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/signup' element={<SignUpPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/settings' element={<SettingsPage/>}></Route>
        <Route path='/profile' element={<ProfilePage/>}></Route>
      </Routes>
    </div>
  )
}

export default App
