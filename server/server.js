const express = require("express");
const cors = require("cors");
require("dotenv").config();
const SocketRoutes = require("./src/routes/socket.route");
const authRoutes = require("./src/routes/auth/auth.route");
const userRoutes = require("./src/routes/auth/user.route");
const connectDB = require("./src/connection/DBconnection");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api/sockets", SocketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
