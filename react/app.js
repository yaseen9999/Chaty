const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt =require('jsonwebtoken')
const connectDB = require('./config/mongoose.js');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const Chat=require('./models/messages.js');
const Conversation=require('./models/conversation.js');
const userprofile=require('./models/userprofile.js');
app.use(cors());
const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000", // React app's URL
      methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;
const  {login} =require("./controllers/login.js")
const { signup} =require("./controllers/signup.js")
const  {logout} =require("./controllers/logout.js")
const  {chats} =require("./controllers/chats.js")
const  {searchfrnd} =require("./controllers/searchfriend.js")
const  {chatlist} =require("./controllers/chatlist.js")
const  {getusers} =require("./controllers/users.js")
const  {getmessages} =require("./controllers/conversation.js")


connectDB();
app.use(bodyParser.urlencoded({ extended: true })); // Handle URL-encoded bodies
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello from the sNode.js backend!');
});
app.post('/login',login)
  app.post('/signup',signup)
  app.get('/logout',logout )
  app.get('/chats', chats)
  app.post('/findfriend', searchfrnd)
  app.post('/friendlist',chatlist )
  app.get('/users/:id',getusers )
  app.post('/conversation',getmessages )
  var users=[];
  const addusers=(userid,socketid)=>{
  console.log(userid,socketid)
  if(userid){
    if (!users.some((user) => user.userid === userid)) {
      users.push({ userid, socketid });
    } }
    users.forEach(element => {
      console.log(element)
    });
  
  }
  const removeuser=(socketid)=>{
    console.log(socketid)
    users = users.filter((user) => user.socketid !== socketid);
    return users;
    }
    const findsocketid=(id)=>{
      console.log(id)
      const socketid = users.find((user) => user.userid == id);
      return socketid;
      }
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('adduser', (userid) => {
     addusers(userid, socket.id);
     io.emit("getonlineusers",users);
    })
   
  socket.on('message', async ( data) => {
    const { userid, message, receiverid } = data;
    try {
      const newmessage=new Chat({
        userid,
        receiverid,
        message
      })
      newmessage.save();
      let conversation = await Conversation.findOne({
        participants: { $all: [userid, receiverid] }
      });
      console.log(conversation)
      if (!conversation) {
        // If no conversation exists, create a new one
        conversation = new Conversation({
          participants: [userid, receiverid],
          messages: [newmessage._id]
        });
      } else {

        conversation.messages.push(newmessage._id);
        
      }
      await conversation.save();
      
    } catch (error) {
      
    }
    console.log('sending message');
    console.log( userid,message,receiverid );
    const result1=findsocketid(receiverid );
    const result2= findsocketid(userid);

    console.log(result1);
    const recieversocketid=result1.socketid;
    const sendersocketid=result2.socketid;
    console.log(result1,result2)
  
    const userProfile = await userprofile.findOne({ _id: userid });
    console.log(userProfile)
    if (recieversocketid) {
      console.log('redirect')
      try {
        io.to(recieversocketid).emit('sendermessage', {
          userid:userProfile,
          message,
          createdAt: new Date().toISOString(),
        });
       
        console.log('Message emitted successfully');

      } catch (error) {
        console.error('Error emitting message:', error);
      }
    } else {
      console.log('Receiver not found');
    }
 if (sendersocketid) {
      try {
        io.to(sendersocketid).emit('sendermessage', {
          userid:userProfile,
          message,
          createdAt: new Date().toISOString(),
        });
        console.log('Message emitted to sender successfully');
      } catch (error) {
        console.error('Error emitting message to sender:', error);
      }
    } else {
      console.log('Sender socket ID not found');
    }
});
  socket.on('disconnect', () => {
    console.log('user disconnected');
    const user=removeuser(socket.id)
    console.log(user)
    io.emit("getusers",user);
});
  })
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
