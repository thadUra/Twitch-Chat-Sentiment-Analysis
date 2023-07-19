# Twitch Chat Sentiment Analysis Stack

This project serves to aid both live Twitch streamers and viewers by analyzing one of the most dynamic components of Twitch streams: the live chat. Performing a sentiment analysis provides two benefits:

1. It can gauge how family friendly / positive and negative a community can be. 
2. It can provide the streamer a live feedback of how the viewers feel about their content.

This repository contains both the frontend (client) and backend (server) for a web application with the goal of performing sentiment analysis on a live Twitch chat and learning various frameworks and libraries for javascript and full stack development. 

#### Various Technologies and Libraries
1. React (Material UI)
2. Node.js (tmi.js)
3. Express
4. Socket.io (for Web Socket)
5. APIs (Google Cloud Natural Language, Twitch)

#### Full Stack Architecture

![Full Stack Architecture](https://raw.githubusercontent.com/thadUra/Twitch-Chat-Sentiment-Analysis/main/img/Architecture.jpq)

##### Frontend

The frontend contains the main React App component with three child components: Landing, Connection, and Analysis. Each component is only rendered once at a time as a method to switch between pages and processes.

The landing component takes user input on what Twitch streamer's chat they would like to analyze. It performs input validation through the Twitch API to check for two different scenarios: if the user exists on Twitch or if the user is not currently live streaming.

![Landing Component Demo](https://raw.githubusercontent.com/thadUra/Twitch-Chat-Sentiment-Analysis/main/img/LandingDemo.gif)

The connection component contains a loading screen while it attempts to establish a web socket connection with the backend. Many of the challenges of implementing this component was keeping track of web sockets per user, disconnecting at random, failing to connect, and closing websockets on disconnect.

The analysis component contains three main sections: the Twitch stream, the live chat, and a sentiment gauge. The sentiment for each message is highlighted via green for positive, orange for neutral, and red for negative. The purple vertical progress bar indicates how many messages it will analyze, which is 150 messages. This is due to Google Cloud API restrictions. The sentiment gauge provides a numerical value and visual for the current sentiment of the chat.

![Landing Component Demo](https://raw.githubusercontent.com/thadUra/Twitch-Chat-Sentiment-Analysis/main/img/AnalysisDemo.gif)


##### Backend

The backend contains the bulk of all API and web socket traffic to take the computational load off of the frontend. After a web socket connection is initiated and established by the frontend, the backend will then connect to the Twitch chat client via the tmi.js library. Event handlers are utilized to perform any necessary operations whenever a chat message is received by the Twitch chat client. The main operation consists of taking that message, preprocessing it (scraping Twitch message object and filtering bot messages), and sending it to the Sentiment API on Google Cloud. Once that sentiment analysis is provided, it emits a message to the web socket to display on the frontend. 


##### Limitations

There exist a couple limitations with this project. First, this web application was not fully deployed. An attempt was made to host the full stack on Netlify (frontend) and Amazon AWS EC2 (backend). However, an SSL certificate was needed to allow the frontend to make HTTPS requests to the backend. Hosting the backend and running the frontend on localhost was as far as I could go in terms of deploying. Second, current language processing APIs such as Google Cloud's Natural Language API or even AWS Comphrened API lack or cannot fully comprehend slang, especially slang utilized on Twitch. Emotes, slang, and other sayings make the sentiment APIs quite unreliable at times.