var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

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
  console.log("connected");

  // join room
  socket.on("join", ({ name, room, googleUserInfo }, callback) => {
    let error = false;
    const messages = AllRooms.getAllMessages(room);
    AllRooms.newRoom(room); // make a new room
    // find room and add user
    AllRooms.findUserAndAddToRoom(room, { googleUserInfo, socketId: socket });

    // get all rooms
    socket.join(room);
    io.in(room).emit("updateMessage", messages);

    if (error) {
      callback();
    }
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
  socket.on("disconnect", () => {
    console.log("user disconnect");
    AllRooms.removeUser(socket.id);
  });

  // drawing data
  socket.on("drawingData", ({ data, room }) => {
    socket.to(room).emit("updateData", data);
  });
});
