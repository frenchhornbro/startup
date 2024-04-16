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
        if (Math.random()*10 > 1) {
            console.log("3rd Party API:")
            const duck = await fetch('/api/duck');
            const duckImg = await duck.json();
            console.log(duckImg);
            imgElement.setAttribute('src', duckImg.duck);
        }
        else {
            console.log("Budgie")
            imgElement.setAttribute('src', "\\budgie-images\\about-budgie.jpg");
        }
    }
    catch {
        console.log("Load Image Error");
        document.querySelector(".bird-img").setAttribute('src', "\\budgie-images\\about-budgie.jpg");
    }
}

function logout() {
    window.location.href = "index.html";
}