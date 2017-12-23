from os import environ
import json
import netifaces
import platform
import re
import requests
from wifi import Cell
from wifi.exceptions import InterfaceError


class IPReporter:

    IPV4_PATTERN = re.compile('\d{1,3}\.\d{1,3}\.\d{1,3}')

    def __init__(self, server, daemon_mode=True):
        """
        Creates a new IP reporter
        :param server: the URL of the server
        :param daemon_mode: whether or not to keep running this process indefinitely as a daemon process
        """
        self.server = server

    def report(self, data):
        requests.post(self.server + '/report-ip', data=data)

    def get_interfaces(self, json_encode=False, exclude_lo=True):
        ifaces = {}
        for iface in netifaces.interfaces():
            if exclude_lo and iface == 'lo':
                continue
            for interface in list(netifaces.ifaddresses(iface).values()):
                address = interface[0]
                if 'netmask' not in address:  # Not a connected interface
                    continue

                # Start a new dictionary unless we're looking at an interface we've already seen
                iface_data = {'name': iface} if iface not in ifaces else ifaces[iface]

                addr = address['addr']
                if self.IPV4_PATTERN.match(addr):  # IPv4 address
                    iface_data['addressIPv4'] = addr
                    iface_data['netmaskIPv4'] = address['netmask']
                else:  # IPv6 address
                    iface_data['addressIPv6'] = addr
                    iface_data['netmaskIPv6'] = address['netmask']

                try:  # If this interface is a WiFi interface, get its info
                    wifi = self.get_wifi_info(iface)
                    iface_data['wifi'] = wifi
                except InterfaceError:
                    pass
                ifaces[iface] = iface_data

        return json.dumps(list(ifaces.values())) if json_encode else ifaces

    def get_wifi_info(self, iface):
        info = list(Cell.all(iface))[0]
        res = {
            'channel': info.channel,
            'encryption': info.encryption_type,
            'frequency': info.frequency,
            'signalStrength': info.signal,
            'ssid': info.ssid,
            'quality': info.quality,
        }
        if info.noise:
            res['noise'] = info.noise
        return res

    def get_os_info(self, json_encode=False):
        res = {
            'name': platform.system(),
            'architecture': platform.machine()
        }
        if platform.system() == 'Linux':
            res['dist'] = platform.linux_distribution()

        return json.dumps(res) if json_encode else res


if __name__ == '__main__':
    server = environ.get('IP_REPORTER_SERVER')
    if server:
        rep = IPReporter(server)
        data = {
            'interfaces': rep.get_interfaces(True),
            'hostname': platform.node(),
            'os': rep.get_os_info(True)
        }
        rep.report(data)
    else:
        print('Error: IP_REPORTER_SERVER environment variable not set')
