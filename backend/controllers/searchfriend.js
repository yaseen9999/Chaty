const UserProfile = require('../models/userprofile');
exports.searchfrnd=async (req,res)=>{
    console.log('api call for searching friend ')
    const {friendName}=req.body;
    console.log(friendName)
    const pipeline=[
        {
            $match:{
                firstName:friendName,
            }

        }
    ];
    const response=await UserProfile.aggregate(pipeline).exec();
    res.status(200).json(response);
    console.log(response);
}