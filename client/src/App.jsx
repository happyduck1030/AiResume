
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Login from './pages/Login.jsx'
import Preview from './pages/Preview.jsx'
import ResumeBuilder from './pages/ResumeBuilder.jsx'
import Dashboard from './pages/Dashboard.jsx'
import api from './configs/api.js'
import { login,setLoading } from './app/features/authSlice.js'
import { useDispatch } from 'react-redux'
import {Toaster}from 'react-hot-toast'


const App = () => {

  const dispatch = useDispatch()
  const getUserData=async()=>{
    const token=localStorage.getItem('token')
    try{
      if(token){
        const {data}=await api.get('/api/users/data',{headers:{Authorization:token}})
        if(data.user){
          dispatch(login({token,user:data.user}))
        }
        
        dispatch(setLoading(false))
      }else{
        console.log('no token')
        dispatch(setLoading(false))

      }
    }catch(err){
  
      dispatch(setLoading(false))
      console.log('no token',err.message)
    }
  }
  useEffect(()=>{
    getUserData()
  },[])
  return (
    <>
    <Toaster/>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/app' element={<Layout />} >
              <Route index element={<Dashboard />}></Route>
              <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          </Route>
          <Route path="view/:resumeId" element={<Preview />} />
          
         
       </Routes>
    </>
  )
}

export default App