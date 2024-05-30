import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Pruebas de integración del módulo de productos', () => {
   let token;
   let productId;

   before(async () => {
      // Login y obtener token
      const credentials = { email: 'testuser@example.com', password: 'password123' };
      const response = await requester.post('/api/sessions/login').send(credentials);
      token = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
   });

   it('POST de /api/products debe crear el producto correctamente', async () => {
      const ProductMock = {
         title: "Producto Test",
         description: "Descripción del producto de prueba",
         code: "TEST1234",
         price: 100,
         stock: 20,
         category: "Pruebas"
      };
      const { statusCode, body } = await requester
         .post('/api/products')
         .set('Cookie', `jwt=${token}`)
         .send(ProductMock);

      expect(statusCode).to.be.eql(201);
      expect(body).to.have.property('_id');
      productId = body._id;
   });

   it('GET de /api/products/:pid debe obtener un producto por ID', async () => {
      const { statusCode, body } = await requester.get(`/api/products/${productId}`);
      expect(statusCode).to.be.eql(200);
      expect(body).to.have.property('_id', productId);
   });

   it('PUT de /api/products/:pid debe actualizar un producto', async () => {
      const updatedProduct = {
         title: "Producto Test Actualizado",
         description: "Descripción actualizada del producto de prueba",
         price: 150,
      };
      const { statusCode, body } = await requester
         .put(`/api/products/${productId}`)
         .set('Cookie', `jwt=${token}`)
         .send(updatedProduct);

      expect(statusCode).to.be.eql(200);
      expect(body).to.have.property('title', updatedProduct.title);
      expect(body).to.have.property('description', updatedProduct.description);
      expect(body).to.have.property('price', updatedProduct.price);
   });

   it('DELETE de /api/products/:pid debe eliminar un producto', async () => {
      const { statusCode } = await requester
         .delete(`/api/products/${productId}`)
         .set('Cookie', `jwt=${token}`);
      expect(statusCode).to.be.eql(204);

      const { statusCode: getStatusCode } = await requester.get(`/api/products/${productId}`);
      expect(getStatusCode).to.be.eql(404);
   });

   it('POST de /api/products debe devolver error 401 si no tiene el token de JWT', async () => {
      const ProductMock = {
         title: "Producto Sin Token",
         description: "Descripción del producto sin token",
         code: "NOAUTH123",
         price: 200,
         stock: 30,
         category: "SinAuth"
      };
      const { statusCode } = await requester.post('/api/products').send(ProductMock);
      expect(statusCode).to.be.eql(401);
   });
});