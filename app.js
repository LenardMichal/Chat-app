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
const SERVER_NAME = "Server :)";

// Io setup
io.on('connection', socket => {
    userList.push(`user${globalUserIndex}`);
    socket.client.userName = `user${globalUserIndex}`;
    globalUserIndex++;
  
  //Greeting message
  socket.emit('greeting', {
    message: `Hello there is ${userList.length} poeple.`,
    name: socket.client.userName,
    user: SERVER_NAME
  });

  // Change name handler
  socket.on('change name', (data) => {
    
    //Check for user duplicate
    let result = _.find(userList, (value) => {
      value === data.name 
    })
    if (result){
      data.name += globalUserIndex;
    }
    socket.emit('message', {user: SERVER_NAME, message: `User "${socket.client.userName}" changed name to: "${data.name}"`});
    socket.client.userName = data.name;
  })
  
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