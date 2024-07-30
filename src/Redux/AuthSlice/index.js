import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'


const baseurl = "https://localhost:7073/api"

//Validator

export const Validator = createAsyncThunk('gets/getsValidation',async (token) =>{
    try {
        const response = await axios.get(`${baseurl}/Validate/validate-token`,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log(response.data);
          return response.data;
      } 
      catch (error) {
        if (error.response && error.response.data.message) {
            return error.response.data.message
        } else {
            return error.message
        }
      }
})



//Login

export const postLoginRequest = createAsyncThunk('posts/postLoginRequest',async (Log) =>{
    try {
        const response = await axios.post(`${baseurl}/User/Login`, Log, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(response.data);
          return response.data;
      } 
      catch (error) {
        console.error('Error fetching personal information:', error);
        throw error;
      }
})


//Register

export const postRegisterRequest = createAsyncThunk('posts/postRegisterRequest',async (Reg) =>{
    try {
        const response = await axios.post(`${baseurl}/User/Register`, Reg, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(response.data);
          return response.data;
      } 
      catch (error) {
        console.error('Error fetching personal information:', error);
        throw error;
      }
})


const AuthSlice = createSlice({
    name:"Auth",
    initialState:{
        loading:false,
        isAuthenticated:true,
        Log:{
            email:"",
            password:""
        },
        Reg:{
            name:"",
            email:"",
            password:"",
        }
    },
    reducers:{
        setAuthenticated:(state,action)=>{state.isAuthenticated = action.payload},
        setLogEmail:(state,action)=>{state.Log.email = action.payload},
        setLogPassword:(state,action)=>{state.Log.password = action.payload},
        setRegName:(state,action)=>{state.Reg.name = action.payload},
        setRegEmail:(state,action)=>{state.Reg.email = action.payload},
        setRegPassword:(state,action)=>{state.Reg.password = action.payload},
    },
    extraReducers: (builder) => {

        builder
        .addCase(Validator.pending,(state)=>{
            state.loading = true;
        })
        .addCase(Validator.fulfilled,(state,action)=>{
            console.log(action.payload.authorized);
            state.isAuthenticated = action.payload.authorized;
        })
        .addCase(Validator.rejected,(state,action)=>{
            console.log(action.error);
            state.isAuthenticated = false;
            console.log("Invalid entry");
        })


        // Add reducers for additional action types here, and handle loading state as needed
        builder
        .addCase(postLoginRequest.pending, (state) => {
            state.loading = true;
        })
        .addCase(postLoginRequest.fulfilled, (state, action) => {
            state.loading = false;
            localStorage.setItem('user',JSON.stringify(action.payload));
        })
        .addCase(postLoginRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Capture error message
        });

        builder
        .addCase(postRegisterRequest.pending, (state) => {
            state.loading = true;
        })
        .addCase(postRegisterRequest.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(postRegisterRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Capture error message
        });

      },
})

export const {setRegPassword,setLogEmail,setLogPassword,setRegEmail,setRegName,setAuthenticated} = AuthSlice.actions

export default AuthSlice.reducer