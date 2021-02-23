const chai = require ('chai');
const expect = require ('chai').expect;
chai.use(require('chai-http'));
const server = require('../server');

describe('Testing the /users endpoints', function() {
    before(function() {
        server.start();
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
});