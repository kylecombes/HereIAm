import express from "express";
import http from "http";
import util from "util";
import WebSocket from 'ws';

// Configuration

const port = 1996; // TODO Load this from an environment variable

// Initialization

const app = express();
const server = http.Server(app);

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

// TODO Connect to MongoDB

const router = express.Router();
app.use(router);

router.get('/report-ip', (req, res) => {
    console.log('Received post to /report-ip:');
    console.log(util.inspect(req.query));
    res.sendStatus(300);
});

// Configure WebSocket server
const wss = new WebSocket.Server({ server });
// const connectedClients = [];
wss.on('connection', (ws) => {
    console.log('Client connected');
});
wss.on('close', () => {
    console.log('Client disconnected');
});