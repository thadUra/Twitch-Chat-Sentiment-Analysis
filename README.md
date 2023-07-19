# Twitch Chat Sentiment Analysis Stack

This project serves to aid both live Twitch streamers and viewers by analyzing one of the most dynamic components of Twitch streams: the live chat. Performing a sentiment analysis provides two benefits:

1. It can gauge how family friendly / positive and negative a community can be. 
2. It can provide the streamer a live feedback of how the viewers feel about their content.

This repository contains both the frontend (client) and backend (server) for a web application with a goal of performing sentiment analysis on a live Twitch chat and learning various frameworks and libraries for javascript and full stack development. 

#### Various Technologies and Libraries
1. React (Material UI)
2. Node.js (tmi.js)
3. Express
4. Socket.io (for Web Socket)
5. APIs (Google Cloud Natural Language, Twitch)

#### Full Stack Architecture

![Full Stack Architecture](https://raw.githubusercontent.com/thadUra/Twitch-Chat-Sentiment-Analysis/main/img/Architecture.png)

##### Frontend

The frontend contains the main React App component with three child components: Landing, Connection, and Analysis. Each component is only rendered once at a time as a method to switch between pages and processes.

The landing component takes user input on what Twitch streamer's chat they would like to analyze. It performs input validation through the Twitch API to check for two different scenarios: if the user exists on Twitch or if the user is not currently live streaming.

![Landing Component Demo](https://raw.githubusercontent.com/thadUra/Twitch-Chat-Sentiment-Analysis/main/img/LandingDemo.gif)

The connection component

The analysis component

##### Backend

