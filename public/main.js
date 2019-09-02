const socket = io(`http://localhost:${IO_PORT}`);

socket.on('greeting', data => {
  // messageList.push(data);
  addListElement(data);
  // Get actual nickname from server
  document.getElementById('userNameInput').value = data.name;
});

socket.on('message', data => {
  addListElement(data);
  autoFocusHandler();
});

socket.on('change name', data => {
  document.getElementById('userNameInput').value = data.name;
})

function sendMetas(metas){
  socket.emit('set metas', {color: metas.color, bgColor: metas.bgColor})
};


//Color change events
let frontColorPicker = document.getElementById('frontColor')
let bgColorPicker = document.getElementById('bgColor'); 

frontColorPicker.addEventListener('change', e => sendMetas({color: frontColorPicker.value, bgColor: bgColorPicker.value}));
bgColorPicker.addEventListener('change', e => sendMetas({color: frontColorPicker.value, bgColor: bgColorPicker.value}));
// Default values for reload purposes.
frontColorPicker.value = '#000000';
bgColorPicker.value = '#ffffff';


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

// function storeResponds(e){

// }



function addListElement(data){
  let list = document.getElementById('chat');
  let el = document.createElement('li');

  let message = document.createElement('span');
  message.textContent = data.message;
  el.append(message);

  let author = document.createElement('span');
  author.textContent = data.user;
  el.append(author);
  
  
  //Adds some styling
  if (data.meta){   
     el.style.backgroundColor = data.meta.bgColor;
     el.style.color = data.meta.color;
  }

  el.tabIndex = -1;
  list.appendChild(el);
  // el.focus();
}


// document.getElementById('changeNickField')

function autoFocusHandler() {
  let currentContext = document.addEventListener('click', createLastFocus);
  let changeNameInput = document.getElementById('userNameInput');
  let list = document.getElementById('chat');
  let messageInput = document.getElementById('messageInput');
  
  list.lastChild.focus();
  if(currentContext === changeNameInput){
    changeNameInput.focus();
  }
  if(currentContext === messageInput){
    messageInput.focus();
  }
  
}

function createLastFocus (e){
  return e.target;
}
