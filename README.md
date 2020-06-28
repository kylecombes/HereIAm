## Never lose access to a headless device again!

Network-connected headless devices (e.g. Raspberry Pis with no displays) are often difficult to connect to over WiFi.
Static IP addresses can be laborious to configure and, when on congested networks, address conflicts often arise.
DHCP solves those problems, but there’s no easy way to know what IP address a device has been given by a router.

HereIAm provides an all-in-one network status reporting solution to address this problem. A tiny client Python script
reports the network status, including IP address and WiFi signal strength, to a Node server. A React web app then
connects to this server (using WebSockets for live updating) and displays the reported device information.

![HereIAm overview](http://cdn.kylecombes.com/projects/hereiam/main-overview.png)

# Configuring a headless device

The following instructions will configure a Linux-based machine to report its network status
upon connecting to any network. This (hopefully) ensures that the server will always be up-to-date.

1) Clone this repo (`git clone https://github.com/kylecombes/HereIAm.git`).

2) Install the dependencies with `sudo -H pip3 install -r hereiam/client/requirements.txt`.

3) Create a new plaintext file with `sudo nano /etc/network/if-up.d/hereiam`. In it, place the following (inserting the correct URL and path to main.py):

   ```
   #!/bin/bash
   /usr/bin/python3 ~/hereiam/client/main.py --server <SERVER_URL> --config ~/.config/hereiam
   ```

4) Make the file executable with `sudo chmod +x /etc/network/if-up.d/hereiam`.

5) Test the file by running `/etc/network/if-up.d/hereiam`. The device should appear on the server.

## Right way

1) `sudo systemctl edit --force --full hereiam.service`

2) Enter the following:
    ```bash
    [Unit]
    Description=HereIAm daemon
    After=network-online.target
    
    [Service]
    Type=simple
    User=pi
    WorkingDirectory=/home/pi
    ExecStart=/usr/bin/python3 /home/pi/hereiam/client/main.py --server=https://hereiam-devices.herokuapp.com
    
    [Install]
    WantedBy=multi-user.target
    ```
   
4) Run it `sudo systemctl start myfirst`
   
3) Run it at boot `sudo systemctl enable myfirst`