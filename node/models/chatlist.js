const mongoose = require('mongoose');

const chatlistschema= new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId, 
        required:true,
        
    },
    friendlist: {
        type: [mongoose.Schema.Types.ObjectId], // Array of strings (friend IDs)
        default: [], // Initialize as an empty array
        
    }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const chatlist = mongoose.model('chatlist', chatlistschema);

module.exports = chatlist;
