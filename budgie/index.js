const uuid = require('uuid');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const port = 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('budgie/public'));

//Use a cookie parser
app.use(cookieParser());

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

//Duck endpoint
apiRouter.get('/duck', async (req, res) => {
  let duck = await fetch("https://random-d.uk/api/quack");
  let resObj = await duck.json();
  res.send(JSON.parse(JSON.stringify({'duck': resObj.url})));
});

apiRouter.get('/validAuth', (req, res) => {
  //TODO: Check in DB
  console.log("Validate Auth called");
  const authToken = req.cookies['authToken'];
  const isValid = (authToken) ? true : false;
  res.send({isValid: isValid});
});

apiRouter.put('/removeAuth', (req, res) => {
  console.log("Remove Auth called");
  res.clearCookie('authToken');
  res.send();
});

// Create User endpoint
apiRouter.post('/new-user', (req, res) => {
  console.log("new-user called");
  let response = newUser(req.body);
  if (response === null) res.send();
  else if (JSON.parse(response).isError) res.send(JSON.parse(response));
  else {
    //TODO: Store in DB
    let authToken = uuid.v4();
    res.cookie('authToken', authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 20000)//TODO: Set this to be longer
    })
    res.send(JSON.parse(response));
  }
});

//Login endpoint
apiRouter.post('/login', (req, res) => {
  console.log("login called");
  let response = login(req.body);
  if (response === null) res.send();
  else if (JSON.parse(response).isError) res.send(JSON.parse(response));
  else {
    //TODO: Store in DB
    let authToken = uuid.v4();
    res.cookie('authToken', authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 20000)//TODO: Set this to be longer
    })
    res.send(JSON.parse(response));
  }
});

//Get User endpoint
apiRouter.get('/user/:username', (req, res) => {
  console.log("Get user called");
  let currUser;
  try {
    currUser = JSON.stringify(users.get(req.params.username));
  }
  catch {res.send();}
  if (!currUser) res.send();
  res.send(JSON.parse(currUser));
});

//Update User endpoint (For editing current user)
apiRouter.put('/user', (req, res) => {
  console.log("Update user called");
  let response = updateUser(req.body);
  if (response === null) res.send();
  else res.send(JSON.parse(response));
});

//Send Friend Request endpoint
apiRouter.post('/friend-request', (req, res) => {
  console.log("friend-request called");
  let response = friendRequest(req.body);
  if (response === null) res.send();
  res.send(JSON.parse(response));
});

//Respond to Friend Request endpoint
apiRouter.post('/friend-request-response', (req, res) => {
  console.log("friend-request-response called");
  let response = respondToFriendRequest(req.body);
  if (response === null) res.send();
  res.send(JSON.parse(response));
});

//New Budget endpoint
apiRouter.post('/budget', (req, res) => {
  console.log("New budget called");
  let response = newBudget(req.body);
  if (response === null) res.send();
  res.send(JSON.parse(response));
});

//Edit Budget Data endpoint
apiRouter.patch('/budget-data', (req, res) => {
  console.log("Edit Budget Data called");
  let response = editBudgetData(req.body);
  if (response === null) res.send();
  res.send(JSON.parse(response));
});

//Send Message endpoint
apiRouter.post('/message', (req, res) => {
  console.log("Message called");
  let response = sendMessage(req.body);
  if (response === null) res.send();
  res.send(JSON.parse(response));
});

//Budget Response endpoint
apiRouter.post('/budget-response', (req, res) => {
  console.log("Budget Response called");
  let response = respondToBudgetRequest(req.body);
  if (response === null) res.send();
  res.send(JSON.parse(response));
});

//View Friend's Budget endpoint
apiRouter.post('/view-friend', (req, res) => {
  console.log("View Friend called");
  let response = viewFriendsBudget(req.body);
  if (response === null) res.send();
  res.send(JSON.parse(response));
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'budgie/public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//---------------------------------------------------------------------------------

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
  users.set(username, user);
  return JSON.stringify(new ResponseData(false, "", {user: user}));
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

function updatePublicBudgets(username) {
  let userData = users.get(username);
  if (userData === null || userData === undefined) return;
  let publicBudgets = [];
  for (thisBudget of userData.budgets) {
    if (thisBudget.privacy === "public") publicBudgets.push(thisBudget.budgetName);
  }
  for (thisFriend of userData.friends) {
    let friendName = thisFriend.username;
    let friendData = users.get(friendName);
    for (let i = 0; i < friendData.friends.length; i++) {
      if (friendData.friends[i].username === username) {
        let permittedBudgets = [];
        for (thisBudget of userData.budgets) {
          for (thisBudgetName of friendData.friends[i].permittedBudgets) {
            if (thisBudgetName === thisBudget.budgetName) {
              permittedBudgets.push(thisBudgetName);
              break;
            }
          }
        }
        let messages = friendData.friends[i].messages;
        friendData.friends.splice(i, 1);
        friendData.friends.push(new Friend(username, publicBudgets, permittedBudgets, messages));
        users.set(friendName, friendData);
        break;
      }
    }
  }
}

function updateUser(requestBody) {
  try {
    let isGuest = (requestBody.guestBudget) ? (requestBody.guestBudget.budgetOwner) : null;
    if (isGuest) {
      let currUsername = requestBody.guestBudget.currUsername;
      let currUser = users.get(currUsername);
      if (currUser === null || currUser === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
      let ownerUsername = requestBody.guestBudget.budgetOwner;
      let owner = users.get(ownerUsername);
      if (owner === null || owner === undefined) return JSON.stringify(new ResponseData(true, "noFriend", {}));
      let guestBudget = requestBody.guestBudget.budget;
      let budgetName = guestBudget.budgetName;

      let checkBudget = verifyBudgetPermissions(currUser, owner, budgetName);
      if (checkBudget.isError) return checkBudget;

      for (let i = 0; i < owner.budgets.length; i++) {
        if (owner.budgets[i].budgetName === budgetName) {
          owner.budgets[i] = guestBudget;
          users.set(ownerUsername, owner);
          return JSON.stringify(new ResponseData(false, "", {'budget': guestBudget}));
        }
      }
    }
    else {
      let currUsername = requestBody.user.username;
      if (users.get(currUsername) === null || users.get(currUsername) === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
      const updatedUser = new User(currUsername, requestBody.user.password, null);
      for (budget of requestBody.user.budgets) updatedUser.budgets.push(budget);
      for (friend of requestBody.user.friends) updatedUser.friends.push(friend);
      for (request of requestBody.user.sentFriendRequests) updatedUser.sentFriendRequests.push(request);
      for (request of requestBody.user.receivedFriendRequests) updatedUser.receivedFriendRequests.push(request);
      users.set(currUsername, updatedUser);
      updatePublicBudgets(currUsername);
      return JSON.stringify(new ResponseData(false, "", {user: updatedUser}));
    }
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
      if (friendReq.username === friendUsername) return JSON.stringify(new ResponseData(true, "doubleRequest", {}));
    }
    for (friendReq of requestor.sentFriendRequests) {
      if (friendReq.username === friendUsername) return JSON.stringify(new ResponseData(true, "alreadyRequested", {}));
    }
    requestor.sentFriendRequests.push(new FriendRequest(friendUsername));
    users.set(requestorName, requestor);
    friendUser.receivedFriendRequests.push(new FriendRequest(requestorName));
    users.set(friendUsername, friendUser);
    return JSON.stringify(new ResponseData(false, "", {}));
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
    if (requestBody.accept) {
      let currUserPublicBudgets = []
      for (budget of currUser.budgets) if (budget.privacy === "public") currUserPublicBudgets.push(budget.budgetName);
      requestor.friends.push(new Friend(currUserName, currUserPublicBudgets, [], []));
      users.set(requestorName, requestor);
      let requestorPublicBudgets = []
      for (budget of requestor.budgets) if (budget.privacy === "public") requestorPublicBudgets.push(budget.budgetName);
      currUser.friends.push(new Friend(requestorName, requestorPublicBudgets, [], []));
      users.set(currUserName, currUser);
    }
    return JSON.stringify(new ResponseData(false, "", {user: currUser}));


    function removeRequests() {
      //Remove any sent friend requests that were never received
      for (let i = 0; i < currUser.receivedFriendRequests.length; i++) {
        if (currUser.receivedFriendRequests[i].username === requestorName) {
          currUser.receivedFriendRequests.splice(i, 1);
          break;
        }
      }

      //Remove any sent friend requests that were never received
      for (let i = 0; i < requestor.sentFriendRequests.length; i++) {
        if (requestor.sentFriendRequests[i].username === currUserName) {
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

function budgetAlreadyRequested(budgetName, friendName, currUsername) {
  let currUser = users.get(currUsername);
  let friendObj = null;
  for (thisFriend of currUser.friends) {
    if (thisFriend.username === friendName) {
      friendObj = thisFriend;
      break;
    }
  }
  if (friendObj === null || friendObj === undefined) return true;
  for (message of friendObj.messages) {
    if (message !== null && message.params.length > 1 && message.params[1] === budgetName && message.tag === "request") return true;
  }
  return false;
}

function sendMessage(requestBody) {
  try {
    let budgetRequest = requestBody.budgetRequest;
    if (budgetRequest !== null && budgetRequest !== undefined) {
      //Send a budget request
      let currUsername = budgetRequest.currUsername;
      let friendUsername = budgetRequest.friendUsername;
      let budgetName = budgetRequest.budgetName;
      if (budgetAlreadyRequested(budgetName, friendUsername, currUsername)) return JSON.stringify(new ResponseData(true, "alreadyRequested", {}));

      //Create a message object and add it to messages in both friend objects
      let requestMessage = new Message(currUsername, "", "request", [friendUsername, budgetName]);
      let currUser = users.get(currUsername);
      for (let i = 0; i < currUser.friends.length; i++) {
        if (currUser.friends[i].username === friendUsername) {
          currUser.friends[i].messages.push(requestMessage);
          users.set(currUsername, currUser);
          break;
        }
      }
      let friend = users.get(friendUsername);
      for (let i = 0; i < friend.friends.length; i++) {
        if (friend.friends[i].username === currUsername) {
          friend.friends[i].messages.push(requestMessage);
          users.set(friendUsername, friend);
          break;
        }
      }
      return JSON.stringify(new ResponseData(false, "", {}));
    }
    else {
      //Send a standard message
      let messageData = requestBody.messageData;
      let currUsername = messageData.currUsername;
      let friendUsername = messageData.friendName;
      let body = messageData.body;
      let currUser = users.get(currUsername);
      if (currUser === null || currUser == undefined) return JSON.stringify(false, "noUser", {});
      let friend = users.get(friendUsername);
      if (friend === null || friend == undefined) return JSON.stringify(false, "noFriend", {});
      
      //Save the message in both inboxes
      let message = new Message(currUsername, body);
      for (let i = 0; i < currUser.friends.length; i++) {
        if (currUser.friends[i].username === friendUsername) {
          currUser.friends[i].messages.push(message);
          users.set(currUsername, currUser);
          break;
        }
      }
      for (let i = 0; i < friend.friends.length; i++) {
        if (friend.friends[i].username === currUsername) {
          friend.friends[i].messages.push(message);
          users.set(friendUsername, friend);
          break;
        }
      }
      return JSON.stringify(new ResponseData(false, "", {}));
    }
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

function respondToBudgetRequest(requestBody) {
  try {
    let currUsername = requestBody.currUsername;
    let currUser = users.get(currUsername);
    if (currUser === null || currUser === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
    let friendUsername = requestBody.friendName;
    let friend = users.get(friendUsername);
    if (friend === null || friend === undefined) return JSON.stringify(new ResponseData(true, "noFriend", {}));
    let budgetName = requestBody.budgetName;
    let isPermitted = requestBody.isPermitted;

    //Change the tag in each inbox to be "permission" or "rejection"
    for (let i = 0; i < currUser.friends.length; i++) {
      if (currUser.friends[i].username === friendUsername) {
        for (let j = 0; j < currUser.friends[i].messages.length; j++) {
          if (currUser.friends[i].messages[j].origin === friendUsername && currUser.friends[i].messages[j].tag === "request" &&
          currUser.friends[i].messages[j].params[0] === currUsername && currUser.friends[i].messages[j].params[1] === budgetName) {
            currUser.friends[i].messages[j].origin = currUsername;
            currUser.friends[i].messages[j].tag = (isPermitted) ? "permission" : "rejection";
            users.set(currUsername, currUser);
            break;
          }
        }
        break;
      }
    }
    for (let i = 0; i < friend.friends.length; i++) {
      if (friend.friends[i].username === currUsername) {
        for (let j = 0; j < friend.friends[i].messages.length; j++) {
          if (friend.friends[i].messages[j].origin === friendUsername && friend.friends[i].messages[j].tag === "request" &&
          friend.friends[i].messages[j].params[0] === currUsername && friend.friends[i].messages[j].params[1] === budgetName) {
            currUser.friends[i].messages[j].origin = currUsername;
            friend.friends[i].messages[j].tag = (isPermitted) ? "permission" : "rejection";
            break;
          }
          //Add to the friend's permittedBudgets
          if (isPermitted) {
            friend.friends[i].permittedBudgets.push(budgetName);
            users.set(friendUsername, friend);
          }
        }
        break;
      }
    }
    return JSON.stringify(new ResponseData(false, "", {}));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

function verifyBudgetPermissions(currUser, friend, budgetName) {
    //Verify users are friends
    let isFriend = false;
    for (thisFriend of friend.friends) {
      if (thisFriend.username === currUser.username) {
        isFriend = true;
        break;
      }
    }
    if (!isFriend) return JSON.stringify(new ResponseData(true, "notFriend", {}));

    //Verify budget exists
    let budget = null;
    for (thisBudget of friend.budgets) {
      if (thisBudget.budgetName === budgetName) {
        budget = thisBudget;
        break;
      }
    }
    if (budget === undefined || budget === null) return JSON.stringify(new ResponseData(true, "noBudget", {}));

    //Verify budget is public
    if (budget.privacy !== "public") return JSON.stringify(new ResponseData(true, "notPublic", {}));

    //Verify budget is permitted
    for (thisFriend of currUser.friends) {
      if (thisFriend.username === friend.username) {
        let isPermitted = false;
        for (thisBudgetName of thisFriend.permittedBudgets) {
          if (thisBudgetName === budgetName) {
            isPermitted = true;
            break;
          }
        }
        if (!isPermitted) return JSON.stringify(new ResponseData(true, "notPermitted", {}));
        break;
      }
    }

    //Return the budget data
    return JSON.stringify(new ResponseData(false, "", budget));
}

function viewFriendsBudget(requestBody) {
  try {
    //Verify users exist
    let currUsername = requestBody.currUsername;
    let currUser = users.get(currUsername);
    if (currUser === null || currUser === undefined) return JSON.stringify(new ResponseData(true, "noUser", {}));
    let friendUsername = requestBody.friendName;
    let friend = users.get(friendUsername);
    if (friend === null || friend === undefined) return JSON.stringify(new ResponseData(true, "noFriend", {}));
    let budgetName = requestBody.budgetName;
    return verifyBudgetPermissions(currUser, friend, budgetName);
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
  constructor(username, publicBudgetList, permittedBudgetList, messageList) {
      this.username = username;
      this.publicBudgets = publicBudgetList;
      this.permittedBudgets = permittedBudgetList;
      this.messages = messageList;
  }
}

class Message {
  constructor(origin, body, tag=null, params=[]) {
      this.origin = origin;
      this.body = body;
      this.tag = tag;
      this.params = params;
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