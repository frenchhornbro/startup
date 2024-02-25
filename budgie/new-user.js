// TODO: Feature: Don't allow the creation of a user with the same name (bc I think that could also wipe out all their data)
// TODO: Feature: Also don't allow the creation of a user with the name incomeHeaderList or expenseHeaderList

let pwdWarningShowing = false;
let confWarningShowing = false;
let warning = "";

function createNewUser() {
    const user = document.querySelector("#username");
    const pwd = document.querySelector("#password");
    const confirm = document.querySelector("#confirm");
    if (user.value != "" && pwd.value != "" && confirm.value != "") {
        if (pwd.value.length >= 7) {
            if (pwd.value == confirm.value) {
                if (pwdWarningShowing) hideWarning("#pwdWarning");
                if (confWarningShowing) hideWarning("#confWarning");
                storeData(user.value, pwd.value);
                window.location.href = "projected.html";
            }
            if (!confWarningShowing) displayWarning("confWarning", "Inputted passwords must be the same");
            if (pwdWarningShowing) {
                hideWarning("#pwdWarning");
            }
        }
        else {
            if (!pwdWarningShowing) displayWarning("pwdWarning", "Password must be at least 7 characters long");
            if (confWarningShowing) hideWarning("#confWarning");
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
        localStorage.setItem("incomeHeaderList", "");
        localStorage.setItem("expenseHeaderList", "");
        localStorage.setItem(user, pwd);
    }
}