//Feature: Upon getting authData, delete any expired authData associated with that username
//Feature: Hash passwords using bCrypt
const {MongoClient} = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('budgie');
const authDataCol = db.collection("authData");
const userDataCol = db.collection("userData");

async function testConnection() {
    try {
        await client.connect();
        await db.command({ping: 1});
        console.log("Success");
    }
    catch(exception) {
        console.log(`Connection failed: ${exception.message}`)
        process.exit(1);
    }
}

async function getAuthDataFromToken(authToken) {
    //Will return null if nothing matches the query
    return await authDataCol.findOne({authToken: authToken});
}

async function getAuthDataFromUsername(username) {
    return await authDataCol.findOne({username: username});
}

async function createAuthData(username, password, authToken) {
    await authDataCol.insertOne({
        username: username,
        password: password,
        authToken: authToken
    });
}

async function createUserData(username, userData) {
    await userDataCol.insertOne({
        username: username,
        user: userData
    });
}

async function updateUserData() {

}

async function getUserData(username) {
    try {
        let userData = await userDataCol.findOne({username: username});
        return userData.user;
    }
    catch {
        return null;
    }
}



module.exports = {
    getAuthDataFromToken,
    getAuthDataFromUsername,
    createAuthData,
    createUserData,
    getUserData
}