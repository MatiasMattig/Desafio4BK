const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

console.log('User role:', role);
console.log('User email:', email);

socket.on("products", (data) => {
    renderProducts(data);
});

///////////////////////////////////
socket.on('error', (message) => {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error'
    });
});
///////////////////////////////////

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
            <button class="btn-remove" >Eliminar</button> 
            <button class="btn-update" data-id="${item._id}">Actualizar</button>
        `;

        productContainer.appendChild(card);

        card.querySelector(".btn-remove").addEventListener("click", () => {
            if (role === "premium" && item.owner === email) {
                removeProduct(item._id);
            } else if (role === "admin") {
                removeProduct(item._id);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tenes permiso para borrar ese producto",
                })
            }
        });

        card.querySelector(".btn-update").addEventListener("click", () => {
            const productId = card.querySelector(".btn-update").dataset.id;
            const productToUpdate = products.docs.find(product => product._id === productId);
            if (role === "premium" && item.owner === email) {
                openUpdateForm(productToUpdate);
            } else if (role === "admin") {
                openUpdateForm(productToUpdate);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tenes permiso para actualizar ese producto",
                })
            }
        });
    });
};

const removeProduct = (id) => {
    socket.emit("removeProduct", id);
};

const addProduct = () => {

    const owner = role === "premium" ? email : "admin";

    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };

    socket.emit("addProduct", product);
};

document.getElementById("btnEnviar").addEventListener("click", addProduct);

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

        socket.emit("updateProduct", { id: product._id, updatedFields: updatedProduct });
        
        updateForm.reset();
        updateForm.remove();
    });

    document.getElementById("productContainer").appendChild(updateForm);
};