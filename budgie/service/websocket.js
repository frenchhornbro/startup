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
        sessions.set(sessionID, newSession);
        ws.on('message', (data) => {
            const msg = String.fromCharCode(...data);
            console.log("Server received message");
            broadcast(msg, sessions, newSession);
        });

        ws.on('close', () => {
            sessions.delete(sessionID);
        });

        ws.on('pong', () => {
            newSession.active = true;
        });
    });
    
    function broadcast(msg, sessions, origin) {
        try {
            for (thisSession of sessions) thisSession[1].ws.send(msg);
        }
        catch (exception) {
            console.log(exception);
        }
    }

    setInterval(() => {
        for (const thisSession of sessions) {
            (async() => {
                if (!thisSession[1].active) {
                    await thisSession[1].ws.terminate();
                    sessions.delete(thisSession.sessionID);
                }
                else {
                    thisSession[1].active = false;
                    thisSession[1].ws.ping();
                }
            })();
        }
    }, 15000);
}

module.exports = {setupWS};