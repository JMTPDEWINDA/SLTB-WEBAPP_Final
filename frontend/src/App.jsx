import React from 'react'
import Navbar from './components/navbar/navbar'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home/Home'
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
    <AuthProvider>
      <div className='app'>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/ForgetPassword" element={<ForgetPassword/>}/>
          <Route path="/Dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/SelectForm" element={
            <ProtectedRoute>
              <SelectForm />
            </ProtectedRoute>
          } />
          <Route path="/PlantingForm1" element={
            <ProtectedRoute>
              <PlantingForm1 />
            </ProtectedRoute>
          } />
          <Route path="/ReplantingForm" element={
            <ProtectedRoute>
              <ReplantingForm />
            </ProtectedRoute>
          } />
          <Route path="/ReferenceEntry" element={<ReferenceEntry />} />  
          <Route path="/TrackStatus" element={<TrackStatus />}  />   
          <Route path="/About" element={<About/>} />
          <Route path="/NewReferenceEntity" element={<NewReferenceEntry />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App

