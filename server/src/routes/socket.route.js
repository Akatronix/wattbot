const express = require("express");
const {
  createSocket,
  getSockets,
  updateSocket,
  deleteSocket,
  updateSocketHardware,
} = require("../controllers/socket.controller");
const verifyToken = require("../middlewares/VerifyToken");
const verifyUser = require("../middlewares/VerifyUser");

const router = express.Router();

// Create a new socket

router.post("/create", verifyToken, verifyUser, createSocket);
router.get("/getData", verifyToken, verifyUser, getSockets);
router.put("/:id", verifyToken, verifyUser, updateSocket);
router.put("/hardware/:id", updateSocketHardware);
router.delete("/:id", verifyToken, verifyUser, deleteSocket);

module.exports = router;
