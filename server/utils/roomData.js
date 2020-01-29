const timeLimit = 65;
const pointsMultiplyer = 300;
const maxRounds = 5;
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
    this.word = "______";
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
    this.gamedata = new gameData();
  }

  guessedCorrect(user) {
    if (!user) return;
    if (!this.gamedata.drawer || !this.gamedata.gameStarted) return;

    const findDrawer = this.users.find(i => {
      return (
        i.user.googleUserInfo.googleId ===
        this.gamedata.drawer.user.googleUserInfo.googleId
      );
    });

    const find = this.gamedata.usersWhoGussedCorrect.find(i => {
      return i === user.googleId;
    });

    if (!find) {
      this.gamedata.usersWhoGussedCorrect.push(user.googleId);
      const addPoints = this.users.find(i => {
        return user.googleId === i.user.googleUserInfo.googleId;
      });

      addPoints.points +=
        Math.round(pointsMultiplyer + this.gamedata.timer / 6) +
        this.gamedata.word.length;
      if (findDrawer) {
        findDrawer.points += Math.round(
          pointsMultiplyer / 2.5 + this.gamedata.timer / 12
        );
      }

      if (
        this.gamedata.usersWhoGussedCorrect.length ===
        this.users.length - 1
      ) {
        this.nextDrawer();
      }
    }
  }

  // game start
  startGame() {
    if (!this.gamedata.gameStarted) {
      this.addMessage("Admin", "New Game Started");
      this.gamedata.gameStarted = true;
      this.addRound();
    }
  }

  stopGame() {
    this.controlTimer("stop");
  }

  controlTimer(mode) {
    if (mode === "start") {
      timer = setInterval(() => {
        this.gamedata.timer--;
        if (this.gamedata.timer <= 0 || mode === "stop") {
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
      this.gamedata.roundPlayers.push(user);
    }
  }

  nextDrawer() {
    this.gamedata.timer -= 5;
    this.gamedata.usersWhoGussedCorrect = [];
    if (this.gamedata.roundPlayers.length > 0) {
      if (this.gamedata.word) {
        setTimeout(() => {
          if (this.gamedata.drawer) {
            if (this.gamedata.drawer.user) {
              this.addMessage(
                "Admin",
                capitalizeFirstLetter(
                  this.gamedata.drawer.user.googleUserInfo.name
                ) +
                  "'s Turn ended: the word was: " +
                  capitalizeFirstLetter(this.gamedata.word)
              );
            }
          }

          this.gamedata.roundEnded = true;
          this.controlTimer("stop");

          this.gamedata.drawer = this.gamedata.roundPlayers[0];
          this.gamedata.roundPlayers.splice(0, 1); // remove the first guy because he is our drawer :D
          this.gamedata.timer = timeLimit;
          this.setNewDrawWord();

          this.controlTimer("start");
        }, 2500);
      }
    } else {
      this.addRound();
    }
  }

  addRound() {
    if (this.gamedata.round >= maxRounds || this.users.length <= 1) {
      this.endGame();
    } else {
      this.gamedata.round++;
      this.setDrawerList();
      this.nextDrawer();
    }
  }

  toggleRoundEnd() {
    this.gamedata.roundEnded = false;
  }

  setNewDrawWord() {
    const number = Math.floor(Math.random() * allWords.length);

    if (allWords[number] !== this.gamedata.word) {
      this.gamedata.word = allWords[number];
    } else {
      this.setNewDrawWord();
    }
  }

  endGame() {
    this.addMessage("Admin", "Game Ended, new game will begin shortly");

    this.gamedata.gameStarted = false;

    this.gamedata = new gameData();
    this.clearPoints();
    this.controlTimer("stop");
  }

  getTimer() {
    return this.gamedata.timer;
  }

  addUser(user) {
    if (!user) return;

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
    if (!user) return;

    let removeUserIndex = this.users.findIndex(i => {
      return i.user.socketId === user.user.socketId;
    });

    this.users.splice(removeUserIndex, 1);
  }

  disconnectUser(user) {
    if (!user) return;

    let removeUserIndex = this.users.findIndex(i => {
      return i.id === user.googleId;
    });
    this.users.splice(removeUserIndex, 1);
  }

  getAllUsersInRoom() {
    return this.users;
  }

  addMessage(name, message) {
    if (!name) return;

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
