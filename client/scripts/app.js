// YOUR CODE HERE:
//var app is in ES6 format below, fulfilling minor checkpoint goals for sprint.
var app = {

  // We likely need to create objects for chatRooms, Friends,  etc... that then link to div's in the html...messages object
  init() {
    this.fetch('http://parse.hrr.hackreactor.com/chatterbox/classes/messages');

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
        for (var i = 0; i < data.results.length; i += 1) {
        // escape(data.result[i].username)
        // escape(data.result[i].text)
        // escape(data.result[i].rom)
          app.renderMessage((data.results[i]));
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
    //message = app.e
    var messageDiv = `
      <div class="chat">
      <p class="username">${message.username}</p>
      <p class="text">${message.text}</p>
      </div>
    `; // <p class="roomname">${message.roomname}</p>
    $('#chats').prepend(messageDiv);
  },
  renderRoom(room) {
    $('#roomSelect').append(`<option value="${room}"> ${room} </option>`);
  },
  handleUserNameClick() {

  },
  escape(text) {
    return;//regexed'version of that text/escaped thing
  },
};

app.init();

//http://parse.hrr.hackreactor.com/chatterbox/classes/messages where CAMPUS is your campus identifier (ex: atx, nyc, la, sfs, sfm6, sfm8, hrr, etc).