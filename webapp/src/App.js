import React from "react";
import Header from "./header";
import DeviceList from "./device-list/device-list";
import './App.css';

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            server: window.SERVER_URI,
        };
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <DeviceList server={this.state.server} />
            </div>
        );
    }
}

export default App;
