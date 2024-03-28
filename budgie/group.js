//Feature: Assign a random color to the name of each person messaging and display it for their name
//Feature: Limit number of budgets that can be created

//TODO: Rename "Group" to "Home"

let users = JSON.parse(localStorage.getItem("users"));
let currUser = null;
for (thisUser of users) {
    if (thisUser.username === localStorage.getItem("currentUser")) {
        currUser = thisUser;
        break;
    }
}

function load() {
    unload();
    loadBudgets();
    loadFriends();
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

function saveUser(userDataToSave) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === userDataToSave.username) {
            users[i] = userDataToSave;
            break;
        }
    }
    localStorage.setItem("users", JSON.stringify(users));
}

function newBudget() {
    //Select the budgets for currUser and append a new budget to it according to the inputted name
    //Then unload the budgets and call loadBudgets
    budgetName = prompt("Enter new budget name:");
    if (budgetName === null || budgetName === "") return;
    if (budgetNameAlreadyExists(budgetName)) {
        alert("That budget name is already in use");
        return;
    }
    
    let newBudget = {budgetName: budgetName, privacy: "private", initial: 0, pIncome: [], pExpenses: [], aIncome: [], aExpenses: []};
    currUser.budgets.push(newBudget);
    
    saveUser(currUser);
    loadBudgets();
    localStorage.setItem("currentBudget", budgetName);
    window.location.href = "projected.html";
}

function editName(editButton) {
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
    localStorage.setItem("users", JSON.stringify(users));
    loadBudgets();
}

function sendMessage() {
    let messageContainer = document.querySelector(".messages");
    
    let thisMessageContainer = document.createElement("div");

    let messageTitle = document.createElement("span");
    messageTitle.textContent = "You: ";
    thisMessageContainer.appendChild(messageTitle);

    let inputtedMessage = document.querySelector("#response").value;
    let newMessage = document.createElement("span");
    newMessage.textContent = inputtedMessage;
    thisMessageContainer.appendChild(newMessage);

    messageContainer.appendChild(thisMessageContainer);
    
    document.querySelector("#response").value = "";
    
    //TODO: Save messages sent
    // Logic: Store the messageTitle and newMessage together as a JSON object in "messages" in localStorage based on the username

    //TODO: Have a clear button for messages / make them expire after so much time...? How would I even count time when the page isn't rendered?

    //TODO: Send fake messages every so often

    //TODO: Automatically make two fake accounts who are friends with everyone)
}

function addFriend() {
    //TODO: Eventually cap the number of friend requests that can be sent in a day, or set a time limit between sending friend requests
    let friendUsername = document.getElementById("new-request").value; //This is the user to firend
    // Can't send a friend request if they have a blank username or if they're your own user
    if (friendUsername === null || friendUsername === "" || friendUsername === currUser.username) return;
    if (!userExists(friendUsername)) alert("User does not exist");
    else {
        // Can't send a friend request to those who are already your friends
        if (inList(friendUsername, currUser.friends)) {
            alert(`${friendUsername} is already your friend`)
            return;
        }
        // If a friend request has already been sent, prevent another one from being sent
        if (inList(friendUsername, currUser.sentFriendRequests)) {
            alert("Friend already requested")
            return;
        }
        //If they have already sent a friend request to you, prevent sending a friend request to them
        if (inList(friendUsername, currUser.receivedFriendRequests)) {
            alert(`${friendUsername} already sent you a friend request! Accept it in messages.`);
            return;
        }
        currUser.sentFriendRequests.push(new FriendRequest(friendUsername));
        saveUser(currUser);
        for (user of users) {
            if (user.username === friendUsername) {
                user.receivedFriendRequests.push(new FriendRequest(currUser.username));
                saveUser(user);
                break;
            }
        }
        alert("Friend request sent");
    }
}

function userExists(username) {
    for (thisUser of users) {
        if (thisUser.username === username) {
            return true;
        }
    }
    return false;
}

function inList(username, list) {
    if (list === null) return false;
    for (thisUser of list) {
        if (thisUser.username === username) return true;
    }
    return false;
}

function rejectFriend(rejectButton) {
    let friendName = rejectButton.parentElement.parentElement.querySelector(".info-title").textContent;
    let friendData = verifyRequest(friendName);
    if (friendData === null) return;
    removeRequest(friendName, friendData);
    load();
}

function acceptFriend(acceptButton) {
    let friendName = acceptButton.parentElement.parentElement.querySelector(".info-title").textContent;
    let friendData = verifyRequest(friendName);
    if (friendData === null) return;
    removeRequest(friendName, friendData);

    let friend = new Friend(friendName);
    currUser.friends.push(friend)
    saveUser(currUser);

    let thisUser = new Friend(currUser.username);
    friendData.friends.push(thisUser);
    saveUser(friendData);

    alert(`Friend added: ${friendName}`);
    load();
}

function verifyRequest(friendName) {
    //Verify the friend request was actually sent and that they're not already a friend
    if (!userExists(friendName)) return null;
    if (inList(friendName, currUser.friends)) return null;
    let friendData = null;
    for (thisUser of users) {
        if (thisUser.username === friendName) {
            friendData = thisUser;
            break;
        }
    }
    if (!inList(currUser.username, friendData.sentFriendRequests)) return null;
    return friendData;
}

function removeRequest(friendName, friendData) {
    //Remove friend's username from currUser's receivedFriendRequests list
    for (let i = 0; i < currUser.receivedFriendRequests.length; i++) {
        if (currUser.receivedFriendRequests[i].username === friendName) {
            currUser.receivedFriendRequests.splice(i,1);
            saveUser(currUser);
            break;
        }
    }

    //Remove currUser's usernamename from friend's sentFriendRequests list
    for (let i = 0; i < friendData.sentFriendRequests.length; i++) {
        if (friendData.sentFriendRequests[i].username === currUser.username) {
            friendData.sentFriendRequests.splice(i, 1);
            saveUser(friendData);
            break;
        }
    }
}

function loadFriends() {
    //TODO: Maybe make this async? The "then" part is each friend

    let friendContainers = document.getElementById("my-friends-container");
    
    //Display all incoming friend requests
    for (request of currUser.receivedFriendRequests) {
        displayFriendRequest(request);
    }

    //Display all friends public budgets
    for (friend of currUser.friends) {
        let friendData = null;
        for (user of users) {
            if (user.username === friend.username) {
                friendData = user;
                break;
            }
        }

        let friendContainer = document.createElement("div");
        friendContainer.className = "friend";

        //Add the title to the DOM
        displayFriendName(friendContainer, friendData);

        //Add the budgets to the DOM
        for (thisBudget of friendData.budgets) {
            if (thisBudget.privacy === "public") {
                displayBudget(friendContainer, thisBudget);
            }
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

    function displayFriendName(friendContainer, friendData) {
        let friendNameContainer = document.createElement("div");
        friendNameContainer.className = "friend-info-container";
        
        let friendTitle = document.createElement("div");
        friendTitle.className = "info-title";
        friendTitle.textContent = friendData.username;
        friendNameContainer.appendChild(friendTitle);
        
        let space = document.createElement("div");
        space.className = "info-title";
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

    function displayBudget(friendContainer, thisBudget) {
                let budgetContainer = document.createElement("div");
                budgetContainer.className = "friend-info-container";

                let space = document.createElement("div");
                space.className = "info-filler";
                budgetContainer.appendChild(space);

                let budgetTitle = document.createElement("div");
                budgetTitle.clasName = "info-title";
                budgetTitle.textContent = thisBudget.budgetName;
                budgetContainer.appendChild(budgetTitle);

                space = document.createElement("div");
                space.className = "info-filler";
                budgetContainer.appendChild(space);

                let buttonContainer = document.createElement("div");
                buttonContainer.className = "budget-info-buttons-container";
                
                let requestButton = document.createElement("div");
                requestButton.type = "button";
                requestButton.className = "btn btn-light";
                requestButton.textContent = "Request Access";
                requestButton.onclick = () => requestFriendsBudget(requestButton);
                //TODO: ^^^ Save permissions within a Friend object and display View or Request Access (and their functions) accordingly
                buttonContainer.appendChild(requestButton);
                budgetContainer.appendChild(buttonContainer);
                friendContainer.appendChild(budgetContainer);
    }
}

function requestFriendsBudget(requestButton) {
    console.log("requestFriendsBudget called");
    //TODO: Implement requesting access to a friend's budget.
    //Logic:
    // Send a request message in messages
    // If it's accepted, change the button text (and corresponding function) to "view",
    //      and add the budget name to "approvedBudgets" for that friend in "friends" in localStorage
    // If it's rejected, return the button to the "Request Access" text (and corresponding function)
}

function viewFriendsBudget(budget) {
    console.log("viewFriendsBudget called");
    //TODO: Implement viewing a friend's budget (have two fake accounts already set up and display their data)
    //      Logic:
    // Verify you're in their friends' list
    // Call that budget as the guestBudget (new localStorage variable)
    // Disable all buttons in Budget View since the guestBudget is not null
}

function openMessage(msgButton) {
    console.log("openMessage called");
    //TODO: Implement opening the messaging box for a friend
    //      Logic:
    // Have a variable for group.js called activeMessagingBox, set to the username of your friend
    // Pull the info from that friend's username in `messages` in localStorage
    // Populate any buttons with the functions they store
}

function logout() {
    window.location.href = "index.html";
}

class FriendRequest { //Eventually could include number of friend requests sent to that person as an attribute
    constructor(username) {
        this.username = username
    }
}

class Friend {
    constructor(username) {
        this.username = username;
        this.permittedBudgets = []; //TODO: Wherever that happens, permitted budgets should be checked each time to remove budgets that have been deleted
    }
}