let pwdWarningShowing = false;
let confWarningShowing = false;
let warning = "";

function login (newUser=false) {
    const user = document.querySelector("#username");
    const pwd = document.querySelector("#password");
    const confirm = document.querySelector("#confirm");
    if (user.value != "" && pwd.value != "") {
        if (pwd.value.length >= 7) {
            if (pwdWarningShowing) {
                removeElement = document.querySelector("#pwdWarning")
                removeElement.parentElement.removeChild(removeElement);
                pwdWarningShowing = false;
            }
            if (newUser) {
                if (pwd.value == confirm.value) {
                    window.location.href = "projected.html";
                }
                else if (!confWarningShowing) {
                    displayWarning("confWarning", "Inputted passwords must be the same");
                }
            }
            else {
                window.location.href = "projected.html";
            }
        }
        else {
            if (confWarningShowing) {
                removeElement = document.querySelector("#confWarning");
                removeElement.parentElement.removeChild(removeElement);
                confWarningShowing = false;
            }
            if (!pwdWarningShowing) {
                displayWarning("pwdWarning", "Password must be at least 7 characters long");
            }
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
        (id === "pwdWarning") ? pwdWarningShowing = true : confWarningShowing = true;
    }
}