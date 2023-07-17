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

/* Web Socket Functionality */
io.on("connection", (socket) => {

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
    

    var msgCount = 0;
    var sentiment = 50;

    /**
     *  RECEIVE: Message
     *  @usage Grab twitch chat message and send it to sentiment APIs
     */
    client.on("message", (_channel, tags, message, _self) => {
      // Only 100 messages
      if( msgCount <= 100 ) {
        let tempCount = msgCount; // to prevent concurrent calls
        msgCount += 1; 
        (async () => {
          let ret = await google.sentiment(message);

          // Calculation for sentiment here
          let raw = Math.round(ret.score * 10);
          let mag = raw * Math.round(ret.magnitude * 100) / 100;
          let x = (Math.abs(sentiment - 50));
          // let multiplier = (-0.74 * Math.log10( (10 * (Math.abs(sentiment - 50))) + 10 )) + 2;
          // let newMultiplier = (-0.03 * (Math.abs(sentiment - 50))) + 1.5;
          let multiplier = 0.5 * ((-0.03 * x) - (0.74 * Math.log10((10*x) + 25)) + 3.5);
          let change = multiplier * mag;
          // console.log(`mag: ${mag}, mul: ${multiplier}, change: ${change}`);
          sentiment = sentiment + change;
          console.log(`score: ${ret.score} => msg: ${message}`);
          // console.log(`raw: ${raw} -> mag: ${mag} -> mul: ${multiplier} -> chng: ${change} -> sent: ${sentiment}`);


          var data = {
            count: tempCount,
            user: tags['display-name'],
            color: tags['color'],
            msg: message,
            sentiment: sentiment,
            raw: ret.score
          }
          socket.emit("new_msg", data);
        })()
      }
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

    if( msgCount >= 100) {
      client.disconnect();
      console.log("Disconnected due to completing analysis");
    }

  });

  /**
   *  RECEIVE: Disconnect
   *  @usage Detects client disconnection to close client
   */
  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected: ${reason}`);
    client.disconnect().then(() => {
      console.log(`Twitch client disconnected`);
    }).catch( (err) => {
      console.log(`Failed to disconnect from twitch client: ${err}`);
    });
    msgCount = 0;
  });

});