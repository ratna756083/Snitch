import productModel from "../models/product.model.js";
import {uploadFile} from "../services/product.services.js"



export async function createProduct(req,res){
    const {title,description,priceAmount,priceCurrency}=req.body

    const seller=req.user

    const images=await Promise.all(req.files.map(async (file)=>{
        return await uploadFile({
            buffer:file.buffer,
            fileName:file.originalname
        })
    }))

    const product=await productModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency:priceCurrency
        },
        images,
        seller:seller._id

    })

    res.status(201).json({
        message:"product created successfully",
        success:true,
        product
    })

}

export async function getSellerProducts(req,res){
    const seller=req.user
    const products=await productModel.find({seller:seller._id})

    res.status(200).json({
        message:"product fetched successfully",
        products
    })
}

export async function getAllProducts(req,res){
  const products=await productModel.find()
  return res.status(200).json({
    message:"products fetched successfully",
    products
  })
}

export async function getProductDetails(req,res){
    const id=req.params.id
    const product=await productModel.findById(id)
    if(!product){
        res.status(401).json({
            message:"product not found"
        })
    }

    res.status(200).json({
        message:"product fetched successfully",
        product
    })

}