const timeLimit = 4;

class gameData {
  constructor() {
    this.round = 0;
    this.scores = [];
    this.timer = timeLimit;
    this.drawer = "";
    this.word = "Shirt";
    this.roundPlayers = [];
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

    this.setOrignalDrawer();

    this.addRound();
  }

  setOrignalDrawer() {
    for (let user of this.users) {
      this.gameData.roundPlayers.push(user);
    }

    this.gameData.drawer = this.gameData.roundPlayers[0];
    this.gameData.roundPlayers.splice(0, 1); // remove the first guy because he is our drawer :D
  }

  controlTimer(mode) {
    if (mode === "start") {
      const timerInterval = setInterval(() => {
        this.gameData.timer--;
        if (this.gameData.timer < 0 || mode === "stop") {
          clearInterval(timerInterval);
          this.nextDrawer();
        }
      }, 1000);
    }
  }

  nextDrawer() {
    if (this.gameData.roundPlayers.length > 0) {
      this.gameData.drawer = this.gameData.roundPlayers[0];
      this.gameData.roundPlayers.splice(0, 1); // remove the first guy because he is our drawer :D
    } else {
      this.addRound();
    }
  }

  addRound() {
    if (this.gameData.round >= 3) {
      this.endGame();
    } else {
      this.gameData.timer = timeLimit;
      this.setNewDrawWord();
      console.log("new Round");

      this.gameData.round++;
      this.controlTimer("start");
    }
  }

  setNewDrawWord() {
    const words = ["Rock", "Paper", "Scissors", "Dog", "Tom", "Jerry"];

    const number = Math.floor(Math.random() * words.length);

    this.gameData.word = words[number];
  }
  endGame() {
    console.log("WIP end game");
    this.gameData = new gameData();
    this.controlTimer("stop");
  }

  getTimer() {
    return this.gameData.timer;
  }

  addUser(user) {
    // check if user exists already!
    const find = this.users.find(i => {
      return user.socketId === i.user.socketId;
    });

    // add google user to lobby!
    const find2 = this.users.find(i => {
      return user.googleUserInfo.googleId === i.user.googleUserInfo.googleId;
    });

    if (!find && !find2) {
      this.users.push({ user, points: 0, id: user.googleUserInfo.googleId });

      return true;
    } else {
      return false;
    }
  }

  removeUser(user) {
    console.log("remove user");
    let removeUserIndex = this.users.findIndex(i => {
      return i.user.socketId === user.user.socketId;
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
