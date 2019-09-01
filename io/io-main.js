// To do here:
// refactor it;

const _ = require('lodash');
const { createUserName, removeUserName } = require('./io-utils');



// Io setup

module.exports = (io) => {
  io._globalUserIndex = 1;
  io._userList = [];
  io.on('connection', socket => {
    io._userList.push(`user${io._globalUserIndex}`);
    socket._username = `user${io._globalUserIndex}`;
    io._globalUserIndex++;
  
    //Greeting message
    socket.emit('greeting', {
      message: `Hello there is ${io._userList.length} poeple.`,
      name: socket._username,
      user: process.env.SERVER_NAME
    });
    
    // Change name handler
    socket.on('change name', (data) => {
      if(data.name !== socket._username){
        let newName  = createUserName(io._userList, data.name, io._globalUserIndex);
        io._userList.push(newName);
        io.emit('message', {user: process.env.SERVER_NAME, message: `User "${socket._username}" changed name to: "${newName}"`});
        socket.emit('change name', {name: newName});
        socket._username = newName;
      } else {
        socket.emit('message', {user: process.env.SERVER_NAME, message: "You already have that nickname!"});
      }
    })
    
    //Pipe message to all ppl
    socket.on('message', (data) => {
      io.emit('message', {user: socket._username, message: data});
    })
    
    //Disconnect socket handler
    socket.on('disconnect', () => {
      // console.log('disconnect');
      removeUserName(io._userList, socket._username);
      io.emit('message', {user: process.env.SERVER_NAME, message: `User "${socket._username}" exit.`})
    })  
  })
}


