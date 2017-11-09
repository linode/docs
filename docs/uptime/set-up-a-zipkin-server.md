---
author:
  name: Luis Cortes
  email: docs@linode.com
description: 'This guide shows you how to use the Zipkin tracking system to collect and search timing data in order to identify latency problems on your website.'
keywords: ["zipkin", " tracking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-28
modified_by:
  name: Luis Cortes
published: 2017-09-28
title: 'Set Up a Zipkin Server'
external_resources:
 - '[Official ZipKin Documentation](http://zipkin.io/)'
---

![Set up a Zipkin Server](/docs/assets/zipkin/zipkin_banner.png)

## What is Zipkin?

[Zipkin](http://zipkin.io/) is a "catch all" for capturing timing data, a centralized repository, and a microweb server to allow you to display and search through spans and traces of your distributed programs or websites.

While the official documentation offers [three different ways of installing Zipkin](http://zipkin.io/pages/quickstart), this guide uses the Java method. One caveat to this method is that everything will be saved in and run from memory. All traces and spans will not be saved to disk. For a secure/storage solution, refer to the official documentation for the [DockerZipkin](https://github.com/openzipkin/docker-zipkin).

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access, and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet. This guide includes firewall rules specifically for a Zipkin server.

3. Create two Linodes and have access to another device:
    1.  One Linode to act as the Zipkin server.
    2.  The second Linode configured as a web server. This will be the Zipkin client machine.
    3.  A device with a web browser, Internet access, and a static IP address. This system will be used to view the traces/spans in the Zipkin server through the ZipKin provided webservice.
        * If the device's IP is dynamic, you'll need to reconfigure the firewall rules each time the IP changes.

While Zipkin can be installed on a variety of distributions, this guide uses Fedora 26 in the examples to configure both the server and client Linodes. Remember to adjust any distribution-specific commands, and replace the example IPs, `192.0.2.0`, `198.51.100.0`, `203.0.113.0` with the IP addresses of your Zipkin server, webserver, and analyst machine, respectively.

## The Target Scenario

This guide's target scenario is a three machine configuration:
1.  The Zipkin server performing the thrift and web services. Both services will use port `9411` (standard Zipkin configuration).

2.  A sample website running on a Linode. The website contains a few mock external services that may take longer than expected, causing the website's pages to render slowly or not at all. We will also configure a call back at port `5000` for Zipkin server callbacks.

    The idea is to be able to setup the Zipkin server and show the user how to add a few lines of python code to a client machine (in our case our web server) to create a simple span to get a few traces. The goal is to provide a sample client from which more can be instrumented in a similar fashion.

3. The final machine is an analyst system with a static IP. This machine will be used to view traces of the client machine from the Zipkin server.

## Zipkin Server Configuration

### Install Package Dependencies

1. Log into your Zipkin server Linode and update your distribution:

        sudo dnf update
        sudo dnf upgrade

2. Install Java:

        sudo dnf install java

3. Download the precompiled Zipkin Java file:

        wget -O zipkin.jar 'https://search.maven.org/remote_content?g=io.zipkin.java&a=zipkin-server&v=LATEST&c=exec'

4. To run Zipkin manually later without having to remember the java command, create a `start-zipkin.sh` file to contain the commands:

    {{< file "start-zipkin.sh" bash >}}
#!/bin/bash
java -jar zipkin.jar

{{< /file >}}


5. Make your new start-zipkin.sh file executable:

        chmod 700 start.sh

### Zipkin Server Hostname

1. Set the hostname of your server:

        hostnamectl set-hostname zipkinsvr

2. Add the new hostname to `/etc/hosts`:

    {{< file-excerpt "/etc/hosts" >}}
192.0.2.0     zipkinsvr

{{< /file-excerpt >}}


### Configure the Firewall for the Zipkin Server

Limit the exposure of our Zipkin server to just our analyst and client machines to avoid the server being compromised.

The default Fedora 26 firewall rules block all ports as a safety precaution. Create a new firewall zone to handle the Zipkin services without exposing too much of the system:

1.  On your Zipkin server, create a new firewall zone called `zipkin`:

        firewall-cmd --new-zone=zipkin --permanent

2.  Reload the firewall to refresh the zone list:

        firewall-cmd --reload

3.  Add the client Linode's public IP:

        firewall-cmd --zone=zipkin --add-source=198.51.100.0  --permanent

4.  Add the analyst Linode's public IP. If you don't define any source IPs, then you won't have any filtering of IPs. To turn filtering on, add at least one source IP:

        firewall-cmd --zone=zipkin --add-source=203.0.113.0  --permanent

5.  Open a firewall port:

        firewall-cmd --zone=zipkin --add-port=9411/tcp  --permanent

6.  (Optional) Since we will want to access the Linode from the analyst machine, add an SSH port:

        firewall-cmd --zone=zipkin --add-service=ssh --permanent

7. Reload and view the new zone:

        firewall-cmd --reload
        firewall-cmd --zone=zipkin --list-all

## Sample Web Server Configuration


### Install Package Dependencies

1. Log into your web server Linode and update your distribution:

        dnf update
        dnf upgrade

2. Depending on your system, you may need to install `python`:

        dnf install python
        dnf install python-devel

3.  Install the following dependencies:

        pip2 install py_zipkin bottle requests

4. Download the python script [website.py](/docs/assets/scripts/website.py) which has been commented to show the added Zipkin code:

        wget https://github.com/linode/docs/assets/scripts/website.py

### Configure Webservice

1. Set `ZIPKIN_SERVER` to the IP address of the Zipkin server:

    {{< file-excerpt "website.py" python >}}
def http_transport(encoded_span):
    import requests
    ZIPKIN_SERVER = "192.0.2.0"

{{< /file-excerpt >}}


2.  Set the host to allow access on the public IP address. If your Zipkin server and analyst machine are on the same local network as the webserver, skip this step:

    {{< file-excerpt "website.py" >}}
run(host='0.0.0.0', port=8080, reloader=True)

{{< /file-excerpt >}}


### Configure the Firewall for the Web Server

If you already have a firewall configured on your web server, you can skip this section.

1.  Create a new zone in our firewall called `webserver`:

        firewall-cmd --new-zone=webserver --permanent

2.  Reload the firewall to refresh the zone list:

        firewall-cmd --reload

3.  Add the IP address of the Zipkin server:

        firewall-cmd --zone=webserver --add-source=192.0.2.0  --permanent

4.  Add the IP address of the analyst machine:

        firewall-cmd --zone=webserver --add-source=203.0.113.0  --permanent

5.  Open both ports through the firewall. Port `8080` goes to the web service script, while port `5000` goes to the Zipkin callback for our span:

        firewall-cmd --zone=webserver --add-port=8080/tcp  --permanent
        firewall-cmd --zone=webserver --add-port=5000/tcp  --permanent

6. (Optional) Since you may want to access the Linode from the analyst machine, add an SSH port:

        firewall-cmd --zone=webserver --add-service=ssh --permanent

7.  Reload and view the new zone:

        firewall-cmd --reload
        firewall-cmd --zone=webserver --list-all


## Full System Test

1. Log into the Zipkin server and run the Zipkin service manually. Since Zipkin is using port `9411`, you don't need to run it as root:

        ./start-zipkin.sh

2. Log into the webserver Linode and run the mock web server. You don't need to run this command as root:

        python2 website.py

3. Use the browser on your analyst machine to navigate to the address of your webserver:

        http://198.51.100.0:8080/

    Refresh the page several times to generate more traces for Zipkin to track.

4.  To view your traces, enter your Zipkin server's IP address in a new tab:

        http://192.0.2.0:9411/

    Adjust the start and end dates on the web form, and fill in **10** for the duration. Click "Find Traces" to see the results. You can click on each of the traces to see details.
