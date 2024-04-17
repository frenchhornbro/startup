const {WebSocketServer} = require('ws');
const uuid = require('uuid');
const port = 4000;
const wss = new WebSocketServer({port: port});

let sessions = [];

wss.on('connection', (ws) => {
    let newSession = {
        id: uuid.v4(),
        active: true,
        ws: ws
    }
    sessions.push(newSession);
    ws.on('message', (data) => {
        const msg = String.fromCharCode(...data);
        console.log(`Server received message: ${msg}`);
        broadcast(msg, sessions, newSession);
    });
});

function broadcast(msg, sessions, origin) {
    for (session of sessions) {
        if (session.id === origin.id) {
            session.ws.send(`You sent the message: ${msg}`);
        }
        else {
            session.ws.send(`Here's the message received: ${msg}.`);
        }
    }
}