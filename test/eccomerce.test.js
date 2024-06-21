const request = require('supertest');
const app = require('../src/app.js');

async function importChai() { 
  return await import('chai');
}

const requester = request("http://localhost:8080");

describe("Testing del ecommerce", () => {
  let chai, expect;

  before(async function() {
    chai = await importChai();
    expect = chai.expect;
  });

  describe("Testing de productos: ", () => {
    it("Endpoint POST /api/products debe crear un nuevo producto", async () => {
      const productMock = {
        title: 'ProductT',
        description: 'ProductD',
        price: 45,
        code: '123',
        stock: 111,
        category: 'ProductC',
        status: true,
        owner: 'admin'
      }
      const {statusCode, ok, _body} = await requester.post("/api/products").send(productMock);

      console.log(statusCode);
      console.log(ok);
      console.log(_body);

      expect(_body.payload).to.have.property("_id");
    });

    it("Endpoint GET /api/products/:id debe devolver un producto por su ID", async () => {
      const productId = "664685a7497ce447c7beb3b2";
      const { statusCode, ok, _body } = await requester.get(`/api/products/${productId}`);

      console.log(statusCode);
      console.log(ok);
      console.log(_body);

      expect(_body).to.have.property("_id").equal(productId);
      expect(_body).to.have.property("title");
      expect(_body).to.have.property("description");
      expect(_body).to.have.property("price");
      expect(_body).to.have.property("code");
      expect(_body).to.have.property("stock");
      expect(_body).to.have.property("category");
      expect(_body).to.have.property("status");
      expect(_body).to.have.property("owner");
    });

    it("Endpoint DELETE /api/products/:id debe eliminar un producto por su ID", async () => {
      const productId = "665f413a1dc523adaf504ba3";
      const { statusCode, ok, _body } = await requester.delete(`/api/products/${productId}`);

      console.log(statusCode);
      console.log(ok);

      expect(statusCode).to.equal(204);
    });
  });

  describe("Testing de carts: ", () => {
    let cartId;
    let productId;

    before(async () => {
        const newCartResponse = await requester.post("/api/carts");
        cartId = newCartResponse.body._id;

        const productMock = {
            title: "ProductTC",
            description: "ProductDC",
            price: 45,
            code: "PRO123",
            stock: 111,
            category: "ProductCC",
            status: true,
            owner: "admin"
        }
        const newProductResponse = await requester.post("/api/products").send(productMock);
        productId = newProductResponse.body.payload._id;
    });

    it("Endpoint POST /api/carts debe crear un nuevo carrito", async () => {
        const { statusCode, body } = await requester.post("/api/carts");
        expect(statusCode).to.equal(200);
        expect(body).to.have.property("_id");
    });

    it("Endpoint POST /api/carts/:cid/products/:pid debe agregar un producto al carrito", async () => {
        const quantity = 2;
        const { statusCode } = await requester.post(`/api/carts/${cartId}/products/${productId}`).send({ quantity });
        expect(statusCode).to.equal(200);
    });

    it("Endpoint DELETE /api/carts/:cid/products/:pid debe eliminar un producto del carrito", async () => {
        const { statusCode } = await requester.delete(`/api/carts/${cartId}/products/${productId}`);
        expect(statusCode).to.equal(200);
    });

    it("Endpoint DELETE /api/carts/:cid debe vaciar completamente el carrito", async () => {
        const { statusCode } = await requester.delete(`/api/carts/${cartId}`);
        expect(statusCode).to.equal(200);
    });

    after(async () => {
        await requester.delete(`/api/products/${productId}`);
        await requester.delete(`/api/carts/${cartId}`);
    });
  });
})

// describe("Testing del ecommerce", () => {

//   describe("Testing de productos: ", () => {
//     it("Endpoint POST /api/products debe crear un nuevo producto", async () => {
//       const productMock = {
//         title: "ProductT",
//         description: "ProductD",
//         price: 45,
//         code: "PRO123",
//         stock: 111,
//         category: "ProductC",
//         status: true,
//         owner: "admin"
//       }
//       const {statusCode, ok, _body} = await requester.post("/api/products").send(productMock);

//       console.log(statusCode);
//       console.log(ok);
//       console.log(_body);

//       expect(_body.payload).to.have.property("_id");
//     });

//     it("Endpoint GET /api/products/:id debe devolver un producto por su ID", async () => {
//       const productId = "664685a7497ce447c7beb3b2";
//       const { statusCode, ok, _body } = await requester.get(`/api/products/${productId}`);

//       console.log(statusCode);
//       console.log(ok);
//       console.log(_body);

//       expect(_body).to.have.property("_id").equal(productId);
//       expect(_body).to.have.property("title");
//       expect(_body).to.have.property("description");
//       expect(_body).to.have.property("price");
//       expect(_body).to.have.property("code");
//       expect(_body).to.have.property("stock");
//       expect(_body).to.have.property("category");
//       expect(_body).to.have.property("status");
//       expect(_body).to.have.property("owner");
//     });

//     it("Endpoint DELETE /api/products/:id debe eliminar un producto por su ID", async () => {
//       const productId = "664e9b98c6cfda47225d581d";
//       const { statusCode, ok, _body } = await requester.delete(`/api/products/${productId}`);

//       console.log(statusCode);
//       console.log(ok);

//       expect(statusCode).to.equal(204);
//     });
//   });

//   describe("Testing de carts: ", () => {
//     let cartId;
//     let productId;

//     before(async () => {
//         const newCartResponse = await requester.post("/api/carts");
//         cartId = newCartResponse.body._id;

//         const productMock = {
//             title: "ProductTC",
//             description: "ProductDC",
//             price: 45,
//             code: "PRO123",
//             stock: 111,
//             category: "ProductCC",
//             status: true,
//             owner: "admin"
//         }
//         const newProductResponse = await requester.post("/api/products").send(productMock);
//         productId = newProductResponse.body.payload._id;
//     });

//     it("Endpoint POST /api/carts debe crear un nuevo carrito", async () => {
//         const { statusCode, body } = await requester.post("/api/carts");
//         expect(statusCode).to.equal(200);
//         expect(body).to.have.property("_id");
//     });

//     it("Endpoint POST /api/carts/:cid/products/:pid debe agregar un producto al carrito", async () => {
//         const quantity = 2;
//         const { statusCode } = await requester.post(`/api/carts/${cartId}/products/${productId}`).send({ quantity });
//         expect(statusCode).to.equal(200);
//     });

//     it("Endpoint DELETE /api/carts/:cid/products/:pid debe eliminar un producto del carrito", async () => {
//         const { statusCode } = await requester.delete(`/api/carts/${cartId}/products/${productId}`);
//         expect(statusCode).to.equal(200);
//     });

//     it("Endpoint DELETE /api/carts/:cid debe vaciar completamente el carrito", async () => {
//         const { statusCode } = await requester.delete(`/api/carts/${cartId}`);
//         expect(statusCode).to.equal(200);
//     });

//     after(async () => {
//         await requester.delete(`/api/products/${productId}`);
//         await requester.delete(`/api/carts/${cartId}`);
//     });
//   });
// })