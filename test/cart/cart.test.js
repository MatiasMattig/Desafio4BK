import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Pruebas de integración del módulo de carritos', () => {

    let cartId;
    let productId;
    let userId;

    before(async () => {
        const productResponse = await requester.post('/api/products').send({
            name: 'Producto de prueba',
            price: 100,
            stock: 50,
            owner: 'owner@example.com'
        });
        productId = productResponse.body.payload._id;

        const userResponse = await requester.post('/api/users').send({
            email: 'testuser@example.com',
            password: 'password123',
            first_name: 'Test',
            last_name: 'User'
        });
        userId = userResponse.body.payload._id;
    });

    after(async () => {
        await requester.delete(`/api/products/${productId}`);
        await requester.delete(`/api/users/${userId}`);
    });

    it('POST de /api/carts debe crear un carrito correctamente', async () => {
        const { statusCode, body } = await requester.post('/api/carts');
        cartId = body.payload._id;
        expect(statusCode).to.be.eql(200);
        expect(body.payload).to.have.property('_id');
    });

    it('GET de /api/carts/:cid debe obtener productos del carrito', async () => {
        const { statusCode, body } = await requester.get(`/api/carts/${cartId}`);
        expect(statusCode).to.be.eql(200);
        expect(body.payload).to.have.property('products');
        expect(Array.isArray(body.payload.products)).to.be.eql(true);
    });

    it('POST de /api/carts/:cid/products/:pid debe agregar un producto al carrito', async () => {
        const { statusCode, body } = await requester.post(`/api/carts/${cartId}/products/${productId}`).send({
            quantity: 2
        });
        expect(statusCode).to.be.eql(200);
        expect(body).to.be.eql("Producto agregado al carrito correctamente");
    });

    it('DELETE de /api/carts/:cid/products/:pid debe eliminar un producto del carrito', async () => {
        const { statusCode, body } = await requester.delete(`/api/carts/${cartId}/products/${productId}`);
        expect(statusCode).to.be.eql(200);
        expect(body).to.have.property('status', 'success');
        expect(body).to.have.property('message', 'Producto eliminado del carrito correctamente');
    });

    it('POST de /api/carts/:cid/purchase debe finalizar una compra correctamente', async () => {
        const { statusCode, body } = await requester.post(`/api/carts/${cartId}/purchase`);
        expect(statusCode).to.be.eql(200);
        expect(body).to.have.property('cliente');
        expect(body).to.have.property('email');
        expect(body).to.have.property('numTicket');
    });
});
