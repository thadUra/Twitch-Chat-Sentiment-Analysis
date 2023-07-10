const tmi = require('tmi.js');

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
});

client.connect()
.then((data) => {
  client.join("hiko")
  .then((data) => {
    console.log(`connected to ${data} successfully`);
  }).catch((err) => {
    console.log(`failed to connected to channel with error: ${err}`);
});

}).catch((err) => {
  console.log(`failed to connect to server with error: ${err}`);
});

client.on("unhost", (channel, viewers) => {
  console.log(`streamer ended livestream`);
});

msgCount = 0;

client.on('message', (channel, tags, message, self) => {
  console.log(`${msgCount++} ==> ${tags['display-name']}: ${message}`);
});

client.on('disconnected', (reason) => {
  console.log(`disconnected because of ${reason}`);
});