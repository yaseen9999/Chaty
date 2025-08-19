const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId },
    groupname: { type: String },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    messages: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("groups", groupSchema);
