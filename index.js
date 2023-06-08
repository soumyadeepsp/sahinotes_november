// this is the main entry point of the server
const express = require('express');
const port = 8000;
const app = express();
const bodyParser = require('body-parser');
require('./config/mongodb');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', require('./routes/home'));

app.listen(port, function(err) {
    if (err) {
        console.log('Server could not run properly:', err);
        return;
    } else {
        console.log('Server is running properly on port:', port);
        return;
    }
});