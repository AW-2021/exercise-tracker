const User = require("../models/user.model");
const Exercise = require("../models/exercise.model");

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUserExercise = async (req, res) => {
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
        req.body.date === undefined ? Date.now() : req.body.date
      ),
    });
    res.status(200).json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserExercises = async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const id = req.params._id;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found!"});
    }

    let dateObj = {};

    if (from) {
      dateObj["$gte"] = new Date(from);
    }
    if (to) {
      dateObj["$lte"] = new Date(to);
    }

    let filter = { _userid: id }

    if (from || to) {
      filter.date = dateObj;
    }

    const exercises = await Exercise.find(filter).limit(parseInt(limit) ?? 1000);

    const log = exercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));

    res.status(200).json({
      _id: user._id,
      username: user.username,
      from: from ? new Date(from).toDateString() : undefined,
      to: to ? new Date(to).toDateString() : undefined,
      count: exercises.length,
      log
    });

  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createUser,
    getUsers,
    createUserExercise,
    getUserExercises,
};