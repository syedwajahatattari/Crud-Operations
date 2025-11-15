import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AddUser from './components/AddUser'
import UpdateUser from './components/UpdateUser'
import DataScreen from './components/DataScreen'
import UserEnquiry from './components/UserEnquiry'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    {/* <BrowserRouter>
    <Routes>
      <Route path='/' element={<DataScreen />} />
      <Route path='/add' element={<AddUser />} />
      <Route path='/update/:id' element={<UpdateUser />} />
      <Route path='/enquiry' element={<UserEnquiry />} />
    </Routes>

    </BrowserRouter> */}
      {/* <AddUser />
      <UpdateUser />
      <DataScreen />
      */}
      <UserEnquiry /> 
    </>
  )
}

export default App
