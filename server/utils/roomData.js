class gameData {
  constructor() {
    this.scores = [];
    this.timer = 0;
    this.turn = null;
    this.word = "Shirt";
  }
}

class roomData {
  constructor(roomId) {
    this.roomId = roomId;
    this.users = [];
    this.messages = [];
    this.gameData = new gameData();
  }

  // game start
  startGame() {
    console.log("start game");
    setInterval(() => {
      this.gameData.timer++;
    }, 1000);
  }

  getTimer() {
    return this.gameData.timer;
  }

  addUser(user) {
    // check if user exists already!
    const find = this.users.find(
      i => user.googleUserInfo.googleId === i.user.googleUserInfo.googleId
    );

    if (!find) {
      this.users.push({ user, points: 0, id: user.googleUserInfo.googleId });
      return true;
    } else {
      return false;
    }
  }

  removeUser(user) {
    console.log("remove user");
    let removeUserIndex = this.users.findIndex(i => {
      return i.socketId === user.socketId;
    });
    this.users.splice(removeUserIndex, 1);
  }

  disconnectUser(user) {
    let removeUserIndex = this.users.findIndex(i => {
      return i.id === user.googleId;
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
