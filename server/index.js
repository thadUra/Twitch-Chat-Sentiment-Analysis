//https://devsdash.com/tutorials/twitch-api-javascript
//https://www.youtube.com/watch?v=djMy4QsPWiI&t=1719s
// const dotenv = require("dotenv").config();
// const test = process.env.CLIENT_ID;
// console.log(test);



const tmi = require('tmi.js');
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
});



/* Init dependencies */
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

/* Init app and server */
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/* Socket Functions*/
io.on("connection", (socket) => {

  console.log(`User connected: ${socket.id}`);

  socket.on("analyze", (data) => {
    // const sentiment = {message: `received msg from ${socket.id}`};
    console.log(`got: ${data.streamer}`);
    // socket.broadcast.emit("receive_sentiment", sentiment);

    client.connect()
      .then( () => {
        client.join(data.streamer)
          .then( (data) => {
            console.log(`connected to ${data} successfully`);
          })
          .catch( (err) => {
            console.log(`failed to connect to channel: ${err}`);
          }) 
      })
      .catch( (err) => {
        console.log(`server failed to connect: ${err}`);
      });

    msgCount = 0;

    client.on('message', (channel, tags, message, self) => {
      console.log(`${msgCount++} ==> ${tags['display-name']}: ${message}`);
      const send = {id: msgCount, text: message};
      socket.emit("new_msg", send);
    });

    client.on('disconnected', (reason) => {
      console.log(`disconnected from server: ${reason}`);
    });

    client.on("unhost", (channel, viewers) => {
      console.log(`streamer ended livestream`);
    });


  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} closed`);
  });


});

/* Listen to front end */
server.listen(3001, () => {
  console.log(`Server is running on port 3001.`);
});