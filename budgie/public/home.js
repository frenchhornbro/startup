//Feature: Assign a random color to the name of each person messaging and display it for their name
//Feature: Limit number of budgets that can be created
//Feature: Eventually cap the number of friend requests that can be sent in a day, or set a time limit between sending friend requests
//Feature: Could set a time for each message to let it expire
//Take note: There's a vulnerability wherever we set a value to the textContent of an attribute, as that can be edited

let activeMessage = null;
localStorage.removeItem("budgetOwner");
let currUser = JSON.parse(localStorage.getItem("user"));

let unreadMsgs = new Map();

//Set up WebSocket to communicate with WebSocketServer
let ws = new WebSocket(`wss://${window.location.host}`);
ws.onmessage = (event) => {
    try {
        const msg = JSON.parse(event.data);
        const tag = msg.tag;
        const origin = msg.origin;
        const destination = msg.destination;
        if (destination === currUser.username) {
            (async () => {
                try {
                    if (tag === "message") {
                        await updateCurrUser();
                        if (activeMessage !== origin) {
                            unreadMsgs.set(origin, true);
                            unloadFriends();
                            loadFriends();
                        }
                        else {
                            unloadMessages();
                            loadMessages();
                        }
                    }
                    else if (tag === "request") {
                        await updateCurrUser();
                        unloadFriends();
                        loadFriends();
                    }
                }
                catch {
                    load();
                }
            })();
        }
    }
    catch {}
};

async function load() {
    unload();
    await updateCurrUser();
    loadBudgets();
    loadFriends();
    loadMessages();
}

async function updateCurrUser() {
    let user = await fetch(`/api/user`);
    let userObj = await user.json();
    if (userObj.isError) {
        if (userObj.responseMsg === "badAuth") alert("Authentication token has expired");
        else alert(`An error has occurred: ${resObj.responseMsg}`);
    }
    else {
        localStorage.setItem("user", JSON.stringify(userObj.data.userData));
        currUser = JSON.parse(localStorage.getItem("user"));
    }
}

function unload() {
    while (document.querySelector(".budget-info-container") !== null) {
        document.querySelector(".budget-info-container").remove();
    }
    unloadFriends();
    unloadMessages();
}
function unloadFriends() {
    while (document.querySelector(".friend") !== null) {
        document.querySelector(".friend").remove();
    }
    while (document.querySelector(".friend-info-container") !== null) {
        document.querySelector(".friend-info-container").remove();
    }
}

function unloadMessages() {
    while (document.querySelector(".message-line-container") !== null) {
        document.querySelector(".message-line-container").remove();
    }
}



function loadBudgets() {
    //Unload all the data
    while (document.querySelector(".budget-info-container") !== null) {
        document.querySelector(".budget-info-container").remove();
    }

    //Get the data for currentUser.
    //For each item in the JSON object "budgets", display the name
    for (let i = 0; i < currUser.budgets.length; i++) {
        loadBudget(currUser.budgets[i]);
    }
}

function loadBudget(thisBudget) {
    let row = document.createElement("div");
    row.className = "budget-info-container";

    let title = document.createElement("div");
    title.textContent = thisBudget.budgetName;
    title.className = "info-title"
    row.appendChild(title);

    let spacer = document.createElement("div");
    spacer.className = "info-filler";
    row.appendChild(spacer);

    let buttonContainer = document.createElement("div");
    buttonContainer.className = "budget-info-buttons-container";

    let privacySelectionContainer = document.createElement("div");

    let privacySelection = document.createElement("select");
    privacySelection.className = "form-select";
    privacySelection.addEventListener("change", () => {savePrivacy(privacySelection)});


    let privateOption = document.createElement("option");
    privateOption.textContent = "Private";
    privacySelection.appendChild(privateOption);
    privateOption.selected = (thisBudget.privacy === "private") ? 1 : 0;
    let publicOption = document.createElement("option");
    publicOption.textContent = "Public";
    publicOption.selected = (thisBudget.privacy === "public") ? 1 : 0;
    privacySelection.appendChild(publicOption);
    privacySelectionContainer.appendChild(privacySelection);
    buttonContainer.appendChild(privacySelectionContainer);

    let miniSpace = document.createElement("div");
    miniSpace.className = "tiny-filler";
    buttonContainer.appendChild(miniSpace);
    
    let viewButton = document.createElement("button");
    viewButton.className = "btn btn-light";
    viewButton.textContent = "View";
    viewButton.addEventListener("click", () => {viewBudget(viewButton)});
    buttonContainer.appendChild(viewButton);

    miniSpace = document.createElement("div");
    miniSpace.className = "tiny-filler";
    buttonContainer.appendChild(miniSpace);

    let editButton = document.createElement("button");
    editButton.className = "btn btn-light";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {editName(editButton)});
    buttonContainer.appendChild(editButton);

    miniSpace = document.createElement("div");
    miniSpace.className = "tiny-filler";
    buttonContainer.appendChild(miniSpace);
    
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-light";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {deleteBudget(deleteButton)});
    buttonContainer.appendChild(deleteButton);

    row.appendChild(buttonContainer);

    let budgetInfoContainer = document.querySelector("#my-budgets-container");
    budgetInfoContainer.appendChild(row);
}

function savePrivacy(selectElement) {
    //Figure out which budget that row correlates to, and update the budget.privacy to be "private" or "public" accordingly
    let budgetName = selectElement.parentElement.parentElement.parentElement.querySelector(".info-title").textContent;
    let budgetElement = parseBudget(budgetName);
    budgetElement.privacy = selectElement.value.toLowerCase();
    saveBudget(budgetElement, budgetName);
}

function viewBudget(buttonElement) {
    //Change the selected budget to be the one selected, and go to the page with that budget loaded in
    let budgetName = buttonElement.parentElement.parentElement.querySelector(".info-title").textContent;
    localStorage.setItem("currentBudget", budgetName);
    localStorage.removeItem("guestBudget");
    window.location.href = "projected.html";
}

function parseBudget(budgetName) {
    for (let i = 0; i < currUser.budgets.length; i++) {
        if (currUser.budgets[i].budgetName === budgetName) {
            return currUser.budgets[i];
        }
    }
}

function saveBudget(budgetElement, budgetName) {
    for (let i = 0; i < currUser.budgets.length; i++) {
        if (currUser.budgets[i].budgetName === budgetName) {
            currUser.budgets[i] = budgetElement;
            break;
        }
    }

    saveUser(currUser);
}

async function saveUser(userDataToSave) {
    try {
        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                    'user': userDataToSave,
                    'guestBudget': null
                })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            if (resObj.responseMsg === "noUser") alert("User does not exist");
            else if (resObj.responseMsg === "badAuth") alert("Authentication token has expired");
            else alert("An error occurred: " + resObj.responseMsg);
        }
        else if (userDataToSave.username === currUser.username) {
            localStorage.setItem("user", JSON.stringify(userDataToSave));
            currUser = JSON.parse(localStorage.getItem("user"));
        }
    }
    catch {
        console.log("Update User Error");
    }
}

async function newBudget() {
    //Select the budgets for currUser and append a new budget to it according to the inputted name
    //Then unload the budgets and call loadBudgets

    budgetName = prompt("Enter new budget name:");
    if (!budgetName) return;
    try {
        const response = await fetch('/api/budget', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'username': currUser.username,
                'newBudgetName': budgetName
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            if (resObj.responseMsg === "dupeBudget") alert("That budget name is already in use");
            else if (resObj.responseMsg === "badAuth") alert("Authentication token has expired");
            else alert("An error occurred: " + resObj.responseMsg);
        }
        else {
            localStorage.setItem("user", JSON.stringify(resObj.data));
            currUser = JSON.parse(localStorage.getItem("user"));
            localStorage.setItem("currentBudget", budgetName);
            loadBudgets();
        }
    }
    catch {
        console.log("New Budget Error");
    }
}

async function editName(editButton) {
    //Input the new budget name. Find the budget corresponding to that button. Edit the name in localStorage. Call load.
    let budgetInfoContainer = editButton.parentElement.parentElement;
    let oldBudgetName = budgetInfoContainer.querySelector(".info-title").textContent;
    let newBudgetName = prompt("Enter budget name:");
    if (newBudgetName === "" || newBudgetName === null) return;
    if (budgetNameAlreadyExists(newBudgetName)) {
        alert("That budget name is already in use");
        return;
    }
    let budgetElement = parseBudget(oldBudgetName);
    budgetElement.budgetName = newBudgetName;
    saveBudget(budgetElement, oldBudgetName);
    loadBudgets();
}

function budgetNameAlreadyExists(name) {
    //Returns true if the budget already exists and false otherwise
    for (thisBudget of currUser.budgets) if (thisBudget.budgetName === name) return true;
    return false;
}

function deleteBudget(deleteButton) {
    //Deletes the budget with that name (after confirmation)
    let budgetInfoContainer = deleteButton.parentElement.parentElement;
    let budgetName = budgetInfoContainer.querySelector(".info-title").textContent;
    if (!confirm("Do you want to delete the budget " + budgetName + "?")) return;

    for (let i = 0; i < currUser.budgets.length; i++) {
        if (currUser.budgets[i].budgetName === budgetName) {
            currUser.budgets.splice(i, 1);
            break;
        }
    }

    saveUser(currUser);
    loadBudgets();
}

async function addFriend() {
    try {
        let friendUsername = document.getElementById("new-request").value; //This is the user to friend
        if (friendUsername === "") return;
        const response = await fetch("/api/friend-request", {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                currUsername: currUser.username,
                friendName: friendUsername
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            switch (resObj.responseMsg) {
                case ("noUser"):
                    alert("User does not exist");
                    break;
                case ("alreadyFriends"):
                    alert(`${friendUsername} is already your friend`)
                    break;
                case ("alreadyRequested"):
                    alert("Friend already requested")
                    break;
                case ("doubleRequest"):
                    alert(`${friendUsername} already sent you a friend request!`);
                    break;
                case ("self"):
                    alert("You can't friend yourself");
                    break;
                case ("badAuth"):
                    alert("Authentication token has expired");
                    break;
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else {
            alert("Friend request sent");
            load();
            ws.send(JSON.stringify(new WSMessage("request", currUser.username, friendUsername)));
        }
    }
    catch {
        console.log("Friend Request Error");
    }
}

function rejectFriend(rejectButton) {
    let friendName = rejectButton.parentElement.parentElement.querySelector(".info-title").textContent;
    respondToFriendRequest(friendName, false);
}

function acceptFriend(acceptButton) {
    let friendName = acceptButton.parentElement.parentElement.querySelector(".info-title").textContent;
    respondToFriendRequest(friendName, true);
}

async function respondToFriendRequest(friendName, accepted) {
    try {
        const response = await fetch('/api/friend-request-response',  {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'requestor': friendName,
                'currUser': currUser.username,
                'accept': accepted
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            switch (resObj.responseMsg) {
                case "noUser":
                    alert(`${currUser.username} doesn't exist`);
                    break;
                case "noFriend":
                    alert(`${friendName} doesn't exist`);
                    break;
                case "alreadyFriend":
                    alert(`${friendName} is already your friend`);
                    break;
                case "notSent":
                    alert("Friend request was never sent");
                    break;
                case "badAuth":
                    alert("Authentication token has expired");
                    break;
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else if (accepted) alert(`Friend added: ${friendName}`);
        load();
        if (accepted) ws.send(JSON.stringify(new WSMessage("request", currUser.username, friendName)));
    }
    catch {
        console.log("Accept Friend Error");
    }
}

function loadFriends() {
    let friendContainers = document.getElementById("my-friends-container");
    
    //Display all incoming friend requests
    for (request of currUser.receivedFriendRequests) {
        displayFriendRequest(request);
    }

    //Display all friends public budgets
    for (friend of currUser.friends) {
        let friendContainer = document.createElement("div");
        friendContainer.className = "friend";

        //Add the title to the DOM
        displayFriendName(friendContainer, friend.username);

        //Add the budgets to the DOM
        for (budgetName of friend.publicBudgets) {
            displayFriendBudget(friendContainer, budgetName, friend.username);
        }
        friendContainers.appendChild(friendContainer);
    }

    function displayFriendRequest(request) {
        let requestContainer = document.createElement("div");
        requestContainer.className = "friend-info-container";

        let requestTitleContainer = document.createElement("div");

        let requestTitle = document.createElement("span");
        requestTitle.className = "info-title";
        requestTitle.textContent = request.username;
        requestTitleContainer.appendChild(requestTitle);

        let requestText = document.createElement("span");
        requestText.textContent = " sent a friend request";
        requestTitleContainer.appendChild(requestText);
        requestContainer.appendChild(requestTitleContainer);

        let space = document.createElement("div");
        space.className = "info-filler";
        requestContainer.appendChild(space);

        let buttonContainer = document.createElement("div");
        buttonContainer.className = "budget-info-buttons-container";

        let acceptButton = document.createElement("button");
        acceptButton.type = "button";
        acceptButton.className = "btn btn-light";
        acceptButton.textContent = "Accept";
        acceptButton.onclick = () => acceptFriend(acceptButton);
        buttonContainer.appendChild(acceptButton);

        let miniSpace = document.createElement("div");
        miniSpace.className = "tiny-filler";
        buttonContainer.appendChild(miniSpace);

        let rejectButton = document.createElement("button");
        rejectButton.type = "button";
        rejectButton.className = "btn btn-light";
        rejectButton.textContent = "Reject";
        rejectButton.onclick = () => rejectFriend(rejectButton);
        buttonContainer.appendChild(rejectButton);
        requestContainer.appendChild(buttonContainer);
        friendContainers.appendChild(requestContainer);
    }

    function displayFriendName(friendContainer, friendName) {
        let unread = unreadMsgs.get(friendName);

        let friendNameContainer = document.createElement("div");
        friendNameContainer.className = "friend-info-container";

        let friendTitle = document.createElement("div");
        friendTitle.className = "info-title friend-name";
        friendTitle.textContent = friendName;
        friendTitle.style.fontWeight = (unread) ? "bolder" : "normal";
        friendNameContainer.appendChild(friendTitle);
        
        let space = document.createElement("div");
        friendNameContainer.appendChild(space);

        let buttonContainer = document.createElement("div");
        buttonContainer.className = "budget-info-buttons-container";

        let msgButton = document.createElement("button");
        msgButton.type = "button";
        msgButton.className = "btn btn-light";
        if (unread) msgButton.style.backgroundColor = "#ff46af";
        msgButton.textContent = "Message";
        msgButton.onclick = () => openMessage(msgButton);
        buttonContainer.appendChild(msgButton);
        friendNameContainer.appendChild(buttonContainer);
        friendContainer.appendChild(friendNameContainer);
    }

    function displayFriendBudget(friendContainer, budgetName, friendName) {
        let budgetContainer = document.createElement("div");
        budgetContainer.className = "friend-info-container";

        let space = document.createElement("div");
        space.className = "info-filler";
        budgetContainer.appendChild(space);

        let budgetTitle = document.createElement("div");
        budgetTitle.className = "info-title budget-name";
        budgetTitle.textContent = budgetName;
        budgetContainer.appendChild(budgetTitle);

        space = document.createElement("div");
        space.className = "info-filler";
        budgetContainer.appendChild(space);

        let buttonContainer = document.createElement("div");
        buttonContainer.className = "budget-info-buttons-container";
        
        if (requestAlreadySent(budgetName, friendName)) {
            let reqTitle = document.createElement("div");
            reqTitle.textContent = "Request sent";
            buttonContainer.appendChild(reqTitle);
        }
        else {
            let reqViewButton = document.createElement("button");
            reqViewButton.type = "button";
            reqViewButton.className = "btn btn-light";
            if (isPermitted(friendName, budgetName)) {
                reqViewButton.textContent = "View";
                reqViewButton.onclick = () => viewFriendsBudget(reqViewButton);
            }
            else {
                reqViewButton.textContent = "Request Access";
                reqViewButton.onclick = () => requestFriendsBudget(reqViewButton);
            }
            buttonContainer.appendChild(reqViewButton);
        }
        budgetContainer.appendChild(buttonContainer);
        friendContainer.appendChild(budgetContainer);
    }
}

function isPermitted(friendName, budgetName) {
    let friend = getFriend(friendName);
    for (thisBudgetName of friend.permittedBudgets) {
        if (thisBudgetName === budgetName) return true;
    }
    return false;
}

function getFriend(username) {
    for (eachFriend of currUser.friends) {
        if (eachFriend.username === username) return eachFriend;
    }
    return null;
}

async function requestFriendsBudget(requestButton) {
    let friendName = requestButton.parentElement.parentElement.parentElement.querySelector(".friend-name").textContent;
    let budgetName = requestButton.parentElement.parentElement.querySelector(".budget-name").textContent;

    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'budgetRequest': {
                    'currUsername': currUser.username,
                    'friendUsername': friendName,
                    'budgetName': budgetName
                }
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            if (resObj.responseMsg === "alreadyRequested") alert("Budget has already been requested");
            else if (resObj.responseMsg === "badAuth") alert("Authentication token has expired");
            else alert("An error occurred: " + resObj.responseMsg);
        }
        else {
            load();
            ws.send(JSON.stringify(new WSMessage("message", currUser.username, friendName)));
        }
    }
    catch {
        console.log("Budget Request Error");
    }
}

function requestAlreadySent(budgetName, friendName) {
    let friend = getFriend(friendName);
    if (friend === null) return true;
    for (message of friend.messages) {
        if (message !== null && message.params.length > 1 && message.params[1] === budgetName && message.tag === "request") return true;
    }
    return false;
}

async function viewFriendsBudget(viewButton) {
    // If you don't have a friend object for them, display an alert
    let friendName = viewButton.parentElement.parentElement.parentElement.querySelector(".friend-name").textContent;
    let budgetName = viewButton.parentElement.parentElement.querySelector(".budget-name").textContent;

    try {
        const response = await fetch('/api/view-friend', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'currUsername': currUser.username,
                'friendName': friendName,
                'budgetName': budgetName
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            switch (resObj.responseMsg) {
                case ("noUser"):
                    alert("User does not exist");
                    break;
                case ("noFriend"):
                    alert(`${friendName} doesn't exist`);
                    break;
                case ("noBudget"):
                    alert(`${budgetName} doesn't exist (perhaps it was deleted?)`);
                    break;
                case ("notPublic"):
                    alert(`${budgetName} is not marked as public`);
                    break;
                case ("notPermitted"):
                    alert(`You were not given access to ${budgetName}`);
                    break;
                case ("notFriend"):
                    alert(`${friendName} is not your friend`);
                    break;
                case ("badAuth"):
                    alert("Authentication token has expired");
                    break;
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else {
            let guestBudget = resObj.data;
            localStorage.setItem("guestBudget", JSON.stringify(guestBudget));
            localStorage.setItem("budgetOwner", friendName);
            localStorage.setItem("currentBudget", budgetName);
            window.location.href = "projected.html";
        }
    }
    catch {
        console.log("View Friend's Budget Error");
    }
}

async function sendMessage() {
    try {
        if (activeMessage === null) return;
        let currUsername = currUser.username
        let body = document.querySelector("#response").value;
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'messageData': {
                    'currUsername': currUsername,
                    'friendName': activeMessage,
                    'body': body
                }
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            if (resObj.responseMsg === "noUser") alert("User does not exist");
            else if (resObj.responseMsg === "noFriend") alert(`${activeMessage} doesn't exist`);
            else if (resObj.responseMsg === "badAuth") alert("Authentication token has expired");
            else alert("An error occurred: " + resObj.responseMsg);
        }
        else {
            ws.send(JSON.stringify(new WSMessage("message", currUsername, activeMessage)));
            document.querySelector("#response").value = "";
            load();
        }
    }
    catch {
        console.log("Send Message Error");
    }
}

function openMessage(msgButton) {
    activeMessage = msgButton.parentElement.parentElement.querySelector(".info-title").textContent;
    unreadMsgs.delete(activeMessage);
    load();
}

function loadMessages() {
    if (activeMessage === null) {
        document.getElementById("response").disabled = true;
        document.querySelector(".response-button").disabled = true;
        return;
    }
    document.getElementById("response").disabled = false;
    document.querySelector(".response-button").disabled = false;
    document.getElementById("message-title").textContent = `Messaging ${activeMessage}`;
    let friendData = getFriend(activeMessage);
    for (message of friendData.messages) {
        displayMessage(message);
    }
}

function displayMessage(message) {
    let messageContainer = document.getElementById("messages");
    
    let thisMessageContainer = document.createElement("div");
    thisMessageContainer.className = "message-line-container";

    if (message.tag === "request") {
        thisMessageContainer.appendChild(displayRequest(message));
    }
    else if (message.tag === "permission") {
        thisMessageContainer.appendChild(displayPermission(message, true));
    }
    else if (message.tag === "rejection") {
        thisMessageContainer.appendChild(displayPermission(message, false));
    }
    else {
        let messageTitle = document.createElement("span");
        messageTitle.textContent = `${message.origin}: `;
        thisMessageContainer.appendChild(messageTitle);
        
        let inputtedMessage = message.body;
        let newMessage = document.createElement("span");
        newMessage.textContent = inputtedMessage;
        thisMessageContainer.appendChild(newMessage);
    }
    messageContainer.appendChild(thisMessageContainer);
}

function displayRequest(request) {
    let reqContainer = document.createElement("div");
    let friendName = request.params[0];
    let budgetName = request.params[1];

    if (request.origin === currUser.username) {
        let reqMsg = document.createElement("span");
        reqMsg.textContent = `You requested access to ${friendName}'s budget: ${budgetName}`;
        reqContainer.appendChild(reqMsg);
    }
    else {
        let reqMsg = document.createElement("span");
        reqMsg.textContent = `${request.origin} requested access to your budget: ${budgetName}`
        reqContainer.appendChild(reqMsg);
        
        let acceptButton = document.createElement("button");
        acceptButton.className = "btn btn-light";
        acceptButton.textContent = "Accept";
        acceptButton.onclick = () => givePermission(request.origin, budgetName, true);
        reqContainer.appendChild(acceptButton);
        
        let declineButton = document.createElement("div");
        declineButton.className = "btn btn-light";
        declineButton.textContent = "Decline";
        declineButton.onclick = () => givePermission(request.origin, budgetName, false);
        reqContainer.appendChild(declineButton);
    }
    return reqContainer;
}

function displayPermission(permission, permitted) {
    let permitContainer = document.createElement("div");
    let friendName = permission.params[0];
    let budgetName = permission.params[1];

    let permitMsg = document.createElement("div");
    if (permission.origin === currUser.username) {
        if (permitted) permitMsg.textContent = `You permitted ${friendName} to access your budget: ${budgetName}`;
        else permitMsg.textContent = `You denied ${friendName}'s request to access your budget: ${budgetName}`;
    }
    else {
        if (permitted) permitMsg.textContent = `${permission.origin} gave you access to their budget: ${budgetName}`;
        else permitMsg.textContent = `${permission.origin} denied you access to their budget: ${budgetName}`;
    }
    permitContainer.appendChild(permitMsg);
    return permitContainer;
}

async function givePermission(friendName, budgetName, permitted) {
    try {
        const response = await fetch('/api/budget-response', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'currUsername': currUser.username,
                'friendName': friendName,
                'budgetName': budgetName,
                'isPermitted': permitted
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            if (resObj.responseMsg === "noUser") alert("User does not exist");
            else if (resObj.responseMsg === "noFriend") alert(`${activeMessage} doesn't exist`);
            else if (resObj.responseMsg === "badAuth") alert("Authentication token has expired");
            else alert("An error occurred: " + resObj.responseMsg);
        }
        else {
            load();
            ws.send(JSON.stringify(new WSMessage("request", currUser.username, friendName)));
        }
    }
    catch {
        console.log("Give Permission Error");
    }
}

async function logout() {
    await fetch('/api/removeAuth', {
        method: 'PUT'
    });
    window.location.href = "index.html";
}

class Message {
    constructor(origin, body, tag=null, params=[]) {
        this.origin = origin;
        this.body = body;
        this.tag = tag;
        this.params = params;
    }
}

class WSMessage {
    constructor(tag, username, friendName) {
        this.tag = tag;
        this.origin = username;
        this.destination = friendName;
    }
}