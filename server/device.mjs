export default class Device {

    constructor(postData) {

        this.data = {}; // Data to be saved to db

        // Pull out network interface info
        let interfaces = postData['interfaces'];
        if (interfaces) {
            this.data['interfaces'] = JSON.parse(interfaces);
        } else {
            console.warn('Request missing interfaces info');
        }

        // Pull out OS info
        let os = postData['os'];
        if (os) {
            this.data['os'] = JSON.parse(os);
        } else {
            console.warn('Request missing OS info');
        }

        // Pull out hostname
        const hostname = postData['hostname'];
        if (hostname) {
            this.data['hostname'] = hostname;
        } else {
            console.warn('Request missing hostname.');
        }

        // Save the create/update time TODO Deal with timezones
        this.data['timestamp'] = new Date();

        this.data['uuid'] = postData['uuid'];

    }

    getData() {
        return this.data;
    }
}