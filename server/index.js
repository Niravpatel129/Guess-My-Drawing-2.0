var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

const router = require("./router");

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

app.use(router);

io.on("connection", socket => {
  // join room
  socket.on("joinRoom", room => {
    socket.join(room);
  });

  // drawing data
  socket.on("drawingData", ({ data, room }) => {
    socket.to(room).emit("updateData", data);
  });
});
