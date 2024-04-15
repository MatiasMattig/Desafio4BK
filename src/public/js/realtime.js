const socket = io(); 

socket.on("products", (data) => {
    //console.log(data);
    renderProducts(data);
})

//Función para renderizar nuestros productos: 

const renderProducts = (products) => {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";
    
    products.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = ` 
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button> Eliminar </button>
                        `;

        productContainer.appendChild(card);
        //Agregamos el evento al boton de eliminar: 
        card.querySelector("button").addEventListener("click", ()=> {
            removeProduct(item._id);
        })
    })
}


const removeProduct = (id) =>  {
    socket.emit("removeProduct", id);
}

//Agregamos productos del formulario: 

document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
})


const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

    socket.emit("addProduct", product);
}