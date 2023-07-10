//https://devsdash.com/tutorials/twitch-api-javascript
//https://www.youtube.com/watch?v=djMy4QsPWiI&t=1719s
const dotenv = require("dotenv").config();
const test = process.env.CLIENT_ID;
console.log(test);

// const tmi = require('tmi.js');

// const client = new tmi.Client({
//   connection: {
//     secure: true,
//     reconnect: true,
//   },
// });

// client.connect()
// .then((data) => {
//   client.join("shanks_ttv")
//   .then((data) => {
//     console.log(`connected to ${data} successfully`);
//   }).catch((err) => {
//     console.log(`failed to connected to channel with error: ${err}`);
// });

// }).catch((err) => {
//   console.log(`failed to connect to server with error: ${err}`);
// });

// client.on("unhost", (channel, viewers) => {
//   console.log(`streamer ended livestream`);
// });

// msgCount = 0;

// client.on('message', (channel, tags, message, self) => {
//   console.log(`${msgCount++} ==> ${tags['display-name']}: ${message}`);
// });

// client.on('disconnected', (reason) => {
//   console.log(`disconnected because of ${reason}`);
// });










// const express = require("express");
// const cors = require("cors");
// const app = express();

// app.use(cors());
// app.use(express.json());

// // HTTP Stuff for Socket
// const http = require("http");
// const { Server } = require("socket.io");
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("send_message", (data) => {
//     const sentiment = {message: `received msg from ${socket.id}`};
//     socket.broadcast.emit("receive_sentiment", sentiment);
//   });

// });

// server.listen(3001, () => {
//   console.log(`Server is running on port 3001.`);
// });