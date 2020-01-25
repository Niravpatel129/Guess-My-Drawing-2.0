const { roomData } = require("./roomData");

class AllRoomsGenerator {
  constructor() {
    this.rooms = [];
  }

  newRoom(roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (!find) {
      this.rooms.push(new roomData(roomName));
      const findAgain = this.rooms.find(i => i.roomId === roomName);

      findAgain.addMessage(
        "new user",
        "Room Created..... Waiting for players ⏰"
      );
    }
  }

  findUserAndAddToRoom(roomName, { googleUserInfo, socketId }) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) return find.addUser({ googleUserInfo, socketId: socketId.id });
  }

  findAllUsersForRoom(roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) return find.getAllUsersInRoom();
  }

  findAllRooms() {
    return this.rooms;
  }

  pushMessage(name, roomName, input) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (input === "/start") {
      this.startGameForRoom(roomName);
    }
    if (input === "/stop") {
      find.stopGame();
    }
    if (input === "/time") {
      this.getTimeForRoom(roomName);
    }

    if (find) find.addMessage(name, input);
  }

  guessedCorrect(user, roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) return find.guessedCorrect(user);
  }

  getAllMessages(roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) return find.getAllMessages();
  }

  gameStart(roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) this.startGameForRoom(roomName);
  }

  getTimeForRoom(roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) return find.getTimer();
  }

  startGameForRoom(roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) return find.startGame();
  }

  resetRooms() {
    this.rooms = [];
  }

  removeUser(socketId) {
    this.clearEmptyRooms();
    for (let room of this.rooms) {
      const user = room.users.find(i => i.user.socketId === socketId);
      if (user) room.removeUser(user);
    }
  }

  disconnectUser(user) {
    this.clearEmptyRooms();

    if (user && user.googleId) {
      for (let room of this.rooms) {
        const find = room.users.find(i => user.googleId === i.id);
        if (find) room.disconnectUser(user);
      }
    }
  }

  clearEmptyRooms() {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].users.length === 0) {
        console.log("Empty room");
        this.rooms.splice(i, 1);
      }
    }
  }
}

module.exports = { AllRoomsGenerator };
