//https://devsdash.com/tutorials/twitch-api-javascript
//https://www.youtube.com/watch?v=djMy4QsPWiI&t=1719s
// const dotenv = require("dotenv").config();
// const test = process.env.CLIENT_ID;
// console.log(test);


/* Init dependencies */
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const chat = require("./chat.js")
const google = require('./googleAnalyze.js')
const tmi = require('tmi.js');

/* Init app and server */
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
server.listen(3001, () => console.log(`Server is running on port 3001.`));
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

var client = null;

/* Web Socket Functionality */
io.on("connection", (socket) => {

  var msgCount = 0;
  console.log(`User ${socket.id} connected...`);
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
  });

  /**
   *  RECEIVE: Start
   *  @param streamer user to get live chat messages from
   *  @usage Initiates analysis of streamer
   */
  socket.on("start", (streamer) => {

    /* Connect to stream with client */
    client.connect().then(() => {
      client.join(streamer).then(() => {
        console.log(`Connected to streamer: ${streamer}`);
      }).catch((err) => {
        console.log(`Error connecting to ${streamer}: ${err}`);
      })
    }).catch((err) => {
      console.log(`Error connecting to ${streamer}: ${err}`);
    });

    /**
     *  RECEIVE: Message
     *  @usage Grab twitch chat message and send it to sentiment APIs
     */
    client.on("message", (_channel, tags, message, _self) => {
      // console.log(`${msgCount++} ==> ${tags['display-name']}: ${message}`);
      var data = {
        count: msgCount,
        msg: message
      }
      msgCount += 1;
      socket.emit("new_msg", data);
      google.sentiment(message);
      //amazon.sentiment(message);
      // data = {
      //   google: 
      //   amazon:
      //   combined:
      // }
      // socket.emit("new_sentiment", data);
    })

    /**
     *  RECEIVE: Disconnect
     * @usage Detects twitch disconnection to close client
     */
    client.on('disconnected', (reason) => {
      console.log(`Twitch Client disconnected: ${reason}`);
    });
    
    /**
     *  RECEIVE: Unhost
     * @usage Detects if stream ended to close client
     */
    client.on("unhost", (channel, _viewers) => {
      console.log(`${channel} ended the stream.`);
    });

  });

  /**
   *  RECEIVE: Disconnect
   *  @usage Detects client disconnection to close client
   */
  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected: ${reason}`);
    if( client.readyState() !== "CLOSED" || client.readyState() !== "CLOSING" ) client.disconnect();
    msgCount = 0;
  });

});