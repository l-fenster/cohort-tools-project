const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.get("/:id", (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) =>
      res.status(200).json({ email: user.email, name: user.name, id: user._id })
    )
    .catch((err) =>
      res.status(500).json({ message: `Internal error: ${err}` })
    );
});

module.exports = router;
