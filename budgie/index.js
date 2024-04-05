const uuid = require('uuid');
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



// Create User endpoint
apiRouter.post('/new-user', (req, res) => {
  let submittedUser = newUser(req.body);
  console.log(submittedUser);
  if (submittedUser === null) res.send();
  else res.send(JSON.parse(submittedUser));
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'budgie\\public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//---------------------------------------------------------------------------------

let users = [];

function getUsers() {
  return [JSON.stringify(users)];
}

function updateUsers(requestBody) {
  users.push(requestBody);
}

function newUser(requestBody) {
  let username = requestBody.username;
  if (username === "" || username === null) return null;
  let password = requestBody.password;
  let confirm = requestBody.confirm;
  for (thisUser of users) {
    console.log(users);
    if (thisUser.username == username) {
      return JSON.stringify(new ResponseData(true, "dupeUser", {}));
    }
  }
  if (password.length < 7) return JSON.stringify(new ResponseData(true, "shortPwd", {}));
  if (password != confirm) return JSON.stringify(new ResponseData(true, "badConf", {}));

  let user = new User(username, password, username + "'s budget")
  let authToken = uuid.v4();
  users.push(user);
  console.log(users);
  return JSON.stringify(new ResponseData(false, "", {
    user: user,
    authToken: authToken
  }));
}

class User {
  constructor(user, pwd, budgetName) {
      this.username = user;
      this.password = pwd;
      let budget = {
          budgetName: budgetName,
          privacy: "private",
          initial: 0,
          pIncome: [],
          pExpenses: [],
          aIncome: [],
          aExpenses: []
      }
      this.budgets = [budget];
      this.friends = [];
      this.sentFriendRequests = [];
      this.receivedFriendRequests = [];
  }
}

class ResponseData {
  constructor(isError, responseMsg, data) {
    this.isError = isError;
    this.responseMsg = responseMsg;
    this.data = data;
  }
}