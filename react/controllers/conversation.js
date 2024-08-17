const Conversation = require('../models/conversation.js');
const mongoose =require('mongoose')
exports.getmessages = async (req, res) => {
    console.log('api call for conversation ')
    const{userid , receiverid} = req.body;
    const id=new mongoose.Types.ObjectId(userid);
    const rid=new mongoose.Types.ObjectId( receiverid);
    console.log(id , rid)
    let conversation = await Conversation.findOne({
        participants: { $all: [id, rid] }
      }) 
    .populate({
        path: 'messages',
        populate: {
            path: 'userid', // Correct path for user profile within each message
            model: 'userprofile',
            select: 'firstName  profilePicture '
        }
    });

      console.log(conversation)
      res.status(200).json({conversation});
      
}