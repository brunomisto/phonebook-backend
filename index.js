const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("reqbody", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqbody"
  )
);
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date().toString()}</p>
      `
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.find({ _id: id }).then((person) => {
    response.send(person);
  });
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);
//   response.status(204).end();
// });

// app.post("/api/persons", (request, response) => {
//   const body = request.body;

//   if (!body.name || !body.number) {
//     // users can't set number as '0' though
//     response.status(400);
//     response.json({ error: "missing name or number" });
//     return;
//   }

//   if (persons.map((p) => p.name).includes(body.name)) {
//     response.status(400);
//     response.json({ error: "names must be unique" });
//     return;
//   }

//   const person = {
//     id: generateId(),
//     name: body.name,
//     number: body.number,
//   };

//   persons = persons.concat(person);
//   response.json(person);
// });

app.listen(3001, () => {
  console.log("listening in http://localhost:3001");
});
