const router = require("express").Router();

const students = require("../models/students.model");
const mongoose = require("mongoose");

router.get("/students", (req, res) => {
  students
    .find()
    .populate("cohort")
    .then((student) => {
      res.status(201).json(student);
    })
    .catch((error) => {
      console.error("Error while retrieving student ->", error);
      res.status(500).json({ error: "Failed to retrieve student" });
    });
});

router.get("/students/:id", (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  students
    .findById(id)
    .populate("cohort")
    .then((student) => res.status(201).json(student))
    .catch((err) => res.status(500).json(err));
});

router.post("/students", (req, res) => {
  students
    .create(req.body)
    .then((student) => res.status(200).json(student))
    .catch((err) => res.status(500).json(err));
});

router.put("/students/:id", (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  students
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((student) => res.status(200).json(student))
    .catch((err) => res.status(500).json(err));
});

router.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  students
    .findByIdAndDelete(id)
    .then(() => res.status(200).send(""))
    .catch((err) => res.status(500).json(err));
});

router.get("/students/cohort/:id", (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  students
    .find({ cohort: id })
    .populate("cohort")
    .then((studs) => res.status(200).json(studs))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
