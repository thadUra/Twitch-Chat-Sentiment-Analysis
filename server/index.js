// const tmi = require('tmi.js');

// const client = new tmi.Client({
//   connection: {
//     secure: true,
//     reconnect: true
//   },
//   channels: [ 'tarik' ]
// });

// client.connect();

// msgCount = 0;

// client.on('message', (channel, tags, message, self) => {
//   console.log(`${msgCount++} ==> ${tags['display-name']}: ${message}`);
// });



const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// HTTP Stuff for Socket
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    const sentiment = {message: `received msg from ${socket.id}`};
    socket.broadcast.emit("receive_sentiment", sentiment);
  });

});

server.listen(3001, () => {
  console.log(`Server is running on port 3001.`);
});