const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user.model");
const Exercise = require("./models/exercise.model");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const exercise = await Exercise.create({
      _userid: user._id,
      username: user.username,
      description: req.body.description,
      duration: req.body.duration,
      date: new Date(
        req.body.date === "" ? Date.now() : req.body.date
      ).toDateString(),
    });
    res.status(200).json({
      _id: user._id,
      username: user.username,
      date: exercise.date,
      duration: exercise.duration,
      description: exercise.description
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const exercises = await Exercise.find({ _userid: user._id });

    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    const filterExercises = exercises.filter((exercise) => {
      const date = new Date(exercise.date);
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    });

    if (req.query.limit) {
      const limitExercises = filterExercises.slice(0, req.query.limit);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        from: req.query?.from
          ? new Date(req.query.from).toDateString()
          : undefined,
        to: req.query?.to ? new Date(req.query.to).toDateString() : undefined,
        count: limitExercises.length,
        log: [...limitExercises.map(exercise => {
            exercise = {
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date
            }
            return exercise;
          }
        )],
      });
    } else {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        from: req.query?.from
          ? new Date(req.query.from).toDateString()
          : undefined,
        to: req.query?.to ? new Date(req.query.to).toDateString() : undefined,
        count: filterExercises.length,
        log: [...filterExercises.map(exercise => {
            exercise = {
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date
            }
            return exercise;
          }
        )],
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database!");
    app.listen(port, () => {
      console.log("Your app is listening on port " + port);
    });
  })
  .catch((error) => {
    console.log("Connection to database failed...\n" + error);
  });
