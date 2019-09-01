const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ioHandler = require('./io/io-main')(io);




server.listen(process.env.PORT || 80);

module.exports = server;