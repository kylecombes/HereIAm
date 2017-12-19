import React from "react";
import DeviceListItem from "./device-list-item";

export default class DeviceList extends React.Component {

    constructor(props) {
        super(props);

        // Open WebSocket connection to server
        this.ws = new WebSocket(props.server);
        this.ws.addEventListener('message', this.serverMessageReceived);
    }

    serverMessageReceived = (msg) => {
        console.log('Received message:');
        console.log(msg);
    };

    render() {

        let devices = [];
        for (let k in this.props.devices) {
            const device = this.props.devices[k];
            devices.push(<DeviceListItem
                name={device.hostname}
                ipAddress={device.ipAddress}
                os={device.os}
            />);
        }

        return (
            <div className="device-list">
                <DeviceListItem className="device-list-header" name="Name" ipAddress="IP Address" os="OS"/>
                {devices}
            </div>
        )
    }

}