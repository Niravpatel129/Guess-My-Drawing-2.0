var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

//
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

//
var users = new Users();

const router = require("./router");

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

app.use(router);

io.on("connection", socket => {
  // join room
  socket.on("join", ({ name, room }, callback) => {
    let error = false;
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
