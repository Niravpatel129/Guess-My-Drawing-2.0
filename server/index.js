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
  console.log("user connect!");

  socket.on("drawingData", data => {
    console.log("emit");
    socket.broadcast.emit("updateData", data);
  });
});
