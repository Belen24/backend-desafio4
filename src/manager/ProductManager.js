import fs from "fs";
import path from "path";
import { __dirname } from "../utils.js";


class ProductManager{
    constructor(pathName){
        this.path=path.join(__dirname,`/files/${pathName}`);
    }

    fileExists(){
        return fs.existsSync(this.path);
    };

    generateId(products){
        let newId;
        if(!products.length){
            newId=1;
        } else{
            newId=products[products.length-1].id+1;
        }
        return newId;
    }

    async codeDuplicate(code) {
        let content = await fs.promises.readFile(this.path, "utf-8");
        let products = JSON.parse(content);
        for (let i = 0; i < products.length; i++) {
          if (products[i].code === code) {
            return true;
          }
        }
        return false;
      }

    async addProduct(product){
        try {

            //Formula para validar que todos los campos sean completados
           /* if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category){
                throw new Error("Por favor completar todos los campos solicitados")
                }*/
    
               //Formula para evitar que un codigo se repita
                if (await this.codeDuplicate(product.code)) {
                throw new Error("Codigo ingresado ya se encuentra registrado");
                }

            if(this.fileExists()){
                let content = await fs.promises.readFile(this.path,"utf-8");
                let products = JSON.parse(content);
                let productId = this.generateId(products);
                product.id = productId;
                // console.log("product: ", product);
                products.push(product);
                await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                return product;
            } else {
                let productId = this.generateId([]);
                product.id = productId;
                // console.log("product: ", product);
                await fs.promises.writeFile(this.path,JSON.stringify([product],null,2));
                return product;
            }
        } catch (error) {
            // console.log(error.message);
            throw new Error(error.message);
        }
    };

    async getProducts(){
        try {
            if(this.fileExists()){
                let content = await fs.promises.readFile(this.path,"utf-8");
                let products = JSON.parse(content);
                //console.log(contentJson);
                return products;
            } else {
                return "El archivo no existe";
            }
        } catch (error) {
            return "Error";
        }
    };

    async getProductById(id){
        try {
            if(this.fileExists()){
                let content = await fs.promises.readFile(this.path,"utf-8");
                let products = JSON.parse(content);
                let product = products.find(item=>item.id === parseInt(id));
                if(product){
                    return product;
                } else {
                    throw new Error(`El producto con el id ${id} no existe`);
                }
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            // console.log(error.message);
            throw new Error(error.message);
        }
    };

    async updateProduct(id,product){
        try {
            if(this.fileExists()){
                let content = await fs.promises.readFile(this.path,"utf-8");
                let products = JSON.parse(content);
                let productIndex = products.findIndex(item=>item.id === parseInt(id));
                if(productIndex>=0){
                    products[productIndex]={
                        ...products[productIndex],
                        ...product
                    }
                    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                    return `El producto con el id ${id} fue modificado y actualizado`;
                } else {
                    throw new Error(`El producto con el id ${id} no existe`);
                }
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            // console.log(error.message);
            throw new Error(error.message);
        }
    };

   async deleteProduct(id){
        try {
            if(this.fileExists()){
                let content = await fs.promises.readFile(this.path,"utf-8");
                let products = JSON.parse(content);
                let productIndex = products.findIndex(item=>item.id === id);

                if(productIndex>=0){
                    products.splice(productIndex);
                }
                
                await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                return (`El elemento con ID ${id} ha sido eliminado del archivo ${this.path}.`);
                
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            // console.log(error.message);
            throw new Error(error.message);
        }
    };
}


//const manager = new ProductManager("./products.json");

const manager = new ProductManager("./products.json");

const funcionPrincipal=async()=>{
    try {
        //PARA AGREGAR PRODUCTOS
        /*let productCreation = await manager.addProduct({title: "Aros largos", description:"aros de plata 925", price: 8000, thumbnail:"https://diferenti.com/484-large_default/aros-plata-silver-star.jpg", code:"jdo823", stock:8});
        console.log("Producto creado: ", productCreation);*/


        //VISUALIZACIÓN DE LOS PRODUCTOS
        /*let arrayProducts = await manager.getProducts();
        console.log("Arreglo de Productos: ", arrayProducts);*/


        //BUSQUEDA DE PRODUCTO POR ID ASIGNADO
        /*et Idprod = await manager.getProductById(1);
        console.log("Id producto: ", Idprod);*/


        //MODIFICACIÓN DE PRODUCTO POR MEDIO DE SU ID
        /*let productModif = await manager.updateProduct(2, {title: "Aros de luna largos", description: "Aros de plata 925", price: 9000, stock:12});
        console.log("Producto modificado: ", productModif);*/


        //ELIMINACIÓN DE ALGÚN PRODUCTO POR MEDIO DE SU ID
        /*let deleteObject = await manager.deleteProduct(3);
        console.log("Producto eliminado: ", deleteObject);*/

    } catch (error) {
        console.log(error.message);
    }
}
funcionPrincipal();

export {ProductManager}