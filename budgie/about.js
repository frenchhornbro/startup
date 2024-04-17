function load() {
    loadLogout();
    loadImage();
}

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

async function loadImage() {
    try {
        const imgElement = document.querySelector(".bird-img");
        if (Math.random()*10 > 5) {
            const duck = await fetch('/api/duck');
            const duckImg = await duck.json();
            imgElement.setAttribute('src', duckImg.duck);
        }
        else {
            imgElement.setAttribute('src', "\\budgie-images\\about-budgie.jpg");
        }
    }
    catch {
        console.log("Load Image Error");
        document.querySelector(".bird-img").setAttribute('src', "\\budgie-images\\about-budgie.jpg");
    }
}

async function logout() {
    await fetch('/api/removeAuth', {
        method: 'PUT'
    });
    window.location.href = "index.html";
}