const express = require('express');
const app = express();

const port = 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetScores
apiRouter.get('/getReqURL', (_req, res) => {
    res.send("Get request received");
});

// SubmitScore
apiRouter.post('/postReqURL', (_req, res) => {
  res.send("Post request received");
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});