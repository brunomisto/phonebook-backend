const express = require("express");

const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  let id = Math.ceil(Math.random() * 1000);
  while (persons.map((p) => p.id).includes(id)) {
    id = Math.ceil(Math.random() * 1000);
  }
  return id;
};

app.use(express.json());

app.get("/info", (request, response) => {
  response.send(
    `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
    `
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons).end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    response.status(404).end();
    return;
  }

  response.send(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    // users can't set number as '0' though
    response.status(400);
    response.json({ error: "missing name or number" });
    return;
  }

  if (persons.map((p) => p.name).includes(body.name)) {
    response.status(400);
    response.json({ error: "names must be unique" });
    return;
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.listen(3001, () => {
  console.log("listening in http://localhost:3001");
});
