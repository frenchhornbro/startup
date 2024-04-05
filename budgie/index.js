const express = require('express');
const app = express();

const port = 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('budgie\\public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get users
apiRouter.get('/users', (_req, res) => {
  res.send(getUsers());
});

// Update users
apiRouter.post('/users', (req, res) => {
  updateUsers(req.body);
  res.send(getUsers());
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'budgie\\public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//TODO: POST Create user endpoint

//TODO: POST Login endpoint

//TODO: GET User object endpoint
//TODO: GET Friend object endpoint
//TODO: POST Friend request endpoint
//TODO: POST Budget request endpoint
//TODO: POST Message endpoint
//TODO: PATCH Budget (name) endpoint
//TODO: POST New Budget endpoint

//TODO: PATCH Budget (data) endpoint


let users = [];

function getUsers() {
  return [JSON.stringify(users)];
}

function updateUsers(requestBody) {
  users.push(requestBody);
}