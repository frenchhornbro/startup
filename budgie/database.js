//Feature: Upon getting authData, delete any expired authData associated with that username
//Feature: Hash passwords using bCrypt
const {MongoClient} = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('budgie');
const authData = db.collection("authData");
const userData = db.collection("userData");

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

async function getAuthData(authToken) {
    //Will return null if nothing matches the query
    const result = await authData.findOne({authToken: authToken});
    console.log(result);
}

async function createUserData(username, password, authToken, userData) {
    const result = await authData.findOne({username: username});
    if (result) return "userExists";
    else {
        await authData.insertOne({
            username: username,
            password: password,
            authToken: authToken
        });
        await userData.insertOne({
            user: userData
        });
    }
}

async function updateUserData() {

}

async function getUserData() {

}



module.exports = {
    getAuthData,
    createUserData
}