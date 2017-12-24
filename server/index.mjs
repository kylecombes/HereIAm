import express from "express";
import BodyParser from "body-parser";
import http from "http";
import MongoClient from "mongodb";
import util from "util";
import SocketIO from 'socket.io';

// Configuration

const port = 1996; // TODO Load this from an environment variable

// Initialization

const app = express();
app.use(BodyParser.json()); // Support JSON-encoded bodies
app.use(BodyParser.urlencoded()); // Support encoded bodies
const server = http.Server(app);

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});


// Connect to the MongoDB instance
const username = process.env.NETSTAT_MONGO_USERNAME;
const password = process.env.NETSTAT_MONGO_PASSWORD;
const mongoPort = process.env.NETSTAT_MONGO_PORT;
const cluster1 = process.env.NETSTAT_MONGO_CLUSTER1;
const cluster2 = process.env.NETSTAT_MONGO_CLUSTER2;
const cluster3 = process.env.NETSTAT_MONGO_CLUSTER3;
const dbName = process.env.NETSTAT_MONGO_DB_NAME;
const replicaSet = process.env.NETSTAT_MONGO_REPLICA_SET;
const authSource = process.env.NETSTAT_MONGO_AUTH_SOURCE || 'admin';

// Make sure all the necessary info is given
if (!(username && password && cluster1 && cluster2 && cluster3 && dbName && replicaSet)) {
    // Couldn't find environment variables
    console.error('Please check your environment variables to make sure the following are defined:');
    console.error('\t- NETSTAT_MONGO_USERNAME');
    console.error('\t- NETSTAT_MONGO_PASSWORD');
    console.error('\t- NETSTAT_MONGO_PORT');
    console.error('\t- NETSTAT_MONGO_CLUSTER1');
    console.error('\t- NETSTAT_MONGO_CLUSTER2');
    console.error('\t- NETSTAT_MONGO_CLUSTER3');
    console.error('\t- NETSTAT_MONGO_DB_NAME');
    console.error('\t- NETSTAT_MONGO_REPLICA_SET');
    console.error('Connection to MongoDB instance failed.');
    process.exit(1); // Kill the server
}
// const mongoUri = `mongodb+srv://${username}:${password}@${cluster}`;
// console.log('Connecting to MongoDB using ' + mongoUri);
const mongoUri = `mongodb://${username}:${password}@${cluster1}:${mongoPort},${cluster2}:${mongoPort},${cluster3}:${mongoPort}/${dbName}?ssl=true&replicaSet=${replicaSet}&authSource=${authSource}`;

let devices = null;
let broadcastDevices = null;

// Connect to the MongoDB database
MongoClient.connect(mongoUri, (err, db) => {
    if (err) { // There was a problem connecting to the MongoDB instance
        console.error('Error connecting to MongoDB instance:');
        console.error(err);
    } else { // Connected to db successfully
        console.log('Successfully connected to MongoDB instance. Starting HTTP server...');

        updateDeviceListCache(db);

        const router = express.Router();
        app.use(router);

        router.put('/devices/:uuid', (req, res) => {
            const uuid = req.params.uuid;
            console.log(`Received put request for device ${uuid}`);
            const data = parseReportingTransmission(req.body);
            if (data) {
                const query = {uuid};
                console.log(query)
                db.collection('devices').update(query, data, {upsert: true}, (err, dbRes) => {
                    if (err) {
                        res.sendStatus(500);
                        console.error(err);
                    } else {
                        res.sendStatus(300);
                        updateDeviceListCache(db);
                    }
                });
            } else {
                res.sendStatus(400);
                console.log('Bad Request status code (400) sent to client.');
            }
        });

        console.log('API server started successfully. Starting WebSocket server...');

        // Configure WebSocket server
        const io = new SocketIO(server);
        // const connectedClients = [];
        io.on('connection', (ws) => {
            console.log('Client connected');
            if (devices) {
                ws.emit('devices', devices);
            }
        });
        io.on('close', () => {
            console.log('Client disconnected');
        });
        broadcastDevices = (msg) => {
            const connectedDevices = Object.values(io.sockets.connected);
            if (connectedDevices.length > 0) {
                connectedDevices.forEach((ws) => {
                    ws.emit('devices', msg);
                });
            }
        };
        console.log(`HTTP and WebSocket servers started successfully. Listening on port ${port}.`)
    }
});

function parseReportingTransmission(postData) {

    const data = {}; // Data to be saved to db

    // Pull out network interface info
    let interfaces = postData['interfaces'];
    if (interfaces) {
        data['interfaces'] = JSON.parse(interfaces);
    } else {
        console.warn('Request missing interfaces info');
        return null;
    }

    // Pull out OS info
    let os = postData['os'];
    if (os) {
        data['os'] = JSON.parse(os);
    } else {
        console.warn('Request missing OS info');
        return null;
    }

    // Pull out hostname
    const hostname = postData['hostname'];
    if (hostname) {
        data['hostname'] = hostname;
    } else {
        console.warn('Request missing hostname.');
        return null;
    }

    // Save the create/update time TODO Deal with timezones
    data['timestamp'] = new Date();

    data['uuid'] = postData['uuid'];

    return data;
}

function updateDeviceListCache(db) {
    console.log('Updating device cache...');
    db.collection('devices').find().sort({datetime: -1}).limit(20).toArray((err, items) => {
        devices = items.map((dev) => {
            return {
                interfaces: dev.interfaces,
                os: dev.os,
                name: dev.hostname,
                timestamp: dev.timestamp,
                uuid: dev.uuid,
            };
        });
        if (broadcastDevices) { // Not defined before WebSockets initialized
            console.log(devices);
            broadcastDevices(devices);
        }

    });
}