// To do here:
// refactor it;

const { createUserName, removeUserName } = require('./io-utils');



// Io setup

module.exports = (io) => {
  io._globalUserIndex = 1;
  io._userList = [];

  io.on('connection', socket => {
    let tempUserName = createUserName(io._userList, 'user', io._globalUserIndex);
    io._userList.push(tempUserName);
    socket._username = tempUserName;
    io._globalUserIndex++;
    
    
    socket.join('any room');
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

    io.emit('send list', io._userList);
    
    // Change name handler
    socket.on('change name', (data) => {
      if(data.name !== socket._username){
        //Checks for name duplicates and push it to array;
        let newName  = createUserName(io._userList, data.name, io._globalUserIndex);
        io._userList.push(newName);
        io.emit('message', {
          user: process.env.SERVER_NAME,
          message: `User "${socket._username}" changed name to: "${newName}"`,
          meta: {
            color: process.env.COLOR,
            bgColor: process.env.BG_COLOR
          }
      });
        removeUserName(io._userList, socket._username);
        socket.emit('send list', io._userList);
        socket.emit('change name', {name: newName});
        socket._username = newName;
      } else {
        socket.emit('message', {
          user: process.env.SERVER_NAME,
          message: "You already have that nickname!",
          meta: {
            color: process.env.COLOR,
            bgColor: process.env.BG_COLOR
          }
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
      io.emit('message', {
        user: process.env.SERVER_NAME,
        message: `User "${socket._username}" exit.`,
        meta: {
          color: process.env.COLOR,
          bgColor: process.env.BG_COLOR
        }
      });
      socket.emit('send list', io._userList);
    })  
  })
}
