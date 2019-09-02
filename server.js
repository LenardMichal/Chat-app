require('dotenv').config();
const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ioHandler = require('./io/io-main')(io);




server.listen(Number(process.env.PORT) || 80, (error) => {
  if (error) console.log(error);
  console.log(`Server listening on ${process.env.PORT || 80}.`)
} );

module.exports = server;