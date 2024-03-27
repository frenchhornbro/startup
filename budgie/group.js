//Feature: Assign a random color to the name of each person messaging
//Feature: Limit number of budgets that can be created

let budget = localStorage.getItem("currentBudget");
let users = JSON.parse(localStorage.getItem("users"));
let currUser = null;
for (thisUser of users) {
    if (thisUser.username === localStorage.getItem("currentUser")) {
        currUser = thisUser;
        break;
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

function loadBudget(budget) {
    let row = document.createElement("div");
    row.className = "budget-info-container";

    let title = document.createElement("div");
    title.textContent = budget.budgetName;
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
    privateOption.selected = (budget.privacy === "private") ? 1 : 0;
    let publicOption = document.createElement("option");
    publicOption.textContent = "Public";
    publicOption.selected = (budget.privacy === "public") ? 1 : 0;
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
    for (budget of currUser.budgets) if (budget.budgetName === name) return true;
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
    for (user of list) {
        if (user.username === username) return true;
    }
    return false;
}

function inFriendsList(username) {
    if (currUser.friends === null) return false;
    for (friend in currUser.friends) {
        if (friend === username) return true;
    }
    return false;
}

function inSentRequestsList(username) {
    if (currUser.sentFriendRequests === null) return false;
    for (request of currUser.sentFriendRequests) {
        if (request === username) return true;
    }
    return false;
}

function rejectFriend(username) {
    //TODO:
    //Logic:
    //Remove them from the requested list and remove the prompt
    //Call load
}

function acceptFriend(username) {
    //TODO:
    //Logic:
    //If they're already a friend, don't display the prompt
    //Otherwise, add them to the friends list for you and for them, remove them from the requested list,
    // update the prompt text, and alert ("Friend added: ${username}")
    // Call load
}

function displayFriends() {
    //TODO: Implement displaying friends' public budgets (load should call this)
    //Maybe make this async? The "then" part is each friend
    //Logic:
    // For each friend in friends, pull their budgets from users
    // For each budget, if privacy is set to public, then display
    // For each requested friend, display the request
}

function requestFriendsBudget(budget) {
    //TODO: Implement requesting access to a friend's budget.
    //Logic:
    // Send a request message in messages
    // If it's accepted, change the button text (and corresponding function) to "view",
    //      and add the budget name to "approvedBudgets" for that friend in "friends" in localStorage
    // If it's rejected, return the button to the "Request Access" text (and corresponding function)
}

function viewFriendsBudget(budget) {
    //TODO: Implement viewing a friend's budget (have two fake accounts already set up and display their data)
    //      Logic:
    // Verify you're in their friends' list
    // Call that budget as the guestBudget (new localStorage variable)
    // Disable all buttons in Budget View since the guestBudget is not null
}

function openMessage(friend) {
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