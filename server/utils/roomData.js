const timeLimit = 70;
const pointsMultiplyer = 300;
let timer;

const allWords = require("./words");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class gameData {
  constructor() {
    this.gameStarted = false;
    this.round = 0;
    this.scores = [];
    this.timer = timeLimit;
    this.drawer = "";
    this.word = "SomeWord";
    this.roundPlayers = [];
    this.roundEnded = false;
    this.usersWhoGussedCorrect = [];
  }
}

class roomData {
  constructor(roomId) {
    this.roomId = roomId;
    this.users = [];
    this.messages = [];
    this.gameData = new gameData();
  }

  guessedCorrect(user) {
    // console.log(this.gameData.drawer);

    const findDrawer = this.users.find(i => {
      return (
        i.user.googleUserInfo.googleId ===
        this.gameData.drawer.user.googleUserInfo.googleId
      );
    });

    const find = this.gameData.usersWhoGussedCorrect.find(i => {
      return i === user.googleId;
    });

    if (!find) {
      this.gameData.usersWhoGussedCorrect.push(user.googleId);
      const addPoints = this.users.find(i => {
        return user.googleId === i.user.googleUserInfo.googleId;
      });

      addPoints.points +=
        Math.round(pointsMultiplyer + this.gameData.timer / 6) +
        this.gameData.word.length;
      if (findDrawer) {
        findDrawer.points += Math.round(
          pointsMultiplyer / 2.5 + this.gameData.timer / 12
        );
      }

      if (
        this.gameData.usersWhoGussedCorrect.length ===
        this.users.length - 1
      ) {
        this.nextDrawer();
      }
    }
  }

  // game start
  startGame() {
    if (!this.gameData.gameStarted) {
      this.addMessage("Admin", "Game Started🐇🐇");
      this.gameData.gameStarted = true;
      this.addRound();
    }
  }

  stopGame() {
    this.controlTimer("stop");
  }

  controlTimer(mode) {
    if (mode === "start") {
      timer = setInterval(() => {
        this.gameData.timer--;
        if (this.gameData.timer <= 0 || mode === "stop") {
          clearInterval(timer);
          this.nextDrawer();
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
  }

  setDrawerList() {
    if (this.users.length <= 1) {
      this.endGame();
    }

    for (let user of this.users) {
      this.gameData.roundPlayers.push(user);
    }
  }

  nextDrawer() {
    this.gameData.usersWhoGussedCorrect = [];
    if (this.gameData.roundPlayers.length > 0) {
      if (this.gameData.word) {
        setTimeout(() => {
          if (this.gameData.drawer) {
            if (this.gameData.drawer.user) {
              this.addMessage(
                "Admin",
                capitalizeFirstLetter(
                  this.gameData.drawer.user.googleUserInfo.name
                ) +
                  "'s Turn ended: the word was: " +
                  capitalizeFirstLetter(this.gameData.word)
              );
            }
          }

          this.gameData.roundEnded = true;
          this.controlTimer("stop");

          setTimeout(() => {
            this.gameData.drawer = this.gameData.roundPlayers[0];
            this.gameData.roundPlayers.splice(0, 1); // remove the first guy because he is our drawer :D
            this.gameData.timer = timeLimit;
            this.setNewDrawWord();

            this.controlTimer("start");
          }, 1000);
        }, 2500);
      }
    } else {
      this.addRound();
    }
  }

  addRound() {
    if (this.gameData.round >= 3 || this.users.length <= 1) {
      this.endGame();
    } else {
      this.gameData.round++;
      this.setDrawerList();
      this.nextDrawer();
    }
  }

  toggleRoundEnd() {
    this.gameData.roundEnded = false;
  }

  setNewDrawWord() {
    const number = Math.floor(Math.random() * allWords.length);

    if (allWords[number] !== this.gameData.word) {
      this.gameData.word = allWords[number];
    } else {
      this.setNewDrawWord();
    }
  }

  endGame() {
    console.log("END");
    this.gameData.gameStarted = false;
    this.gameData = new gameData();
    this.clearPoints();
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

  clearPoints() {
    for (let user in this.users) {
      this.users[user].points = 0;
    }
  }
}

module.exports = { roomData };
