// YOUR CODE HERE:
//var app is in ES6 format below, fulfilling minor checkpoint goals for sprint.
// createdAt, objectId, roomname, text, updatedAt, username
var app = {
  url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  roomname: 'lobby',
  roomnames: {},
  username: '',
  messages: [],
  lastMessageID: null,
  friends: {},

  init() {
    app.username = window.location.search.substr('?username='.length) || 'anonymous';

    app.fetch();

    $('#send').on('submit', app.handleSubmit);

    $('#roomSelect').on('change', app.handleRoomChange);

    $('#chats').on('click', '.username', app.handleUsernameClick);

    // setInterval(function() {
    //   app.fetch();
    // }, 3000);
  },

  renderRoomNames() {
    app.messages.forEach(function(message) {
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
    return roomName;
  },

  handleRoomChange() {
    var selectedRoom = $('#roomSelect').val();
    if(selectedRoom === 'createRoom') {
      selectedRoom = app.renderRoomName(prompt('Please enter room name', 'lobby'));
    }
    app.roomname = selectedRoom;
    $('#roomSelect').val(selectedRoom);
    app.renderMessages();
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
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch() {
    $.ajax({
      url: app.url,
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

        app.setLastMessageID(messages[messages.length - 1].objectId);
        app.renderMessages();
        app.renderRoomNames();
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
    return messages[messages.length - 1].objectId !== app.lastMessageID;
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

  renderMessages() {
    app.clearMessages();

    app.messages.filter(function(message) {
      return message.roomname === app.roomname;
    }).forEach(function(message) {
      if(app.checkValidMessage(message)) {
        app.renderMessage(message);
      }
    });
  },

  renderMessage(message) {
    var $chat = $('<div class="chat" />');

    var $username = $('<span class="username" />');
    $username.text(message.username);
    $chat.append($username);
    $chat.attr('data-username', $username.text());
    if(app.friends[$username.text()]) {
      $chat.addClass('friend');
    }
    $chat.append('<br>');

    var $text = $('<span class="text" />');
    $text.text(message.text);

    $chat.append($text);

    $('#chats').append($chat);
  },

  handleUsernameClick() {
    var friend = $(this).text();
    app.friends[friend] = true;
    app.renderMessages();
  }
};

//http://parse.hrr.hackreactor.com/chatterbox/classes/messages where CAMPUS is your campus identifier (ex: atx, nyc, la, sfs, sfm6, sfm8, hrr, etc).