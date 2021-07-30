const express = require("express");
const User = require("../models").User;
const router = express.Router();

router.post("/join", (req, res) => {
  if (!req.body?.username || !req.body?.roomname) {
    res.status(400).end();
  }

  User.findOrCreate({ where: { username: req.body.username } })
    .then(([user, created]) => {
      res.json({ user });
    })
    .catch((error) => {
      res.status(500).end(error);
    });
});

module.exports = router;
