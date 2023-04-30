import {Router} from "express";
import { CartManager } from "../manager/cartManager.js";
import { ProductManager } from "../manager/ProductManager.js";

const cartManager = new CartManager("carts.json");
const productManager = new ProductManager("products.json");

const router = Router();


//METODO PARA CREAR UN CARRITO
router.post("/",async(req,res)=>{
    try {
        const cartCreated = await cartManager.addCart();
        res.json({status:"success", data:cartCreated});
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});


//METODO PARA BUSCAR CARRITO POR MEDIO DE SU ID
router.get("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if(cart){
            res.json({status:"success", data:cart});
        } else {
            res.status(400).json({status:"error", message:"Carrito no existe"});
        }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});


//METODO PARA BUSCAR CARRITO Y AGREGAR PRODUCTO AL CARRITO
router.post("/:cid/product/:pid", async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartManager.getCartById(cartId);
        if(cart){
            const product = await productManager.getProductById(productId);
            if(product){
                const response  = await cartManager.addProductToCart(cartId,productId);
                res.json({status:"success", message:response});
            } else {
                res.status(400).json({status:"error", message:erorr.message});
            }
        } else {
            res.status(400).json({status:"error", message:"Carrito no existe"});
        }
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});

export{router as cartRouter};