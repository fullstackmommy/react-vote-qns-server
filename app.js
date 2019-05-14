const express = require("express");
const app = express();

const cors = require("cors");
const server = require("http").createServer(app);

const socket = require("socket.io");
const io = socket(server);
let numConnection = 0;
// testing for socketIO
app.set("socketio", io);
//const eventRoute = require("./routes/ioevents")(io, app);
//
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/api/v1/events", require("./routes/events"));

io.set("origins", "*:*");
io.on("connection", socket => {
  numConnection = numConnection + 1;
  console.log("connected ", socket.id);

  socket.on("newConnection", function() {
    io.sockets.emit("newConnection", numConnection);
  });

  socket.on("typing", function() {
    console.log("typing...");
    socket.broadcast.emit("typing", numConnection);
  });

  socket.on("addQuestion", function() {
    console.log("Receiving new question...");
    io.sockets.emit("addQuestion");
  });

  socket.on("addVote", function() {
    console.log("Adding vote... ");
    io.sockets.emit("addVote");
  });

  socket.on("disconnect", function() {
    console.log("disconnected ", numConnection);
    numConnection = numConnection - 1;
    socket.broadcast.emit("ConnectionCounter", numConnection);
  });
});

module.exports = server;
