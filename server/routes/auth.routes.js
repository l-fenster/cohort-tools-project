const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();
const isAuthenticated = require("../middleware/jwt");

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Provide an email and a password" });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address" });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });

    return;
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists." });
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPass = await bcrypt.hash(password, salt);

  await User.create({
    email,
    password: hashedPass,
    name: name,
  }).then((usr) => res.status(201).json({ email: usr.email, id: usr._id }));
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please provide both email and password" });
    return;
  }

  // If the user is already in database
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    res.status;
    (400).json({ message: "User not found" });
    return;
  }
  const correctPassword = await bcrypt.compare(password, foundUser.password);

  if (!correctPassword) {
    res.status(400).json({ message: "Incorrect password" });
    return;
  }

  const payload = {
    id: foundUser._id,
    email: foundUser.email,
    name: foundUser.name,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY);
  res.send({ authToken: token });
});

//verify
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
