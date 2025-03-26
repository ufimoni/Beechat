import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
    name: 'loader',
    initialState: {loader: false},
    reducers: {
        showLoader: (state) => {state.loader = true;},
        hideLoader: (state) => {state.loader = false}
    }
})

//// here we are  distructuring them into different objects in this array.
export const {showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;