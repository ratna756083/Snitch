import express from 'express'
import { verifyUser } from '../middlewares/auth.middleware.js'
import { validateAddToCart,validateIncrementcartItemQuantity } from '../validator/cart.validator.js'
import {addToCart,getCart,IncrementcartItemQuantity,DecrementcartItemQuantity,deleteCartItem,craeteOrderPayment,verifyOrderPayment} from '../controllers/cart.controller.js'


const router=express.Router()

router.post("/add/:productId/:variantId",verifyUser,validateAddToCart,addToCart)
router.get("/",verifyUser,getCart)
router.patch("/quantity/increment/:productId/:variantId",verifyUser,validateIncrementcartItemQuantity,IncrementcartItemQuantity)
router.patch("/quantity/decrement/:productId/:variantId",verifyUser,validateIncrementcartItemQuantity,DecrementcartItemQuantity)
router.delete("/delete/:productId/:variantId",verifyUser,validateIncrementcartItemQuantity,deleteCartItem)
router.post("/payment/create/order",verifyUser,craeteOrderPayment)
router.post("/payment/verify/order",verifyUser,verifyOrderPayment)


export default router