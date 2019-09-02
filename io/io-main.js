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
    
    
    //message generator
    let greetingMessage = `Hello there is one person`
    if(io._userList.length > 1){
      greetingMessage = `Hello there is ${io._userList.length} poeple.`;
    }

    socket.emit('greeting', {
      message: greetingMessage,
      name: socket._username,
      user: process.env.SERVER_NAME,
      meta: {
        color: process.env.COLOR,
        bgColor: process.env.BG_COLOR
      }
    });
    
    // Change name handler
    socket.on('change name', (data) => {
      if(data.name !== socket._username){
        //Checks for name duplicates and push it to array;
        let newName  = createUserName(io._userList, data.name, io._globalUserIndex);
        io._userList.push(newName);
        io.emit('message', {user: process.env.SERVER_NAME, message: `User "${socket._username}" changed name to: "${newName}"`});
        removeUserName(io._userList, socket._username);
        
        socket.emit('change name', {name: newName});
        socket._username = newName;
      } else {
        socket.emit('message', {
          user: process.env.SERVER_NAME,
          message: "You already have that nickname!"
          });
      }
    })
    
    //Pipe message to all ppl
    socket.on('message', (data) => {
      io.emit('message', {
        user: socket._username,
        message: data,
        meta: socket._meta
      });
    });

    socket.on('set metas', data => {
        socket._meta = data;
    })
    
    //Disconnect socket handler
    socket.on('disconnect', () => {
      // console.log('disconnect');
      removeUserName(io._userList, socket._username);
      io.emit('message', {user: process.env.SERVER_NAME, message: `User "${socket._username}" exit.`})
    })  
  })
}


