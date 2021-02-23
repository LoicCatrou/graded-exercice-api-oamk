const chai = require ('chai');
const expect = require ('chai').expect;
const assert = require('chai').assert;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));
const server = require('../server');
const api = 'http://localhost:3000';
const jsonwebtoken = require('jsonwebtoken');

describe('Testing the /users endpoints', function() {

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

    describe('Tests for the POST /users endpoint', function() {
        it('User created', async function() {
            await chai.request('http://localhost:3000').post('/users')
                .send({
                    username: "FrancoisBLAC",
                    firstName: "François", 
                    lastName: "Blanchard",
                    dateOfBirth: "2018-11-28",
                    address: "13 rue de Montmartre",
                    city: "75000 PARIS",
                    country:"France",
                    email: "test10@hotmail.com",
                    password: "12345678",
                    phoneNumber: "0659790004"
                })
                .then(response => {
                    expect(response.status).to.equal(201);
                })
                .catch(error => {
                    throw error;
                });
        })

        it('Missing or invalid required information', async function() {
            await chai.request('http://localhost:3000').post('/users')
                .send({
                    username: "FrancoisB",
                    firstName: "François", 
                    lastName: "Blanchard",
                    dateOfBirth: "2018-11-28",
                    address: "13 rue de Montmartre",
                    city: "75000 PARIS",
                    country:"France",
                    email: "test2@hotmail.com",
                    password: "123456",
                    phoneNumber: "0659790004"
                })
                .then(response => {
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    throw error;
                });
        })

        it('Email or username already taken', async function() {
            await chai.request('http://localhost:3000').post('/users')
                .send({
                    username: "FrancoisBLA",
                    firstName: "François", 
                    lastName: "Blanchard",
                    dateOfBirth: "2018-11-28",
                    address: "13 rue de Montmartre",
                    city: "75000 PARIS",
                    country:"France",
                    email: "test3@hotmail.com",
                    password: "123456",
                    phoneNumber: "0659790004"
                })
                .then(response => {
                    expect(response.status).to.equal(409);
                })
                .catch(error => {
                    throw error;
                });
        })
    })
    describe('Tests for the GET /users endpoint', function() {
        it('User found', async function() {
            await chai.request('http://localhost:3000')
                .get('/users')
                .set('Authorization', 'Bearer ' + userJwt)
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        })

        it('Unauthorized', async function() {
            await chai.request('http://localhost:3000')
                .get('/users')
                .then(response => {
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        })
    })
});