const {WebSocketServer} = require('ws');
const uuid = require('uuid');

function setupWS(httpServer) {
    const wss = new WebSocketServer({noServer: true});

    httpServer.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    });
    
    let sessions = new Map();
    
    wss.on('connection', (ws) => {
        let sessionID = uuid.v4();
        let newSession = {
            id: sessionID,
            username: null,
            active: true,
            ws: ws
        }
        sessions.set(sessionId, newSession);
        ws.on('message', (data) => {
            const msg = String.fromCharCode(...data);
            console.log(`Server received message: ${msg}`);
            //TODO: Upon receiving the message, add them to a users map
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

    //TODO: Make function to kill dead sessions
}

module.exports = {setupWS};