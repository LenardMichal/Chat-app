(function(){
// eslint-disable-next-line
const socket = io(`http://localhost:${IO_PORT}`);

let userNameInput = document.getElementById('userNameInput');
let usersList = document.getElementById('usersList');

socket.on('greeting', data => {
  addListElement(data);
  // Get actual nickname from server
  userNameInput.value = data.name;
});

socket.on('message', data => {
  addListElement(data);
  autoFocusHandler();
});

socket.on('change name', data => {
  userNameInput.value = data.name;
})

socket.on('send list', data => listUpdate(data, usersList));

function listUpdate(names, list){
  list.textContent = '';
  for(let name of names) {
    let el = document.createElement('li');
    el.textContent = name;
    list.appendChild(el);
  }
  //  userCounter maniplation
  document.getElementById('userCounter').textContent = list.childElementCount;
  document.getElementById('manIcon').classList.add('iconBox__icon--active');
  setTimeout(() => {document.getElementById('manIcon').classList.remove('iconBox__icon--active')}, 1000);
}

function sendMetas(metas){
  socket.emit('set metas', {color: metas.color, bgColor: metas.bgColor})
}

//Color change events
let frontColorPicker = document.getElementById('frontColor')
let bgColorPicker = document.getElementById('bgColor'); 

frontColorPicker.addEventListener('change', () => sendMetas({color: frontColorPicker.value, bgColor: bgColorPicker.value}));
bgColorPicker.addEventListener('change', () => sendMetas({color: frontColorPicker.value, bgColor: bgColorPicker.value}));
// Default values for reload purposes.
frontColorPicker.value = '#000000';
bgColorPicker.value = '#ffffff';


// Send message handler
let messageField = document.getElementById('messageInput');

document.getElementById('messageButton').addEventListener('click', messageEmitter);
messageField.addEventListener('keydown', messageEmitter)
messageField.addEventListener('keydown', e => pushMessageToInput(e, messageField, messagesList));

// Messages list store all responds from user.
let messagesList = [];
// Function that store messages and removes them if there is more than 10.
function storeMessage (list, msg) {
  if (Array.isArray(list)){
    list.unshift(msg);
    if(list.length > 10) {
      list.pop();
    }
  } else {
    console.error('List argument is not array type.')
  }
}

let iteratorCtx = -1;
function pushMessageToInput(e, inputField, msgList){
  if(msgList.length > 0) {
    if(e.key === "ArrowUp"){
      if(iteratorCtx < msgList.length - 1) {
        iteratorCtx++
        if(iteratorCtx > -1){
          inputField.value = msgList[iteratorCtx]
        } else {
          inputField.value = '';
        }
      }
    }
    if(e.key === 'ArrowDown') {
      if(iteratorCtx > 0){
        iteratorCtx--
        inputField.value = msgList[iteratorCtx];
      } else {
        iteratorCtx = -1;
        inputField.value = '';
      }
    }
  }
}

function messageEmitter(e){
  if(eventChecker(e)){
    let input =  document.getElementById('messageInput');
    storeMessage(messagesList, input.value);
    socket.emit('message', input.value);
    input.value = '';
  }
}

// Change name handler
userNameInput.addEventListener('keydown', changeNameEmitter);
userNameInput.addEventListener('keydown', () => pushMessageToInput());
document.getElementById('userNameButton').addEventListener('click', changeNameEmitter);

function changeNameEmitter(e){
  if(eventChecker(e)){
    let input = userNameInput;
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
  
  
  //Adds some styling
  if (data.meta){   
     el.style.backgroundColor = data.meta.bgColor;
     el.style.color = data.meta.color;
  }

  el.tabIndex = -1;
  list.appendChild(el);
  // el.focus();
}

// Creates context to last clicked element and focus it after got new message

let currentContext;
// Function that find last input element and restore focus to him.
function autoFocusHandler() {
  let changeNameInput = document.getElementById('userNameInput');
  let list = document.getElementById('chat');
  let messageInput = document.getElementById('messageInput');
  let messageBtn = document.getElementById('messageButton');

  list.lastChild.focus();
  
  if(currentContext === changeNameInput){
    changeNameInput.focus();
  }
  if(currentContext === messageInput || currentContext === messageBtn){
    messageInput.focus();
  }
  
}

document.addEventListener('click', createLastFocus);

function createLastFocus (e){
  currentContext = e.target
}


// Function that controls popup windows.
function toggleHiddenWindows(e) {
  let settingsIcon = document.getElementById('settingsIcon');
  let iconBox = document.getElementById('iconBox');
  let userListBox = document.getElementsByClassName('userListBox')[0];
  let screenOverlapse = document.getElementById('screenOverlapse');
  let settings = document.getElementsByClassName('settings')[0];
  
  // Block using on huge screen
  if(window.matchMedia('(max-width: 900px)').matches){


    if (e.target === iconBox || e.target === iconBox.childNodes[1] ){
      // userListBoxVisibility = true
      if(userListBox.style.display === 'none') {
        userListBox.style.display = 'inline-block';
        screenOverlapse.style.display = 'block';
      } else {
        userListBox.style.display = 'none';
      }
    }
    if(e.target === settingsIcon){
      if(settings.style.display === 'none') {
        settings.style.display = 'inline-block';
        screenOverlapse.style.display = 'block';
      } else {
        settings.style.display = 'none';
      }
    }
    // Hides all popups on screen overlapse click
    if(e.target === screenOverlapse){
      screenOverlapse.style.display = 'none';
      settings.style.display = 'none';
      userListBox.style.display = 'none';
    }
    if(userListBox.style.display === "none" && settings.style.display === 'none') {
      screenOverlapse.style.display = 'none';
    }
    
  }

}

document.addEventListener('click', toggleHiddenWindows);

})();