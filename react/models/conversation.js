const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userprofile' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chats' }],

},{timestamps:true});

module.exports = mongoose.model('Conversation', conversationSchema);
