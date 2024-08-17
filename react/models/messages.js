const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'userprofile' },
  receiverid: { type: mongoose.Schema.Types.ObjectId},
  message: { type: String, required: true },
 
},{timestamps:true});

module.exports = mongoose.model('Chats', chatSchema);
