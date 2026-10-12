import {setLoading, setUser} from "../state/auth.slice"
import {register,login,getMe} from "../service/auth.api"
import { useDispatch } from "react-redux"

export function useAuth(){

  const dispatch=useDispatch()

    async function handleRegister({email,contact,password,fullname,isSeller}){
     const data=await register({email,contact,password,fullname,isSeller})
     dispatch(setUser(data.user))
     return data.user
    }
    async function handelLogin({email,password}){
      const data=await login({email,password})
      dispatch(setUser(data.user))
      return data.user
    }

    async function handelGetMe(){
     try {
       dispatch(setLoading(true))
      const data=await getMe()
      dispatch(setUser(data.user))
      
     } catch (error) {
      console.log(error)
     }finally{
      dispatch(setLoading(false))
     }

    }

    return {
        handleRegister,
        handelLogin,
        handelGetMe
    }
}