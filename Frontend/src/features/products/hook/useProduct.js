import { setSellerProducts,setProducts } from "../state/product.slice"
import { createProduct, getSellerProducts ,getAllProducts,getProductDetail,addProductVariant} from "../service/product.api"
import { useDispatch } from "react-redux"

export const useProduct = () => {
    const dispatch = useDispatch()

    async function handelCreateProduct(formData) {
        const data = await createProduct(formData)
        return data.product
    }

    async function handelGetSellerproducts() {
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products))
        return data.products
    }
    async function handelGetAllProducts(){
        const data=await getAllProducts()
        dispatch(setProducts(data.products))
    }
    async function handelGetProductDetail(Id){
        const data=await getProductDetail(Id)
        return data.product
    }
    async function handelAddProductvariant(productId,addNewVariant){
        const data=await addProductVariant(productId,addNewVariant)
        return data
    }

    
    return {
        handelCreateProduct,
        handelGetSellerproducts,
        handelGetAllProducts,
        handelGetProductDetail,
        handelAddProductvariant
        
    }
}