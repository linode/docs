---
author:
  name: Luis Cortes
  email: docs@linode.com
description: 'Zipkin is a tracking system that allows you to collect and search timing data in order to identify latency problems.'
keywords: 'zipkin, tracking'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Tuesday, September 12th, 2017
modified_by:
  name: Linode
published: 'Monday, September 11th, 2017'
title: 'Set Up a Zipkin Server with Sample Website Tracking'
external_resources:
 - '[Official ZipKin Documentation](http://zipkin.io/)'
---

## What is Zipkin?

[Zipkin](http://zipkin.io/) is a kind of "catch all" for capturing timing data, a centralized repository, and a microweb server to allow you to display/search through spans/traces of your distributed programs/websites.

There are 3 recommended ways we can set it up. We will start with the easiest, downloading a JAR file and executing it with Java. Caveat: everything will be in memory. All traces and spans will not be saved to disk. View docker configuration for secure/storage solution.

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access, and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet. This guide includes firewall rules specifically for a Zipkin server.

3. This guide will use Fedora 26 to configure both of the server machines. The workstation you will use can be any machine with a web browser.

4. You will need a webserver machine in the Linode cloud. We will create a mock Python website with a couple of mock functions we can use to simulate timing data. This machine will be called **websvr**. We will also refer to this machine as a Zipkin client machine.

5. You will need an analyst system (laptop or workstation) with a web browser. Our client system will be called **officeworker**. This system will be used to view the traces/spans in the Zipkin server through the ZipKin provided webservice.

{: .note}
>
> Throughout this guide, please replace 192.0.2.0, 198.51.100.0, 203.0.113.0 with the IP addresses of your Zipkin server, web server, and analyst machine, respectively.

{: .note}
> The assumption for your analyst machine is that your real world IP address is a static IP address. Otherwise, you need to find out what has been assigned to it by a DHCP server everytime, and reconfigure your firewall rules on your Zipkin server to match.

## The Target Scenario

The target scenario is a three machine configuration. The first machine will be the Zipkin server performing the thrift and web services. Both services will use port 9411 (standard Zipkin configuration).

![Zipkin Layout](zipkin_layout.png)

The second will be a normal sample website running on a web server machine. The website contains a couple of mock external services that may take longer than expected, causing the website's pages to render slowly or not at all. We will also configure a call back at port 5000 for Zipkin server callbacks.

The idea is to be able to setup the Zipkin server and show the user how to add a few lines of python code to a client machine (in our case our web server) to create a simple span to get a few traces. The goal is to provide a sample client from which more can be instrumented in a similar fashion.

The final machine is an analyst system probably located in some business with a static IP. This machine will be used by the analyst to view traces of the client machine from the Zipkin server.

## Zipkin Server Configuration

### Install Package Dependencies

1. Log into your Zipkin server machine and make sure your Fedora 26 OS is up to date:

        sudo dnf update
        sudo dnf upgrade

2. Install Java:

        sudo dnf install java

3. Download Zipkin. [The quick start guide](http://zipkin.io/pages/quickstart) provides 3 different ways to install Zipkin. Let's take the second option: downloading a precompiled JAR file:

        wget -O zipkin.jar 'https://search.maven.org/remote_content?g=io.zipkin.java&a=zipkin-server&v=LATEST&c=exec'

4. The guide also describes how to run Zipkin manually. We will create a start-zipkin.sh file that will contain these commands. We don't want to have to remember them more than once.

    {: .file}
    start-zipkin.sh
    :   ~~~
        #!/bin/bash
        java -jar zipkin.jar
        ~~~

5. Make your new start-zipkin.sh file executable.

        chmod 700 start.sh

### Zipkin Server Hostname

1. Set the hostname of your server, if you haven't already:

        hostnamectl set-hostname zipkinsvr

2. Add the new hostname to `/etc/hosts`:

    {:.file-excerpt}
    /etc/hosts
    :   ~~~
        192.0.2.0     zipkinsvr
        ~~~

#### Firewall Steps for Zipkin Server

Whenever one sets up any service on a public server machine there is a possibility that your machine may be hacked, DOS'ed, or compromised.

As a precaution, we will limit the availability of our Zipkin server to just our analyst and client machines.

Due to the default Fedora 26 firewall rules, no ports are open - this is by design and a safety precaution. Let's see how to open up those ports without allowing everyone to get in to our Zipkin server.

Note: both of the Zipkin services use the same port 9411/tcp.

This is where `firewall-cmd` shines. We will create a new zone in our firewall that will handle the Zipkin services and source machines and block everything else.

1.  On your Zipkin server, create a new zone in our firewall called **zipkin** (all lowercase as Linux is case sensitive).

        firewall-cmd --new-zone=zipkin --permanent

2.  Reload the firewall so you can refresh your zone list.

        firewall-cmd --reload

3.  Add a client machine real world IP.

        firewall-cmd --zone=zipkin --add-source=198.51.100.0  --permanent

4.  Add an analyst machine real world IP (If you forget to define any source IPs, then you will effectively have no filtering on your IPs. In other words you need at least 1 source IP to start filtering on IPs. If there are no source IPs defined, any machine can connect to your server.)

        firewall-cmd --zone=zipkin --add-source=203.0.113.0  --permanent

5.  Open a port through your firewall.

        firewall-cmd --zone=zipkin --add-port=9411/tcp  --permanent

6.  (Optional) Since we may want to access our machine from the analyst machine, it may be a good idea to add an ssh port.

        firewall-cmd --zone=zipkin --add-service=ssh --permanent

7. Reload and View your new zone:

        firewall-cmd --reload
        firewall-cmd --zone=zipkin --list-all

## Sample Web Server Configuration


### Install Package Dependencies

1. Log into your web server machine. Then make sure your Fedora 26 OS is up to date:

        dnf update
        dnf upgrade

2. Depending on your system, you may need to install `python`:

        dnf install python
        dnf install python-devel

3.  Install the the following dependencies:

        pip2 install py_zipkin bottle requests

4. Download the python script [website.py](/docs/assets/scripts/website.py) which has been commented to show where we added the Zipkin code.

        wget https://github.com/linode/docs/assets/scripts/website.py

### Configure Webservice

1. Set ZIPKIN_SERVER to the IP address of the Zipkin server:

    {:.file-excerpt}
    website.py
    :   ~~~
        def http_transport(encoded_span):
            import requests
            ZIPKIN_SERVER = "192.0.2.0"
        ~~~

2.  Set the host to allow access on the public IP address (if your Zipkin server and analyst machine are on the same local network as the webserver, you can skip this step):

    {:.file-excerpt}
    website.py
    :   ~~~
        run(host='0.0.0.0', port=8080, reloader=True)
        ~~~

#### Firewall Steps for Web Server

If you already have firewall protection on your webserver, you can skip this section.

1.  Create a new zone in our firewall called **webserver** (all lowercase as Linux is case sensitive).

        firewall-cmd --new-zone=webserver --permanent

2.  Reload the firewall so you can refresh your zone list.

        firewall-cmd --reload

3.  Add the IP address of the Zipkin server.

        firewall-cmd --zone=webserver --add-source=192.0.2.0  --permanent

4.  Add the IP address of your analyst machine.

        firewall-cmd --zone=webserver --add-source=203.0.113.0  --permanent

5.  Open both ports through your firewall. Port 8080 goes to our web service script, while port 5000 goes to our Zipkin callback for our span.

        firewall-cmd --zone=webserver --add-port=8080/tcp  --permanent
        firewall-cmd --zone=webserver --add-port=5000/tcp  --permanent

6. (Optional) Since we may want to access our machine from the analyst machine, it may be a good idea to add an ssh port.

        firewall-cmd --zone=webserver --add-service=ssh --permanent

7.  Reload and view your new zone:

        firewall-cmd --reload
        firewall-cmd --zone=webserver --list-all


## Full System Test

1. Log into the Zipkin server and run the Zipkin service manually. Since Zipkin is using port 9411, you don't need to run it as root.

        ./start-zipkin.sh

2. Log into your webserver and run the mock web server. You don't need to run this command as root:

        python2 website.py

3. Log into your analyst machine. In a browser's address bar, type the address of your webserver:

        http://198.51.100.0:8080/

Refresh the page several times to generate more traces for Zipkin to track.

4.  To view your traces, enter your Zipkin server's IP address in a new tab:

        http://192.0.2.0:9411/

Adjust the start and end dates on the web form, and fill in **10** for the duration. Click "Find Traces" to see the results. You can click on each of the traces to see details.
