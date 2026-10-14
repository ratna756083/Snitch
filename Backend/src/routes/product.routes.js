import express from "express"
import { verifySeller } from '../middlewares/auth.middleware.js'
import { createProduct, getSellerProducts,getAllProducts,getProductDetails ,addProductVarient} from "../controllers/product.controller.js"
import { createProductvalidator } from "../validator/product.validator.js"
import multer from 'multer'
const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

router.post("/", verifySeller, upload.array('images', 7), createProductvalidator, createProduct)
router.get("/seller", verifySeller, getSellerProducts)
router.get("/",getAllProducts)
router.get("/details/:id",getProductDetails)
router.post("/:id/variants",verifySeller,upload.array('images', 7),addProductVarient)

export default router