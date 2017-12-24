import React from "react";

export default class IfaceInfo extends React.Component {

    render() {

        let wifiElem = null;
        if (this.props.hasOwnProperty('wifi')) {
            const wifi = this.props.wifi;

            wifiElem = <div className="iface-wifi cell small-12 medium-6 grid-x">
                <span className="subsection-title cell small-12">SSID</span>
                <span className="subsection-details cell small-12">{wifi.ssid}</span>
                <span className="subsection-title cell small-12">Encryption</span>
                <span className="subsection-details cell small-12">{wifi.encryption.toUpperCase()}</span>
                <span className="subsection-title cell small-12">Signal strength</span>
                <span className="subsection-details cell small-12">{wifi.signalStrength}<span className="dbm">dBm</span></span>
                <span className="subsection-title cell small-12">Quality</span>
                <span className="subsection-details cell small-12">{wifi.quality}</span>
            </div>;
        }

        const generalInfo = [];
        if (this.props.hasOwnProperty('addressIPv4')) {
            generalInfo.push(
                <div key="ipv4" className="cell small-12 grid-x">
                    <span className="subsection-title cell small-12">IPv4 address</span>
                    <span className="subsection-details cell small-12">{this.props.addressIPv4}</span>
                    <span className="subsection-title cell small-12">IPv4 netmask</span>
                    <span className="subsection-details cell small-12">{this.props.netmaskIPv4}</span>
                </div>);
        }
        if (this.props.hasOwnProperty('addressIPv6')) {
            generalInfo.push(
                <div key="ipv6" className="cell small-12 grid-x">
                    <span className="subsection-title cell small-12">IPv6 address</span>
                    <span className="subsection-details cell small-12">{this.props.addressIPv6}</span>
                    <span className="subsection-title cell small-12">IPv6 netmask</span>
                    <span className="subsection-details cell small-12">{this.props.netmaskIPv6}</span>
                </div>);
        }

        return (
            <div className="iface-info cell small-12 grid-x">
                <div className="iface-general cell small-12 medium-6 grid-x">
                    <span className="subsection-title cell small-12">Interface name</span>
                    <span className="section-title cell small-12">{this.props.name}</span>
                    {generalInfo}
                </div>
                {wifiElem}
            </div>
        )
    }

}