const mongoose = require("mongoose");

const socketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },

    voltage: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    power: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },

    switchStatus: { type: Boolean, default: false },
    userID: { type: String, required: true },
  },
  { timestamps: true }
);

const Socket = mongoose.model("Socket", socketSchema);
module.exports = Socket;
