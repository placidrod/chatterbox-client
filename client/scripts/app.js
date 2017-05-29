// YOUR CODE HERE:
//var app is in ES6 format below, fulfilling minor checkpoint goals for sprint.
// createdAt, objectId, roomname, text, updatedAt, username
var app = {
  messagesUrl: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  roomname: 'lobby',
  roomnames: {},
  username: '',
  messages: [],
  lastMessageID: null,

  init() {
    app.username = window.location.search.substr('?username='.length) || 'anonymous';

    app.fetch(app.messagesUrl);

    $('#send').on('submit', app.handleSubmit);

    $('#roomSelect').on('change', app.renderRoom);

    // setInterval(function() {
    //   app.fetch(app.messagesUrl);
    // }, 3000);
  },

  renderRoomNames(messages) {
    messages.forEach(function(message) {
      if(!app.roomnames[message.roomname]) {
        app.roomnames[message.roomname] = true;
        app.renderRoomName(message.roomname);
      }
    });
  },

  renderRoomName(roomName) {
    if(!app.checkValid(roomName)) {
      return;
    }

    var $option = $('<option />');
    $option.val(roomName).text(roomName);
    $('#roomSelect').append($option);
  },

  renderRoom() {
    var selectedRoom = $('#roomSelect').val();
    var filteredMessagesByRoom = app.messages.filter(function(message){
      return message.roomname === selectedRoom;
    });
    app.renderMessages(filteredMessagesByRoom);
  },

  handleSubmit(event) {
    event.preventDefault();
    // console.log($('#text').val());
    var message = {
      username: app.username,
      roomname: app.roomname,
      text: $('#text').val()
    };

    app.send(message);

  },

  send(message) {
    $.ajax({
      url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch(app.messagesUrl);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch(url) {
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        order: '-createdAt'
      },
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Fetched');

        var messages = data.results;

        if(!app.confirmNewMessagesFetched(messages)) {
          return;
        }

        app.messages = messages;

        app.setLastMessageID(messages[0].objectId);
        app.renderMessages(data.results);
        app.renderRoomNames(data.results);
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

  checkValid(string) {
    return !!string;
  },

  checkValidMessage(message) {
    return app.checkValid(message.username)
           && app.checkValid(message.text)
           && app.checkValid(message.roomname);
  },

  renderMessages(messages) {
    // console.log(messages);

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

  handleUserNameClick() {

  }
};

//http://parse.hrr.hackreactor.com/chatterbox/classes/messages where CAMPUS is your campus identifier (ex: atx, nyc, la, sfs, sfm6, sfm8, hrr, etc).