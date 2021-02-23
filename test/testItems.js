const chai = require ('chai');
const expect = require ('chai').expect;
const assert = require('chai').assert;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));
const server = require('../server');
const api = 'http://localhost:3000';
const jsonwebtoken = require('jsonwebtoken');

describe('Testing the /items endpoints', function() {

    let userJwt = null;
    let decodedJwt = null;

    before(async function() {
        server.start();

        await chai.request(api)
        .get('/logins')
        .auth('FrancoisBLA', '12345678')
        .then(response => {
            userJwt = response.body.token;
            decodedJwt = jsonwebtoken.decode(userJwt, { complete: true });
        });
    }); 

    after(function() {
        server.close();
    });

    describe('Tests for the POST /items endpoint', function() {
        it('Item created', async function() {
            await chai.request(api)
                .post('/items')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
                    description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
                    category: "Home",
                    address: "513 Jarvisville Road",
                    city: "Manhattan, NY 10016 ",
                    country: "United States",
                    images: ["https://www.lesalexiens.fr/wp-content/uploads/2021/02/test-xiaomi-mi-g9-avis-aspirateur-1024x683.jpg"],
                    price: 229.99,
                    deliveryType: "Shipping",
                    postingDate: new Date().toISOString(),
                })
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('Missing or invalid required information', async function() {
            await chai.request(api)
                .post('/items')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
                    description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
                    category: "Home",
                    address: "513 Jarvisville Road",
                    city: "Manhattan, NY 10016 ",
                    country: "United States",
                    images: ["https://www.lesalexiens.fr/wp-content/uploads/2021/02/test-xiaomi-mi-g9-avis-aspirateur-1024x683.jpg"],
                    price: 229.99,
                    deliveryType: "ByPlane",
                    postingDate: new Date().toISOString(),
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('Unauthorized', async function() {
            await chai.request(api)
                .post('/items')
                .send({
                    title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
                    description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
                    category: "Home",
                    address: "513 Jarvisville Road",
                    city: "Manhattan, NY 10016 ",
                    country: "United States",
                    images: ["https://www.lesalexiens.fr/wp-content/uploads/2021/02/test-xiaomi-mi-g9-avis-aspirateur-1024x683.jpg"],
                    price: 229.99,
                    deliveryType: "ByPlane",
                    postingDate: new Date().toISOString(),
                })
                .then(response => {
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });
    });

    describe('Tests for the GET /items/publication/{date} endpoint', function() {
        it('Item(s) found', async function() {
            await chai.request(api)
                .get('/items/publication/2021-02-07')
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('There is no item published at the given date', async function() {
            await chai.request(api)
                .get('/items/publication/2021-02-08')
                .then(response => {
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });
    });

    describe('Tests for the GET /items/category/{category} endpoint', function() {
        it('Item(s) found', async function() {
            await chai.request(api)
                .get('/items/category/Home')
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('There is no item published on this category', async function() {
            await chai.request(api)
                .get('/items/category/Outside')
                .then(response => {
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });
    });

    describe('Tests for the GET /items/country/{category}/city/{city} endpoint', function() {
        it('Item(s) found', async function() {
            await chai.request(api)
                .get('/items/country/United States/city/Manhattan, NY 10016')
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('There is no item in that country/city', async function() {
            await chai.request(api)
                .get('/items/country/United States/city/Brooklin, NY 10016')
                .then(response => {
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });
    });

    describe('Tests for the PUT /items/{ref} endpoint', function() {
        it('Item successfully updated', async function() {
            await chai.request(api)
                .put('/items/1')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
                    description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
                    category: "Home",
                    address: "513 Jarvisville Road",
                    city: "Manhattan, NY 10016 ",
                    country: "United States",
                    images: ["https://www.lesalexiens.fr/wp-content/uploads/2021/02/test-xiaomi-mi-g9-avis-aspirateur-1024x683.jpg"],
                    price: 229.99,
                    deliveryType: "Pickup",
                    lastModificationDate: new Date().toISOString(),
                })
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('Missing arguments or wrong arguments', async function() {
            await chai.request(api)
                .put('/items/1')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
                    description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
                    category: "Home",
                    address: "513 Jarvisville Road",
                    city: "Manhattan, NY 10016 ",
                    country: "United States",
                    images: ["https://www.lesalexiens.fr/wp-content/uploads/2021/02/test-xiaomi-mi-g9-avis-aspirateur-1024x683.jpg"],
                    price: 229.99,
                    deliveryType: "ByPlane",
                    lastModificationDate: new Date().toISOString(),
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('Item non existant or bad ref', async function() {
            await chai.request(api)
                .put('/items/20')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
                    description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
                    category: "Home",
                    address: "513 Jarvisville Road",
                    city: "Manhattan, NY 10016 ",
                    country: "United States",
                    images: ["https://www.lesalexiens.fr/wp-content/uploads/2021/02/test-xiaomi-mi-g9-avis-aspirateur-1024x683.jpg"],
                    price: 229.99,
                    deliveryType: "Pickup",
                    lastModificationDate: new Date().toISOString(),
                })
                .then(response => {
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('Unauthorized', async function() {
            await chai.request(api)
                .put('/items/2')
                .set('Authorization', 'Bearer ' + userJwt)
                .send({
                    title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
                    description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
                    category: "Home",
                    address: "513 Jarvisville Road",
                    city: "Manhattan, NY 10016 ",
                    country: "United States",
                    images: ["https://www.lesalexiens.fr/wp-content/uploads/2021/02/test-xiaomi-mi-g9-avis-aspirateur-1024x683.jpg"],
                    price: 229.99,
                    deliveryType: "Pickup",
                    lastModificationDate: new Date().toISOString(),
                })
                .then(response => {
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });
    });

    describe('Tests for the DELETE /items/{ref} endpoint', function() {
        it('Item successfully deleted', async function() {
            await chai.request(api)
                .delete('/items/1')
                .set('Authorization', 'Bearer ' + userJwt)
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('Item non existant or bad ref', async function() {
            await chai.request(api)
                .delete('/items/20')
                .set('Authorization', 'Bearer ' + userJwt)
                .then(response => {
                    expect(response.status).to.equal(404);
                })
                .catch(error => {
                    throw error;
                });
        });
        it('Unauthorized', async function() {
            await chai.request(api)
                .delete('/items/2')
                .set('Authorization', 'Bearer ' + userJwt)
                .then(response => {
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });
    });
});