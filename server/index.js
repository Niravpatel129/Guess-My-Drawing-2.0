var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

const router = require("./router");

const PORT = process.env.PORT || 5000;

// setup
const { Rooms } = require("./utils/Rooms");

const AllRooms = new Rooms();

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

app.use(router);

io.on("connection", socket => {
  // join room
  socket.on("join", ({ name, room }, callback) => {
    let error = false;
    AllRooms.newRoom(room);
    socket.join(room);

    if (error) {
      callback();
    }
  });

  // disconnect room
  socket.on("disonnect", () => {
    console.log("user disconnect");
  });

  // drawing data
  socket.on("drawingData", ({ data, room }) => {
    socket.to(room).emit("updateData", data);
  });
});
