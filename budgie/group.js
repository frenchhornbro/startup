//Feature: Assign a random color to the name of each person messaging

//TODO: Add an edit budget name button next to the View button
//TODO: Add a delete budget button next to the Edit button
//TODO: Don't allow duplicate budget names


let user = localStorage.getItem("currentUser");
let budget = localStorage.getItem("currentBudget");
let users = JSON.parse(localStorage.getItem("users"));
let currUser = null;
for (thisUser of users) {
    if (thisUser.username === user) {
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
    let budgetName = buttonElement.parentElement.parentElement.parentElement.querySelector(".info-title").textContent;
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

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === user) {
            users[i] = currUser;
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
    
    let newBudget = {budgetName: budgetName, privacy: "private", initial: 0, pIncome: [], pExpenses: [], aIncome: [], aExpenses: []};
    currUser.budgets.push(newBudget);
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === user) {
            users[i] = currUser;
            break;
        }
    }
    localStorage.setItem("users", JSON.stringify(users));
    loadBudgets();
    localStorage.setItem("currentBudget", budgetName);
    window.location.href = "projected.html";
}

function editName(editButton) {
    //Input the new budget name. Find the budget corresponding to that button. Edit the name in localStorage. Call load.
    let budgetInfoContainer = editButton.parentElement.parentElement;
    let oldBudgetName = budgetInfoContainer.querySelector(".info-title").textContent;
    console.log(oldBudgetName)
    let newBudgetName = prompt("Enter budget name:");
    if (newBudgetName === "" || newBudgetName === null) return;
    let budgetElement = parseBudget(oldBudgetName);
    budgetElement.budgetName = newBudgetName;
    saveBudget(budgetElement, oldBudgetName);
    loadBudgets();
}

function deleteBudget(deleteButton) {
    console.log("deleteBudget called");
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
}

function logout() {
    window.location.href = "index.html";
}