import argparse
import json
import netifaces
from os import environ
import os
import platform
import re
import requests
import uuid
from wifi import Cell
from wifi.exceptions import InterfaceError


IPV4_PATTERN = re.compile('^\d{1,3}\.\d{1,3}\.\d{1,3}.\d{1,3}$')


def report():
    url = '{}/devices/{}'.format(server, uid)
    print(url)
    print(data)
    requests.put(url, json=data)


def get_interfaces(json_encode=False, exclude_lo=True):
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
            if IPV4_PATTERN.match(addr):  # IPv4 address
                iface_data['addressIPv4'] = addr
                iface_data['netmaskIPv4'] = address['netmask']
            else:  # IPv6 address
                iface_data['addressIPv6'] = addr
                iface_data['netmaskIPv6'] = address['netmask']

            try:  # If this interface is a WiFi interface, get its info
                wifi = get_wifi_info(iface)
                iface_data['wifi'] = wifi
            except InterfaceError:
                pass
            ifaces[iface] = iface_data

    return json.dumps(list(ifaces.values())) if json_encode else ifaces


def get_wifi_info(iface):
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


def get_os_info(json_encode=False):
    res = {
        'name': platform.system(),
        'architecture': platform.machine()
    }
    if platform.system() == 'Linux':
        res['dist'] = platform.linux_distribution()

    return json.dumps(res) if json_encode else res


# Try to get the server URI from an environment variable
server = environ.get('HEREIAM_SERVER')

# Parse any passed arguments
parser = argparse.ArgumentParser(description='Reporting client for HereIAm'
                                 + 'dynamic IP address reporter.')
parser.add_argument('-s', '--server', help='the server address (overrides any '
                    + 'set environment variable)')
args = parser.parse_args()
if args.server:
    server = args.server


if server:

    # Determine this device's UID
    homeDir = os.environ['HOME']
    dataDir = os.path.join(homeDir, '.hereiam')
    uidFilePath = os.path.join(dataDir, 'uid')

    # Create ~/.ifacereporter if it does not exist
    if not os.path.exists(dataDir):
        os.makedirs(dataDir)

    if os.path.isfile(uidFilePath):  # Read the UUID if one already exists
        f = open(uidFilePath, 'r')
        try:
            uid = f.read()
            print('Read UUID:', uid)
        finally:
            f.close()
    else:  # Generate and save a UUID if one does not already exist
        uid = uuid.uuid4()  # Generate random unique identifier
        f = open(uidFilePath, 'w+')
        try:
            print('Attempting to write {} to {}'.format(uid, uidFilePath))
            f.write(str(uid))
            print('Successfully wrote to file')
        finally:
            f.close()

    data = {
        'interfaces': get_interfaces(True),
        'hostname': platform.node(),
        'os': get_os_info(True),
        'uuid': uid
    }
    report()
else:
    print('Error: HEREIAM_SERVER environment variable not set')
