// To do here:
// refactor it;

const _ = require('lodash');
const { createUserName } = require('./io-utils');



// Io setup

module.exports = (io) => {
  io._globalUserIndex = 1;
  io._userList = [];
  io.on('connection', socket => {
    io._userList.push(`user${globalUserIndex}`);
    socket._username = `user${globalUserIndex}`;
    io._globalUserIndex++;
  
  //Greeting message
  socket.emit('greeting', {
    message: `Hello there is ${io._userList.length} poeple.`,
    name: socket._username,
    user: process.env.SERVER_NAME
  });
  
  // Change name handler
  socket.on('change name', (data) => {
    createUserName(io._userList, data.name, io._globalUserIndex);
    
    io.emit('message', {user: process.env.SERVER_NAME, message: `User "${socket._username}" changed name to: "${data.name}"`});
    socket._username = data.name;
  })
  
  //Pipe message to all ppl
  socket.on('message', (data) => {
    io.emit('message', {user: socket._username, message: data});
  })
  
  //Disconnect socket handler
  socket.on('disconnect', () => {
    // console.log('disconnect');
    let tempUserList = _.remove(io._userList, (n) => {
      n === socket._username;
    });
    io._userList = tempUserList;
  })  
  })
}


