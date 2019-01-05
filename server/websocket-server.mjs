import SocketIO from 'socket.io';

export default class WebSocketServer {

    constructor() {
        this.io = null;
        this.messageReceivedListeners = {
            'connection': [],
        };

        // Bind the current context to all methods
        this.start = this.start.bind(this);
        this.onClientConnect = this.onClientConnect.bind(this);
        this.onClientConnect = this.onClientConnect.bind(this);
        this.registerMessageListener = this.registerMessageListener.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.broadcastDevices = this.broadcastDevices.bind(this);
    }

    start(httpServer) {
        this.io = new SocketIO(httpServer);
        this.io.on('connection', this.onClientConnect);

        console.log(`WebSocket server started successfully.`)
    }

    onClientConnect(socket) {
        console.log('Client connected');
        this.broadcastDevices(socket);
        // Notify anyone interested in connection events
        this.messageReceivedListeners['connection'].forEach(callback => callback());
        // Register the disconnect event handler
        socket.on('disconnect', () => this.onDisconnect(socket));

    }

    /**
     * Registers a callback for a particular sockets.io event.
     * @param {string} messageName - the name of the event/message ("connection", "disconnect", etc)
     * @param {function} callback - the function to be called with any message payload
     */
    registerMessageListener(messageName, callback) {
        if (!this.messageReceivedListeners.hasOwnProperty(messageName)) {
            this.messageReceivedListeners[messageName] = [ callback ];
        } else {
            this.messageReceivedListeners[messageName].push(callback);
        }
    }

    onDisconnect(socket) {
        console.log('Client disconnected');
        if (this.messageReceivedListeners.hasOwnProperty('disconnect')) {
            this.messageReceivedListeners['disconnect'].forEach(callback => callback());
        }
    }


    broadcastDevices(msg, socket=null) {
        if (socket) { // Just send the update to one device
            socket.emit('devices', msg);
        } else { // Send the update to all connected devices
            const connectedDevices = Object.values(this.io.sockets.connected);
            if (connectedDevices.length > 0) {
                connectedDevices.forEach((ws) => {
                    ws.emit('devices', msg);
                });
            }
        }
    };
}