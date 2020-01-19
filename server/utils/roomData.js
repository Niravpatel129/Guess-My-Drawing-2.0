class gameData {
  constructor() {
    this.scores = {};
    this.timer = 0;
    this.turn = null;
  }
}

class roomData {
  constructor(roomId) {
    this.roomId = roomId;
    this.users = [];
    this.messages = [];
    this.gameData = new gameData();
  }

  addUser(user) {
    console.log("add user");

    this.users.push(user);
  }

  removeUser(user) {
    console.log("remove user");
    let removeUserIndex = this.users.findIndex(i => {
      return i.socketId === user.socketId;
    });
    this.users.splice(removeUserIndex, 1);
  }

  getAllUsersInRoom() {
    return this.users;
  }

  addMessage(name, message) {
    this.messages.push({ name, message });
  }

  getAllMessages() {
    return this.messages;
  }
}

module.exports = { roomData };
