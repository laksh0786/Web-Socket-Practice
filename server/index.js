const express = require('express');
const http = require('http');
const cors = require('cors');

//simple http protocol is ues for the communication between the server and the client - in this when we send a request to the server the server will send the response to the client and the connection will be closed

// but websocket protocol is used for the real time communication between the server and the client - in this when we send a request to the server the server will send the response to the client and the connection will be kept open so that the server can send the data to the client whenever it wants to send the data to the client without the client sending the request to the server



//importing Server from  socket.io
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

//creating a new instance of socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
})

app.use(cors({
    origin: 'http://localhost:5173',  // Replace with your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    credentials: true                 // If you are using cookies or authentication
}));

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


//we can also use io middleware to authenticate the user before connecting to the server

// io.use((socket, next) => {

    //In this middleware we can check the user details and then allow the user to connect to the server
    
    // We can allow the user to connect to the server by calling the next() method
    //next();

    // If we don't want to allow the user to connect to the server then we can call the next() method with an error message
    // next(new Error('User not allowed to connect to the server'));

// })


io.on('connection', (socket) => {

    // console.log("User details --> ", socket);
    console.log('User connected', socket.id);

    //now sending the welcome message to the user

    // socket.emit('event-name' , data) --> to send the data to the socket user and not to all the users
    socket.emit('user-message', 'Welcome to the chat app');

    // socket.broadcast.emit('event-name' , data) --> to send the data to all the users except the user who sent the data 
    socket.broadcast.emit('user-message', 'A new user has joined the chat' + socket.id);

    // io.emit('event-name' , data) --> to send the data to all the users
    // io.emit('welcome-message', 'A new user has joined the chat' + socket.id);
    

    socket.on('send-message' , (data)=>{
        console.log(data);
        if(data.to){

            //both socket.to and io.to will send the data to the specific user
            // io.to(data.to).emit('user-message', data.message);
            socket.to(data.to).emit('chat-msg', data.message);
        }
        else{
            io.emit('chat-msg' , data.message); //sending the data to all the users
            //socket.broadcast.emit('user-message', data.message); //sending the data to all the users except the user who sent the data
        }
    })

    socket.on('join-room', (room)=>{
        socket.join(room);
        console.log('User joined room', room);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });

})

app.get('/', (req, res) => {
    res.send('Server is running and connected to the client');
})


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


server.listen(3000, () => {
    console.log('Server is running on port 3000');
})