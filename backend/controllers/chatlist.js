const chatlist = require('../models/chatlist.js');
const UserProfile = require('../models/userprofile.js');

exports.chatlist = async (req, res) => {
    console.log('API call for updating friend list');
    const { friendid, userid } = req.body; // Ensure friendId and userId are sent in the request
    console.log(friendid, userid);

    try {
        // Update the friendlist or create a new document if it doesn't exist
        const result = await chatlist.findOneAndUpdate(
            { userid: userid }, // Match document by `userid`
            { $addToSet: { friendlist: friendid } }, // Add `friendid` to `friendlist` only if not already present
            { new: true, upsert: true } // Return the updated document and create it if it doesn't exist
        );

        if (!result) {
            return res.status(404).json({ message: "User not found or friend ID not updated" });
        }
        const user= await UserProfile.findOne({_id:friendid})
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating friend list:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
