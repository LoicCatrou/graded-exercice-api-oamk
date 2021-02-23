require('dotenv').config();

const express = require('express');
const router = express.Router();
const userComponent = require('./users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

router.use(express.json());


passport.use(new BasicStrategy(
    function(username, password, done) {
  
      const user = userComponent.getUserUsername(username);
      if(user == undefined) {
        return done(null, false, { message: "HTTP Basic username not found" });
      }

      if(bcrypt.compareSync(password, user.password) == false) {
        return done(null, false, { message: "HTTP Basic password not found" });
      }
      return done(null, user);
    }
));

let jwtSecretKey = null;

if(process.env.JWTKEY === undefined) {
  jwtSecretKey = require('../jwt-key.json').secret;
} else {
  jwtSecretKey = process.env.JWTKEY;
}

let options = {}

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

options.secretOrKey = jwtSecretKey;

passport.use(new JwtStrategy(options, function(jwt_payload, done) {

  const now = Date.now() / 1000;
  if(jwt_payload.exp > now) {
    done(null, jwt_payload.user);
  }
  else {
    done(null, false);
  }
}));

router.get('/', passport.authenticate('basic', { session: false }), (req, res) => {
    const body = {
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        address: req.user.address,
        city: req.user.city,
        country: req.user.country,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
    };
    
    const payload = {
        user : body
    };
  
    const options = {
        expiresIn: '1d'
    }

    const token = jwt.sign(payload, jwtSecretKey, options);

    return res.json({ token });
});

module.exports = router;