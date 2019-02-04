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
dbConn.connect().then(() => {
  // Create a DeviceManager to keep track of the device info
  const devMan = new DeviceManager(dbConn);
  // devMan.fetchDevices();

  // Start the HTTP server
  const httpServer = new HttpServer(port);

  // Initialize the WebSockets server
  const wsServer = new WebSocketServer(devMan);

  httpServer.registerReceivedReportMsgHandler((uuid, msg, res) => {
    const dev = DeviceManager.parseDeviceJSON(msg);
    dbConn.saveDevice(uuid, dev)
      .then(() => {
        res.sendStatus(200);
        wsServer.broadcastDevices();
      })
      .catch(err => res.status(500).send(err));
  });
  // wsServer.registerMessageListener('connected', wsServer.broadcastDevices);

  // Start the WebSockets server
  wsServer.start(httpServer.getHTTPServer());
});
