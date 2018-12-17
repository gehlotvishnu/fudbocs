const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const saveCustomer = require('./index').saveCustomer;
const getCustomers = require('./index').getCustomers;
const saveSchedule = require('./index').saveSchedule;
const getSchedule = require('./index').getSchedule;
const updateSchedule = require('./index').updateSchedule;
const getBookAuthorDetails = require('./index').getBookAuthorDetails;

app.use(express.static(path.join(__dirname, 'build')));

// Set up mongoose connection
const mongoDB = "mongodb://mukesh:dhrDG!421@foodbox-shard-00-00-ogufn.mongodb.net:27017,foodbox-shard-00-01-ogufn.mongodb.net:27017,foodbox-shard-00-02-ogufn.mongodb.net:27017/foodbox?ssl=true&replicaSet=foodbox-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/saveCustomer', function (req, res) {
  saveCustomer(req.body).then(books => res.send(books));
});

app.post('/api/saveSchedule', function (req, res) {
  saveSchedule(req.body).then(books => res.send(books));
});

app.post('/api/updateSchedule', function (req, res) {
  updateSchedule(req.body).then(books => res.send(books));
});

app.get('/api/getCustomers', function (req, res) {
  getCustomers().then(customers => res.send(customers));
});

app.get('/api/getSchedule', function (req, res) {
  getSchedule(req.query.customerId, req.query.date).then(schedule => res.send(schedule));
});

app.get('/api/getAuthorDetails', function (req, res) {
  getBookAuthorDetails(req.query.q).then(authorDetails => res.send(authorDetails));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var port = process.env.PORT || 3001;

app.set('port', port);
app.listen(port);