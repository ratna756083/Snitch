import {createSlice} from '@reduxjs/toolkit'

const cartSlice=createSlice({
    name:"cart",
    initialState:{
        totalPrice:null,
        currency:null,
        items:[]
    },
    reducers:{
        setCart:(state,action)=>{
        state._id=action.payload._id
        state.items=action.payload.items || []
        state.totalPrice=action.payload.totalPrice
        state.currency=action.payload.currency
        },
        addItem:(state,action)=>{
            const newItem = action.payload
            const existingItem = state.items.find(item =>
                String(item.product?._id || item.product) === String(newItem.product?._id || newItem.product) &&
                String(item.variant) === String(newItem.variant)
            )
            if (existingItem) {
                existingItem.quantity = (Number(existingItem.quantity) || 1) + 1
            } else {
                state.items.push(newItem)
            }
        },
        rollbackAddItem:(state,action)=>{
            const {productId,variantId} = action.payload
            const existingItem = state.items.find(item =>
                String(item.product?._id || item.product) === String(productId) &&
                String(item.variant) === String(variantId)
            )
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1
            } else {
                state.items = state.items.filter(item =>
                    String(item.product?._id || item.product) !== String(productId) ||
                    String(item.variant) !== String(variantId)
                )
            }
        },
    }
})

export const {setCart, addItem, rollbackAddItem}=cartSlice.actions
export default cartSlice.reducer