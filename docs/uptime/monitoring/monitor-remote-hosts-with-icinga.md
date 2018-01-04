---
author:
<<<<<<< Updated upstream
  name: Matt Vass
  email: linuxboxgo@gmail.com
description: 'This guide will show you how to install and configure Icinga2 monitoring system in the latest release of Debian 9'
keywords: 'debian, icinga, monitoring'
=======
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how to configure Icinga2 to monitor remote systems on your Linode"
og_description: "This guide will show you how to configure Icinga2 to monitor your remote systems. Icinga2 can monitor local and remote systems, and this guide shows you how to do both."
keywords: ["debian", "icinga", "monitoring", "icinga2"]
>>>>>>> Stashed changes
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-12-12
modified_by:
  name: Linode
published: 2017-12-12
title: 'Monitor Remote Hosts with Icinga'
external_resources:
 - '[Official Icinga Documentation](https://www.icinga.com/docs/icinga2/latest/doc/01-about/)'
---

Icinga, previously a fork of popular Nagios monitoring system, is an Open-Source network monitoring application that can be used to monitor critical services and systems over your premises. Icinga2 can check and monitor hosts in a network or it can verify network external protocols, such as the state of a HTTP server, a mail server a file share service or others. However, Icinga2 can be configured to monitor internal systems state and check the load, the memory, the disk free space or other internal parameters via Icinga agents deployed in every node that needs to me monitored. Icinga can also be configured to send notifications and alerts via e-mail or SMS to the system administrators defined in contacts. Icinga is highly deployed in Linux on top of Apache web server, PHP server-side interpreted programming language and MySQL or MariaDB database. These components make what we know as the LAMP stack.


<<<<<<< Updated upstream
In this tutorial we’ll cover how to install and configure the latest version Icinga2 web monitoring tool in Debian 9.2 in order to monitor our network infrastructure. We’ll also cover how we can setup icinga2 to monitor remote hosts services, such as HTTP servers, via regular command checks and how to deploy Icinga2 agent-based services running on the nodes that needs to be monitored in order to securely collect internal nodes system information, such as memory consumption, the system load degree, number of running processes or other important internal system parameters.
=======
This guide is a continuation of our guide on [Icinga2](/docs/uptime/monitoring/install-icinga2-monitoring-on-debian-9).
Icinga, is an open source network monitoring application that can be used to monitor critical services and systems on your Linode. Icinga2 can monitor hosts on a network or it can verify network external protocols, such as the state of an HTTP server, mail server, file-sharing service, or others.
>>>>>>> Stashed changes


<<<<<<< Updated upstream
## Prerequisites
=======
>>>>>>> Stashed changes

-	Debian 9.2 installed on a virtual private server
-	Root account access via console or remotely via SSH service or `sudo` root privileges for a local or remote account
-	A domain name, private or public, depending on your deployment, with the proper DNS records configured for web services
-	A mail service properly configured at your premises in order to send mail alerts

<<<<<<< Updated upstream
### Monitor Remote Hosts via Simple Host Monitoring

In order to monitor a host and its external services via regular command checks, Icinga2 uses a mechanism that issues a ping command at regular time intervals against the server's IP address and also, using its internal built-in commands, regularly verifies the state of remote network services protocols, such as HTTP, SSH, SMTP, IMAP, POP or others. Icinga2 stores Host definitions in objects. These objects with their attributes used for applying rules for Service, Notification, Dependency and Scheduled Downtime can be found in `hosts.conf` file, which can be located in `/etc/icinga2/conf.d/` directory. To add a new host definition in order to be periodically monitored by Icinga2 engine via ICMP checks, in order to check if the host is online, open `hosts.conf` configuration file for editing and add the following lines add the bottom of the file.
=======
The steps and examples in this guide assume the defaults and configurations from the previous guide. Adjust all variables accordingly.
>>>>>>> Stashed changes

`nano /etc/icinga2/conf.d/hosts.conf`


Icinga Host definition sample:

~~~ conf
object Host "WebServer VPS" {
  import "generic-host"
  address = "10.25.1.31"
  check_command = "hostalive"
}
~~~


Assuming that you want to check the status of a web server that runs in this node, add the following lines after host definition. This check will verify if the web server is alive and responds with the proper HTTP codes.

~~~ conf
object Service "http" {
  host_name = " WebServer VPS"
  check_command = "http"
}
~~~

Finally, to apply the Host definitions and start periodically monitor the new host resource and the external web server, restart icinga2 daemon by issuing the following command.

`systemctl restart icinga2.service`

Verify the state of the new added host by navigating to **Overview -> Hosts** in Icinga’s Web 2 interface. In the right plane you should see the health status of the new added host.


![description](images/23.PNG)

To display the status of the host’s HTTP service, navigate to **Overview -> Servicegroups** and hit on HTTP Checks. In the right plane you should see health status of the external web service.

![description](images/24.PNG)



### Monitor Remote Hosts via Icinga2 Agent Monitoring
Icina2 can monitor nodes internal health parameters, such as CPU load, disk space, memory, number of running process via a secured channel setup between a master node and client node on port 5665/TCP. In this instance we’ll configure our Icinga2 to act as the master node and check the internal parameters health status of a remote client node, where a CentOS 7 server runs. In this specific type of configuration, also named Top Down Command Endpoint model, the check commands will be scheduled on the master node and then will be sent to the client via a TLS connection.

First, we need to setup Icinga2 master node in our current Debian 9 server. Execute the below command to configure this instance of Icinga2 as a master node.

`icinga2 node wizard`


 Use the below command output excerpt to configure the master node:


<pre>
Welcome to the Icinga 2 Setup Wizard!

We'll guide you through all required configuration details.

<b>Please specify if this is a satellite setup ('n' installs a master setup) [Y/n]: n </b>
Starting the Master setup routine...
Please specifiy the common name (CN) [icinga]: <b>press Enter</b>
Checking for existing certificates for common name 'icinga'...
Certificates not yet generated. Running 'api setup' now.
information/cli: Generating new CA.
information/base: Writing private key to '/var/lib/icinga2/ca/ca.key'.
information/base: Writing X509 certificate to '/var/lib/icinga2/ca/ca.crt'.
information/cli: Generating new CSR in '/etc/icinga2/pki/icinga.csr'.
information/base: Writing private key to '/etc/icinga2/pki/icinga.key'.
information/base: Writing certificate signing request to '/etc/icinga2/pki/icinga.csr'.
information/cli: Signing CSR with CA and writing certificate to '/etc/icinga2/pki/icinga.crt'.
information/pki: Writing certificate to file '/etc/icinga2/pki/icinga.crt'.
information/cli: Copying CA certificate to '/etc/icinga2/pki/ca.crt'.
Generating master configuration for Icinga 2.
information/cli: Adding new ApiUser 'root' in '/etc/icinga2/conf.d/api-users.conf'.
information/cli: Enabling the 'api' feature.
Enabling feature api. Make sure to restart Icinga 2 for these changes to take effect.
information/cli: Dumping config items to file '/etc/icinga2/zones.conf'.
information/cli: Created backup file '/etc/icinga2/zones.conf.orig'.
Please specify the API bind host/port (optional): press Enter
Bind Host []: <b>press Enter</b>
Bind Port []: <b>press Enter</b>
information/cli: Created backup file '/etc/icinga2/features-available/api.conf.orig'.
information/cli: Updating constants.conf.
information/cli: Created backup file '/etc/icinga2/constants.conf.orig'.
information/cli: Updating constants file '/etc/icinga2/constants.conf'.
information/cli: Updating constants file '/etc/icinga2/constants.conf'.
information/cli: Updating constants file '/etc/icinga2/constants.conf'.
Done.

Now restart your Icinga 2 daemon to finish the installation!
</pre>

In order to apply the master node configuration, restart Icinga2 service and check daemon status by issuing the following commands.

`systemctl restart icinga2.service`

`systemctl status icinga2.service`


Also, issue ss command to output the port number of this master node and open the port in your Debian firewall.

`netstat -tulpn| grep icinga`


On the next step, generate a client ticket for your client node by issuing the following command. Use the *hostname* of your client to generate the ticket. In this example the client node hostname is `centos`. Replace the hostname of the client appropriately and make sure you run the command with `root` privileges.

`icinga2 pki ticket --cn 'centos'`


The command will generate and display a key. Make sure you copy or note down this key because you will need to setup the CentOS client later.


## Configure CentOS 7 Client Node

Now, log in to your CentOS 7 system with an account with `root` privileges or directly as root and issue the following command to enable EPEL and Icinga2 repositories in CentOS. Also, make sure your CentOS 7 system is configured with a static IP address.

`yum install epel-release`

`yum install https://packages.icinga.com/epel/icinga-rpm-release-7-latest.noarch.rpm`


Next, install Igina2 engine and Nagios plugins required by Icinga2 to execute the check commands in CentOS by issuing the following command.

`yum install icinga2 nagios-plugins-all`


After Icinga2 daemon has been installed in your CentOS system, start Icinga2 node wizard and configure this system as a satellite node instead of master node, by executing the below command.

`icinga2 node wizard`


 Use the below command output excerpt to configure CentOS 7 client node:


<pre>
Welcome to the Icinga 2 Setup Wizard!

We'll guide you through all required configuration details.

<b>Please specify if this is a satellite setup ('n' installs a master setup) [Y/n]: y </b>
Starting the Node setup routine...
Please specifiy the common name (CN) [centos]: <b>Press Enter</b>
Please specify the master endpoint(s) this node should connect to:
Master Common Name (CN from your master setup): <b>icinga</b>
</>Do you want to establish a connection to the master from this node? [Y/n]: y </b>
Please fill out the master connection information:
Master endpoint host (Your master's IP address or FQDN): <b>10.25.32.120 </b>
Master endpoint port [5665]: <b>Press Enter </b>
Add more master endpoints? [y/N]:<b> n </b>
Please specify the master connection for CSR auto-signing (defaults to master endpoint host): <b>press Enter </b>
Host [10.25.32.120]: <b>press Enter</b>
Port [5665]: <b>press Enter</b>
information/base: Writing private key to '/etc/icinga2/pki/centos.key'.
information/base: Writing X509 certificate to '/etc/icinga2/pki/centos.crt'.
information/cli: Fetching public certificate from master (10.25.32.120, 5665):

Certificate information:

 Subject:     CN = icinga
 Issuer:      CN = Icinga CA
 Valid From:  Aug 21 21:54:45 2016 GMT
 Valid Until: Aug 24 21:54:45 2031 GMT
 Fingerprint: 4C 6D 49 09 C0 A5 66 3C 77 12 3C 58 AF 78 08 DC 11 53 A8 68

Is this information correct? [y/N]: <b>y</b>
information/cli: Received trusted master certificate.

Please specify the request ticket generated on your Icinga 2 master.
 (Hint: # icinga2 pki ticket --cn 'centos'): <b>a34c7fcbc4f5311257d2a5d4e7f1961dc3c64cb5 </b> (Enter the ticket key generated on the master node)
information/cli: Requesting certificate with ticket 'a34c7fcbc4f5311257d2a5d4e7f1961dc3c64cb5'.

information/cli: Created backup file '/etc/icinga2/pki/centos.crt.orig'.
information/cli: Writing signed certificate to file '/etc/icinga2/pki/centos.crt'.
information/cli: Writing CA certificate to file '/etc/icinga2/pki/ca.crt'.
Please specify the API bind host/port (optional): <b>press Enter</b>
Bind Host []: <b>press Enter</b>
Bind Port []: <b>press Enter</b>
Accept config from master? [y/N]: <b> y </b>
Accept commands from master? [y/N]: <b>y </b>
information/cli: Disabling the Notification feature.
Disabling feature notification. Make sure to restart Icinga 2 for these changes to take effect.
information/cli: Enabling the Apilistener feature.
Enabling feature api. Make sure to restart Icinga 2 for these changes to take effect.
information/cli: Created backup file '/etc/icinga2/features-available/api.conf.orig'.
information/cli: Generating local zones.conf.
information/cli: Dumping config items to file '/etc/icinga2/zones.conf'.
information/cli: Created backup file '/etc/icinga2/zones.conf.orig'.
information/cli: Updating constants.conf.
information/cli: Created backup file '/etc/icinga2/constants.conf.orig'.
information/cli: Updating constants file '/etc/icinga2/constants.conf'.
information/cli: Updating constants file '/etc/icinga2/constants.conf'.
Done.

Now restart your Icinga 2 daemon to finish the installation!
</pre>


After the client node wizard completes, restart Icinga2 service, check Icinga2 service status, run `ss` command to list Icinga’s listening port and add the Icinga2 listening port number to CentOS firewall application, by issuing the below commands.

`systemctl restart icinga2`

`systemctl status icinga2`

`ss –tlpn|grep icinga2`

`firewall-cmd --add-port=5665/tcp --permanent`

`firewall-cmd --reload`

This last step completes the configuration on CentOS 7 Client node.


## Setup Icinga2 Master Agent-based Monitoring
Now, go back to Icinga2 master node server console and create CentOS client zone directory and client configuration and services files by issuing the below commands.

`mkdir /etc/icinga2/zones.d/centos/`

`touch /etc/icinga2/zones.d/centos/centos.conf`

`touch /etc/icinga2/zones.d/centos/services.conf`

Next, open `centos.conf` zone configuration file for editing and add the following lines:

~~~ conf
object Zone "centos" {
  endpoints = [ "centos" ]
  parent = "icinga"
}

object Endpoint "centos" {
  host = "192.168.1.100"
}

object Host "centos" {
  import "generic-host"
  address = "192.168.1.100"
  vars.os = "Linux"
  vars.notification["mail"] = {
    groups = [ "icingaadmins" ]
  }
  vars.client_endpoint = name
}
~~~

The centos endpoint object zone will report back to its master node defined by `parent = “icinga”` statement.  Replace the CentOS hostname and IP address accordingly.



Now, open CentOS zone services configuration file and update the file as shown in the below excerpt:

`vi /etc/icinga2/zones.d/centos/services.conf`


`services.conf` file excerpt:

~~~ conf
apply Service "users" {
  import "generic-service"
  check_command = "users"
  command_endpoint = host.vars.client_endpoint
  assign where host.vars.client_endpoint
}

apply Service "procs" {
  import "generic-service"
  check_command = "procs"
  command_endpoint = host.vars.client_endpoint
  assign where host.vars.client_endpoint
}
~~~

 In this configuration file we’ve defined the following services checks for the remote client:  verify number of logged-in users to the system and the number of processes running in the system. The `command_endpoint` lines forces the service checks to be transmitted to the remote CentOS system and executed by Icinga2 engine command endpoint. You can add as many commands as you’d like here to be executed internally on the remote host. However, if Icinga sent instructions are not present on the remote node as Nagios plugin scripts, the commands won’t execute and an error should be displayed in icinga2 web interface.

<<<<<<< Updated upstream
Finally, to apply all the configurations made so far, restart icinga2 service and navigate to Icinga Web 2 interface to verify if the command checks are running on the remote node host. If the configuration is correctly configured you should see a list of internal parameters displayed for your remote client endpoint node.
=======
    * Verify number of users logged in to the system and the number of processes running.
    * The `command_endpoint` lines force the service checks to be transmitted to the remote CentOS system and executed by the Icinga2 engine command endpoint.
    * You can add as many commands as you’d like here to be executed internally on the remote host. However, if Icinga sent instructions are not present on the remote node as Nagios plugin scripts, the commands won’t execute and an error will be displayed in the icinga2 web interface.
>>>>>>> Stashed changes

![description](images/25.PNG)

 DEAR COPY EDITOR-- CONSIDER REMOVING THIS COMMENTED SECTION.

-->

That’s all! You have successfully configured Icinga2 as a master node and added a CentOS 7 machine client node to be remotely checked via Icinga2 agent-based monitoring system and another remote host to be actively monitored via external services command checks.
For further complex configurations regarding Icinga2 installation and setup and monitoring mechanisms, please visit Icinga2 documentation at the following internet address: https://www.icinga.com/docs/icinga2/latest/doc/01-about/

