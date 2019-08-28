const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.send("Hiho!");
})


module.exports = app;