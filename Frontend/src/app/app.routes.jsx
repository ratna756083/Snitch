import {createBrowserRouter} from "react-router"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import CreateProduct from "../features/products/pages/CreateProduct"
import Dashboard from "../features/products/pages/Dashboard"
import Protected from "../features/auth/componets/Protected"
import Home from "../features/products/pages/Home"
import ProductDetail from "../features/products/pages/ProductDetail"
import SellerProductDetails from "../features/products/pages/SellerProductDetails"
import Cart from "../features/cart/pages/Cart"
import OrderSuccess from "../features/cart/pages/OrderSuccess"
export const routes=createBrowserRouter([
    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/products/:id",
        element:<ProductDetail/>
    },
    {
        path:"/cart",
        element:<Cart/>
    },
    {
        path:"/order-success",
        element:<OrderSuccess/>
    },
    {
        path:"/seller",
        children:[
            {
                path:"/seller/create-product",
                element:<Protected role="seller"> <CreateProduct/></Protected>
            },
            {
                path:"/seller/dashboard",
                element: <Protected role="seller">  <Dashboard/>  </Protected>
            },
            {
                path:"/seller/product/:id",
                element:<Protected role="seller"> <SellerProductDetails/></Protected>
            }
        ]
    },
    
])