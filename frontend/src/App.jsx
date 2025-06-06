import React from 'react'
import Navbar from './components/navbar/navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import ForgetPassword from './components/ForgetPassword/ForgetPassword'
import Dashboard from './components/Dashboard/Dashboard'
import SelectForm from './components/SelectForm/SelectForm'
import PlantingForm1 from './components/PlantingForm1/PlantingForm1'
import ReplantingForm from './components/ReplantingForm/ReplantingForm'
import ReferenceEntry from './components/ReferenceEntry/ReferenceEntry'
import TrackStatus from './components/TrackStatus/TrackStatus'
import About from './components/About/About'
import NewReferenceEntry from './components/NewReferenceEntry/NewReferenceEntry'



const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/ForgetPassword" element={<ForgetPassword/>}/>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/SelectForm" element={<SelectForm />} />
        <Route path="/PlantingForm1" element={<PlantingForm1 />} />
        <Route path="/ReplantingForm" element={<ReplantingForm />} />
        <Route path="/ReferenceEntry" element={<ReferenceEntry />} />  
        <Route path="/TrackStatus" element={<TrackStatus />}  />   
        <Route path="/About" element={<About/>} />
        <Route path="/NewReferenceEntity" element={<NewReferenceEntry />} />
        
      </Routes>

    </div>
  )
}

export default App

