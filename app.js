const express = require('express');
const app = express();
// const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const { message, setUserName, userNameOverload } = require('./socket-IO');

// app.use(cors());

let globalUserIndex = 1;
let userList = [];

// Setup view engine
app.set('view engine', 'ejs');




app.get('/', (req, res) => {
  res.render('index');
});

// Io setup
io.on('connection', socket => {
  if(!socket.client.userName){
    userList.push(`user${globalUserIndex}`);
    socket.client.userName = `user${globalUserIndex}`;
    globalUserIndex++;
  }

  
  socket.emit('greeting', {message: `Hello there is ${userList.length} poeple.`});
  
  socket.on('message', (data) => {
    socket.emit('message', {user: socket.client.userName, message: data});
  })

  


  socket.on('disconnect', () => {
   userList = userList.filter((user) => {
     return user !== socket.client.userName
   })
  })  
})

server.listen(80);

module.exports = io;