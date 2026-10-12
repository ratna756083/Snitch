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

export async function getAllProducts(){
    const responce=await ProductApi.get("/")
    return responce.data
}

export async function getProductDetail(Id){
    const responce =await ProductApi.get(`/details/${Id}`)
    return responce.data
}