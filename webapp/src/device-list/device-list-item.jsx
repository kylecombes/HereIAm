import React from "react";
import IfaceInfo from "./iface";

export default class DeviceListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            detailsVisible: false,
        }
    }

    render() {
        let className = 'device-list-item cell small-12';
        if (this.props.className) className = `${className} ${this.props.className}`;

        let detailsClassName = 'details cell small-12';
        if (this.state.detailsVisible) detailsClassName = `${detailsClassName} visible`;

        const ifaces = this.props.info.interfaces.map((iface) => {
            return <IfaceInfo key={iface.name + iface.netmask} {... iface} />;
        });

        // Determine the OS name string to display
        const osName = this.props.info.os.hasOwnProperty('dist') // Linux distro
                ? `${this.props.info.os.dist[0]} ${this.props.info.os.dist[1]} (${this.props.info.os.dist[2]} ${this.props.info.os.architecture})`
                : `${this.props.info.os.name} (${this.props.info.os.architecture})`;

        return (
            <div className={className}>
                <span className="name cell small-12" onClick={this.nameClick}>{this.props.info.name}</span>
                <div className={detailsClassName}>
                    <div className="cell small-12 grid-x">
                        <span className="section-header cell small-6">Network</span>
                        <div className="reported cell small-6 grid-x">
                            <span className="cell small-6">Reported</span>
                            <span className="cell small-6">{this.props.info.reportedTime}</span>
                        </div>
                    </div>
                    <div className="ifaces grid-x cell small-12">
                        {ifaces}
                    </div>
                    <div className="operating-system small-12 cell grid-x">
                        <span className="section-header cell small-12">Operating System</span>
                        <span className="os">{osName}</span>
                    </div>
                </div>
            </div>
        )
    }

    nameClick = () => {
        // Toggle the visibility of the details pane
        this.setState({
            detailsVisible: !this.state.detailsVisible
        });
    };

}