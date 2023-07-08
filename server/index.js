// var express = require('express');
// var app = express();
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });
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

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});