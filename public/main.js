const socket = io('http://localhost');
let user;
let messageList = [];


socket.on('greeting', data => {
  // messageList.push(data);
  addListElement(data);
  // Get actual nickname from server
  document.getElementById('userNameInput').value = data.name;
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
  if(eventChecker(e)){
    let input =  document.getElementById('messageInput');
    socket.emit('message', input.value);
    input.value = '';
  }
}

// Change name handler
document.getElementById('userNameInput').addEventListener('keydown', changeNameEmitter);
document.getElementById('userNameButton').addEventListener('click', changeNameEmitter);

function changeNameEmitter(e){
  if(eventChecker(e)){
    let input = document.getElementById('userNameInput');
    socket.emit('change name', {name: input.value});
  }
}


function eventChecker(event){
  if(event.key === "Enter" || event.type === 'click'){
    return true;
  }
  return false
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