const express = require('express');
const app = express();
// const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const _ = require('lodash');

// app.use(cors());

let globalUserIndex = 1;
let userList = [];

// Setup view engine
app.set('view engine', 'ejs');

// Setup for static files
app.use(express.static('public'));


//Serve for out chat app
app.use('', (req, res) => {
  res.render('index');
});

// Io setup
io.on('connection', socket => {
    socket.client.userName
    userList.push(`user${globalUserIndex}`);
    socket.client.userName = `user${globalUserIndex}`;
    globalUserIndex++;
  
  //Greeting message
  socket.emit('greeting', {message: `Hello there is ${userList.length} poeple.`});
  
  //Pipe message to all ppl
  socket.on('message', (data) => {
    socket.emit('message', {user: socket.client.userName, message: data});
  })

  //Disconnect socket handler
  socket.on('disconnect', () => {
    // console.log('disconnect');
    let tempUserList = _.remove(userList, (n) => {
      n === socket.client.userName;
    });
    userList = tempUserList;
  })  
})

server.listen(80);

module.exports = io;