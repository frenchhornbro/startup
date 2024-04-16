const {MongoClient} = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('budgie');
const users = client.db('users');

async function testConnection() {
    try {
        await client.connect();
        await db.command({ping: 1});
        const result = await db.collection("testCollection").insertOne({"test": "tacos"});
        console.log("Success");
    }
    catch(exception) {
        console.log(`Connection failed: ${exception.message}`)
        process.exit(1);
    }
}

testConnection();