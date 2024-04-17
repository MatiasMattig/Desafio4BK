const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
})

// Función para renderizar nuestros productos
const renderProducts = (products) => {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    products.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <p> ${item.title} </p>
            <p> ${item.price} </p>
            <button class="btn-remove">Eliminar</button>
            <button class="btn-update" data-id="${item._id}">Actualizar</button>
        `;

        productContainer.appendChild(card);

        card.querySelector(".btn-remove").addEventListener("click", () => {
            removeProduct(item._id);
        });

        card.querySelector(".btn-update").addEventListener("click", () => {
            const productId = card.querySelector(".btn-update").dataset.id;
            const productToUpdate = products.docs.find(product => product._id === productId);
            openUpdateForm(productToUpdate);
        });
    });
}

const removeProduct = (id) => {
    socket.emit("removeProduct", id);
}

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

function openUpdateForm(product) {
    const updateForm = document.createElement("form");

    updateForm.innerHTML = `
        <input type="text" id="updateTitle" value="${product.title}">
        <input type="text" id="updateDescription" value="${product.description}">
        <input type="number" id="updatePrice" value="${product.price}">
        <input type="text" id="updateImg" value="${product.img}">
        <input type="text" id="updateCode" value="${product.code}">
        <input type="number" id="updateStock" value="${product.stock}">
        <input type="text" id="updateCategory" value="${product.category}">
        <select id="updateStatus">
            <option value="true" ${product.status ? 'selected' : ''}>Activo</option>
            <option value="false" ${!product.status ? 'selected' : ''}>Inactivo</option>
        </select>
        <button type="submit" id="btnUpdate">Actualizar</button>
    `;

    updateForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const updatedProduct = {
            title: document.getElementById("updateTitle").value,
            description: document.getElementById("updateDescription").value,
            price: document.getElementById("updatePrice").value,
            img: document.getElementById("updateImg").value,
            code: document.getElementById("updateCode").value,
            stock: document.getElementById("updateStock").value,
            category: document.getElementById("updateCategory").value,
            status: document.getElementById("updateStatus").value === "true",
        };
        await updateProduct(product._id, updatedProduct);
        
        updateForm.reset();
        updateForm.remove();
    });

    document.getElementById("productContainer").appendChild(updateForm);
}

// const socket = io(); 

// socket.on("products", (data) => {
//     //console.log(data);
//     renderProducts(data);
// })

// //Función para renderizar nuestros productos: 

// const renderProducts = (products) => {
//     const productContainer = document.getElementById("productContainer");
//     productContainer.innerHTML = "";
    
//     products.docs.forEach(item => {
//         const card = document.createElement("div");
//         card.classList.add("card");

//         card.innerHTML = ` 
//                         <p> ${item.title} </p>
//                         <p> ${item.price} </p>
//                         <button> Eliminar </button>
//                         `;

//         productContainer.appendChild(card);
//         //Agregamos el evento al boton de eliminar: 
//         card.querySelector("button").addEventListener("click", ()=> {
//             removeProduct(item._id);
//         })
//     })
// }


// const removeProduct = (id) =>  {
//     socket.emit("removeProduct", id);
// }

// //Agregamos productos del formulario: 

// document.getElementById("btnEnviar").addEventListener("click", () => {
//     addProduct();
// })


// const addProduct = () => {
//     const product = {
//         title: document.getElementById("title").value,
//         description: document.getElementById("description").value,
//         price: document.getElementById("price").value,
//         img: document.getElementById("img").value,
//         code: document.getElementById("code").value,
//         stock: document.getElementById("stock").value,
//         category: document.getElementById("category").value,
//         status: document.getElementById("status").value === "true",
//     };

//     socket.emit("addProduct", product);
// }