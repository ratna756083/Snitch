import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import {craeteOrder} from "../services/payment.service.js"
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";
export const addToCart=async (req,res)=>{

    const {productId,variantId}=req.params
    const {quantity=1}=req.body

    
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    })

    if(!product){
        return  res.status(404).json({
            message:"product or Varient not found",
            success:false
        })
    }
    const stock=await stockOfVariant(productId,variantId)


    const cart=(await cartModel.findOne({user:req.user._id})) || (await cartModel.create({user:req.user._id}))

    const isProductAlredyInCart= cart.items.some(item=>item.product.toString() === productId && item.variant?.toString() === variantId)

    if(isProductAlredyInCart){
       const quantityInCart=cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity
       if(quantityInCart + quantity > stock){
        return res.status(400).json({
            message:`Only ${stock} items left in stock and you already have ${quantityInCart} items in your cart`,
            success:false
        })
       }

       await cartModel.findByIdAndUpdate(
        {user:req.user._id,"items.product":productId,"items.variant":variantId},
        {$inc:{"items.$.quantity":quantity}},
        {new:true}
       )
       return res.status(200).json({
        message:"Cart updated successfully",
        success:true
       })

    }


    if(quantity > stock){
        return res.status(400).json({
            message:`Only ${stock} items left in stock`,
            success:false
        })
    }

    cart.items.push({
        product:productId,
        variant:variantId,
        quantity,
        price:product.price
    })
    cart.save()

    return res.status(200).json({
       message:"Product added to cart successfully",
       success:true
    })

}

export const getCart=async (req,res)=>{
    const user=req.user
  let cart=await getCartDetails(user._id)

    if(!cart){
        cart=await cartModel.create({user:user._id})
    }

    return res.status(200).json({
        message:"Cart fetched successfully",
        sucess:true,
        cart
    })
}

export const IncrementcartItemQuantity=async (req,res)=>{
    
    const {productId,variantId}=req.params
   

    
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    })

    if(!product){
        return  res.status(404).json({
            message:"product or Varient not found",
            success:false
        })
    }

    const cart=await cartModel.findOne({user:req.user._id})
    if(!cart){
        return res.status(404).json({
            message:"cart not found",
            success:false
        })
    }
    const stock=await stockOfVariant(productId,variantId)
    const quantityInCart=cart.items.find(item=>item.product.toString()=== productId && item.variant?.toString() === variantId )?.quantity || 0

    if(quantityInCart + 1 >stock){
        return res.status(400).json({
            message:`only ${stock} item left in stock.and you already have ${quantityInCart} items`,
            success:false

        })
    }

    await cartModel.findOneAndUpdate(
   { user:req.user._id,"items.product":productId,"items.variant":variantId},
   {$inc:{"items.$.quantity":1}},
   {new:true}
   )

   return res.status(200).json({
    message:"Cart items quantity incremented successfully",
    success:true
   })

}

export const DecrementcartItemQuantity=async (req,res)=>{
    const {productId,variantId}=req.params
   

    
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    })

    if(!product){
        return  res.status(404).json({
            message:"product or Varient not found",
            success:false
        })
    }

    const cart=await cartModel.findOne({user:req.user._id})
    if(!cart){
        return res.status(404).json({
            message:"cart not found",
            success:false
        })
    }
  
    const quantityInCart=cart.items.find(item=>item.product.toString()=== productId && item.variant?.toString() === variantId )?.quantity || 0
    if(quantityInCart <=1){
        return res.status(400).json({
            message:"can not decrease more"
        })
    }

      await cartModel.findOneAndUpdate(
   { user:req.user._id,"items.product":productId,"items.variant":variantId},
   {$inc:{"items.$.quantity":-1}},
   {new:true}
   )

   return res.status(200).json({
    message:"Cart items quantity Decremented successfully",
    success:true
   })

}

export const deleteCartItem=async (req,res)=>{
      const {productId,variantId}=req.params
   

    
    const product=await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    })

    if(!product){
        return  res.status(404).json({
            message:"product or Varient not found",
            success:false
        })
    }

    const cart=await cartModel.findOne({user:req.user._id})
    if(!cart){
        return res.status(404).json({
            message:"cart not found",
            success:false
        })
    }

    await cartModel.updateOne(
        {user:req.user._id},
        {$pull:{items:{product:productId,variant:variantId}}}
    )

    return res.status(200).json({
        message:"cart item deleted successfully"
    })
}

export const craeteOrderPayment=async (req,res)=>{

    let cart=await getCartDetails(req.user._id)
    if(!cart){
        return res.status(400).json({
            message:"cart not found"
        })
    }
   const order=await craeteOrder({amount:cart.totalPrice,currency:cart.currency})

   const payment=await paymentModel.create({
      user:req.user._id,
      razorpay:{
        orderId:order.id
      },
      price:{
        amount:cart.totalPrice,
        currency:cart.currency
      },
      orderItems:cart.items.map(item=>({
        title:item.product.title,
        productId:item.product._id,
        variantId:item.variant,
        quantity:item.quantity,
        images:item.product.variants.images || item.product.images,
        description:item.product.description,
        price:{
            amount:item.product.variants.price.amount || item.product.price.amount,
            currency:item.product.variants.price.currency || item.product.currency
        }

      }))
   })

   
   return res.status(200).json({
    message:"order created successfully",
    success:true,
    order
   })
}

export const verifyOrderPayment=async (req,res)=>{
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    }=req.body

    const payment=await paymentModel.findOne({
        "razorpay.orderId":razorpay_order_id,
        status:"pending"
    })

    if(!payment){
        return res.status(400).json({
            message:"payment not found"
        })
    }

    const isPaymentValid=validatePaymentVerification({
        order_id:razorpay_order_id,
        payment_id:razorpay_payment_id
    },razorpay_signature,config.RAZORPAY_KEY_SECRET)


    if(!isPaymentValid){
        payment.status="failed"
       await payment.save()
       return res.status(400).json({
        message:"payment varification failed",
        success:false
       })
    }

    payment.status="paid",
    payment.razorpay.paymentId=razorpay_payment_id
    payment.razorpay.orderId=razorpay_order_id
    
  await  payment.save()
  await cartModel.updateOne(
    {user:payment.user},
    {$set:{items:[]}}
  )
  return res.status(200).json({
    message:"payment verified successfully",
    success:true
  })


}
