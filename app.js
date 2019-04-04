const express = require("express");
const cors = require('cors')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let numConnection = 0
// testing for socketIO
app.set("socketio", io)
const eventRoute = require("./routes/ioevents")(io, app)
//
app.use(cors())
app.use(express.json());
app.use(express.static('public'))
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/api/v1/events", require("./routes/events"));

io.set('origins', '*:*');
io.on('connection', socket => {

    console.log('connected ', numConnection)
    numConnection = numConnection + 1;
    socket.emit('ConnectionCounter', numConnection)
    socket
        .broadcast
        .emit('ConnectionCounter', numConnection)

    socket.on('disconnect', function () {
        console.log('disconnected ', numConnection)
        numConnection = numConnection - 1;
        socket
            .broadcast
            .emit('ConnectionCounter', numConnection)
    });

    /*     console.log('User connected')
    socket.emit('FromAPI', 'test2')
    socket
        .broadcast
        .emit('FromAPI', 'test')
    socket.on('FromClient', (data) => {
        console.log('Received ', data)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    }) */
})

module.exports = server;
