const mongoose = require("mongoose");

const userLeadSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
  totalSpentTime: {
    type: Number,
    default: 0,
  },
});

const chartSchema = new mongoose.Schema({
  leadId: { type: String },
  leadName: { type: String },
  lead: [userLeadSchema],
});

module.exports = mongoose.model("Chart", chartSchema);
