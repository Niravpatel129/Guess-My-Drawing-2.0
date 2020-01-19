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
    this.users.push(user);
  }
}

module.exports = { roomData };
