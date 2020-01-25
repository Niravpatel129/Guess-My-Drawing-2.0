const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const router = require("./router");

const PORT = process.env.PORT || 5000;

// setup
const { AllRoomsGenerator } = require("./utils/AllRoomsGenerator");

const AllRooms = new AllRoomsGenerator();

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

app.use(router);

io.on("connection", socket => {
  socket.emit("connected");

  // join room
  socket.on("join", ({ name, room, googleUserInfo }, callback) => {
    if (!googleUserInfo) {
      callback("You need to login first, GUEST MODE IS NOT ENABLED YET!");
    } else {
      socket.to(room).emit("newJoinNotification", name);

      let error = false;
      const messages = AllRooms.getAllMessages(room);
      AllRooms.newRoom(room); // make a new room
      // find room and add user
      AllRooms.findUserAndAddToRoom(room, {
        googleUserInfo,
        socketId: socket
      });

      if (error) {
        callback("Error!");
      }

      // get all rooms
      socket.join(room);
      io.in(room).emit("updateMessage", messages);

      // get all users in room
      io.in(room).emit("getAllUsers", AllRooms.findAllUsersForRoom(room));

      if (error) {
        callback();
      }
    }
  });

  // guessed correct
  socket.on("guessedCorrect", ({ user, room }) => {
    AllRooms.guessedCorrect(user, room);
  });

  // socket on get userlist
  socket.on("getUserList", room => {
    io.in(room).emit("getAllUsers", AllRooms.findAllUsersForRoom(room));
  });

  socket.on("gameStart", room => {
    io.of("/")
      .to(room)
      .emit("gameStart", room);

    AllRooms.gameStart(room);
  });

  // get all rooms
  socket.on("getAllRooms", () => {
    AllRooms.clearEmptyRooms();
    socket.emit("sendAllRooms", AllRooms.findAllRooms());
  });

  // get new chat message
  socket.on("chatMessage", ({ name, room, input }) => {
    AllRooms.pushMessage(name, room, input);
    const messages = AllRooms.getAllMessages(room);
    io.in(room).emit("updateMessage", messages);
    io.in(room).emit("getAllUsers", AllRooms.findAllUsersForRoom(room));
  });

  // disconnect room
  socket.on("disconnect", () => {
    console.log("connection disconnect");
    AllRooms.removeUser(socket.id);

    socket.broadcast.emit("checkUserListAgain");
  });

  // force disconnect user
  socket.on("disconnectUser", user => {
    console.log("frontend emitted user disconnect");
    socket.broadcast.emit("checkUserListAgain");
    AllRooms.disconnectUser(user);
  });

  // drawing data
  socket.on("drawingData", ({ data, room }) => {
    socket.to(room).emit("updateData", data);
  });
});

const timer = setInterval(() => {
  if (AllRooms.rooms.length !== 0) {
    io.of("/").emit("sendTime", AllRooms.rooms);
  }

  for (let room of AllRooms.rooms) {
    io.in(room.roomId).emit(
      "updateMessage",
      AllRooms.getAllMessages(room.roomId)
    );
    if (room.users.length <= 1 && room.gameData.gameStarted) {
      room.endGame();
    }

    if (!room.gameData.gameStarted) {
      io.of("/")
        .to(room.roomId)
        .emit("gameEnded");
    }

    if (room.gameData.roundEnded) {
      room.gameData.roundEnded = false;
      io.of("/")
        .to(room.roomId)
        .emit("roundEnded");
    }
  }
}, 1000);
