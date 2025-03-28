const uuid = require('uuid');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const database = require('./database.js');
const wss = require('./websocket.js');

const port = 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

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
  (async() => {
    console.log("Validate Auth called");
    const isValid = await isValidAuth(req);
    res.send({isValid: isValid});
  })();
});

apiRouter.put('/removeAuth', (req, res) => {
  console.log("Remove Auth called");
  res.clearCookie('authToken');
  res.send();
});

// Create User endpoint
apiRouter.post('/new-user', async (req, res) => {
  console.log("new-user called");
  let authToken = uuid.v4();
  let newUserPromise = new Promise((resolve) => resolve(newUser(req.body, authToken)));
  newUserPromise
    .then((response) => {
      if (response === null) res.send();
      else if (JSON.parse(response).isError) res.send(JSON.parse(response));
      else {
        res.cookie('authToken', authToken, {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + 1200000)
        })
        res.send(JSON.parse(response));
      }
    });
});

//Login endpoint
apiRouter.post('/login', (req, res) => {
  console.log("login called");
  let authToken = uuid.v4();
  let loginPromise = new Promise((resolve) => resolve(login(req.body, authToken)));
  loginPromise
    .then((response) => {
      if (response === null) res.send();
      else if (JSON.parse(response).isError) res.send(JSON.parse(response));
      else {
        res.cookie('authToken', authToken, {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + 1200000)
        })
        res.send(JSON.parse(response));
      }
    });
});

//Get User endpoint
apiRouter.get('/user', (req, res) => {
  (async() => {
  try {
      console.log("Get user called");
      if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
      else {
        const authToken = req.cookies['authToken'];
        const authData = await database.getAuthDataFromToken(authToken);
        const username = authData.username;
        const userData = await database.getUserData(username);
        let currUser = JSON.stringify(new ResponseData(false, "", {userData}));
        
        if (!currUser) res.send();
        else res.send(JSON.parse(currUser));
      }
    }
    catch {
      res.send();
    }
  })();
});

//Update User endpoint (For editing current user)
apiRouter.put('/user', (req, res) => {
  (async() => {
    console.log("Update user called");
    if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
    else {
      let response = await updateUser(req.body);
      if (response === null) res.send();
      else res.send(JSON.parse(response));
    }
  })();
});

//Send Friend Request endpoint
apiRouter.post('/friend-request', (req, res) => {
  (async() => {
    console.log("friend-request called");
    if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
    else {
      let response = await friendRequest(req.body);
      if (response === null) res.send();
      else res.send(JSON.parse(response));
    }
  })();
});

//Respond to Friend Request endpoint
apiRouter.post('/friend-request-response', (req, res) => {
  (async() => {
    console.log("friend-request-response called");
    if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
    else {
      let response = await respondToFriendRequest(req.body);
      if (response === null) res.send();
      res.send(JSON.parse(response));
    }
  })();
});

//New Budget endpoint
apiRouter.post('/budget', (req, res) => {
  (async() => {
    console.log("New budget called");
    if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
    else {
      let response = await newBudget(req.body);
      if (response === null) res.send();
      res.send(JSON.parse(response));
    }
  })();
});

//Send Message endpoint
apiRouter.post('/message', (req, res) => {
  (async() => {
    console.log("Message called");
    if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
    else {
      let response = await sendMessage(req.body);
      if (response === null) res.send();
      res.send(JSON.parse(response));
    }
  })();
});

//Budget Response endpoint
apiRouter.post('/budget-response', (req, res) => {
  (async() => {
    console.log("Budget Response called");
    if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
    else {
      let response = await respondToBudgetRequest(req.body);
      if (response === null) res.send();
      res.send(JSON.parse(response));
    }
  })();
});

//View Friend's Budget endpoint
apiRouter.post('/view-friend', (req, res) => {
  (async() => {
    console.log("View Friend called");
    if (!await isValidAuth(req)) res.send(JSON.parse(JSON.stringify(new ResponseData(true, "badAuth", {}))));
    else {
      let response = await viewFriendsBudget(req.body);
      if (response === null) res.send();
      res.send(JSON.parse(response));
    }
  })();
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const httpServer = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Setup WebSocket server
wss.setupWS(httpServer);

//---------------------------------------------------------------------------------

async function isValidAuth(req) {
  const authToken = req.cookies['authToken'];
  const authData = JSON.stringify(await database.getAuthDataFromToken(authToken));
  const isValid = (authData !== "null" && authData !== null);
  return isValid;
}

async function newUser(requestBody, authToken) {
  let username = requestBody.username;
  if (username === "" || username === null) return null;
  let password = requestBody.password;
  let confirm = requestBody.confirm;
  let dupeUser = await database.getAuthDataFromUsername(username);
  if (dupeUser) return JSON.stringify(new ResponseData(true, "dupeUser", {}));
  if (password.length < 7) return JSON.stringify(new ResponseData(true, "shortPwd", {}));
  if (password != confirm) return JSON.stringify(new ResponseData(true, "badConf", {}));

  let budgetName = username + '\'s budget';
  let user = new User(username, budgetName);
  const passwordHash = await bcrypt.hash(password, 10);
  await database.createAuthData(username, passwordHash, authToken);
  await database.createUserData(username, user);
  return JSON.stringify(new ResponseData(false, "", {user: user}));
}

async function login(requestBody, authToken) {
  let username = requestBody.username;
  let password = requestBody.password;
  let credentials = await database.getAuthDataFromUsername(username);
  if (!credentials) return JSON.stringify(new ResponseData(true, "noUser", {}));
  if (!await bcrypt.compare(password, credentials.password)) return JSON.stringify(new ResponseData(true, "badPwd", {}));
  await database.createAuthData(username, password, authToken);
  let user = await database.getUserData(username);

  return JSON.stringify(new ResponseData(false, "", {user: user}));
}

async function updatePublicBudgets(username) {
  let userData = await database.getUserData(username);
  if (!userData || userData === 'null') return;
  let publicBudgets = [];
  for (thisBudget of userData.budgets) {
    if (thisBudget.privacy === "public") publicBudgets.push(thisBudget.budgetName);
  }
  for (thisFriend of userData.friends) {
    let friendName = thisFriend.username;
    let friendData = await database.getUserData(friendName);
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
        await database.updateUserData(friendName, friendData);
        break;
      }
    }
  }
}

async function updateUser(requestBody) {
  try {
    let isGuest = (requestBody.guestBudget) ? (requestBody.guestBudget.budgetOwner) : null;
    if (isGuest) {
      let currUsername = requestBody.guestBudget.currUsername;
      let currUser = await database.getUserData(currUsername);
      if (currUser === null || currUser === 'null') return JSON.stringify(new ResponseData(true, "noUser", {}));
      let ownerUsername = requestBody.guestBudget.budgetOwner;
      let owner = await database.getUserData(ownerUsername);
      if (owner === null || owner === 'null') return JSON.stringify(new ResponseData(true, "noFriend", {}));
      let guestBudget = requestBody.guestBudget.budget;
      let budgetName = guestBudget.budgetName;

      let checkBudget = verifyBudgetPermissions(currUser, owner, budgetName);
      if (checkBudget.isError) return checkBudget;

      for (let i = 0; i < owner.budgets.length; i++) {
        if (owner.budgets[i].budgetName === budgetName) {
          owner.budgets[i] = guestBudget;
          await database.updateUserData(ownerUsername, owner);
          return JSON.stringify(new ResponseData(false, "", {'budget': guestBudget}));
        }
      }
    }
    else {
      let currUsername = requestBody.user.username;
      let currUser = await database.getUserData(currUsername);
      if (currUser === null || currUser === "null") return JSON.stringify(new ResponseData(true, "noUser", {}));
      const updatedUser = new User(currUsername, null);
      for (budget of requestBody.user.budgets) updatedUser.budgets.push(budget);
      for (friend of requestBody.user.friends) updatedUser.friends.push(friend);
      for (request of requestBody.user.sentFriendRequests) updatedUser.sentFriendRequests.push(request);
      for (request of requestBody.user.receivedFriendRequests) updatedUser.receivedFriendRequests.push(request);
      await database.updateUserData(currUsername, updatedUser);
      await updatePublicBudgets(currUsername);
      return JSON.stringify(new ResponseData(false, "", {user: updatedUser}));
    }
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

async function friendRequest(requestBody) {
  try {
    let requestorName = requestBody.currUsername;
    let requestor = await database.getUserData(requestorName);
    if (!requestor || requestor === 'null') return JSON.stringify(new ResponseData(true, "noUser", {}));
    let friendUsername = requestBody.friendName;
    let friendUser = await database.getUserData(friendUsername);
    if (!friendUser || friendUser === 'null') return JSON.stringify(new ResponseData(true, "noUser", {}));
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
    await database.updateUserData(requestorName, requestor);
    friendUser.receivedFriendRequests.push(new FriendRequest(requestorName));
    await database.updateUserData(friendUsername, friendUser);
    return JSON.stringify(new ResponseData(false, "", {}));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

async function respondToFriendRequest(requestBody) {
  try {
    //Verify both users exist
    const currUsername = requestBody.currUser;
    let currUser = await database.getUserData(currUsername);
    if (!currUser || currUser === 'null') return JSON.stringify(new ResponseData(true, "noUser", {user: currUser}));
    const requestorName = requestBody.requestor;
    let requestor = await database.getUserData(requestorName);
    if (!requestor || requestor === 'null') return JSON.stringify(new ResponseData(true, "noFriend", {user: currUser}));

    //Verify they aren't already friends
    for (friend of currUser.friends) {
      if (friend.username == requestorName) return JSON.stringify(new ResponseData(true, "alreadyFriend", {user: currUser}));
    }
    for (friend of requestor.friends) {
      if (friend.username == currUsername) return JSON.stringify(new ResponseData(true, "alreadyFriend", {user: currUser}));
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
      if (request.username === currUsername) {
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
      requestor.friends.push(new Friend(currUsername, currUserPublicBudgets, [], []));
      let requestorPublicBudgets = []
      for (budget of requestor.budgets) if (budget.privacy === "public") requestorPublicBudgets.push(budget.budgetName);
      currUser.friends.push(new Friend(requestorName, requestorPublicBudgets, [], []));
    }
    
    //Update User Data
    await database.updateUserData(requestorName, requestor);
    await database.updateUserData(currUsername, currUser);
    
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
        if (requestor.sentFriendRequests[i].username === currUsername) {
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

async function newBudget(requestBody) {
  try {
    let username = requestBody.username;
    let user = await database.getUserData(username);
    if (!user || user === 'null') return JSON.stringify(new ResponseData(true, "noUser", {}));
    let budgetName = requestBody.newBudgetName;
    for (thisBudget of user.budgets) {
      if (thisBudget.budgetName === budgetName) {
        return JSON.stringify(new ResponseData(true, "dupeBudget", {}));
      }
    }
    let newBudget = {budgetName: budgetName, privacy: "private", initial: 0, pIncome: [], pExpenses: [], aIncome: [], aExpenses: []};
    user.budgets.push(newBudget);
    await database.updateUserData(username, user);
    return JSON.stringify(new ResponseData(false, "", user));
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

async function budgetAlreadyRequested(budgetName, friendName, currUsername) {
  let currUser = await database.getUserData(currUsername);
  let friendObj = null;
  for (thisFriend of currUser.friends) {
    if (thisFriend.username === friendName) {
      friendObj = thisFriend;
      break;
    }
  }
  if (!friendObj || friendObj === 'null') return true;
  for (message of friendObj.messages) {
    if (message !== null && message.params.length > 1 && message.params[1] === budgetName && message.tag === "request") return true;
  }
  return false;
}

async function sendMessage(requestBody) {
  try {
    let budgetRequest = requestBody.budgetRequest;
    if (budgetRequest !== null && budgetRequest !== undefined) {
      //Send a budget request
      let currUsername = budgetRequest.currUsername;
      let friendUsername = budgetRequest.friendUsername;
      let budgetName = budgetRequest.budgetName;
      if (await budgetAlreadyRequested(budgetName, friendUsername, currUsername)) return JSON.stringify(new ResponseData(true, "alreadyRequested", {}));

      //Create a message object and add it to messages in both friend objects
      let requestMessage = new Message(currUsername, "", "request", [friendUsername, budgetName]);
      let currUser = await database.getUserData(currUsername);
      for (let i = 0; i < currUser.friends.length; i++) {
        if (currUser.friends[i].username === friendUsername) {
          currUser.friends[i].messages.push(requestMessage);
          await database.updateUserData(currUsername, currUser);
          break;
        }
      }
      let friend = await database.getUserData(friendUsername);
      for (let i = 0; i < friend.friends.length; i++) {
        if (friend.friends[i].username === currUsername) {
          friend.friends[i].messages.push(requestMessage);
          await database.updateUserData(friendUsername, friend);
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
      let currUser = await database.getUserData(currUsername);
      if (!currUser || currUser === 'null') return JSON.stringify(false, "noUser", {});
      let friend = await database.getUserData(friendUsername);
      if (!friend || friend === 'null') return JSON.stringify(false, "noFriend", {});
      
      //Save the message in both inboxes
      let message = new Message(currUsername, body);
      for (let i = 0; i < currUser.friends.length; i++) {
        if (currUser.friends[i].username === friendUsername) {
          currUser.friends[i].messages.push(message);
          await database.updateUserData(currUsername, currUser);
          break;
        }
      }
      for (let i = 0; i < friend.friends.length; i++) {
        if (friend.friends[i].username === currUsername) {
          friend.friends[i].messages.push(message);
          await database.updateUserData(friendUsername, friend);
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

async function respondToBudgetRequest(requestBody) {
  try {
    let currUsername = requestBody.currUsername;
    let currUser = await database.getUserData(currUsername);
    if (!currUser || currUser === 'null') return JSON.stringify(new ResponseData(true, "noUser", {}));
    let friendUsername = requestBody.friendName;
    let friend = await database.getUserData(friendUsername);
    if (!friend || friend === 'null') return JSON.stringify(new ResponseData(true, "noFriend", {}));
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
            await database.updateUserData(currUsername, currUser);
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
            friend.friends[i].messages[j].origin = currUsername;
            friend.friends[i].messages[j].tag = (isPermitted) ? "permission" : "rejection";
            //Add to the friend's permittedBudgets
            if (isPermitted) friend.friends[i].permittedBudgets.push(budgetName);
            await database.updateUserData(friendUsername, friend);
            break;
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
    if (!budget || budget === 'null') return JSON.stringify(new ResponseData(true, "noBudget", {}));

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

async function viewFriendsBudget(requestBody) {
  try {
    //Verify users exist
    let currUsername = requestBody.currUsername;
    let currUser = await database.getUserData(currUsername);
    if (!currUser || currUser === 'null') return JSON.stringify(new ResponseData(true, "noUser", {}));
    let friendUsername = requestBody.friendName;
    let friend = await database.getUserData(friendUsername);
    if (!friend || friend === 'null') return JSON.stringify(new ResponseData(true, "noFriend", {}));
    let budgetName = requestBody.budgetName;
    return verifyBudgetPermissions(currUser, friend, budgetName);
  }
  catch {
    return JSON.stringify(new ResponseData(true, "unknownError", {}));
  }
}

class User {
  constructor(user, budgetName) {
      this.username = user;
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