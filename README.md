## Never lose access to a headless device again!

Network-connected headless devices (e.g. Raspberry Pis with no displays) are often difficult to connect to over WiFi.
Static IP addresses can be laborious to configure and, when on congested networks, address conflicts often arise.
DHCP solves those problems, but there’s no easy way to know what IP address a device has been given by a router.

HereIAm provides an all-in-one network status reporting solution to address this problem. A tiny client Python script
reports the network status, including IP address and WiFi signal strength, to a Node server. A React web app then
connects to this server (using WebSockets for live updating) and displays the reported device information.

![HereIAm overview](http://cdn.kylecombes.com/projects/hereiam/main-overview.png)
