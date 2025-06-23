const express = require("express");
const router = express.Router();
const { createUser, getUsers, createUserExercise, getUserExercises } = require("../controllers/user.controller");

router.post("/", createUser);

router.get("/", getUsers);

router.post("/:_id/exercises", createUserExercise);

router.get("/:_id/logs", getUserExercises);

module.exports = router;