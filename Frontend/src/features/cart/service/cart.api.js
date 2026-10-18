import axios from 'axios'

const cartApi=axios.create({
    baseURL:"/api/cart",
    withCredentials:true
})

export const addItem=async ({productId,variantId})=>{
    const responce=await cartApi.post(`/add/${productId}/${variantId}`,{quantity:1})

    return responce.data
}

export const getCart=async ()=>{
    const response=await cartApi.get("/",{withCredentials:true})
    return response.data
}

export const incrementCartItemApi=async ({productId,variantId})=>{
   const response=await cartApi.patch(`/quantity/increment/${productId}/${variantId}`)
   return response.data
}

export const decrementCartItemapi=async ({productId,variantId})=>{
    const response=await cartApi.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data
}
export const deleteCartItem=async ({productId,variantId})=>{
   const responce=await cartApi.delete(`/delete/${productId}/${variantId}`)
   return responce.data
}