import Device from './device.mjs';

export default class DeviceManager {

    /**
     * Instantiates a new DeviceList object for keeping track of devices.
     * @param dbConn - a connection to a MongoDB database
     * @param {function} broadcastUpdate - a callback to be used when a device list update needs to be sent
     */
    constructor(dbConn, broadcastUpdate) {
        this.devices = [];
        this.dbConn = dbConn;
        this.broadcastUpdate = broadcastUpdate;
        this.receivedReportMsg = this.receivedReportMsg.bind(this);
    }

    /**
     * Fetches a list of devices and their info.
     * @param count the number of devices to get (sorted by most recent update)
     * @param callback a function to call
     */
    fetchDevices(count=20, callback=null) {
        console.log(`Fetching ${count} most recent devices...`);
        this.dbConn.db.collection('devices').find().sort({datetime: -1}).limit(count).toArray((err, items) => {
            this.devices = items.map((dev) => {
                return {
                    interfaces: dev.interfaces,
                    os: dev.os,
                    name: dev.hostname,
                    timestamp: dev.timestamp,
                    uuid: dev.uuid,
                };
            });
            if (callback) {
                callback(this.devices);
            }
            if (this.broadcastUpdate) {
                this.broadcastUpdate(this.devices);
            }
        });
    }

    /**
     * Handles responding to a POST request from the Python client.
     * @param {string} uuid - the unique identifier of the reporting device
     * @param {object} msg - the POST request body
     * @param {object} res - the Express result object (must be used to avoid appearance of timeout to client)
     */
    receivedReportMsg(uuid, msg, res) {
        let dev = new Device(msg);
        if (dev) {
            const query = {uuid};
            this.dbConn.db.collection('devices').replaceOne(query, dev.data, {upsert: true}, (err, dbRes) => {
                if (err) {
                    res.sendStatus(500);
                    console.error(err);
                } else {
                    res.sendStatus(300);
                    // Update our device list
                    this.fetchDevices();
                }
            });
        } else {
            res.sendStatus(400);
            console.log('Bad Request status code (400) sent to client.');
        }

    }



}