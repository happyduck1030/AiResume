import { createSlice } from "@reduxjs/toolkit";

const authSilce = createSlice({
  name: "auth",
  initialState: {
    token:null,
    user:null,
    loading:true
  },
  reducers: {
   login:(state,action)=>{
    state.token=action.payload.token
    state.user=action.payload.user
   },
    logout:(state)=>{
    state.token=''
    state.user=null
    localStorage.removeItem('token')
    },
    setLoading:(state,action)=>{
      state.loading=action.payload

    }
   }
  
})
export const {login,logout,setLoading}=authSilce.actions
export default authSilce.reducer