


const SERVER_NAME = "Server :)";

let globalUserIndex = 1;
let userList = [];
const _ = require('lodash');
// Io setup

module.exports = (io) => {
  
  io.on('connection', socket => {
    userList.push(`user${globalUserIndex}`);
    socket.username = `user${globalUserIndex}`;
    globalUserIndex++;
  
  //Greeting message
  socket.emit('greeting', {
    message: `Hello there is ${userList.length} poeple.`,
    name: socket.username,
    user: SERVER_NAME
  });
  
  // Change name handler
  socket.on('change name', (data) => {
    io.emit('message', {message: userList});
    //Check for user duplicate
    _.find(userList, (value, index) => {
      if(value === data.name){
        let tempList = Object.assign(userList);
        tempList[index] = data.name + globalUserIndex;
        
      }
    })
    io.emit('message', {user: SERVER_NAME, message: `User "${socket.username}" changed name to: "${data.name}"`});
    socket.username = data.name;
  })
  
  //Pipe message to all ppl
  socket.on('message', (data) => {
    io.emit('message', {user: socket.username, message: data});
  })
  
  //Disconnect socket handler
  socket.on('disconnect', () => {
    // console.log('disconnect');
    let tempUserList = _.remove(userList, (n) => {
      n === socket.username;
    });
    userList = tempUserList;
  })  
  })
}
