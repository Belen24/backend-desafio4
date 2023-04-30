import {Router} from "express";
import { ProductManager } from "../manager/ProductManager.js";

const productManager = new ProductManager("products.json");


const router = Router();


//RUTA GET PARA TRAER LISTA DE PRODUCTOS INCLUYENDO LIMITACIÓN DE VISUALIZACIONES
router.get("/", async(req,res)=>{

    try{
        const products = await productManager.getProducts();
        const limit = parseInt (req.query.limit);
        if (!isNaN (limit)){
            res.send(products.slice(0, limit));
        } else {
            res.json({status:"success", data:products});
        }
    } catch (error){
        res.status(400).json({status:"error", message:error.message});
    }
});


//METODO PARA BUSCAR Y VISUALIZAR PRODUCTO POR MEDIO DE SU ID
router.get ("/:pid", async (req,res) => {
    try{
        const pId =parseInt(req.params.pid);
        //console.log(pId);
        const productsId = await productManager.getProductById(pId);
        res.json({status:"success", data:productsId});
    } catch (error) {
        res.send (`El producto con el id ingresado no existe`);
    }
    
    
});


//METODO PARA AGREGAR PRODUCTO
router.post("/",async(req,res)=>{

    try {
        const newProduct = req.body;
        const productSaved = await productManager.addProduct(newProduct);
        res.json({status:"success", data:productSaved});
    } catch (error) {
        res.status(400).json({status:"error", message:error.message});
    }
});


//METODO PARA ACTUALIZAR PRODUCTOS POR ID
router.put ("/:pid", async (req,res) => {
    try{
        const pId =parseInt(req.params.pid);
        //console.log(pId);
        const modProduct = req.body;
        const productsId = await productManager.updateProduct(pId, modProduct);
        res.json({status:"success", data:productsId});
    } catch (error) {
        res.send (`El producto con el id ingresado no existe`);
    }
    
    
});


//METODO PARA ELIMINAR PRODUCTOS POR ID
router.delete ("/:pid", async (req,res) => {
    try{
        const pId =parseInt(req.params.pid);
        //console.log(pId);
        const productsId = await productManager.deleteProduct(pId);
        res.json({status:"success", data:productsId});
    } catch (error) {
        res.send (`El producto con el id ingresado no existe`);
    }
    
    
});





export{router as productRouter};