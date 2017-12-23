import React from "react";

export default class IfaceInfo extends React.Component {

    render() {

        let wifiElem = null;
        if (this.props.hasOwnProperty('wifi')) {
            const wifi = this.props.wifi;

            wifiElem = <div className="iface-wifi cell small-12 medium-6 grid-x">
                <span className="section-title cell small-12">WiFi Status</span>
                <span className="subsection-title cell small-4">SSID</span>
                <span className="subsection-details cell small-8">{wifi.ssid}</span>
                <span className="subsection-title cell small-4">Encryption</span>
                <span className="subsection-details cell small-8">{wifi.encryption}</span>
                <span className="subsection-title cell small-4">Signal strength</span>
                <span className="subsection-details cell small-8">{wifi.signalStrength}</span>
                <span className="subsection-title cell small-4">Quality</span>
                <span className="subsection-details cell small-8">{wifi.quality}</span>
            </div>;
        }

        const generalInfo = [];
        if (this.props.hasOwnProperty('addressIPv4')) {
            generalInfo.push(
                <div key="ipv4" className="cell small-12 grid-x">
                    <span className="subsection-title cell small-4">IPv4 address</span>
                    <span className="subsection-details cell small-8">{this.props.addressIPv4}</span>
                    <span className="subsection-title cell small-4">IPv4 netmask</span>
                    <span className="subsection-details cell small-8">{this.props.netmaskIPv4}</span>
                </div>);
        }
        if (this.props.hasOwnProperty('addressIPv6')) {
            generalInfo.push(
                <div key="ipv6" className="cell small-12 grid-x">
                    <span className="subsection-title cell small-4">IPv6 address</span>
                    <span className="subsection-details cell small-8">{this.props.addressIPv6}</span>
                    <span className="subsection-title cell small-4">IPv6 netmask</span>
                    <span className="subsection-details cell small-8">{this.props.netmaskIPv6}</span>
                </div>);
        }

        return (
            <div className="iface-info cell small-12 grid-x">
                <div className="iface-general cell small-12 medium-6 grid-x">
                    <span className="section-title cell small-12">{this.props.name}</span>
                    {generalInfo}
                </div>
                {wifiElem}
            </div>
        )
    }

}