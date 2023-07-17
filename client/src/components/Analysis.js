import { useEffect, useState } from 'react'
import { ThemeProvider, Box, Typography, Fab  } from '@mui/material'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Sentiment from './Sentiment.js'
import Progress from './Progress.js'
import theme from '../styles/theme.js'
import 'socket.io-client'

function Analysis ( {
    isActive,
    streamer,
    socket,
    goBack
  }) {

    const [ chat, setChat ] = useState([]);
    const [ msg, setMsg ] = useState([]);
    const [ count, setCount ] = useState(0);
    const [ twitch, setTwitch ] = useState(false);
    const [ sentiment, setSentiment ] = useState(50);

    if( isActive && !twitch ) {
      socket.emit("start", streamer);
      setTwitch(true);
    }

    useEffect(() => {

      socket.on("new_msg", (data) => {
        // Set chat messages
        setMsg([data.user, data.msg, data.color, data.raw]);
        let newChat = chat.concat({ msg, id:data.count });
        setChat(newChat);
        setCount(data.count);

        setSentiment(data.sentiment);

      });

    }, [socket, chat, count, msg]); 

    const backToLanding = () => {
      setTwitch(false);
      setChat([]);
      setCount(0);
      setSentiment(50);
      goBack();
    }

    const determineColor = (raw) => {
      if( raw < -0.25 ) return "rgba(255, 0, 0, 0.35)";
      else if( raw > 0.25 ) return "rgba(0, 255, 0, 0.35)";
      else return "rgba(255, 165, 0, 0.35)";
    }

    const embedLink = `https://player.twitch.tv/?channel=${streamer}&parent=localhost`;

    return (
      <div>
        {isActive ? (

          <ThemeProvider theme={theme}>
            <Box 
              minHeight="98vh"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography 
                variant="h3"
              >
                <Box 
                  sx={{ letterSpacing: 4, p: 2}}
                >{streamer.charAt(0).toUpperCase() + streamer.slice(1)}
                </Box>
              </Typography>
              <Box 
                sx={{ pb: 10 }}
                display="flex"
                flexDirection={{xs: "column",sm: "column", md: "row", lg: "row"}}
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  sx={{ letterSpacing: 2, p: 1.5, borderRadius: 2}}
                  padding={{xs: 1, sm: 1.5}}
                  margin={{md: 5, sm: 3, xs: 2}}
                  width={{ md: 380, sm: 285, xs: 184}}
                  height={{ md: 214, sm: 160, xs: 104}}
                  bgcolor="primary.main"
                  justifyContent="center"
                >
                  <iframe
                    src={embedLink}
                    height="100%"
                    width="100%"
                    title="Twitch"
                    style={{border: 0}}
                    allow="fullscreen">
                  </iframe>
                  <Box
                    sx={{ p:3 }}
                    width={{ md: 300, sm: 200, xs: 150}}
                  >
                    <Sentiment sentiment={sentiment}></Sentiment>
                    <Typography variant="h5">Sentiment: {Math.round(sentiment)}</Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                >
                  <Box
                    style={{overflowY: 'scroll'}}
                    width={{ md: 300, sm: 200, xs: 150}}
                    height={{ md: 350, sm: 300, xs: 200}}
                    sx={{ p: 1, borderRadius: 2, borderTop: 12, borderColor: "#e6e6e6"}}
                    bgcolor="#0e0c13"
                    display="flex"
                    flexDirection="column-reverse"
                  >
                    <ul
                      style={{listStyleType: "none", padding: 2, whiteSpace: "pre-wrap", overflowWrap: "break-word"}}
                    >
                      {chat.slice(-(chat.length-1)).map((item) => 
                        <li
                          style={{
                            textAlign: "left", 
                            color: "#fff", 
                            whiteSpace: "pre-wrap", 
                            padding: 2, 
                            margin: 4,
                            backgroundColor: `${determineColor(item.msg[3])}`,
                            borderRadius: 3,
                            fontSize: "1.7vh"
                          }}
                          key={item.id}
                          >
                            <font style={{color: `${item.msg[2]}` }}>{item.msg[0]}:</font> {item.msg[1]}
                        </li>
                      )}
                    </ul>
                  </Box>
                  <Box
                    sx={{ p:3 }}
                    height={{ md: 300, sm: 200, xs: 150}}
                  ><Progress count={count}></Progress>
                  </Box>
                </Box>
              </Box>
              <Fab 
                size="medium" 
                color="primary" 
                aria-label="add"
                onClick={backToLanding}
                ><KeyboardReturnIcon />
              </Fab>
            </Box>
          </ThemeProvider>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Analysis;