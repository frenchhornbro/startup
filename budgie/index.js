let incorrectPwdWarningShowing = false;
let noUserWarningShowing = false;
let warning = "";

function login () {
    const user = document.querySelector("#username");
    const pwd = document.querySelector("#password");
    if (user.value != "" && pwd.value != "") {
        if (verified(user.value, pwd.value)) {
            if (incorrectPwdWarningShowing) hideWarning("#incorrectPassword");
            if (noUserWarningShowing) hideWarning("#noUser");
            window.location.href = "projected.html";
        }
    }
    
    function verified(user, pwd) {
        if (!localStorage.getItem(user)) {
            if (!noUserWarningShowing) displayWarning("noUser", "User does not exist");
            if (incorrectPwdWarningShowing) hideWarning("#incorrectPassword");
            return false;
        }
        else if (localStorage.getItem(user) != pwd) {
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

function clearStorage() {
    localStorage.clear();
    console.log("Cleared");
}