import DatabaseConnection from './database.mjs';
import dotenv from 'dotenv';
import fs from 'fs';
import HttpServer from './http-server.mjs';
import DeviceManager from './device-manager.mjs';
import WebSocketServer from './websocket-server.mjs';

// Try loading environment variables from a .env file
if (fs.existsSync('./.env')) {
    dotenv.config();
}

// Figure out which port we're going to be listening for connections on
const port = process.env.PORT || 1234;

// Connect to MongoDB
const dbConn = new DatabaseConnection();

// Start the HTTP server
const httpServer = new HttpServer(port);

// Initialize the WebSockets server
const wsServer = new WebSocketServer();

// Create a DeviceManager to keep track of the device info
const devMan = new DeviceManager(dbConn, wsServer.broadcastDevices);
httpServer.registerReceivedReportMsgHandler(devMan.receivedReportMsg);
wsServer.registerMessageListener('connected', wsServer.broadcastDevices);

dbConn.connect(() => devMan.fetchDevices());

// Start the WebSockets server
wsServer.start(httpServer.getHTTPServer());
