const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

//const Customer = require('./controllers/customer.js');
const customerRouter = require('./routes/customer');

//const Schedule = require('./controllers/schedule');
const ScheduleRouter = require('./routes/schedule');
const invoiceRouter = require('./routes/invoice');
const Auth = require('./controllers/auth');

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/auth/login", Auth.login);

app.use('/api/customer', customerRouter);
app.use('/api/schedule', ScheduleRouter);
app.use('/api/invoice', invoiceRouter)
//app.get('api/schedule/exist',Schedule.exist);




app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var port = process.env.PORT || 3001;
//var port = process.env.PORT || 3003;

app.set('port', port);
app.listen(port);
console.log('Express Server Started successfully')