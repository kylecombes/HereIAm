import React from "react";

export default class DeviceListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            detailsVisible: false,
        }
    }

    render() {
        const className = this.props.className ? `device-list-item ${this.props.className}` : 'device-list-item';
        const detailsClassName = this.state.detailsVisible ? 'details visible' : 'details';
        return (
            <div className={className}>
                <div className="brief">
                    <span className="name" onClick={this.nameClick}>{this.props.name}</span>
                    <span className="ip-address">{this.props.ipAddress}</span>
                </div>
                <div className={detailsClassName}>
                    <div className="detail-item">
                        <span className="details-title">Operating System</span>
                        <span className="os">{this.props.os}</span>
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