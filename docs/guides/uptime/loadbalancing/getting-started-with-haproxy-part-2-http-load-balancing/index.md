---
slug: getting-started-with-haproxy-part-2-http-load-balancing
title: "Getting Started With HAProxy Part 2: HTTP Load Balancing"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-08-29
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

[HAProxy](http://www.haproxy.org) is an intelligent intermediary gateway application between clients (frontends) and server resources (backends). Among other options, it directs frontends to backends based on inbound frontend requests, and serves results based on a round-robin server rotation, and/or based on health checks using TCP (Layer4) and/or HTTP (Layer7) server health conditions.

This guide is the second of a series of guides on HAProxy. In [Part One](), the basic features of TCP network load balancing using HAProxy are described, and steps to build a network that demonstrate its features are provided, using minimally-configured Linode nanodes. The HAProxy node is configured as a TCP load balancer with both passive and active TCP health checks on its backend servers. Please read it because the context for this guide builds from it, and complete the steps to build your test network before you begin work here.

## Before You Begin

### Test Platform Build Review

In Part One, the demonstration test bed includes building HAProxy into one of three server choices, Ubuntu 22.04LTS, CentOS Stream 9, or openSUSE Leap. The HAProxy server built is the listed IP address for inbound client frontend connections. 

Backend services consist of three Linode Marketplace WordPress servers, labeled backend1, backend2, and backend3, respectively. The backend WordPress servers are grouped as a backend, listed by their names and individual IP addresses, and are used as a pool in this example.

The Linode Marketplace one-click installation of WordPress is used to test the backend. The frontend is handled by the chosen HAProxy platform, and the backend IP addresses of the three WordPress instances become the testbed for examples of simple backend server failure emulation proving the TCP sensing.

This guide shows you how to set up frontend-backend HTTP logic matches, and how health checks using HTTP queries to backend servers permit HAProxy to match requests based on server health conditions as queried through http logic.

When a server is removed, it's queried until it answers correctly, and comes "up" as a member of the backend server pool that services requests. You can maintain a failed server’s existing connection, so that a busy server that is temporarily CPU-bound and can’t respond to requests, doesn’t lose its session with frontend clients. 

## Deploy Additional Backend Servers

You are going to use the three WordPress backend server instances from Getting Started With HAProxy Part One to demonstrate path-based configuration routing determination. These three server instances are named backend1, backend2, and backend3, and answer when accessed through a browser through the HAProxy gateway IP address, with a default home page. 

Using these instances, you’ll change paths within the HAProxy configuration file to demonstrate path-based deterministic routing by using the configuration to read the http frontend header to specify a backend path that mates the browser access with the backend server. The evidence of success in this routing is the correctly-supplied named backend server. 

## Configure Path-based Routing in HAProxy

### Define Application Backends in HAProxy

Building from the above platform, you are going to configure the backend instances and change the configuration file of HAProxy to inbound frontend requests, which when these requests are matched, serve the appropriate backend server. 

HAProxy reads the frontend header, matches the inbound HTTP header to a specified string, and the backend routes the frontend conversation based on the match. Failing a match, a default backend resource is allocated to the frontend request. Either allocation, a directed match, or a default match, also can be directed further through health checks.

The default home page of the backend router path is indicated at the top left of the page. 

### Methods of HTTP Redirection

HAProxy offers redirection based on the frontend configured logic statements. Most popularly, the client-sent header URL matches a resource variable name. The inbound HTTP header contains information that is used to associate a frontend access with an associated backend service through matching the header URL to variable name strings that you specify. The backend service can be an HTTP server, database, node.js responder, or your choice of destination. The backend resource, having matched the logic state of the frontend processing specification, mates frontend with the backend resource it’s directed to, creating a circuit between client and server. 

### Define the Application Front Ends in HAProxy

The example you use matches, depending on the string you send to HAProxy, your URL input to flow through the matching logic to a backend server. You can target the frontend URL and client request using the frontend ACL function. There are numerous ACL conditions you can use to test an incoming http 1.0/1.1/2.0 string. The HAProxy server built in Part One has a configuration file in the /etc/haproxy directory called haproxy.conf. This file can select a server based on the incoming HTTP header.
The syntax for frontend ACL URL processing is:

code: frontend #Describes a condition for incoming header statements
code: ACL <chosen_variable_name> <URL-input_string> <inbound_http_request>

[URL processing](http://docs.haproxy.org/2.4/configuration.html#7.3.6-url) in the example decides which backend resource is chosen based on the inbound HTTP header in a get or post request addressed to the frontend. 

### Update the HAProxy Frontend

Edit the /etc/haproxy/haproxy.cfg file using your favorite editor. 
Insert these entries into the /etc/haproxy/haproxy.cfgUpdate the HAProxy Frontend file to match the code below, and save the file. 

code: log	global
code: 	mode	http
code: 	option	httplog
code: 	option	dontlognull
code:         timeout connect 5000
code:         timeout client  50000
code:         timeout server  50000
code: 	errorfile 400 /etc/haproxy/errors/400.http
code: 	errorfile 403 /etc/haproxy/errors/403.http
code: 	errorfile 408 /etc/haproxy/errors/408.http
code: 	errorfile 500 /etc/haproxy/errors/500.http
code: 	errorfile 502 /etc/haproxy/errors/502.http
code: 	errorfile 503 /etc/haproxy/errors/503.http
code: 	errorfile 504 /etc/haproxy/errors/504.http


#New Code for HTTP Test
code: Use_server1 if url_site1
code: Use_server2 if url_site2
code: Use server3 if url_site3

code: backend 
code: server server1 <backend1 IP address>:80
code: server server2 <backend2 IP address>:80
code: server server3 <backend3 IP address>:80
code: frontend http
code: bind *:80
code: Mode http
code: Acl url_site1 path_beg /server1
code: Acl url_site2 path_beg /server2
code: Acl url_site3 path_beg /server3
code: Use_server1 if url_site1
code: Use_server2 if url_site2
code: Use server3 if url_site3
code: backend 
code: server server1 <backend1 IP address>:80
code: server server2 <backend2 IP address>:80
code: server server3 <backend3 IP address>:80

Using a browser, access the HAProxy server’s IP address, using just the IP address. If your browser complains of no HTTPS/TLS certificate, use its advanced settings to reach the site, ignoring the warning. 

Each individual backend server can be reached by changing the URL in your browser to:

code: <haproxy_server_IP_address>/server1

or:

code: <haproxy_server_IP_address>/server2

or:

code: <haproxy_server_IP_address>/server3

The ACL function allows you to evaluate and redirect many different types of frontend inputs using the HTTP header that arrives with each client. [Other methods of evaluation](http://docs.haproxy.org/2.4/configuration.html) are available on frontend requests to route them to matching backend resources.

## Health Checks

### Configure Basic HTTP Health Checks 

In Part One, the HAProxy gateway was configured to test TCP and Layer4 connectivity, which marks as down, servers that fail because of aggregate errors over a period of time. The HTTP health checks use a set of standard HTTP message interpretations to mark down servers when found over a specified interval. 

Like TCP health checks, HTTP health checks continue to test a marked-down server to see if it begins to respond. If a new correct response is discovered, the server is added back to the pool of up servers. 

The result of an HTTP health request can also specify a custom value rather than a standard WC2 HTTP message. This health check result request can use REGEX expressions, or simple text matches within the first 32kb of the get/post reply from the backend server. The string might match "Alive" or "Logged In" within a session. 
Basic HTTP Health Check

Mark backend servers to check for server health using the "check" directive:

code: backend mybackend
code:     option httpchk GET /health
code:     server backend1 <server_IP_address>:80 check
code:     server backend2 <server_IP_address>:80 check
code:     server backend3 <server_IP_address>:80 check

Using the check option shown, standard responses from the server in the 200399 range indicate to HAProxy that your servers have a pulse. Responses in the 400-500 range will mark the server as down from the current pool.

### Configuring String-based HTTP Health Checks

The HTTP health check can also query and match responses from a backend server. When requests are made, only the first 16kb of the response are loaded in. If very long page headers or in-line graphics or CGI is used, the desired response may be missed if it’s not within the 16kb limit of examined return data.

The HTTP-check directive checks a default three times before marking down a server. This code in the backend section of the example /etc/haproxy/haproxy.cfg file helps you check that a response was returned "OK". This string could be another string from a server page or resource that you retain in the pool when it responds "OK"-- or whatever variable suits your matching requirements. 

code: backend our_test
code:   option httpchk
code:   http-check expect string OK
code:   server backend1 <server_IP_Address>:80 check
code:   server backend2 <server_IP_Address>:80 check
code:   server backend3 <server_IP_Address>:80 check
  
Test Load Balancing Functionality and Verify Health Checks

Test the haproxy.cfg file for functionality through a sanity check:

code: haproxy -c /etc/haproxy/haproxy.cfg

An error message is returned if a check of the configuration file has logical or syntax errors. Each error is listed, line per line, when the check is complete. This doesn’t mean there are other logic problems or errors, rather, that HAProxy loads and attempts to service the gateway with the configuration.

On Ubuntu and openSUSE-based HAProxy hosts, HAProxy creates a log file in /var/log called haproxy.log. When using CentOS Stream, systemctl starts and stops HAProxy as a service, and rsyslog pipes HAProxy lots to a [file named during rsyslog configuration](https://www.server-world.info/en/note?os=CentOS_Stream_9&p=haproxy&f=1).

The functionality of your configuration revolves around the logic you employ to configure frontend and backend resources. There can be many configuration options chosen for complex sites. [The HAProxy logs](http://docs.haproxy.org/2.4/configuration.html#8) are highly-defined for sorting purposes, and follow one of five different user-definable (including a custom) formats.
 
### Testing Load Balancing

Each method of load balancing can be checked by altering the balancing method after manually killing or causing a mark-down of a server. Removing a desired backend WordPress URL page causes a 404 response for an HTTP-check. The returned 404 should show the server marked down after three attempts and three failures. You can also take the backend server offline using server management or httpd shutdown.
 
### Verifying Health Checks

You have several methods to test both active and passive health checks. Backend servers can be removed from the pool in several ways. They can be simply powered down, halting their network connection, and/or stopping the Apache httpd service on the backend instance. Refreshing the browser client request forms an HTTP get to HAProxy, which must select a backend server according to the URL requested in the browser refresh get request. HAProxy delivers a server remaining in the backend server pool, and failing an available server, returns an HTTP 400 or 500 error. 

You can monitor backend server logs with syslog aggregators like FluentD or other log aggregators that verify test results through log messages generated by HAProxy’s system log. 

In our example application, the backend servers use WordPress, which is served by MySQL/MariaDB or another database server. This database server backend can also be checked for connectivity. Third parties also support plugin HAProxy apps that are specifically configured for other applications, such as databases, message bus aggregators, and products in the pub/sub message logging space.

## Conclusion

The HAProxy HTTP gateway functions can deterministically assess HTTP inbound frontend traffic, and match it to backend resources by evaluating the HTTP header. In a similar way, the HTTP health checks can autonomously query backend servers and check for status messages indicating health, or specific strings inferring the health of individual or groups of backend servers. 

Test these servers for their load balancing function by randomly testing the configuration instructions against the behavior of server response. In a similar way, you determine the health of the backends by monitoring from client-side HTTP requests, and verifying correct responses. 