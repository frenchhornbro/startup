function loadLogout() {
    if (localStorage.getItem("currentUser") !== null) {
        let logOutContainer = document.querySelector(".log-out");
        let logOutBtn = document.createElement("button");
        logOutBtn.type = "button";
        logOutBtn.className = "btn btn-light";
        logOutBtn.textContent = "Log Out";
        logOutBtn.onclick = () => logout();
        logOutContainer.appendChild(logOutBtn);
    }
}

function logout() {
    window.location.href = "index.html";
}