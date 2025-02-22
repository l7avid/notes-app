import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData : null
}

const userAuth = createSlice({
    name:'userData',
    initialState,
    reducers:{
        login :(state,actions)=>{
            state.userData = actions.payload;
        },
        logout:(state) =>{
            state.userData = null
        }
    }

})
export const {login ,logout} = userAuth.actions;
export default userAuth.reducer