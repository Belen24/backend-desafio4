import { Router } from "express";
import { ProductManager } from "../manager/ProductManager.js";

const productManager = new ProductManager("products.json");


const router = Router ();

router.get("/",async(req,res)=>{
  try {
    const products = await productManager.getProducts();
    res.render("home", {products});
  } catch (error){
    res.status(400).json({status:"error", message:error.message});
  }
    
});


router.get("/realTimeProducts",(req,res)=>{
    //try {
    //const newProduct = req.body;
    //const products = await productManager.getProducts();
      //const products = await productManager.addProduct(newProduct);
      res.render("realTimeProducts");
    /*} catch (error){
      res.status(400).json({status:"error", message:error.message});
    }*/
      
  });


export { router as viewRouter}