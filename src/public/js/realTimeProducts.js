console.log("realTimeProducts js");

const socketClient = io();



let productForm = document.getElementById("productForm");
let messageLogs = document.getElementById("messageLogs");

//Autentificación para ingresar a la lista de productos
Swal.fire({
    title:"Ingresa tu nombre",
    input:"text",
    inputValidator:(value)=>{
        if(!value){
            return "Este campo es obligatorio para usar el chat"
        }
    },
    allowOutsideClick:false,
}).then(result=>{
    user=result.value;
    socketClient.emit("authenticated",{user:user,message:"conectado"});
});


//captura de los elementos del formulario para agregar productos a la lista
productForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const title = evt.target.elements.title.value;
  const description = evt.target.elements.description.value;
  const code = evt.target.elements.code.value;
  const price = evt.target.elements.price.value;
  const status = evt.target.elements.status.value;
  const stock = evt.target.elements.stock.value;
  const category = evt.target.elements.category.value;
  const thumbnails = evt.target.elements.thumbnails.value;
  const product = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnails: thumbnails,
  };
  socketClient.emit("message", product);
  productForm.reset();
});


//metodo para escuchar el evento por parte del servidor para ir limpiando y actualizando la lista de productos
socketClient.on("messageChat", (messages) => {
  messageLogs.innerHTML = "";
  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.innerHTML = `<p>${message.title} - ${message.description} - ${message.code} - ${message.price} - ${message.status} - ${message.stock} - ${message.category} - ${message.thumbnails}</p>`;
  });
});

socketClient.on("messageChat",(data)=>{
    console.log(data);
    let messagesElements= "";
    data.forEach(product=>{
        messagesElements += 
        `
        <li>Product: ${product.title} </li>
        <p>description: ${product.description} </p>
        <p>code: ${product.code}</p>
        <p>price: ${product.price} </p>
        <p>status: ${product.status} </p>
        <p>stock: ${product.stock}</p>
        <p>category: ${product.category}</p>
        <p>id: ${product.id}</p>
        <hr>`;
      });

    messageLogs.innerHTML=messagesElements;
});


socketClient.on("newUser",(serverMsg)=>{
    if(user){
        Swal.fire({
            text:serverMsg,
            toast:true,
            position:"top-right"
        });
    }
});