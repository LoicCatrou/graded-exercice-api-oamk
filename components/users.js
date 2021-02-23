const express = require('express');
const router = express.Router();
const Ajv = require('ajv').default;
const usersDataSchema = require('../test/schemas/usersDataSchema.json');
const bcrypt = require('bcrypt');
const passport = require('passport');

const users =[
    {   
        id: 1, 
        username: "FrancoisBLA", 
        firstName: "François", 
        lastName: "Blanchard",
        dateOfBirth: "2018-11-28",
        address: "13 rue de Montmartre",
        city: "75000 PARIS",
        country:"France",
        email: "test@hotmail.com",
        password: "$2b$10$pK/wycU6vDeKfpnqFKL5E.C26LSOLvpcgrRbIr3TyBvPUwEXSf4iS",
        phoneNumber: "0659790004"
    },
    {
        id: 2,
        username: "testtesttest",
        firstName: "aaaaaaaaa",
        lastName:"bbbbbbbbbb",
        dateOfBirth: "2018-11-28",
        address: "5 rue du cccccc",
        city: "75000 PARIS",
        country: "France",
        email: "loic.catrou@hotmail.com",
        password: "$2b$10$pK/wycU6vDeKfpnqFKL5E.C26LSOLvpcgrRbIr3TyBvPUwEXSf4iS",
        phoneNumber: "0659790004"
    }
]

router.post('/', async (req, res) => {
    const ajv = new Ajv();
    const validate = ajv.compile(usersDataSchema);
    const valid = validate(req.body);

    let usernameTest = users.find(u => u.username == req.body.username );
    let emailTest = users.find(u => u.email == req.body.email );

    if(valid==true && usernameTest === undefined && emailTest === undefined){

        try{
            const hash = await bcrypt.hash(req.body.password, 10);

            const user = {
                id: users.length +1,
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                address: req.body.address,
                city: req.body.city,
                country: req.body.country,
                email: req.body.email,
                password: hash,
                phoneNumber: req.body.phoneNumber,
            };
    
            users.push(user);
            res.status(201);
            res.json(user);
            //console.log(user);
        }
        catch{
            throw error;
        }
    }
    else if(valid==false && usernameTest === undefined && emailTest === undefined){
        res.status(400);
        res.send(validate.errors.map(e => e.message));
        //console.log(validate.errors.map(e => e.message));
    }
    else{
        res.status(409).send("Username or email already taken");
    }    
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = users.find(u => u.username == req.user.username);
    if(!user){
        res.status(404).send();
    }
    else{
        res.status(200);
        res.json(user);
    }
});

module.exports = {
    router : router,
    getUserUsername : (username) => users.find(u => u.username == username)
};