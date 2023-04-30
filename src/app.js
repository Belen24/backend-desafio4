import express from "express";
import { productRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/carts.routes.js";
import {Server} from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import { viewRouter } from "./routes/views.routes.js";
import { ProductManager } from "./manager/ProductManager.js";

const productManager = new ProductManager("products.json");


const app = express();
const port = 8080;

//midlewares
app.use(express.json());
app.use (express.static (path.join (__dirname, "/public")));

//servidor http
const httpServer = app.listen(port,()=>console.log(`Server on listening on port ${port}`));

//servidor websocket
const io = new Server (httpServer);

//configuracion de plantillas
app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join (__dirname, "/views"));



//routes
app.use("/api/products",productRouter);
app.use("/api/carts",cartRouter);
app.use (viewRouter);
app.use ("/realTimeProducts", viewRouter);


//configuración webSocket
io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");
    
    socket.on("authenticated", async(data)=>{
      const messages = await  productManager.getProducts();
      socket.emit("messageChat", messages);
      socket.broadcast.emit("newUser", `El usuario ${data.user} se acaba de conectar`);
  });

  socket.on("message", async(product)=>{
      await productManager.addProduct(product);
      const messages = await productManager.getProducts();
      io.emit("messageChat", messages);
  });


  

});