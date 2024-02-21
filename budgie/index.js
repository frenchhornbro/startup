let pwdWarningShowing = false;

function login () {
    const user = document.querySelector("#username");
    const pwd = document.querySelector("#password");
    if (user.value != "" && pwd.value != "") {
        if (pwd.value.length >= 7) {
            window.location.href = "projected.html";
            return false;
        }
        else if (!pwdWarningShowing) {
            console.log("Password must be at least 7 characters long");
            const pwdWarning = document.createElement('div');
            pwdWarning.textContent = "Password must be at least 7 characters long";
            pwdWarning.style.color = "red";
            pwdWarning.style.fontSize = ".75em";
            pwdWarning.style.fontStyle = "italic";
            insertBox = document.querySelector("#password-container");
            insertBox.appendChild(pwdWarning);
            pwdWarningShowing = true;
        }
        console.log("Logged in");
        return true;
    }
}