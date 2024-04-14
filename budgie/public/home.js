//Feature: Assign a random color to the name of each person messaging and display it for their name
//Feature: Limit number of budgets that can be created
//Feature: Eventually cap the number of friend requests that can be sent in a day, or set a time limit between sending friend requests
//Feature: Could set a time for each message to let it expire
//Take note: There's a vulnerability wherever we set a value to the textContent of an attribute, as that can be edited

let activeMessage = null;
localStorage.removeItem("budgetOwner");
let currUser = JSON.parse(localStorage.getItem("user"));

// callPlaceholdersMsgs();

async function load() {
    // genPlaceholderFriend();
    unload();
    await updateCurrUser();
    loadBudgets();
    loadFriends();
    loadMessages();
}

async function updateCurrUser() {
    let user = await fetch(`/api/user/${currUser.username}`);
    let userObj = await user.json();
    localStorage.setItem("user", JSON.stringify(userObj));
    currUser = JSON.parse(localStorage.getItem("user"));
}

function unload() {
    while (document.querySelector(".budget-info-container") !== null) {
        document.querySelector(".budget-info-container").remove();
    }

    while (document.querySelector(".friend") !== null) {
        document.querySelector(".friend").remove();
    }

    while (document.querySelector(".friend-info-container") !== null) {
        document.querySelector(".friend-info-container").remove();
    }

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
            body: JSON.stringify(userDataToSave)
        });
        const resObj = await response.json();
        if (resObj.isError) alert("An error occurred: " + resObj.responseMsg);
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
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else {
            alert("Friend request sent");
            load();
        }
    }
    catch {
        console.log("Friend Request Error");
    }
}

async function userExists(username) {
    try {
        const response = await fetch('/api/user-exists', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({'username': username})
        });
        const resObj = await response.json();
        if (resObj.isError) alert("An error occurred: " + resObj.responseMsg);
        else return resObj.data.exists;
    }
    catch {
        console.log("User Exists Error");
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
                requestor: friendName,
                currUser: currUser.username,
                accept: accepted
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
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else if (accepted) alert(`Friend added: ${friendName}`);
        load();
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
        let friendNameContainer = document.createElement("div");
        friendNameContainer.className = "friend-info-container";
        
        let friendTitle = document.createElement("div");
        friendTitle.className = "info-title friend-name";
        friendTitle.textContent = friendName;
        friendNameContainer.appendChild(friendTitle);
        
        let space = document.createElement("div");
        friendNameContainer.appendChild(space);

        let buttonContainer = document.createElement("div");
        buttonContainer.className = "budget-info-buttons-container";

        let msgButton = document.createElement("button");
        msgButton.type = "button";
        msgButton.className = "btn btn-light";
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
            if (isPermitted(friendName)) {
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

function isPermitted(friendName) {
    let friend = getFriend(friendName);
    for (thisBudgetName of friend.permittedBudgets) {
        if (thisBudgetName === thisBudget.budgetName) return true;
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
            else alert("An error occurred: " + resObj.responseMsg);
        }
        else {
            load();
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

function viewFriendsBudget(viewButton) {
    // If you don't have a friend object for them, display an alert
    let friendName = viewButton.parentElement.parentElement.parentElement.querySelector(".friend-name").textContent;
    let friend = getFriend(friendName);
    if (friend === null) {
        alert(`${friendName} is not listed as one of your friends :(`);
        return;
    }
    
    // If the budget is not listed in permittedBudgets, display an alert
    let budgetName = viewButton.parentElement.parentElement.querySelector(".budget-name").textContent;
    if (!isPermitted(friend.username)) {
        alert(`You have not been granted access to ${budgetName}`)
        return;
    }
    
    // If friend no longer exists, display an alert
    let friendUserData = null;
    for (thisUser of users) {
        if (thisUser.username === friendName) {
            friendUserData = thisUser;
            break;
        }
    }
    if (friendUserData === null) {
        alert(`${friendName} is not an existing user`);
        return;
    }
    
    // If budget no longer exists, display an alert and remove it from the friend's permittedBudgets
    let budgetData = null;
    for (thisBudget of friendUserData.budgets) {
        if (thisBudget.budgetName === budgetName) {
            budgetData = thisBudget.budgetName;
            break;
        }
    }
    if (budgetData === null) {
        alert(`${budgetName} has been deleted`);
        removePermissions(friendName, budgetName);
        return;
    }

    // If a budget is set to private, display an alert and remove it from the friend's permittedBudgets
    if (budgetData.privacy === "private") {
        alert(`${budgetName} has been set as a private budget`);
        removePermissions(friendName, budgetName);
        return;
    }

    // Call that budget as the guestBudget (new localStorage variable)
    localStorage.setItem("budgetOwner", friendName);
    localStorage.setItem("currentBudget", budgetName);
    window.location.href = "projected.html";
}

function removePermissions(friendName, budgetName) {
    for (let i = 0; i < currUser.friends.length; i++) {
        if (currUser.friends[i].username === friendName) {
            let friend = currUser.friends[i];
            for (let j = 0; j < friend.permittedBudgets.length; j++) {
                if (friend.permittedBudgets[i] === budgetName) {
                    currUser.friends[i].permittedBudgets.slice(j, 1);
                    break;
                }
            }
            break;
        }
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
            else alert("An error occurred: " + resObj.responseMsg);
        }
        else {
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

function givePermission(friendName, budgetName, permitted) {
    //Get friend data
    let friendData = null;
    for (thisUser of users) {
        if (thisUser.username === friendName) {
            friendData = thisUser;
            break;
        }
    }
    if (friendData === null) return;

    //Get currUser's friend object in friendData
    let currUserFriend = null;
    for (thisFriend of friendData.friends) {
        if (thisFriend.username === currUser.username) {
            currUserFriend = thisFriend;
            break;
        }
    }
    if (currUserFriend === null) return;

    //Add budgetName to permittedBudgets
    if (permitted) currUserFriend.permittedBudgets.push(budgetName);

    //Change the message in friend's inbox
    changeFriendsInbox(currUserFriend, friendData, friendName, budgetName, permitted);

    //Change the message in currUser's inbox
    changeCurrUsersInbox(friendName, budgetName, permitted);
    
    //Reload
    load();
}

function changeFriendsInbox(currUserFriend, friendData, friendName, budgetName, permitted) {
    for (let i = 0; i < currUserFriend.messages.length; i++) {
        let message = currUserFriend.messages[i];
        if (message.origin === friendName && message.tag === "request" && message.params[0] === currUser.username && message.params[1] === budgetName) {
            let permitTag = (permitted) ? "permission" : "rejection";
            let permitMessage = new Message(currUser.username, "", permitTag, [friendName, budgetName]);
            currUserFriend.messages[i] = permitMessage;
            break;
        }
    }
    saveUser(friendData);
}

function changeCurrUsersInbox(friendName, budgetName, permitted) {
    for (let i = 0; i < currUser.friends.length; i++) {
        if (currUser.friends[i].username === friendName) {
            let friend = currUser.friends[i];
            for (let j = 0; j < friend.messages.length; j++) {
                let message = friend.messages[j];
                if (message.origin === friendName && message.tag === "request" && message.params[0] === currUser.username && message.params[1] === budgetName) {
                    let permitTag = (permitted) ? "permission" : "rejection";
                    let permitMessage = new Message(currUser.username, "", permitTag, [friendName, budgetName]);
                    currUser.friends[i].messages[j] = permitMessage;
                    break;
                }
            }
            break;
        }
    }
    saveUser(currUser);
}

function logout() {
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

// function genPlaceholderFriend() {
//     if (getFriend("Bot Friend") !== null) return;

//     let friendData = null;
//     for (thisUser of users) {
//         if (thisUser.username === "Bot Friend") {
//             friendData = thisUser;
//             break;
//         }
//     }

//     let botFriend = new Friend("Bot Friend");
//     botFriend.permittedBudgets.push("Bot Friend's Budget");
//     currUser.friends.push(botFriend)
//     saveUser(currUser);

//     let currUserFriend = new Friend(currUser.username);
//     friendData.friends.push(currUserFriend);
//     saveUser(friendData);
// }

// function callPlaceholdersMsgs() {
//     setTimeout(() => genPlaceholderMsgs(), 18000);
// }

// function genPlaceholderMsgs() {
//     let botFriendData = null;
//     for (let i = 0; i < users.length; i++) {
//         if (users[i].username === "Bot Friend") {
//             botFriendData = users[i];
//             break;
//         }
//     }

//     let name = "Bot Friend"
//     let body = genPlaceholderBody();
//     let message = new Message(name, body);
//     if (activeMessage === "Bot Friend") displayMessage(message);

//     for (let i = 0; i < currUser.friends.length; i++) {
//         if (currUser.friends[i].username === "Bot Friend") {
//             currUser.friends[i].messages.push(message);
//             saveUser(currUser);
//             break;
//         }
//     }

//     for (let i = 0; i < users.length; i++) {
//         if (users[i].username === "Bot Friend") {
//             for (let j = 0; j < users[i].friends.length; j++) {
//                 if (users[i].friends[j].username === currUser.username) {
//                     users[i].friends[j].messages.push(message);
//                     saveUser(users[i]);
//                     break;
//                 }
//             }
//             break;
//         }
//     }
//     callPlaceholdersMsgs();

//     function genPlaceholderBody() {
//         let num = Math.floor(Math.random() * 10);
//         switch (num) {
//             case 1:
//             case 2:
//             case 3:
//             case 4:
//                 return "Hey";
//             case 5:
//                 return "You haven't messaged me in a while";
//             case 6:
//             case 7:
//                 return "I'm bored";
//             case 8:
//                 return "You should make a new budget";
//             case 9:
//                 return "Bro";
//             default:
//                 return "What's up";
//         }
//     }
// }