import { body, validationResult } from 'express-validator'

function validateRequest(req,res,next){
    const errors=validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }

    next()
}




export const validateRegisterUser = [
    body("email")
        .isString().withMessage("email must be a string")
        .bail()
        .trim()
        .isEmail().withMessage("invalid email format"),
    body("contact")
        .isString().withMessage("contact must be a string")
        .matches(/^\d{10}$/)
        .trim()
        .notEmpty().withMessage("contact is required"),
    body("password")
        .isString().withMessage("password must be a string")
        .isLength({min:6})
        .notEmpty().withMessage("password is required"),
    body("fullname")
        .isString().withMessage("fullname must be a string")
        .notEmpty().withMessage("fullname is required"),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be an boolean")    ,
    
      validateRequest
]


export const validateLoginUser=[
     body("email")
        .isString().withMessage("email must be a string")
        .bail()
        .trim()
        .isEmail().withMessage("invalid email format"),
    body("password")
        .isString().withMessage("password must be a string")
        .isLength({min:6})
        .notEmpty().withMessage("password is required"),
        
        validateRequest
]