const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cohorts = require("./models/cohorts.model");
const students = require("./models/students.model");
const PORT = 5005;

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to database: ${x.connections[0].name}`))
  .catch((err) => console.error(err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// const students = require("./data/students.json");
// const cohorts = require("./data/cohorts.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Student Routes
app.get("/api/students", (req, res) => {
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

app.get("/api/students/:id", (req, res) => {
  const { id } = req.params;
  students
    .findById(id)
    .populate("cohort")
    .then((student) => res.status(201).json(student))
    .catch((err) => res.status(500).json(err));
});

app.post("/api/students", (req, res) => {
  students
    .create(req.body)
    .then((student) => res.status(200).json(student))
    .catch((err) => res.status(500).json(err));
});

app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  students
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((student) => res.status(200).json(student))
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;
  students
    .findByIdAndDelete(id)
    .then(() => res.status(200).send(""))
    .catch((err) => res.status(500).json(err));
});

app.get("/api/students/cohort/:id", (req, res) => {
  const { id } = req.params;
  students
    .where({ cohort: id })
    .populate("cohort")
    .then((studs) => res.status(200).json(studs))
    .catch((err) => res.status(500).json(err));
});

// Cohort routes
app.get("/api/cohorts", (req, res) => {
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

app.post("/api/cohorts", (req, res) => {
  cohorts
    .create(req.body)
    .then((cohort) => res.status(201).json(cohort))
    .catch((err) => res.status(500).json(err));
});

app.put("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  cohorts
    .findByIdAndUpdate(id, req.body, { new: true })
    .then((cohort) => res.status(200).json(cohort))
    .catch((err) => res.status(500).json(err));
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  cohorts
    .findById(cohortId)
    .then((cohort) => res.status(201).json(cohort))
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  cohorts
    .findByIdAndDelete(cohortId)
    .then((cohort) => res.status(201).send())
    .catch((err) => res.status(500).json(err));
});

app.get("*", (req, res) => res.send("404 - Page not found"));

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
