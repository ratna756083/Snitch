import {body,param,validationResult} from 'express-validator'

const validateRequest=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    next()
}

export const validateAddToCart=[
    param("productId").isMongoId().withMessage("invalid ProductId"),
    param("variantId").isMongoId().withMessage("invalid variant Id"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be 1"),
    validateRequest
]

export const validateIncrementcartItemQuantity=[
    param("productId").isMongoId().withMessage("invalid ProductId"),
    param("variantId").isMongoId().withMessage("invalid variant Id"),
    validateRequest
]