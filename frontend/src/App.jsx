import { Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

const App = () => {

  //connecting to the web socket server : if backencd and frotnend are on the same server then no need to mention url
  //if backend and frontend are on different servers then mention the url of the backend server

  //useMemo is used to create a new instance of the socket only when the component is mounted for the first time and not when the component is re-rendered it also re renders when the dependencies change given in the second argument
  //if we don't use useMemo then a new instance of the socket will be created every time the component is re-rendered

  //withCredentials: true is used to send the cookies along with the request for authentication
  const socket = useMemo(() => io('http://localhost:3000' , {
    withCredentials: true,
  }), [])

  const [msg, setMsg] = useState({ message: '', to: '' });
  const [allMessages, setAllMessages] = useState([]);
  const [socketId, setSocketId] = useState(socket.id);


  const changeHandler = (e) => {
    // console.log(e.target.value);
    setMsg((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    })
  }

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit('send-message', msg);
    setMsg({ message: '', to: '' })
  }

  const [room , setRoom] = useState('');

  const createRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room', room);
    setRoom('');
  }

  useEffect(() => {

    socket.on('connect', () => {

      setSocketId(socket.id);

      socket.on('user-message', (data) => {
        console.log(data);
      })

      socket.on('welcome-message', (data) => {
        console.log(data);
      })

      socket.on('chat-msg', (data) => {
        // console.log(data);
        setAllMessages((prev) => {
          return [...prev, data];
        })
      })

    })

    return () => {
      socket.disconnect()
    }

  }, [])


  return (
    <>
      <div>

        <h1>Web Socket Tutorial</h1>

        <h2>Socket ID: {socketId}</h2>

        <form>

          <Typography variant="h6">Enter your message</Typography>
          <input type="text" onChange={changeHandler} name="message" value={msg.message}/>

          <Typography variant="h6">To</Typography>
          <input type="text" name="to" onChange={changeHandler} value={msg.to} />


          <button type="button" onClick={submitHandler}>Send Message</button>

        </form>

        <form>

          <Typography variant="h6">Create Room</Typography>

          <input type="text" name="room" value={room} onChange={(e)=>{
            setRoom(e.target.value);
          }} placeholder='Room Name'/>
          
          <button type="button" onClick={createRoomHandler}>Join Room</button>
        
        </form>

        <div>
          <h2>Messages</h2>
          <ul>
            {
              allMessages.map((msg, index) => {
                return <li key={index}>{msg}</li>
              })
            }
          </ul>
        </div>

      </div>
    </>
  )
}

export default App