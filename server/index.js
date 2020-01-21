const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const router = require("./router");

const PORT = process.env.PORT || 5000;

// setup
const { AllRoomsGenerator } = require("./utils/AllRoomsGenerator");

const AllRooms = new AllRoomsGenerator();

let globalSocket;

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

app.use(router);

io.on("connection", socket => {
  globalSocket = socket;
  console.log("connected");

  // join room
  socket.on("join", ({ name, room, googleUserInfo }, callback) => {
    if (!googleUserInfo) {
      callback("You need to login first, GUEST MODE IS NOT ENABLED YET!");
    } else {
      let error = false;
      const messages = AllRooms.getAllMessages(room);
      AllRooms.newRoom(room); // make a new room
      // find room and add user
      const isNewUser = AllRooms.findUserAndAddToRoom(room, {
        googleUserInfo,
        socketId: socket
      });

      console.log("socketId is already in a room!");

      if (!googleUserInfo) {
        callback("You need to login first, GUEST MODE IS NOT ENABLED YET!");
      }

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

  // socket on get userlist
  socket.on("getUserList", room => {
    console.log("hii");
    io.in(room).emit("getAllUsers", AllRooms.findAllUsersForRoom(room));
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
  });

  // disconnect room
  socket.on("disconnect", user => {
    console.log("user disconnect");

    socket.broadcast.emit("checkUserListAgain");

    AllRooms.removeUser(socket.id);
  });

  // force disconnect user
  socket.on("disconnectUser", user => {
    console.log("user disconnect");
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
}, 1000);
