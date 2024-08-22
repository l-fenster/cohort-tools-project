const router = require("express").Router();
const cohorts = require("../models/cohorts.model");
const mongoose = require("mongoose");

router.get("/cohorts", (req, res) => {
  cohorts
    .find()
    .then((cohort) => {
      res.status(201).json(cohort);
    })
    .catch((error) => {
      console.error("Error while retrieving cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

router.post("/cohorts", (req, res) => {
  cohorts
    .create(req.body)
    .then((cohort) => res.status(201).json(cohort))
    .catch((err) => res.status(500).json(err));
});

router.put("/cohorts/:id", (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  cohorts
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((cohort) => res.status(200).json(cohort))
    .catch((err) => res.status(500).json(err));
});

router.get("/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  if (!mongoose.isValidObjectId(cohortId)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  cohorts
    .findById(cohortId)
    .then((cohort) => res.status(201).json(cohort))
    .catch((err) => res.status(500).json(err));
});

router.delete("/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  if (!mongoose.isValidObjectId(cohortId)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  cohorts
    .findByIdAndDelete(cohortId)
    .then((cohort) => res.status(201).send())
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
