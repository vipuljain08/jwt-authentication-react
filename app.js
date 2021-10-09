require("dotenv").config();
require("./config/database").connect();
const User = require("./model/user");
const auth = require("./middleware/auth")

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// register route
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required");
    }
    const checkUserIfExist = await User.findOne({ email });
    if (checkUserIfExist) {
      return res.status(409).send("User is already exist. Please Login");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user in our database
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIN: "2h" }
    );
    // save user token
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

// login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required!");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      user.token = token;
      res.status(200).json(user);
    }

    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome to JWT Authentication.")
})

module.exports = app;
