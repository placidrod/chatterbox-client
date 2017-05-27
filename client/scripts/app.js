// YOUR CODE HERE:
//var app is in ES6 format below, fulfilling minor checkpoint goals for sprint.
var app = {

  // We likely need to create objects for chatRooms, Friends,  etc... that then link to div's in the html...messages object
  uniqueRoomNames: [],
  currentRoom: 'lobby',
  username() {
    var step = window.location.search.replace(/\?username=/, '');
    var stepTwo = step.replace(/%20/, ' ');
    return stepTwo;
  },
  init() {
    app.fetch('http://parse.hrr.hackreactor.com/chatterbox/classes/messages');

    setInterval(function() {
      app.fetch('http://parse.hrr.hackreactor.com/chatterbox/classes/messages/');
    }, 2000);

    $('#send .submit').on('click', app.handleSubmit());
    $('#main .username').on('click', app.handleUserNameClick());
  },
  send(message) {
    $.ajax({// This is the url you should use to communicate with the parse API server.
      url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch(url) { // fetch may need to take an argument of a url later to specify which subdirectory to fetch/get
    $.ajax({
      url: url, //'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',//may need to change to variable later
      type: 'GET',
      //GET needs a target???
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Fetched');
        app.clearMessages();
        for (var i = 0; i < data.results.length; i += 1) {
          app.renderMessage((data.results[i]));
          if (app.uniqueRoomNames.indexOf(data.results[i].roomname) === -1) {
            app.uniqueRoomNames.push(data.results[i].roomname);
            app.renderRoom(data.results[i].roomname);
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch', data);
      }
    });
  },
  clearMessages() {
    $('#chats').empty();
  },
  renderMessage(message) {
    message.username = app.escape(message.username);
    message.text = app.escape(message.text);
    message.roomname = app.escape(message.roomname);//remember to resafe it elsewhere
    // console.log(message.text);

    var messageDiv = `
      <div class="chat">
      <p class="username">${message.username}</p>
      <p class="text">${message.text}</p>
      <p class="roomname">${message.roomname}</p>
      </div>
    `; // <p class="roomname">${message.roomname}</p>
    $('#chats').prepend(messageDiv);
  },
  renderRoom(room) {
    $('#roomSelect').append(`<option value="${room}"> ${room} </option>`);
  },
  handleUserNameClick() {

  },
  handleSubmit() {
    $('#send').submit();

  },
  escape(str) {
    // return str;
    var replaceChars = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#96;',
      ' ': '&#32;',
      '!': '&#33;',
      '@': '&#64;',
      '$': '&#36;',
      '%': '&#37;',
      '(': '&#40;',
      ')': '&#41;',
      '=': '&#61;',
      '+': '&#43;',
      '{': '&#123;',
      '}': '&#125;',
      '[': '&#91;',
      ']': '&#93;'
    };
    return str.replace(/[&<>"'`\s!@$%()=+{}[]]/g, function(char) {
      return replaceChars[char];
    });
  },
};

app.init();

//http://parse.hrr.hackreactor.com/chatterbox/classes/messages where CAMPUS is your campus identifier (ex: atx, nyc, la, sfs, sfm6, sfm8, hrr, etc).