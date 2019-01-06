import React from "react";
import IfaceInfo from "./iface";
import moment from "moment";

export default class DeviceListItem extends React.Component {

    render() {
        let className = 'device-list-item section-content';
        if (this.props.className) className = `${className} ${this.props.className}`;

        let detailsClassName = 'details-container cell small-12';
        if (this.props.expanded) detailsClassName = `${detailsClassName} visible`;

        const ifaces = this.props.info.interfaces.map((iface) => {
            return <IfaceInfo key={iface.name + iface.netmask} {... iface} />;
        });

        // Determine the OS name string to display
        const osName = this.props.info.os.hasOwnProperty('dist') // Linux distro
                ? `${this.props.info.os.dist[0]} ${this.props.info.os.dist[1]} (${this.props.info.os.dist[2]} ${this.props.info.os.architecture})`
                : `${this.props.info.os.name} (${this.props.info.os.architecture})`;

        let reportedString = '';
        const reported = moment(this.props.info.timestamp);
        reportedString = reported.format('M/D [at] h:mm a');

        return (
            <div className={className}>
                <span className="name cell small-12" onClick={() => this.props.toggleCollapsed(this.props.info.uuid)}>{this.props.info.name}</span>
                <div className={detailsClassName}>
                    <div className="details-content cell small-12">
                        <div className="cell small-12 grid-x">
                            <span className="os cell small-6">Running {osName}</span>
                            <span className="reported cell small-6">Reported {reportedString}</span>
                        </div>
                        <div className="ifaces grid-x cell small-12">
                            {ifaces}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}