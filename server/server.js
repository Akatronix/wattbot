const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const SocketRoutes = require("./src/routes/socket.route");
const authRoutes = require("./src/routes/auth/auth.route");
const userRoutes = require("./src/routes/auth/user.route");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// home route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// routes
app.use("/api/sockets", SocketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    app.listen(PORT, () => {
      console.log(`server started on port: ${PORT}`);
    });
  })
  .catch(() => {
    console.log("error connecting to database");
  });
