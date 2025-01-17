import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const baseurl = "https://matrimonykavinapi.azurewebsites.net/api"

//Get Matches with memberId

export const getMatchesWithMemberId = createAsyncThunk('gets/getMatchesWithMemberId',async () =>{
    try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const response = await axios.get(`${baseurl}/Matches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        // console.error('Error fetching personal information:', error);
        throw error;
      }
})

// Created new match

export const postNewMatch = createAsyncThunk('posts/postNewMatch',async (matchRequestDto) =>{
  try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.post(`${baseurl}/Matches`, matchRequestDto ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // console.error('Error fetching personal information:', error);
      throw error;
    }
})

export const updateExistingMatch = createAsyncThunk('update/updateExistingMatch',async (data) =>{
  try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      var {decision,match} = data;
      const updatedMatch = {
        ...match,
        status: decision,
      };
      const response = await axios.put(`${baseurl}/Matches`, updatedMatch ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      // console.error('Error updating Existing match:', error);
      throw error;
    }
})

const MatchSlice = createSlice({
    name:"Match",
    initialState:{
        MyAllMatches:{
            all:[],
            Pending:[],
            Matched:[],
            Requests:[]
        },
        PostMatchRequest:{
            toProfileId: 0,
            message: ""
        },
        UpdateMatchRequest:{
          decision:"",
          match:{}
        },
        loading:false,
        selectedmatchstatus:"",
        pop:false
    },
    reducers:{
      setRequestStatus:(state,action)=>{

        let {selected} = action.payload
        const foundMatch = state.MyAllMatches.all.find(match => (
          match.fromProfileId === selected.memberId ||
          match.toProfileId === selected.memberId
        ));        
        
        if(foundMatch){
          state.selectedmatchstatus = foundMatch.status;
        }
        else{
          state.selectedmatchstatus = ""
        }
      },
      setPopOpen:(state,action)=>{ state.pop = true},
      setPopClose:(state,action)=>{ state.pop = false},
      setPostToProfileId:(state,action)=>{ state.PostMatchRequest.toProfileId = action.payload},
      setPostMessage:(state,action)=>{state.PostMatchRequest.message = action.payload},
      setDecision:(state,action)=>{state.UpdateMatchRequest.decision = action.payload},
      setMatch:(state,action)=>{state.UpdateMatchRequest.match = action.payload}
    },
    extraReducers: (builder) => {
      
      // Add reducers for additional action types here, and handle loading state as needed
      builder
      .addCase(getMatchesWithMemberId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMatchesWithMemberId.fulfilled, (state, action) => {
        const memberId = Number(JSON.parse(localStorage.getItem('user'))?.memberId);
        state.loading = false;
        state.MyAllMatches = {
              all : action.payload,
              Pending: action.payload.filter(
                (match) => match.fromProfileId === memberId && match.status !== "Matched"
              ),
              Matched: action.payload.filter(
                (match) =>
                  match.status === "Matched" &&
                  (match.fromProfileId === memberId || match.toProfileId === memberId)
              ),
              Requests: action.payload.filter(
                (match) => match.toProfileId === memberId && match.status !== "Matched"
              ),
        };
      })
      .addCase(getMatchesWithMemberId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Capture error message
      });

      builder
      .addCase(postNewMatch.fulfilled,(state,action)=>{
        state.loading = false;
      })

      },
})

export const {setPopClose,setPopOpen,setPostMessage,setPostToProfileId,setDecision,setMatch,setRequestStatus} = MatchSlice.actions;

export default MatchSlice.reducer