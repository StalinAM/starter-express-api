const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

morgan.token("body", (req, res) => JSON.stringify(req.body));

const tokenMorgan = morgan((token, request, response) => {
  return [
    token.method(request, response),
    token.url(request, response),
    token.status(request, response),
    token.res(request, response, "content-length"),
    "-",
    token["response-time"](request, response),
    "ms",
    token.body(request, response),
  ].join(" ");
});
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

app.get("/info", (request, response) => {
  const responseText = `
        <h1>Phonebook has info for ${persons.length} people</h1>
        <p>${new Date()}</p>
    `;
  response.send(responseText);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// DELETE

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

// POST

const numRandom = () => {
  return Math.floor(Math.random() * 100);
};
const generateId = () => {
  const newId = numRandom();
  const idFound = persons.some((item) => item.id == newId);
  while (idFound) {
    newId = numRandom();
  }
  return newId;
};
app.post("/api/persons", tokenMorgan, (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  const nameFound = persons.some(
    (item) => item.name.toLowerCase() == body.name.toLowerCase()
  );
  if (nameFound) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
