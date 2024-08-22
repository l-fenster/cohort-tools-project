const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const PORT = 5005;
const studentRoutes = require("./routes/student.routes");
const cohortRoutes = require("./routes/cohort.routes");

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
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.disable("x-powered-by");

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Student Routes

app.use("/api", studentRoutes);

// Cohort routes

app.use("/api", cohortRoutes);

//error handling

require("./error-handling")(app);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
