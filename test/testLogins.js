const chai = require ('chai');
const expect = require ('chai').expect;
const assert = require('chai').assert;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));
const server = require('../server');
const api = 'http://localhost:3000';

describe('Testing the /logins endpoints', function() {

    before(function() {
        server.start();
    }); 

    after(function() {
        server.close();
    });

    describe('Tests for the GET /logins endpoint', function() {
        it('Login successfull', async function() {
            await chai.request(api)
                .get('/logins')
                .auth('FrancoisBLA', '12345678')
                .then(response => {
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    throw error;
                });
        });

        it('Username nonexistant or password not matching', async function() {
            await chai.request(api)
                .get('/logins')
                .auth('FrancoisBLA', '123456789')
                .then(response => {
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    throw error;
                });
        });
    });
});