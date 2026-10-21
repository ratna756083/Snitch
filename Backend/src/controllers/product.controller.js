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
      return  res.status(401).json({
            message:"product not found"
        })
    }

  return   res.status(200).json({
        message:"product fetched successfully",
        product
    })

}


export async function addProductVarient(req,res){

    const id=req.params.id
    const product=await productModel.findOne({
        _id:id,
        seller:req.user._id
    })
    if(!product){
        return res.status(404).json({
            message:"product not found",
            success:false
        })
    }

    const files=req.files
    const images=[]

    if(files || files.length !== 0){
       ( await Promise.all(files.map(async (file)=>{
            const image=await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname
            })
            return image
        }))).map(image=>images.push(image))
    }

    const price=req.body.priceAmount
    const stock=req.body.stock
    const attributes=JSON.parse(req.body.attributes || "{}")

    console.log(images)
    console.log(price)

    product.variants.push({
        images,
        price:{
            amount:price || product.price.amount ,
            currency:req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save()
    res.status(201).json({
        message:"variants uploaded",
        product
    })
}
