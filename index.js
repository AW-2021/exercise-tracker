const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/user.route.js");
require("dotenv").config();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

/* Routes */
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
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
