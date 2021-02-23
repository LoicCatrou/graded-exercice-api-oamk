const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userComponent = require('./components/users');
const itemComponent = require('./components/items');
const loginComponent = require('./components/logins');

app.set('port', (process.env.PORT || 3000));

app.use(express.json());
app.use(bodyParser.json());

app.use('/users', userComponent.router);
app.use('/items', itemComponent);
app.use('/logins', loginComponent);

let serverInstance = null;

module.exports = {
    start: function() {
        serverInstance = app.listen(app.get('port'), function() {
            console.log('Node app is running on port', app.get('port'));
        });
    },
    close: function() {
        serverInstance.close();
    },
}