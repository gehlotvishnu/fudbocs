const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// const customerRouter = require('./routes/customer');
const Customer = require('./controllers/customer.js');
const Schedule = require('./controllers/schedule');

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/api/customer/all', Customer.all);
app.get('/api/schedule/getBy', Schedule.getBy);

app.post('/api/customer/add', Customer.add);
app.post('/api/schedule/add', Schedule.add);
app.post('/api/schedule/update', Schedule.update);

// app.post('/api/saveCustomer', function (req, res) {
//   saveCustomer(req.body).then(books => res.send(books));
// });

// app.post('/api/saveSchedule', function (req, res) {
//   saveSchedule(req.body).then(books => res.send(books));
// });

// app.post('/api/updateSchedule', function (req, res) {
//   updateSchedule(req.body).then(books => res.send(books));
// });

// app.get('/api/getCustomers', function (req, res) {
//   getCustomers().then(customers => res.send(customers));
// });

// app.get('/api/getSchedule', function (req, res) {
//   getSchedule(req.query.customerId, req.query.date).then(schedule => res.send(schedule));
// });

// app.get('/api/getAuthorDetails', function (req, res) {
//   getBookAuthorDetails(req.query.q).then(authorDetails => res.send(authorDetails));
// });

// app.get('/api/filterCustomer', function (req, res) {
//   filterCustomer(req.query.date, req.query.tiffinType).then(authorDetails => res.send(authorDetails));
// });

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var port = process.env.PORT || 3001;

app.set('port', port);
app.listen(port);