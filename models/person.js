require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI);

// Person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Person factory
const Person = mongoose.model("Person", personSchema);

module.exports = Person;