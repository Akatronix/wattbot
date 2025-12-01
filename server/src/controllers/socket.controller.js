const Socket = require("../models/Socket.model");
const mongoose = require("mongoose");

async function createSocket(req, res) {
  try {
    const { name, location, type } = req.body;
    if (!name || !location || !type) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newSocket = await Socket.create({
      name,
      location,
      type,
      userID: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Socket created successfully",
      socket: newSocket,
    });
  } catch (error) {
    console.error("Error creating socket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getSockets(req, res) {
  try {
    const sockets = await Socket.find({ userID: req.user.id }).select(
      "-userID"
    );
    res.status(200).json({ success: true, data: sockets });
  } catch (error) {
    console.error("Error fetching sockets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function updateSocket(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedSocket = await Socket.findOneAndUpdate(
      { _id: id, userID: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!updatedSocket) {
      return res
        .status(404)
        .json({ success: false, message: "Socket not found" });
    }
    res.status(200).json({
      success: true,
      message: "Socket updated successfully",
    });
  } catch (error) {
    console.error("Error updating socket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function deleteSocket(req, res) {
  console.log("first");

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid socket ID format",
      });
    }

    const deletedSocket = await Socket.findOneAndDelete({
      _id: id,
      userID: req.user.id,
    });

    if (!deletedSocket) {
      return res.status(404).json({
        success: false,
        message: "Socket not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Socket deleted successfully",
      data: deletedSocket,
    });
  } catch (error) {
    console.error("Error deleting socket:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// hardware update function can be added here
async function updateSocketHardware(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedSocket = await Socket.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedSocket) {
      return res
        .status(404)
        .json({ success: false, message: "Socket not found" });
    }
    res.status(200).json({
      success: true,
      message: "Socket updated successfully",
      data: updatedSocket,
    });
  } catch (error) {
    console.error("Error updating socket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = {
  createSocket,
  getSockets,
  updateSocket,
  deleteSocket,
  updateSocketHardware,
};
