const timeLimit = 25;

class gameData {
  constructor() {
    this.gameStarted = false;
    this.round = 0;
    this.scores = [];
    this.timer = timeLimit;
    this.drawer = "";
    this.word = "Shirt";
    this.roundPlayers = [];
    this.roundEnded = false;
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
    if (!this.gameData.gameStarted) {
      this.gameData.gameStarted = true;
      this.addRound();
    }
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

  setDrawerList() {
    console.log("init draw list");
    if (this.users.length <= 1) {
      this.endGame();
    }

    for (let user of this.users) {
      this.gameData.roundPlayers.push(user);
    }
  }

  nextDrawer() {
    if (this.gameData.roundPlayers.length > 0) {
      this.gameData.roundEnded = true;
      this.setNewDrawWord();
      console.log(this.gameData.roundPlayers.length, "drawers left");
      this.gameData.drawer = this.gameData.roundPlayers[0];
      this.gameData.roundPlayers.splice(0, 1); // remove the first guy because he is our drawer :D
      this.gameData.timer = timeLimit;
      this.controlTimer("start");
    } else {
      this.addRound();
    }
  }

  addRound() {
    console.log("We are on round", this.gameData.round);
    if (this.gameData.round >= 3) {
      this.endGame();
    } else {
      console.log("Everyone for this round has drawn!");

      if (this.users.length <= 1) {
        this.endGame();
      }

      this.gameData.round++;
      this.setDrawerList();
      this.nextDrawer();
    }
  }

  toggleRoundEnd() {
    this.gameData.roundEnded = false;
  }

  setNewDrawWord() {
    const words = ["Rock", "Paper", "Scissors", "Dog", "Tom", "Jerry"];

    const number = Math.floor(Math.random() * words.length);

    this.gameData.word = words[number];
  }

  endGame() {
    console.log("WIP end game");
    this.gameData.gameStarted = false;
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
