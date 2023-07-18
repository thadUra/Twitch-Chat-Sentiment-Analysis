/* Init dependencies */
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router.js");
const http = require("http");
const { Server } = require("socket.io");
const tmi = require('tmi.js');

/* Sentiment Analysis APIs */
const google = require('./sentiment/googleAnalyze.js');
const amzn = require('./sentiment/amznAnalyze.js');

/* Init app and server */
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(router);
server.listen(3100, () => console.log(`Server is running on port 3001.`));
const io = new Server(server);

/* Web Socket Functionality */
io.on("connection", (socket) => {

  /* Create new tmi.js client for twitch connection */
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
    
    /* Initialize a message count and sentiment levels */
    var MESSAGE_MAX = 101;
    var msgCount = 0;
    var sentiment = 50;

    /**
     *  RECEIVE: Message
     *  @usage Grab twitch chat message and send it to sentiment APIs
     */
    client.on("message", (_channel, tags, message, _self) => {
      
      /* Only analyze max amount of messages OR if user is not a bot */
      if( msgCount <= MESSAGE_MAX && !tags['display-name'].includes("bot") ) {

        /* Prevent race conditions on message count */
        let tempCount = msgCount;
        msgCount += 1; 

        /* Perform analysis on message */
        (async () => {
          let gglAnalysis = await google.sentiment(message);
          /* let amznAnalysis = await amzn.sentiment(message); NOT IMPLEMENTED YET */

          /* Continue if not error from sentiment APIs */
          if( gglAnalysis !== -1 ) {
            /* Calculation for sentiment here */
            let raw = Math.round(gglAnalysis.score * 10);
            let mag = raw * Math.round(gglAnalysis.magnitude * 100) / 100;
            let x = (Math.abs(sentiment - 50));
            let multiplier = 0.5 * ((-0.03 * x) - (0.74 * Math.log10((10*x) + 25)) + 3.5);
            let change = multiplier * mag;
            sentiment = sentiment + change;

            /* Create object to emit for frontend */
            var data = {
              count: tempCount,
              user: tags['display-name'],
              color: tags['color'],
              msg: message,
              sentiment: sentiment,
              raw: gglAnalysis.score
            }
            socket.emit("new_msg", data);
          }
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

    /* If messages reach limit, disconnect from client  */
    if( msgCount > MESSAGE_MAX) {
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