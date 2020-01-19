const { roomData } = require("./roomData");

class AllRoomsGenerator {
  constructor() {
    this.rooms = [];
  }

  newRoom(roomName) {
    if (this.rooms.indexOf(roomName) === -1) {
      this.rooms.push(new roomData(roomName));
    }
  }

  pushMessage(name, roomName, input) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) find.addMessage(name, input);
  }

  getAllMessages(roomName) {
    const find = this.rooms.find(i => i.roomId === roomName);
    if (find) return find.getAllMessages();
  }

  resetRooms() {
    this.rooms = [];
  }
}

module.exports = { AllRoomsGenerator };
