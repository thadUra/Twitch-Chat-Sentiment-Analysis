const tmi = require('tmi.js');

const connectStream = (streamer) => {

  /* Get new client */
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
  });

  /* Connect to stream with client */
  client.connect().then(() => {
    client.join(streamer).then(() => {
      console.log(`Connected to streamer: ${streamer}`);
    }).catch((err) => {
      throw new Error(`Error connecting to ${streamer}: ${err}`);
    })
  }).catch((err) => {
    throw new Error(`Error connecting to ${streamer}: ${err}`);
  });

  return client;
};

exports.connectStream = connectStream;