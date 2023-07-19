// NOT COMPLETED YET

const dotenv = require("dotenv").config();

// Importing https module
const http = require('http');

const options = {
    host: process.env.AMAZON_API,
    path: '/test/helloworld?name=John&city=Seattle',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'day': 'Thursday'
    },
};

  
// Sending the request
const req = http.request(options, (res) => {
    let data = ''
     
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    // Ending the response 
    res.on('end', () => {
        console.log('Body:', JSON.parse(data))
    });
       
}).on("error", (err) => {
    console.log("Error: ", err)
}).end()