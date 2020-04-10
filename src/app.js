const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function repoIndex (request, response, next)  {
  const { id } = request.params;

  const result = repositories.findIndex(index => index.id === id);

  if(result < 0){
    return response.status(400).json({ error: 'Id não encontrado' })
  }

  next();
};

app.get("/repositories", (request, response) => {
  if(repositories.length === 0){
    return response.status(200).json({ response: "Nenhum repositório disponível."});
  } else {
    return response.status(200).json(repositories);
  }
});

app.post("/repositories", (request, response) => {
  const { techs, title, url } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);
  
  return response.status(201).json(repo);

});

app.put("/repositories/:id", repoIndex, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(index => index.id === id);
  const { likes } = repositories[index];

  repositories[index] = { id, title, url, techs, likes };

  const repoUpdate = repositories[index];

  return response.status(200).json(repoUpdate);

});

app.delete("/repositories/:id", repoIndex, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(index => index.id === id);

  repositories.splice(index, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", repoIndex, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(index => index.id === id);

  repositories[index].likes += 1;

  const { likes } = repositories[index];

  return response.status(200).json({ likes });

});

module.exports = app;
