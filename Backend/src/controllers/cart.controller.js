import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
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
    let cart=(await cartModel.aggregate(
  [
    {
      $match: {
        user: new mongoose.Types.ObjectId(user._id)
      }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $unwind: { path: '$items.product.variants' }
    },
    {
      $match: {
        $expr: {
          $eq: [
            '$items.variant',
            '$items.product.variants._id'
          ]
        }
      }
    },
    {
      $addFields: {
        itemPrice: {
          price: {
            $multiply: [
              '$items.quantity',
              '$items.product.variants.price.amount'
            ]
          },
          currency:
            '$items.product.variants.price.currency'
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        totalPrice: { $sum: '$itemPrice.price' },
        currency: {
          $first: '$itemPrice.currency'
        },
        items: { $push: '$items' }
      }
    }
  ]
 
))[0]

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
