import { addItem as addItemToCart, rollbackAddItem, setCart } from "../state/cart.slice";
import { addItem, getCart,incrementCartItemApi ,decrementCartItemapi,deleteCartItem} from "../service/cart.api"
import { useDispatch } from 'react-redux'

export const useCart = () => {
    const dispatch = useDispatch()

    async function handelAddItem({ product, productId = product?._id, variantId, price = product?.price }) {
        const optimisticItem = {
            product,
            variant: variantId,
            quantity: 1,
            price,
        }
        dispatch(addItemToCart(optimisticItem))
        let response
        try {
            response = await addItem({ productId, variantId })
        } catch (error) {
            dispatch(rollbackAddItem({ productId, variantId }))
            throw error
        }
        await handelGetCart()
        return response
    }

    async function handelGetCart() {
        const data = await getCart()
        dispatch(setCart(data.cart))
        return data.cart
    }

  async  function handelRemoveItem({productId,variantId}) {
         await deleteCartItem({productId,variantId})
        await handelGetCart()
    }

   
  async  function handelIncrementCartItem({productId,variantId}){
        await incrementCartItemApi({productId,variantId})
        await handelGetCart()
    }
    async function handelDecrementCartItem({productId,variantId}){
        await decrementCartItemapi({productId,variantId})
        await handelGetCart()
    }
    return {
        handelAddItem,
        handelGetCart,
        handelRemoveItem,
        handelIncrementCartItem,
        handelDecrementCartItem
    }
}
