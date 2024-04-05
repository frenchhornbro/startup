let dupeWarningShowing = false;
let pwdWarningShowing = false;
let confWarningShowing = false;
let warning = "";
localStorage.removeItem("user");
localStorage.removeItem("currentUser");
localStorage.removeItem("budgetOwner");
localStorage.removeItem("currentBudget");

async function createNewUser() {
    try {
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        const confirm = document.querySelector("#confirm").value;
        const response = await fetch('/api/new-user', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'username': username,
                'password': password,
                'confirm': confirm
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            switch (resObj.responseMsg) {
                case ("dupeUser"):
                    dupeUser();
                    break;
                case ("shortPwd"):
                    shortPwd();
                    break;
                case ("badConf"):
                    badConf();
                    break;
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else {
            console.log(resObj.data.user);
            if (dupeWarningShowing) hideWarning("dupeWarning");
            if (pwdWarningShowing) hideWarning("pwdWarning");
            if (confWarningShowing) hideWarning("confWarning");
            storeData(resObj.data.user);
            // genBotFriend();
            window.location.href = "home.html";
        }
    }
    catch {
        console.log("Create Error");
    }
}

function dupeUser() {
    if (pwdWarningShowing) hideWarning("pwdWarning");
    else if (confWarningShowing) hideWarning("confWarning");
    if (!dupeWarningShowing) displayWarning("dupeWarning", "That username is taken");
    return;
}

function shortPwd() {
    if (dupeWarningShowing) hideWarning("dupeWarning");
    if (confWarningShowing) hideWarning("confWarning");
    if (!pwdWarningShowing) displayWarning("pwdWarning", "Password must be at least 7 characters long");
}

function badConf() {
    if (dupeWarningShowing) hideWarning("dupeWarning");
    if (pwdWarningShowing) hideWarning("pwdWarning");
    if (!confWarningShowing) displayWarning("confWarning", "Inputted passwords must be the same");
}

function displayWarning(id, warningText) {
    warning = document.createElement('div');
    warning.id = id;
    warning.textContent = warningText;
    warning.style.color = "red";
    warning.style.fontSize = ".75em";
    warning.style.fontStyle = "italic";
    insertBox = document.querySelector("#password-container");
    insertBox.appendChild(warning);
    setWarnings(id, true);
}

function hideWarning(id) {
    removeElement = document.getElementById(id);
    removeElement.parentElement.removeChild(removeElement);
    setWarnings(id, false);
}
function setWarnings(id, isTrue) {
    switch (id) {
        case ("pwdWarning"):
            pwdWarningShowing = isTrue;
            break;
        case ("confWarning"):
            confWarningShowing = isTrue;
            break;
        default:
            dupeWarningShowing = isTrue;
            break;
    }
}
function storeData(newUser) {
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("currentUser", newUser.username);
    localStorage.setItem("currentBudget", newUser.budgets[0].budgetName);
}

// function genBotFriend() {
//     //Generate a placeholder bot friend
//     let users = JSON.parse(localStorage.getItem("users"));
//     for (user of users) {
//         if (user.username === "Bot Friend") return;
//     }
//     users.push(new Bot());
//     localStorage.setItem("users", JSON.stringify(users));
// }

// class Bot {
//     constructor() {
//         this.username = "Bot Friend";
//         this.password = "my very secret password";
//         let botBudget = {
//             budgetName: "Bot Friend's Budget",
//             privacy: "public",
//             initial: 123.45,
//             pIncome: [["Work", 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250]],
//             pExpenses: [["Groceries", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],["Taxes", 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0]],
//             aIncome: [["Work", 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200]],
//             aExpenses: [["Groceries", 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120],["Taxes", 0, 0, 0, -50.15, 0, 0, 0, 0, 0, 0, 0, 0,]]
//         }
//         this.budgets = [botBudget];
//         this.friends = [];
//         this.sentFriendRequests = [];
//         this.receivedFriendRequests = [];
//     }
// }