export default class DeviceManager {

    /**
     * Instantiates a new DeviceList object for keeping track of devices.
     * @param dbConn - a connection to a MongoDB database
     */
    constructor(dbConn) {
        this.devices = [];
        this.dbConn = dbConn;
    }

    /**
    * Fetches a list of devices and their info.
    * @param count the number of devices to get (sorted by most recent update)
    */
    getDevices(count=20) {
        const that = this;
        return new Promise((resolve, reject) => {
          console.log(`Fetching ${count} most recent devices...`);
          that.dbConn.db.collection('devices').find().sort({datetime: -1}).limit(count).toArray((err, items) => {
            if (err) {
                reject(err);
            } else {
                // TODO: Check if this map is necessary
              const devices = items.map(dev => {
                return {
                  interfaces: dev.interfaces,
                  os: dev.os,
                  name: dev.hostname,
                  timestamp: dev.timestamp,
                  uuid: dev.uuid,
                };
              });
              resolve(devices);
            }
          });
        });
    }

    /**
     * Handles responding to a POST request from the Python client.
     * @param {string} uuid - the unique identifier of the reporting device
     * @param {object} msg - the POST request body
     */
    receivedReportMsg(uuid, msg) {
        const dev = this.parseDeviceJSON(msg);
        return this.dbConn.saveDevice(uuid, dev);
    }

  static parseDeviceJSON(postData) {
    const data = {}; // Data to be saved to db

    // Pull out network interface info
    let interfaces = postData['interfaces'];
    if (interfaces) {
      data['interfaces'] = JSON.parse(interfaces);
    } else {
      console.warn('Request missing interfaces info');
    }

    // Pull out OS info
    let os = postData['os'];
    if (os) {
      data['os'] = JSON.parse(os);
    } else {
      console.warn('Request missing OS info');
    }

    // Pull out hostname
    const hostname = postData['hostname'];
    if (hostname) {
      data['hostname'] = hostname;
    } else {
      console.warn('Request missing hostname.');
    }

    // Save the create/update time TODO Deal with timezones
    data['timestamp'] = new Date();

    data['uuid'] = postData['uuid'];

    return data;
  }


}