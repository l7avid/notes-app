import { createSlice } from "@reduxjs/toolkit";
import { User } from '@supabase/supabase-js';

const initialState = {
    userData : null as User | null
}

const userAuth = createSlice({
    name:'userData',
    initialState,
    reducers:{
        loginReducer :(state,actions)=>{
            state.userData = actions.payload;
        },
        logoutReducer:(state) =>{
            state.userData = null
        }
    }

})
export const {loginReducer ,logoutReducer} = userAuth.actions;
export default userAuth.reducer