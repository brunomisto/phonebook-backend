const mongoose = require("mongoose");

if (
  process.argv.length < 3 ||
  process.argv.length > 5 ||
  process.argv.length === 4
) {
  console.log(
    "wrong usage, use mongo.js <password> or mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const uri = `mongodb+srv://bruno:${password}@cluster0.o5gkghs.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(uri);

// Person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Person factory
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((people) => {
    console.log("phonebook:");
    people.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
