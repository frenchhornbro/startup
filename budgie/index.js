let incorrectPwdWarningShowing = false;
let noUserWarningShowing = false;
let warning = "";
localStorage.removeItem("currentUser");
localStorage.removeItem("budgetOwner");
localStorage.removeItem("currentBudget");
let users = null;
if (localStorage.getItem("users") !== null) users = JSON.parse(localStorage.getItem("users"))

function login () {
    const inputtedUser = document.querySelector("#username").value;
    const inputtedPwd = document.querySelector("#password").value;

    let userExists = false;
    let correctPwd = null;
    if (users !== null) {
        for (array of users) {
            if(array.username == inputtedUser) {
                userExists = true;
                correctPwd = array.password;
                break;
            }
        }
    }

    if (verified()) {
        if (incorrectPwdWarningShowing) hideWarning("#incorrectPassword");
        if (noUserWarningShowing) hideWarning("#noUser");
        localStorage.setItem("currentUser", inputtedUser);
        
        for (let i = 0; i < users.length; i++) {
            if (users[i].username) {
                localStorage.setItem("currentBudget", users[i].budgets[0].budgetName);
                break;
            }
        }
        window.location.href = "group.html";
    }
    
    function verified() {
        if (!userExists) {
            if (!noUserWarningShowing) displayWarning("noUser", "User does not exist");
            if (incorrectPwdWarningShowing) hideWarning("#incorrectPassword");
            return false;
        }
        else if (correctPwd !== inputtedPwd) {
            if (!incorrectPwdWarningShowing) displayWarning("incorrectPassword", "The password is incorrect");
            if (noUserWarningShowing) hideWarning("#noUser");
            return false;
        }
        return true;
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
        (id === "noUser") ? noUserWarningShowing = true : incorrectPwdWarningShowing = true;
    }

    function hideWarning(id) {
        removeElement = document.querySelector(id);
        removeElement.parentElement.removeChild(removeElement);
        (id === "#noUser") ? noUserWarningShowing = false : incorrectPwdWarningShowing = false;
    }
}