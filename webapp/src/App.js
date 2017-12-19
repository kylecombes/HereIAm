import React from "react";
import Header from "./header";
import DeviceList from "./device-list/device-list";
import './App.css';

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            server: window.server,
            devices: [
                {
                    hostname: 'hydra',
                    ipAddress: '192.167.24.12',
                    os: 'Ubuntu 16.04',
                },
                {
                    hostname: 'Incipio',
                    ipAddress: '192.168.1.23',
                    os: 'Windows 10',
                },
                {
                    hostname: 'Validus',
                    ipAddress: '10.129.1.32',
                    os: 'Windows 10 Professional',
                },
                {
                    hostname: 'bocs',
                    ipAddress: '192.168.34.20',
                    os: 'Raspbian Stretch',
                },
                {
                    hostname: 'bocs-audio',
                    ipAddress: '192.168.34.124',
                    os: 'Raspbian Stretch',
                },
            ]
        };
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <DeviceList server={this.state.server} devices={this.state.devices}/>
            </div>
        );
    }
}

export default App;
