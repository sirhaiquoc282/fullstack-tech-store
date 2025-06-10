import  {createSlice}  from "@reduxjs/toolkit"
import { toast } from "react-toastify";

const initialState = {
    username : localStorage.getItem("username"),
    isLogin : localStorage.getItem("username") !==null && localStorage.getItem("username") !==" " &&  localStorage.getItem("username") !== undefined
}




export const authenSlice = createSlice({
    name: "authenSlice",
    initialState,
    reducers : {
        doLogin: (state, action)=>{
            const {email, password} = action.payload
            if (email === "dien@gmail.com" && password === "123456") {
                
                
                const username = email.split("@")[0];
                localStorage.setItem("username", username);
                return {
                    ...state,
                    username ,
                    isLogin : true
                }
            }
           toast.error("Đăng nhập thất bại :((")
            
           return {
                    ...state,
                    username :"",
                    isLogin : false
                }
        },
        doLoguot : (state)=>{
            localStorage.removeItem("username");
            return {
                    ...state,
                    username :"",
                    isLogin : false
                }
        }

    }
})

export const {doLogin, doLoguot} = authenSlice.actions;
export default authenSlice.reducer;