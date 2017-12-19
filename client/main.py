from os import environ
import json
import requests


class IPReporter:

    def __init__(self, server, daemon_mode=True):
        """
        Creates a new IP reporter
        :param server: the URL of the server
        :param daemon_mode: whether or not to keep running this process indefinitely as a daemon process
        """
        self.server = server

    def report(self, data):
        ip = '192.168.39.24'
        hostname = 'hydra'
        os_name = 'Ubuntu 16.04 64-bit'
        requests.get(self.server + '/report-ip?ip={ip}&hostname={hostname}&os={os}'.format(ip=ip, hostname=hostname, os=os_name))


if __name__ == '__main__':
    server = environ.get('IP_REPORTER_SERVER')
    if server:
        rep = IPReporter(server)
        data = {'testing123': 'take it back, back!'}
        data_json = json.dumps(data)
        rep.report(data_json)
    else:
        print('Error: IP_REPORTER_SERVER environment variable not set')
