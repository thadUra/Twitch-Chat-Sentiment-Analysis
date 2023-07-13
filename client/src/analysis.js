import { useEffect, useState } from 'react'
import 'socket.io-client'

function Analysis ( {
    isActive,
    streamer,
    socket,
    goBack
  }) {

    const [ chat, setChat ] = useState([]);
    const [ msg, setMsg ] = useState('');

    const [ count, setCount ] = useState(0);
    

    useEffect(() => {
      socket.on("new_msg", (data) => {
        setMsg(data.msg);
        const newChat = chat.concat({ msg, id:data.count });
        setChat(newChat);
        setCount(count+1);
        console.log(chat);
      });
    }, [socket, chat, count, msg]); 

  
    return (
      <div>
        {isActive ? (
          <div>
            <h1>MSGS BELOW</h1>
            <p>{socket.id}</p>
            <button onClick={goBack}>Go Back!</button>
            <p>msgs found: {count}</p>
            <ul>{chat.map((item) => <li key={item.id}>{item.msg}</li>)}</ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
}

export default Analysis;