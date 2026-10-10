import {setUser} from "../state/auth.slice"
import {register,login} from "../service/auth.api"
import { useDispatch } from "react-redux"

export function useAuth(){

  const dispatch=useDispatch()

    async function handleRegister({email,contact,password,fullname,isSeller}){
     const data=await register({email,contact,password,fullname,isSeller})
     dispatch(setUser(data.user))
    }
    async function handelLogin({email,password}){
      const data=await login({email,password})
      dispatch(setUser(data.user))
    }

    return {
        handleRegister,
        handelLogin
    }
}