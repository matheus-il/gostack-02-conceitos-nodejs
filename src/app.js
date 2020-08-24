const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

// app.listen(4000);

const repositories = [];

// Middleware
const validateId = (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "This id is not an uuid!" })
  }

  return next();
}

app.use('/repositories/:id', validateId)

// Requests
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, techs, title } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { url, techs, title } = request.body;
  const { id } = request.params;

  const idIndex = repositories.findIndex(repository => repository.id === id);

  if (idIndex < 0) {
    return response.status(400).json({ error: "Id not found!" })
  }

  // Clona e atribue novos valores
  const newRepositoryProperties = { url, techs, title }
  let cloneRepository = repositories[idIndex];
  Object.assign(cloneRepository, newRepositoryProperties)
  repositories[idIndex] = cloneRepository;

  return response.status(200).json(repositories[idIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const idIndex = repositories.findIndex(repository => repository.id === id);

  if (idIndex < 0) {
    return response.status(400).json({ error: "Id not found!" })
  }

  repositories.splice(idIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const idIndex = repositories.findIndex(repository => repository.id === id);

  if (idIndex < 0) {
    return response.status(400).json({ error: "Id not found!" })
  }

  repositories[idIndex].likes++

  return response.status(200).json(repositories[idIndex]);

});

module.exports = app;
