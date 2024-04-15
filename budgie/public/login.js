let incorrectPwdWarningShowing = false;
let noUserWarningShowing = false;
let warning = "";
localStorage.removeItem("user");
localStorage.removeItem("currentUser");
localStorage.removeItem("guestBudget");
localStorage.removeItem("budgetOwner");
localStorage.removeItem("currentBudget");

async function login() {
    try {
        const inputtedUser = document.getElementById("username").value;
        const inputtedPwd = document.getElementById("password").value;
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'username': inputtedUser,
                'password': inputtedPwd
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            switch (resObj.responseMsg) {
                case ("noUser"):
                    noUser();
                    break;
                case ("badPwd"):
                    badPwd();
                    break;
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else {
            if (incorrectPwdWarningShowing) hideWarning("#incorrectPassword");
            if (noUserWarningShowing) hideWarning("#noUser");
            localStorage.setItem("currentUser", inputtedUser);
            localStorage.setItem("currentBudget", resObj.data.user.budgets[0].budgetName);
            localStorage.setItem("user", JSON.stringify(resObj.data.user));
            window.location.href = "home.html";
        }
    }
    catch {
        console.log("Login Error");
    }
}

function noUser() {
    if (!noUserWarningShowing) displayWarning("noUser", "User does not exist");
    if (incorrectPwdWarningShowing) hideWarning("#incorrectPassword");
}

function badPwd() {
    if (!incorrectPwdWarningShowing) displayWarning("incorrectPassword", "The password is incorrect");
    if (noUserWarningShowing) hideWarning("#noUser");
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