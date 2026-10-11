import axios from 'axios'

const ProductApi=axios.create({
    baseURL:"/api/products",
    withCredentials:true
})

export async function createProduct(formData){
    const responce=await ProductApi.post("/",formData)
    return responce.data
}

export async function getSellerProducts(){
    const responce=await ProductApi.get("/seller")
    return responce.data
}