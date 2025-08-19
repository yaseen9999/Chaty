// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userid:null|| localStorage.getItem('userid'),
  },
  reducers: {
    setUserid: (state, action) => {
      const userid = action.payload;
      state.userid = userid;
      localStorage.setItem('userid',userid);
    },
    loadUserid: (state, action) => {
      const userid = action.payload;
      
      // Load the userid from local storage using the dynamic key
      const storedUserid = localStorage.getItem(userid);
      if (storedUserid) {
        state.userid = storedUserid;
      }
    },
  },
});

export const { setUserid, clearUserid,loadUserid } = userSlice.actions;

export default userSlice.reducer;
