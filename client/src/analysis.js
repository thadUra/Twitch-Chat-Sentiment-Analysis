import { useEffect, useState } from 'react'
import 'socket.io-client'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Fab from '@mui/material/Fab';
import LinearProgress from '@mui/material/LinearProgress';

function Analysis ( {
    isActive,
    streamer,
    socket,
    goBack
  }) {

    const [ chat, setChat ] = useState([]);
    const [ msg, setMsg ] = useState('');
    const [ count, setCount ] = useState(0);
    const [ twitch, setTwitch ] = useState(false);
    const [ sentiment, setSentiment ] = useState(50);

    if( isActive && !twitch ) {
      socket.emit("start", streamer);
      setTwitch(true);
    }

    useEffect(() => {

      socket.on("new_msg", (data) => {
        setMsg(data.msg);
        if( chat.length !== 0 ) {
          let newChat = chat.concat({ msg, id:data.count });
          setChat(newChat);
        }
        else {
          let newChat = [msg];
          setChat(newChat);
        }
        setCount(count+1);
      });

      socket.on("new_sentiment", (data) => {
        setSentiment(data.sentiment);
      })

    }, [socket, chat, count, msg]); 

    const backToLanding = () => {
      setTwitch(false);
      setChat([]);
      setCount(0);
      goBack();
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
              <Typography variant="h3">
                <Box sx={{ letterSpacing: 4, p: 2}}>{streamer.charAt(0).toUpperCase() + streamer.slice(1)}</Box>
              </Typography>
              <Box 
                sx={{ pb: 10 }}
                display="flex"
                flexDirection={{xs: "column",sm: "column", md: "row", lg: "row"}}
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  sx={{ letterSpacing: 4, p: 1.5, borderRadius: 2}}
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
                </Box>
                <Box
                  width={{ md: 300, sm: 200, xs: 150}}
                  height={{ md: 350, sm: 300, xs: 200}}
                  sx={{ letterSpacing: 4, p: 5, borderRadius: 2, borderTop: 12, borderColor: "#e6e6e6"}}
                  bgcolor="#0e0c13"
                >
                  Chat here
                </Box>
              </Box>
              <Box
                sx={{ p:3 }}
                width={{ md: 300, sm: 200, xs: 150}}
              >
                {Math.round(sentiment)}
                <LinearProgress  variant="determinate" value={sentiment} />
              </Box>
              <Fab 
                size="medium" 
                color="primary" 
                aria-label="add"
                onClick={backToLanding}
                ><KeyboardReturnIcon />
              </Fab>
            </Box>
            <h1>MSGS BELOW</h1>
            <p>{socket.id}</p>
            <button onClick={backToLanding}>Go Back!</button>
            <p>msgs found: {count}</p>
            <ul>{chat.map((item) => <li key={item.id}>{item.msg}</li>)}</ul>
          </ThemeProvider>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Analysis;