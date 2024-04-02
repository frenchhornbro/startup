let dupeWarningShowing = false;
let pwdWarningShowing = false;
let confWarningShowing = false;
let warning = "";
localStorage.removeItem("currentUser");
localStorage.removeItem("budgetOwner");
localStorage.removeItem("currentBudget");

function createNewUser() {
    const user = document.querySelector("#username");
    if (duplicateUser(user.value)) {
        if (pwdWarningShowing) hideWarning("pwdWarning");
        else if (confWarningShowing) hideWarning("confWarning");
        if (!dupeWarningShowing) displayWarning("dupeWarning", "That username is taken");
        return;
    }
    const pwd = document.querySelector("#password");
    const confirm = document.querySelector("#confirm");
    if (user.value !== "" && pwd.value !== "" && confirm.value !== "") {
        if (pwd.value.length >= 7) {
            if (pwd.value == confirm.value) {
                if (dupeWarningShowing) hideWarning("dupeWarning");
                if (pwdWarningShowing) hideWarning("pwdWarning");
                if (confWarningShowing) hideWarning("confWarning");
                storeData(user.value, pwd.value);
                genBotFriend();
                window.location.href = "group.html";
            }
            else {
                if (dupeWarningShowing) hideWarning("dupeWarning");
                if (pwdWarningShowing) hideWarning("pwdWarning");
                if (!confWarningShowing) displayWarning("confWarning", "Inputted passwords must be the same");
            }
        }
        else {
            if (dupeWarningShowing) hideWarning("dupeWarning");
            if (confWarningShowing) hideWarning("confWarning");
            if (!pwdWarningShowing) displayWarning("pwdWarning", "Password must be at least 7 characters long");
        }
    }

    function duplicateUser(username) {
        let users = JSON.parse(localStorage.getItem("users"));
        if (users === null) return false;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) return true;
        }
        return false;
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

    function storeData(user, pwd) {
        let userList = JSON.parse(localStorage.getItem("users"));
        if (userList === null) userList = [];
        let budgetName = user + "'s budget";
        let newUser = new User(user, pwd, budgetName);
        userList.push(newUser);
        localStorage.setItem("users", JSON.stringify(userList));
        localStorage.setItem("currentUser", user);
        localStorage.setItem("currentBudget", budgetName);
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
        this.budgets = [budget];
        this.friends = [];
        this.sentFriendRequests = [];
        this.receivedFriendRequests = [];
    }
}

function genBotFriend() {
    //Generate a placeholder bot friend
    let users = JSON.parse(localStorage.getItem("users"));
    for (user of users) {
        if (user.username === "Bot Friend") return;
    }
    users.push(new Bot());
    localStorage.setItem("users", JSON.stringify(users));
}

class Bot {
    constructor() {
        this.username = "Bot Friend";
        this.password = "my very secret password";
        let budget = {
            budgetName: "Bot Friend's Budget",
            privacy: "public",
            initial: 123.45,
            pIncome: [["Work", 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250]],
            pExpenses: [["Groceries", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],["Taxes", 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0]],
            aIncome: [["Work", 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200]],
            aExpenses: [["Groceries", 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120],["Taxes", 0, 0, 0, -50.15, 0, 0, 0, 0, 0, 0, 0, 0,]]
        }
        this.budgets = [budget];
        this.friends = [];
        this.sentFriendRequests = [];
        this.receivedFriendRequests = [];
    }
}