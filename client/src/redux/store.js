import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from './loaderSlice';
/*/// we will export this store function after creating a store
creating only ine state
/*/
//// there is a property called reducer
const store = configureStore({
reducer: {loaderReducer}
//// reducer: {loaderReducer: loaderReducer}
})
export default store; /// exporting the store