const express = require('express');
const router = express.Router();
const Ajv = require('ajv').default;
const itemsDataSchema = require('../test/schemas/itemsDataSchema.json');
const passport = require('passport');

const items =[
    {
        ref: 1,
        title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
        description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
        category: "Home",
        address: "513 Jarvisville Road",
        city: "Manhattan, NY 10016",
        country: "United States",
        image : [],
        price: 229.99,
        deliveryType: "Shipping",
        seller: {
            username: "FrancoisBLA",
            firstName: "François",
            lastName: "Blanchard",
            address: "13 rue de Montmartre",
            city: "75000 PARIS",
            country: "France",
            email: "test@hotmail.com",
            phoneNumber: "0659790004"
        },
        postingDate: "2021-02-07T00:00:00-00:00",
        lastModificationDate: null
    },
    {
        ref: 2,
        title: "Xiaomi Mi G9 Handheld Wireless Vacuum Cleaner Cordless Replaceable battery 2021",
        description: "100,000rpm high speed brushless motor，Leave dirt no place to hide.",
        category: "Kitchen",
        address: "513 Jarvisville Road",
        city: "Dukes, NY 10016",
        country: "United States",
        price: 229.99,
        deliveryType: "Shipping",
        seller: {
            username: "testtesttest",
            firstName: "aaaaaaaaa",
            lastName:"bbbbbbbbbb",
            address: "5 rue du cccccc",
            city: "75000 PARIS",
            country: "France",
            email: "loic.catrou@hotmail.com",
            phoneNumber: "0659790004"
        },
        postingDate: "2021-02-05T00:00:00-00:00",
        lastModificationDate: null
    }
]

router.get('/', (req, res) => {
    if(items == undefined){
        res.status(404).send();
    }
    else{
        res.json(items);
        res.status(200).send();
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const ajv = new Ajv();
    const validate = ajv.compile(itemsDataSchema);
    const valid = validate(req.body);
    if(valid==true){
        const item = {
            ref: items.length +1,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            image: req.body.image,
            price: req.body.price,
            deliveryType: req.body.deliveryType,
            seller : req.user,
            postingDate: req.body.postingDate,
            lastModificationDate: null
        };

        items.push(item);
        res.status(200);
        res.json(item);
        //console.log(item);
    }
    else{
        res.status(400).send();
    }
});

router.delete('/:ref', passport.authenticate('jwt', { session: false }), (req, res) => {
    const item = items.find(i => i.ref == req.params.ref);
    if(!item){
        res.status(404).send();
    }
    else if(item.seller.username == req.user.username){
        for(var i = 0; i<items.length;i++){
            if(items[i].ref == item.ref){
                items.splice(i, 1);
            }
        }
        res.status(200).send();
    }
    else{
        res.status(401).send();
    }
});

router.put('/:ref', passport.authenticate('jwt', { session: false }), (req, res) => {
    const ajv = new Ajv();
    const validate = ajv.compile(itemsDataSchema);
    const valid = validate(req.body);
    const item = items.find(i => i.ref == req.params.ref);
    if(!item){
        res.status(404).send();
    }
    else{
        if(valid==true && item.seller.username == req.user.username){
            item.title =  req.body.title,
            item.description = req.body.description,
            item.category = req.body.category,
            item.address = req.body.address,
            item.city = req.body.city,
            item.country = req.body.country,
            item.image = req.body.image,
            item.price = req.body.price,
            item.deliveryType = req.body.deliveryType,
            item.seller = req.user,
            item.postingDate = req.body.postingDate,
            item.lastModificationDate = req.body.lastModificationDate
            res.status(200);
            res.json(item);
            //console.log(item);
        }
        else if(valid == false && item.seller.username == req.user.username){
            res.status(400).send();
        }
        else{
            res.status(401).send();
        }
    }

});

router.get('/publication/:date', (req, res) => {
    const item = items.find(i => i.postingDate.substr(0, 10) == req.params.date);
    if(!item){
        res.status(404).send();
    }
    else{
        const result = items.filter(i => i.postingDate.substr(0, 10) == req.params.date);
        res.status(200);
        res.json(result);
    }
});

router.get('/category/:category', (req, res) => {
    const item = items.find(i => i.category == req.params.category);
    if(!item){
        res.status(404).send();
    }
    else{
        const result = items.filter(i => i.category == item.category);
        res.status(200);
        res.json(result);
    }
});

router.get('/country/:country/city/:city', (req, res) => {
    const item = items.find(i => i.country == req.params.country);
    if(!item){
        res.status(404).send();
    }
    else{
        let result = items.filter(i => i.country == item.country);
        const end = result.find(i => i.city == req.params.city);
        if(!end){
            res.status(404).send();
        }
        else{
            result = result.filter(i => i.city == end.city);
            res.status(200);
            res.json(result);
        }
    }
});

module.exports = router;