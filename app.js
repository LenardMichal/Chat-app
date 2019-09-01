const express = require('express');
const app = express();
// const cors = require('cors');


// app.use(cors());

// Setup view engine
app.set('view engine', 'ejs');

// Setup for static files
app.use(express.static('public'));


//Serve for out chat app
app.use('', (req, res) => {
  res.render('index', {portNumber: process.env.PORT});
});

module.exports = app;