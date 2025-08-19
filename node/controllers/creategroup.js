const groups = require("../models/groups");
exports.creategroup = (req, res) => {
  try {
    console.log("api call for creating group");
    const { userid, groupName } = req.body;
    console.log(userid, groupName);
    const newgroup = new groups({
      admin: userid,
      groupname: groupName,
    });

    newgroup.save();
  } catch (error) {
    console.log("error in creating group", error);
  }
};
