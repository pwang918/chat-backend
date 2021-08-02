const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socket = require("socket.io");
const controllers = require("./controllers");

const app = express();
const port = process.env.port || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const server = app.listen(
  port,
  console.log(`Server is running on the port: ${port}`)
);

const io = socket(server);
// Socket connection
io.on("connection", (socket) => {
  socket.on("join", (data) =>
    controllers.UserController.join({ ...data, socket })
  );

  socket.on("chat", (message) =>
    controllers.UserController.sendChat({ socket, message })
  );
});
