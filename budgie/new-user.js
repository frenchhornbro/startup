// TODO: Feature: Don't allow the creation of a user with the same name (bc I think that could also wipe out all their data)
// TODO: Feature: Also don't allow the creation of a user with the name incomeHeaderList or expenseHeaderList

let pwdWarningShowing = false;
let confWarningShowing = false;
let warning = "";
localStorage.removeItem("currentUser");

function createNewUser() {
    const user = document.querySelector("#username");
    const pwd = document.querySelector("#password");
    const confirm = document.querySelector("#confirm");
    if (user.value !== "" && pwd.value !== "" && confirm.value !== "") {
        if (pwd.value.length >= 7) {
            if (pwd.value == confirm.value) {
                if (pwdWarningShowing) hideWarning("#pwdWarning");
                if (confWarningShowing) hideWarning("#confWarning");
                storeData(user.value, pwd.value);
                window.location.href = "projected.html";
            }
            else {
                if (pwdWarningShowing) hideWarning("#pwdWarning");
                if (!confWarningShowing) displayWarning("confWarning", "Inputted passwords must be the same");
            }
        }
        else {
            if (confWarningShowing) hideWarning("#confWarning");
            if (!pwdWarningShowing) displayWarning("pwdWarning", "Password must be at least 7 characters long");
        }
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
        (id === "pwdWarning") ? pwdWarningShowing = true : confWarningShowing = true;
    }

    function hideWarning(id) {
        removeElement = document.querySelector(id);
        removeElement.parentElement.removeChild(removeElement);
        (id === "#pwdWarning") ? pwdWarningShowing = false : confWarningShowing = false;
    }

    function storeData(user, pwd) {
        let userList = JSON.parse(localStorage.getItem("users"));
        if (userList === null) userList = [];
        let newUser = new User(user, pwd);
        userList.push(newUser);
        localStorage.setItem("users", JSON.stringify(userList));
        localStorage.setItem("currentUser", user);
    }
}

class User {
    constructor(user, pwd) {
        this.username = user;
        this.password = pwd;
        this.initial = 0;
        this.pIncome = [];
        this.pExpenses = [];
        this.aIncome = [];
        this.aExpenses = [];
    }
}