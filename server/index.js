const express = require('express');
const http = require('http');
const cors = require('cors');

//simple http protocol is ues for the communication between the server and the client - in this when we send a request to the server the server will send the response to the client and the connection will be closed

// but websocket protocol is used for the real time communication between the server and the client - in this when we send a request to the server the server will send the response to the client and the connection will be kept open so that the server can send the data to the client whenever it wants to send the data to the client without the client sending the request to the server



//importing Server from  socket.io
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);

//creating a new instance of socket.io
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST' , 'PUT' , 'DELETE'],
        credentials: true
    }
})

// io refers to the whole server where as socket refers to the individual user
// io will contain all the sockets of the users connected to the server

//now using 'on' method to listen to the events that are fired by the users
//connection event is fired when a new user connects to the server
// 'disconnect' event is fired when a user disconnects from the server
//socket is the object that contains all the information about the user

// 'emit' method is used to send the data to the client
// 'on' method is used to listen to the data sent by the client
// 'broadcast' method is used to send the data to all the users except the user who sent the data
// 'to' method is used to send the data to a specific user
// 'join' method is used to join a user to a specific room
// 'leave' method is used to leave a user from a specific room



io.on('connection' , (socket)=>{

    console.log("User details --> " , socket);
    console.log('User connected' , socket.id);

    //now sending the welcome message to the user

    // socket.emit('event-name' , data) --> to send the data to the socket user and not to all the users
    socket.emit('message' , 'Welcome to the chat app');

    // socket.broadcast.emit('event-name' , data) --> to send the data to all the users except the user who sent the data 

    // io.emit('event-name' , data) --> to send the data to all the users
    io.emit('message' , 'A new user has joined the chat' + socket.id);

})

app.get('/' , (req , res)=>{
    res.send('Server is running and connected to the client');
})


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


server.listen(3000 , ()=>{
    console.log('Server is running on port 3000');
})