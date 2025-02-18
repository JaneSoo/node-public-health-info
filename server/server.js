// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const healthRoutes = require('./routes/health-route');
const swaggerRoutes = require('./routes/swagger-route');
const homeRoute = require('./routes/homeroute');
const dataRoute = require('./routes/dataroute');

const app = express();

// enable parsing of http request body
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// routes and api calls
app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);
app.use('/', homeRoute);
app.use('/getdata', dataRoute);


// default path to serve up index.html (single page application)


// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

module.exports = app;
