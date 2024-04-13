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
  console.log("new-user called");
  let submittedUser = newUser(req.body);
  if (submittedUser === null) res.send();
  else res.send(JSON.parse(submittedUser));
});

//Login endpoint
apiRouter.post('/login', (req, res) => {
  console.log("login called");
  let submittedUser = login(req.body);
  console.log(submittedUser);
  if (submittedUser === null) res.send();
  else res.send(JSON.parse(submittedUser));
});

//Update User endpoint (For editing current user)
apiRouter.put('/user', (req, res) => {
  console.log("user called");
  let submittedUser = updateUser(req.body);
  if (submittedUser === null) res.send();
  else res.send(JSON.parse(submittedUser));
});

//User Exists endpoint
apiRouter.post('/userEx', (req, res) => {
  console.log("userEx called");
  let submittedUser = userExists(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
});

//Send Friend Request endpoint
apiRouter.post('/friendReq', (req, res) => {
  console.log("friendReq called");
  let submittedUser = friendRequest(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
});

//New Budget endpoint
apiRouter.post('/budget', (req, res) => {
  console.log("New budget called");
  let submittedUser = newBudget(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
})

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'budgie\\public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//---------------------------------------------------------------------------------

//NOTE: Brackets must be placed around the JSON.stringify of a response value if it is not an object (such as an array)
let users = new Map();

function newUser(requestBody) {
  let username = requestBody.username;
  if (username === "" || username === null) return null;
  let password = requestBody.password;
  let confirm = requestBody.confirm;
  if (users.get(username) !== null && users.get(username) !== undefined) return JSON.stringify(new ResponseData(true, "dupeUser", {}));
  if (password.length < 7) return JSON.stringify(new ResponseData(true, "shortPwd", {}));
  if (password != confirm) return JSON.stringify(new ResponseData(true, "badConf", {}));

  let budgetName = username + '\'s budget';
  let user = new User(username, password, budgetName)
  let authToken = uuid.v4();
  users.set(username, user);
  return JSON.stringify(new ResponseData(false, "", {
    user: user,
    authToken: authToken
  }));
}

function login(requestBody) {
  let username = requestBody.username;
  let password = requestBody.password;
  let user = users.get(username);
  if (user === null || user === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
  if (user.password !== password) return JSON.stringify(new ResponseData(true, "badPwd", {}));

  let authToken = uuid.v4();
  return JSON.stringify(new ResponseData(false, "", {
    user: user,
    authToken: authToken
  }));
}

function updateUser(requestBody) {
  try {
    if (users.get(requestBody.username) === null || users.get(requestBody.username) === undefined) return;
    const updatedUser = new User(requestBody.username, requestBody.password, null);
    for (budget of requestBody.budgets) updatedUser.budgets.push(budget);
    for (friend of requestBody.friends) updatedUser.friends.push(friend);
    for (request of requestBody.sentFriendRequests) updatedUser.sentFriendRequests.push(request);
    for (request of requestBody.receivedFriendRequests) updatedUser.receivedFriendRequests.push(request);
    users.set(requestBody.username, updatedUser);
    return JSON.stringify(new ResponseData(false, "", {user: updatedUser}));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

function userExists(requestBody) {
  try {
    const username = requestBody.username;
    if (users.get(username) === null || users.get(username) === undefined) {
      return JSON.stringify(new ResponseData(false, "", {exists: false}));
    }
    else return JSON.stringify(new ResponseData(false, "", {exists: true}));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

function friendRequest(requestBody) {
  try {
    let requestorName = JSON.parse(requestBody.request).username;
    let requestor = users.get(requestorName);
    let friendUsername = requestBody.username;
    let friendUser = users.get(friendUsername);
    for (friend of friendUser.friends) {
      if (friend.username === requestorName) return JSON.stringify(new ResponseData(true, "alreadyFriends", {}));
    }
    for (friendReq of friendUser.receivedFriendRequests) {
      if (friendReq.username === requestorName) return JSON.stringify(new ResponseData(true, "alreadyRequested", {}));
    }
    for (friendReq of requestor.receivedFriendRequests) {
      if (friendReq.username === friendUsername) return JSON.stringify(new ResponseData(true, "doubleRequest", {}));
    }
    friendUser.receivedFriendRequests.push(JSON.parse(requestBody.request));
    users.set(friendUsername, friendUser);
    return JSON.stringify(new ResponseData(false, "", {}));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

function newBudget(requestBody) {
  try {
    let username = requestBody.username;
    let user = users.get(username);
    if (user === null || user === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
    let budgetName = requestBody.newBudgetName;
    for (thisBudget of user.budgets) {
      if (thisBudget.budgetName === budgetName) {
        return JSON.stringify(new ResponseData(true, "dupeBudget", {}));
      }
    }
    let newBudget = {budgetName: budgetName, privacy: "private", initial: 0, pIncome: [], pExpenses: [], aIncome: [], aExpenses: []};
    user.budgets.push(newBudget);
    users.set(username, user);
    return JSON.stringify(new ResponseData(false, "", user));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
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
      if (budgetName !== null) this.budgets = [budget];
      else this.budgets = [];
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