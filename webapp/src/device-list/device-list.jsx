import React from "react";
import DeviceListItem from "./device-list-item";
import SocketIOClient from "socket.io-client";

export default class DeviceList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            devices: [],
        };
    }

    componentDidMount = () => {

        // Open WebSocket connection to server
        const devicesSocket = SocketIOClient.connect('ws://localhost:1996');
        devicesSocket.on('connect', () => console.log('Connected to server'));
        devicesSocket.on('greeting', this.serverMessageReceived);
        devicesSocket.on('devices', (msg) => {
            const stateUpdate = { devices: msg };
            console.log(stateUpdate)
            this.setState(stateUpdate);
        });
    };

    serverMessageReceived = (msg) => {
        console.log('Server says:');
        console.log(msg);
    };

    render() {

        let devices = [];

        this.state.devices.forEach((device) => {
            devices.push(<DeviceListItem key={device.name} info={device} className="cell small-12"/>);
        });

        return (
            <div className="device-list">
                {devices}
            </div>
        )
    }

}