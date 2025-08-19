const groups = require("../models/groups");
exports.joingroup = async (req, res) => {
  try {
    console.log("api call for joining group");
    const { userid, groupName } = req.body;
    console.log(userid, groupName);
    const group = await groups.findOne({ groupname: groupName });
    console.log(group);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.members.includes(userid)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this group" });
    }
    group.members.push(userid);
    await group.save();
    console.log("User added to group:", group);
    res.status(200).json(group);
  } catch (error) {
    console.log("error in creating group", error);
  }
};
