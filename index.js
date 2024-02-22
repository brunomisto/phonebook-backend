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
  Person.findById(id).then((person) => {
    response.send(person);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((person) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    // users can't set number as '0' though
    response.status(400);
    response.json({ error: "missing name or number" });
    return;
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const updatedPerson = {
    name: request.body.name,
    number: request.body.number,
  };

  Person.findByIdAndUpdate(id, updatedPerson, {
    new: true,
    runValidators: true,
  })
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.use((error, request, response, next) => {
  if (error.name === "CastError") {
    response.status(400);
    response.json({ error: "malformatted id" });
    return;
  } else if (error.name === "ValidationError") {
    response.status(400);
    response.json(error);
    return;
  }

  next(error);
});

app.listen(3001, () => {
  console.log("listening in http://localhost:3001");
});
