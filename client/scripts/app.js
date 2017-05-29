// YOUR CODE HERE:
//var app is in ES6 format below, fulfilling minor checkpoint goals for sprint.
// createdAt, objectId, roomname, text, updatedAt, username
var app = {
  messagesUrl: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  roomname: 'lobby',
  username: '',
  messages: [],
  lastMessageID: null,

  init() {
    app.username = window.location.search.substr('?username='.length) || 'anonymous';

    app.fetch(app.messagesUrl);

    // setInterval(function() {
    //   app.fetch(app.messagesUrl);
    // }, 3000);
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
      url: url,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Fetched');
        app.renderMessages(data.results);
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch', data);
      }
    });
  },

  clearMessages() {
    $('#chats').empty();
  },

  confirmNewMessagesFetched(messages) {
    return messages[0].objectId !== app.lastMessageID;
  },

  setLastMessageID(lastFetchedMessageID) {
    app.lastMessageID = lastFetchedMessageID;
  },

  checkValidMessage(message) {
    return !!message.username && !!message.text && !!message.roomname;
  },

  renderMessages(messages) {
    console.log(messages);
    if(!app.confirmNewMessagesFetched(messages)) {
      return;
    }

    app.setLastMessageID(messages[0].objectId);

    app.clearMessages();

    messages.forEach(function(message) {
      if(app.checkValidMessage(message)) {
        app.renderMessage(message);
      }
    });
  },

  renderMessage(message) {
    var $chat = $('<div class="chat" />');

    var $username = $('<span class="username" /><br>');
    $username.text(message.username);

    var $text = $('<span class="text" />');
    $text.text(message.text);

    $chat.append($username);
    $chat.append($text);

    $('#chats').append($chat);
  },

  renderRoom(room) {
    $('#roomSelect').append(`<option value="${room}"> ${room} </option>`);
  },

  handleUserNameClick() {

  },

  handleSubmit() {
    $('#send').submit();

  }
};

//http://parse.hrr.hackreactor.com/chatterbox/classes/messages where CAMPUS is your campus identifier (ex: atx, nyc, la, sfs, sfm6, sfm8, hrr, etc).