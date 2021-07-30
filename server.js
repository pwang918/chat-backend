const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = process.env.port || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", routes);
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, console.log(`Server is running on the port: ${port}`));
