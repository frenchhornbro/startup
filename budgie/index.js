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
apiRouter.post('/user-exists', (req, res) => {
  console.log("user-exists called");
  let submittedUser = userExists(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
});

//Send Friend Request endpoint
apiRouter.post('/friend-request', (req, res) => {
  console.log("friend-request called");
  let submittedUser = friendRequest(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
});

//Respond to Friend Request endpoint
apiRouter.post('/friend-request-response', (req, res) => {
  console.log("friend-request-response called");
  let submittedUser = respondToFriendRequest(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
});

//New Budget endpoint
apiRouter.post('/budget', (req, res) => {
  console.log("New budget called");
  let submittedUser = newBudget(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
});

//Edit Budget Data endpoint
apiRouter.patch('/budget-data', (req, res) => {
  console.log("Edit Budget Data called");
  let submittedUser = editBudgetData(req.body);
  if (submittedUser === null) res.send();
  res.send(JSON.parse(submittedUser));
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
    if (users.get(username) === null || users.get(username) === undefined) return JSON.stringify(new ResponseData(false, "", {exists: false}));
    else return JSON.stringify(new ResponseData(false, "", {exists: true}));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

function friendRequest(requestBody) {
  try {
    let requestorName = requestBody.currUsername;
    let requestor = users.get(requestorName);
    if (requestor === null || requestor === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
    let friendUsername = requestBody.friendName;
    let friendUser = users.get(friendUsername);
    if (friendUser === null || friendUser === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
    if (requestorName === friendUsername) return JSON.stringify(new ResponseData(true, "self", {}));
    for (friend of requestor.friends) {
      if (friend.username === friendUsername) return JSON.stringify(new ResponseData(true, "alreadyFriends", {}));
    }
    for (friendReq of requestor.receivedFriendRequests) {
      if (friendReq.username === friendName) return JSON.stringify(new ResponseData(true, "doubleRequest", {}));
    }
    for (friendReq of requestor.sentFriendRequests) {
      if (friendReq.username === friendUsername) return JSON.stringify(new ResponseData(true, "alreadyRequested", {}));
    }
    requestor.sentFriendRequests.push(new FriendRequest(friendUsername));
    users.set(requestorName, requestor);
    friendUser.receivedFriendRequests.push(new FriendRequest(requestorName));
    users.set(friendUsername, friendUser);
    return JSON.stringify(new ResponseData(false, "", {user: requestor}));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

function respondToFriendRequest(requestBody) {
  try {
    //Verify both users exist
    const currUserName = requestBody.currUser;
    const currUser = users.get(currUserName);
    if (currUser === null || currUser === undefined) return JSON.stringify(new ResponseData(true, "noUser", {user: currUser}));
    const requestorName = requestBody.requestor;
    const requestor = users.get(requestorName);
    if (requestor === null || requestor === undefined) return JSON.stringify(new ResponseData(true, "noFriend", {user: currUser}));

    //Verify they aren't already friends
    for (friend of currUser.friends) {
      if (friend.username == requestorName) return JSON.stringify(new ResponseData(true, "alreadyFriend", {user: currUser}));
    }
    for (friend of requestor.friends) {
      if (friend.username == currUserName) return JSON.stringify(new ResponseData(true, "alreadyFriend", {user: currUser}));
    }

    //Verify the request happened
    let requestHappened = false;
    for (request of currUser.receivedFriendRequests) {
      if (request.username === requestorName) {
        requestHappened = true;
        break;
      }
    }
    if (!requestHappened) {
      removeRequests();
      return JSON.stringify(new ResponseData(true, "notSent", {user: currUser}));
    }
    requestHappened = false;
    for (request of requestor.sentFriendRequests) {
      if (request.username === currUserName) {
        requestHappened = true;
        break;
      }
    }
    if (!requestHappened) {
      removeRequests();
      return JSON.stringify(new ResponseData(true, "notSent", {user: currUser}));
    }

    //Remove the friend requests
    removeRequests();

    //Add each other as friends
    if (JSON.parse(requestBody).accept) {
      requestor.friends.push(new Friend(currUserName));
      users.set(requestorName, requestor);
      currUser.friends.push(new Friend(requestorName));
      users.set(currUserName, currUser);
    }
    return JSON.stringify(new ResponseData(false, "", {user: currUser}));


    function removeRequests() {
      //Remove any sent friend requests that were never received
      for (let i = 0; i < requestor.sentFriendRequests.length; i++) {
        if (requestor.sentFriendRequests[i].username === currUser) {
          requestor.sentFriendRequests.splice(i, 1);
          break;
        }
      }

      //Remove any sent friend requests that were never received
      for (let i = 0; i < requestor.sentFriendRequests.length; i++) {
        if (requestor.sentFriendRequests[i].username === currUser) {
          requestor.sentFriendRequests.splice(i, 1);
          break;
        }
      }
    }
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

class Friend {
  constructor(username) {
      this.username = username;
      this.permittedBudgets = [];
      this.messages = [];
  }
}

class FriendRequest { //Eventually could include number of friend requests sent to that person as an attribute
  constructor(username) {
      this.username = username
  }
}

class ResponseData {
  constructor(isError, responseMsg, data) {
    this.isError = isError;
    this.responseMsg = responseMsg;
    this.data = data;
  }
}