const { roomData } = require("./roomData");

class Rooms {
  constructor() {
    this.rooms = [];
  }

  newRoom(roomName) {
    if (this.rooms.indexOf(roomName) === -1) {
      this.rooms.push(roomName);
    }
  }

  pushMessage(roomName) {
    const index = this.rooms.find(i => i.roomName === roomName);
    console.log(index);
  }

  resetRooms() {
    this.rooms = [];
  }
}

module.exports = { Rooms };
