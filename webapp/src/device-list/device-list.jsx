import React from "react";
import DeviceListItem from "./device-list-item";
import SocketIOClient from "socket.io-client";

export default class DeviceList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            devices: [],
            expandedDevices: [],
        };
    }

    toggleDeviceCollapsed = (uuid) => {
        const expandedDevices = this.state.expandedDevices;
        const index = expandedDevices.indexOf(uuid);
        if (index > -1) { // Device was expanded, should be collapsed
            expandedDevices.splice(index, 1);
        } else { // Device was collapsed, should be visible
            expandedDevices.push(uuid);
        }
        this.setState({expandedDevices});
    };

    componentDidMount = () => {

        // Open WebSocket connection to server
        const devicesSocket = SocketIOClient.connect(this.props.server);
        devicesSocket.on('connect', () => console.log('Connected to server'));
        devicesSocket.on('devices', (msg) => {
            const stateUpdate = { devices: msg };
            this.setState(stateUpdate);
        });
    };


    render() {
        let devices = [];

        this.state.devices.forEach((device) => {
            const isExpanded = this.state.expandedDevices.indexOf(device.uuid) > -1;
            devices.push(<DeviceListItem key={device.uuid} info={device} expanded={isExpanded} toggleCollapsed={this.toggleDeviceCollapsed} />);
        });

        return (
            <div className="device-list-container">
                <div className="device-list-header">
                    <div className="section-content">
                        <span className="section-content">Devices</span>
                    </div>
                </div>
                <div className="device-list">
                    {devices}
                </div>
            </div>
        )
    }

}