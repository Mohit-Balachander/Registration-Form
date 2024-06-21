const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

const username = process.env.MONGODB_USERNAME || "mohitbalachander";
const password = process.env.MONGODB_PASSWORD || "mohitbalachander123";

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.lqybtb4.mongodb.net/registrationFormDB`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Registration schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'pages' directory
app.use(express.static(path.join(__dirname, "pages")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Received registration data:", { name, email, password });

    const existingUser = await Registration.findOne({ email });

    // Check whether if there is an existing user present
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      console.log("New user registered:", registrationData);
      res.redirect("/success");
    } else {
      console.log("User already exists with email:", email);
      res.redirect("/error");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "success.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "error.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
