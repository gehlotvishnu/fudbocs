const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const Customer = require('./controllers/customer.js');
const Schedule = require('./controllers/schedule');

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/api/customer/all', Customer.all);
app.get('/api/customer/filter', Customer.filter);
app.get('/api/schedule/getBy', Schedule.getBy);

app.post('/api/customer/add', Customer.add);
app.post('/api/schedule/add', Schedule.add);
app.post('/api/schedule/update', Schedule.update);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var port = process.env.PORT || 3001;

app.set('port', port);
app.listen(port);