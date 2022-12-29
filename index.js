const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Phone = require("./models/phone");
const { response } = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
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
// ROUTES GET
app.get("/info", (request, response) => {
  Phone.Phone.find({}).then((item) => {
    const responseText = `
        <h1>Phonebook has info for ${item.length} people</h1>
        <p>${new Date()}</p>
    `;
    response.send(responseText);
  });
});

app.get("/api/persons", (request, response) => {
  Phone.Phone.find({}).then((items) => {
    response.json(items);
  });
});
app.get("/api/persons/:id", (request, response, next) => {
  Phone.Phone.findById(request.params.id)
    .then((item) => {
      if (item) {
        response.json(item);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// DELETE

app.delete("/api/persons/:id", (request, response, next) => {
  Phone.Phone.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// POST

app.post("/api/persons", tokenMorgan, (request, response, next) => {
  const body = request.body;

  const phone = new Phone.Phone({
    name: body.name,
    number: body.number,
  });

  phone
    .save()
    .then((savedPhone) => {
      response.json(savedPhone);
    })
    .catch((error) => next(error));
});
// PUT
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Phone.Phone.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatePhone) => {
      response.json(updatePhone);
    })
    .catch((error) => next(error));
});
//ERROR
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
//CONNECT DATABASE
Phone.connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
