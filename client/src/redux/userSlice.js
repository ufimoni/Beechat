import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
    name: 'user',
    initialState: {
         user: null,
         allUsers: [],
         allChats: [],
         selectedChats: null,
        },
    reducers: {
        setUser: (state, action) => {state.user = action.payload; },
        setAllUsers: (state, action) => { state.allUsers = action.payload},
        setAllChats: (state, action) => {state.allChats = action.payload},
        setselectedChats: (state, action) => {state.selectedChats = action.payload;}
    }
})

//// here we are  distructuring them into different objects in this array.
export const { setUser, setAllUsers, setAllChats, setselectedChats } = usersSlice.actions;
export default usersSlice.reducer;