const mongoose = require("mongoose");

const leadsSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Provide email address!"],
      unique: [true, "Email address already taken"],
    },
    role: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leads", leadsSchema);
