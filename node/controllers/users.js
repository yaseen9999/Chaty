const mongoose = require('mongoose');
const chatlist = require('../models/chatlist');

exports.getusers = async (req, res) => {
    console.log('API call for getting users');
    const { id } = req.params;
    console.log(id);

    try {
        // Convert the id to an ObjectId
        const objectId =new  mongoose.Types.ObjectId(id);

        const pipeline = [
            {
                $match: { userid: objectId }, // Match document by ObjectId
            },
            {
                $unwind: "$friendlist" // Deconstruct the `friendlist` array field
            },
            {
                $lookup: {
                    from: 'userprofiles',
                    localField: 'friendlist', // Field from the chatlists collection
                    foreignField: '_id', // Field from the userdetails collection
                    as: 'userDetails' // Output field name
                }
            },
            {
                $unwind: "$userDetails" // Deconstruct the `userDetails` array field
            },
          {  $group:{
                _id: "$userid",
               
                userDetails: { $push: "$userDetails" } // Aggregate `userDetails` into an array
            }
        },{
            $project: {
                _id: 1,
                friendlist: 1,
                userDetails: 1 // Include `userDetails` in the final output
            }
        }
           
        ];

        const response = await chatlist.aggregate(pipeline).exec();
        res.status(200).json(response);
        console.log(response);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
