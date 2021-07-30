const express = require("express");
const userRoutes = require("./user");
const router = express.Router();

router.get("/", (req, res) => {
  res.end("API V1");
});
router.use("/users", userRoutes);

module.exports = router;
