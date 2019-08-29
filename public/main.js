const socket = io('http://localhost');
let user;
let messageList = [];
socket.on('greeting', data => {
  messageList.push(data);
  socket.emit('message', "costam");
  // socket.emit('userNameChange', 'AdolfKittler');
});
socket.on('message', data => {
  // console.log(data);
  // messageList.push(data);
  addListElement(data);
});
// Send message handler

document.getElementById('sendMessage').addEventListener('click', messageEmitter);
document.getElementById('messageInput').addEventListener('keydown', messageEmitter)


function messageEmitter(e){
  if(e.key === "Enter" || e.type === 'click'){
    let input =  document.getElementById('messageInput');
    socket.emit('message', input.value);
    input.value = '';
  }
}



function addListElement(data){
  let list = document.getElementById('chat');
  let el = document.createElement('li');

  let message = document.createElement('span');
  message.textContent = data.message;
  el.append(message);

  let author = document.createElement('span');
  author.textContent = data.user;
  el.append(author);

  
  list.appendChild(el);
}


// document.getElementById('changeNickField')