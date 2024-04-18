async function validateAuth() {
    try {
        let response = await fetch("/api/validAuth");
        let resObj = await response.json();
        if (!resObj.isValid) window.location.href = "/index.html";
    }
    catch (exception) {
        console.log(exception);
        window.location.href = "/index.html";
        console.log("Kick Error");
    }
}

validateAuth();