import { setSellerProducts } from "../state/product.slice"
import { createProduct, getSellerProducts } from "../service/product.api"
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

    return {
        handelCreateProduct,
        handelGetSellerproducts
    }
}