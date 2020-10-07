const express = require('express');
const fs = require('fs');
const app = express();
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

let history = require('./history.json') || [];

function saveHistory(history) {
  fs.writeFileSync('history.json', JSON.stringify(history), {encoding: 'utf-8'});
}

function findPostByID (id) {
  return history.find(element => element.id === id);
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send(
    fs.readFileSync('index.html', {encoding: 'utf-8'})
  );
});

app.get('/messages', (req, res) => {
  res.send(history);
});

app.get('/messages/:id', (req, res) => {
  const message = findPostByID(req.params.id).message;
  res.send(message);
});

app.delete('/messages', (req, res) => {
  history = [];
  saveHistory(history);
  res.send(history);
});

app.delete('/messages/:id', (req, res) => {
  const postFinder = findPostByID(req.params.id);
  const indexOfPost = history.indexOf(postFinder);
  history.splice(indexOfPost, 1);
  saveHistory(history);
  res.send(history);
});

app.put('/messages/:id/:new_message', (req, res) => {
  const postFinder = findPostByID(req.params.id);
  const indexOfPost = history.indexOf(postFinder);
  history[indexOfPost].message = req.params.new_message;
  saveHistory(history);
  res.send(history);
});

app.post('/messages', (req, res) => {
  history.push({
    id: uuid,
    ...req.body
  }
);
  saveHistory(history);
  res.send(history);
});

app.listen(8080);