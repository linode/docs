---
slug: getting-started-with-haproxy-part-one-tcp-load-balancing
title: "Getting Started with HAProxy Part One: TCP Load Balancing"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-08-21
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

An HAProxy instance serves as a reverse proxy between client requests, called the network frontend, and server resources, or the backend. It serves as a shared uniform resource indicator (URI) similar to a URL, placing client traffic on backend compute resources. 

HAProxy also performs optional services, which are masked and transparent to clients. It can manage clients by session, resolve and strip/encrypt Transport Layer Security (TLS), manage sessions, and use prevention methods to mask backend resources from malicious and benign malformed client traffic.

The HAProxy network (TCP) load balancer uses stateful routing between frontend and backends using one of several configuration choices, keeps track of clients, and determines their destination. HAProxy determines connections between the frontend and backend based on Layer 4 (network) or Layer 7 (application) configuration settings.

It performs many gateway and server tasks that offload server compute instance needs and performs much of its work in the Linux kernel which optimizes its capacity. There are several options available for administrators to minimize congestion on cloud networks. These include differing methods of choosing how clients and servers become related, troubleshooting, decrypting and encrypting TLS for the backend server compute instances, sensing backend server traffic load and/or health, all while maintaining copious logs for trend analysis, troubleshooting, and forensics.

The most common use of HAProxy is as an intelligent network load balancing instance. In this role, HAProxy gateway uses simple round-robin, client-to-server routing, or more complex routing based on backend server health.

This guide demonstrates how to install HAProxy onto three popular Linode Linux distribution families, Ubuntu, CentOS Stream, and openSUSE Leap. It also provides instructions for how to deploy WordPress on Linode Marketplace Nanode instances, and develop a proof-of-concept based on HAProxy network load balancing features.

## Install HAProxy

There are several prerequisites you need before installing HAProxy. Choose the latest version of HAProxy, which begins with an even number. There are Long Term Service (LTS) versions available that are best for deployment. Most Linux repositories have a checked build when HAProxy is pulled.

For testing and production purposes, any network client-side configuration, IPv4 or IPv6 can be used. For production use, the HAProxy IP address is used as a client termination point for your backend resources. Your host DNS points to this pair of addresses. 

Once in production, the HAProxy instance becomes a gateway to the backend resources you’ve allocated for client services. In this test case, these include a working DNS configuration, and a cloud host configured to be the target of the frontend IP addressing scheme. Backend servers may additionally be cascaded with other HAProxy servers to manage traffic for subsidiary processes.
HAProxy is typically installed into a Linux compute instance as the sole application on the instance, because the instance is the sole traffic termination point for network traffic. 
 
### Installing HAProxy on Ubuntu 22.04 Server

An Ubuntu Server can be deployed on a simple [Linode Nanode](https://www.linode.com/blog/linode/akamai_cloud_computing_price_update/) with minimal memory and disk size. From the Linode user interface, choose Linodes, Create, and then from Distributions choose Ubuntu 22.04 LTS as the source image. Select a Region near you, a Linode Plan of Shared CPU Nanode, root password and details of ssh keys or passwords unique to your use of Linode. Start the Linode server and login using your root user and root password.

HAProxy installation is performed after an update to the base Ubuntu 22.04 Server payload:
code: apt update
code: apt upgrade -y

The latest kernel updates are installed. Reboot the instance:
code: reboot

After the reboot, the latest HAProxy instance in the repository is installed. Log back into the server:
code: apt install haproxy

The application and libraries are now installed, but HAProxy configuration file editing must take place, and HAProxy must be set to restart upon reboot. HAProxy is controlled through its configuration file and CLI. Skip to Deploy Backend Instances.

### Installing HAProxy on CentOS Stream

From the Linode user interface choose Linodes, Create, and then from Distributions choose CentOS Stream 9 as the source image, a Region near you, a Linode Plan of Shared CPU Nanode, root password and details of ssh keys or passwords unique to your use of Linode. 

Start the Linode server. Login using the root user and root password that you set during configuration.

To install HAProxy on this instance, use dnf:
code: dnf install haproxy

The application and libraries are now installed and apparmor is configured, but HAProxy configuration file editing must take place, and HAProxy must be set to restart upon reboot. HAProxy is controlled through its configuration file and CLI. Skip to Deploy Backend Instances.

### Installing HAProxy on openSUSE Leap

From the Linode user interface, choose Linodes, Create. Then from Distributions choose openSUSE Leap as the source image. Seleect a Region near you, a Linode Plan of Shared CPU Nanode, root password and details of ssh keys or passwords unique to your use of Linode. 

Start the Linode server. Login using the root user and root password set during configuration.

Next, install HAProxy using zypper:
code: zypper in haproxy

The application and libraries are now installed, but HAProxy configuration file editing must take place, and HAProxy must be set to restart upon reboot. HAProxy is controlled through its configuration file and CLI. Configure the test servers next. 

### Deploy Backend Instances

This guide uses simple Wordpress backend instances to demonstrate how HAProxy controls network traffic flows at both the TCP/Network (Layer 4) and HTTP/Application (Layer 7) levels. A minimal Linode/Akamai Nanode can be used to test and demonstrate HAProxy options.

Build three test backend WordPress test instances and configure these backend servers to use your VLAN.

From the Linode Create Menu, select Marketplace, then choose WordPress from Popular Apps. The default image used is Ubuntu 22.04 LTS.

Choose a LAMP or LEMP stack, a location in the same data center where you’re hosting your HAProxy instance. Supply passwords, and a username for the database. Check the fields in the Create page, then press the Create button.

Create a second and third instance by repeating these steps, but insert Backend2 and Backend3 as the server instance names. These are connected to your VLAN. Each of these servers will be generated with an index.html (home page) indicating the name of the server (Backend1, Backend2, Backend3). Check each server by its IP address to ensure correct generation of the example test server. Note the IP addresses used by the three servers.
 
### HAProxy Configuration File

All of the HAProxy instances described above use a similar configuration file which you can find in: /etc/haproxy/haproxy.cfg. During installation of HAProxy, a default file is written. This file is modified to set options.

The HAProxy configuration file contains the settings you need to perform network balancing and flow control. The file is located as: /etc/haproxy/haproxy.cfg in the above HAProxy server installations. It can be edited with vim, nano, or another favored text editor. 

### Starting and Stopping HAProxy After Configuration Changes

The sysctl command is used to start HAProxy:
code: sysctl start haproxy
You can use sysctl to start HAProxy after a reboot by using the command:
code: sysctl enable haproxy
When you make a change to the configuration file, restart HAProxy with this command:
code: sysctl restart haproxy

## Configure HAProxy as a TCP Load Balancer

Backends are the pool of servers chosen by HAProxy as terminating connections for inbound client frontend traffic. HAProxy uses different balancing methods to connect frontend traffic to backend traffic, and unless specified, the default is no-balancing.

Balancing methods include: 

-   Round Robin: This method considers the pool of available backend servers and assigns the next server in the backend farm. 
-   Least Conn: The HAProxy gateway keeps track of source frontend clients and backend servers and allocates inbound connection requests to the server having the least connections. 
-   Health: Active and Passive backend health check methods add and delete servers from the server farm pool.

### Set Up Backends in HAProxy (TCP)

Backend servers are listed in the haproxy.cfg file and the following code is appended to the /etc/haproxy/haproxy.cfg file:  
code: backend web_test
code:     mode tcp
code:     balance roundrobin
code:          server server1 <backend1 IP address>:80
code:          server server2 <backend2 IP address>:80
code:          server server3 <backend3 IP address>:80

These additions to the file configure your HAProxy gateway to listen for port 80 (http traffic) and establish the name web-test for the frontend. The backend is configured in the server statements and uses the VLAN addresses that are specified in the HAProxy server instance when it was initially configured.
 
The example round robin method attaches a client reaching the IP address of the HAProxy server, to the next server on the list of servers. 

### Set Up Frontends in HAProxy (TCP)

The HAProxy instance listens to its IP addresses for traffic. The backend name used in the example above must match the frontend client listening ports:

code: frontend web-test
code: bind *:80
code: mode tcp
code: default_backend web-test

The bind command sets the mode between the left and right side of the ":" colon argument. In this example, where "*:80" is stated, the bind directive takes the inbound port of the frontend and listens to port 80, the commonly used port for web activity. The next line calls out filtration by TCP, which monitors for TCP error messages to (next line) the default_backend named "web-test". 

## Configure Health Checks

### Active Health Checks 

HAProxy’s network load balancing function can also make selections based on health criteria of its backend server farm member servers. These checks can be active or passive. 

An active health check probes backend servers individually for health attributes, while a passive check uses only basic connection error information by protocol (Layer 4/TCP or Layer7/HTTP).

You can determine and enable a server’s suitability with the check verb appended to a server listing in your HAProxy configuration file:

code:  server server1 <backend1 server IP address>:80 check

When the check verb is appended, HAProxy uses a syn/ack to determine that the server is alive. Some servers respond correctly to this type of query, but other services may be down or unavailable.

The active health check choice is more sophisticated and determines its state by using application-specific queries to backend servers, and the correct response expected by such a query.  

The HAProxy Server checks servers according to an interval you specify. For example:
code: backend web-test
code: server server1 <backend1 server IP address>:80 check inter 4

This checks the first server in the pool every four seconds and marks the server down if it doesn’t respond. This is similar to a ping-type health check for server response.

### Passive Health Checks 

HAProxy uses TCP protocol to perform passive health checks on backend servers. An example backend TCP passive health check, using this guide’s configuration, checks for Layer 4 (TCP) errors, and finding the limit specified, mark-as-down the server:
code: backend web-test 
code: server backend1 <server IP address>:80 check  observe layer4  error-limit 10  on-error mark-down

This check sends TCP summed errors to determine whether the number of errors (ten errors are specified) marks the server as down. You can change intervals [for different servers](https://www.haproxy.com/documentation/hapee/1-8r1/load-balancing/health-checking/active-health-checks/) based on their capacity or complexity.

## Test Load Balancing Functionality and Verify Health Checks

Use your example: /etc/haproxy/haproxy.cfg:
code: 	frontend web-test
code:     bind *:80
code:     mode tcp
code:     default_backend web-test
code: 	backend web_test
code:     mode tcp
code:    balance roundrobin
code:    server server1 <backend1 IP address>:80
code:    server server2 <backend2 IP address>:80
code:    server server3 <backend3 IP address>:80


Point a browser at the HAProxy gateway IP address found in your initial HAProxy server instance, and the first server’s WordPress web page, indicating backend1 should be displayed. Open a second window, and repeat the same URI (HAProxy server IP address) and backend2’s default page should appear. Open a third window and repeat these steps for backend3 server’s web page to appear.

After these pages are loaded, HAProxy considers them a balanced backend. To test the functionality, you have several options:

-   Remove one of the servers by powering it down. Reloading or opening new browser requests to the closed server eliminated it from the pool.

-   You can also use and ssh shell into any of the servers, and shutdown its apache service by using the command:

    code: sysctl apache2 stop

You can disable the network connection to have a failure of the network service to prove the elimination of a server from the backend pool because the health check disables the selection of the server when the server doesn’t respond to the syn. 

HAProxy has complex checks that can ask, via an active health check, for a specific response from a server under its control, and if the response doesn’t match the regex expression sought, it "mark down", or removes, the server from the availability pool.
 
## Conclusion

The HAProxy gateway balances frontend requests to backend resources according to its configuration. The configuration can determine an available backend server resource from a configured pool through simple, round robin sequential backend server selection, or through active or passive backend health checks.