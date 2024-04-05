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


// Create User endpoint
apiRouter.post('/new-user', (req, res) => {
  let submittedUser = newUser(req.body);
  if (submittedUser === null) res.send();
  else res.send(JSON.parse(submittedUser));
});

//Login endpoint
apiRouter.post('/login', (req, res) => {
  let submittedUser = login(req.body);
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

//NOTE: Brackets must be placed around the JSON.stringify of a response value if it is not an object (such as an array)
let users = [];

function newUser(requestBody) {
  let username = requestBody.username;
  if (username === "" || username === null) return null;
  let password = requestBody.password;
  let confirm = requestBody.confirm;
  for (thisUser of users) {
    if (thisUser.username == username) {
      return JSON.stringify(new ResponseData(true, "dupeUser", {}));
    }
  }
  if (password.length < 7) return JSON.stringify(new ResponseData(true, "shortPwd", {}));
  if (password != confirm) return JSON.stringify(new ResponseData(true, "badConf", {}));

  let user = new User(username, password, username + "'s budget")
  let authToken = uuid.v4();
  users.push(user);
  return JSON.stringify(new ResponseData(false, "", {
    user: user,
    authToken: authToken
  }));
}

function login(requestBody) {
  let username = requestBody.username;
  let password = requestBody.password;
  let user = null;
  for (thisUser of users) {
    if (thisUser.username === username) {
      user = thisUser;
      break;
    }
  }
  if (user === null) return JSON.stringify(new ResponseData(true, "noUser", {}));
  if (user.password !== password) return JSON.stringify(new ResponseData(true, "badPwd", {}));

  let authToken = uuid.v4();
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