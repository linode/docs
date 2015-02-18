iInstall Webmin on CentOS using the tar.gz file

Introduction

Webmin is a system that allows the management of the main servers (Unix platform) as; Apache, DNS, Squid, DHCP, file sharing, MySQL database among many others.
One of the biggest vantanges is the administration via the browser (Internet Browser) that can be done locally or remotely on any computer connected to the Internet, and you do not need to edit the configuration files manually.



Necessary requirements:

- Http server installed and perl5

 [Texto link] (http://www.apache.org)
 [Texto link] (http://www.perl.com)


Before you start you need to install http server (apache) and the per5 on CentOS.

To install http server run the following command in the shell;


yum install httpd -y


Soon after install Perl

yum install perl perl5 -y


Go to the / tmp directory and download the tar.gz file

[root@yourhost /]# cd /tmp

[root@yourhost /tmp]# wget http://prdownloads.sourceforge.net/webadmin/webmin-1.730.tar.gz


Once finished downloading access the / tmp directory, where the webmin-1.730.tar.gz file and shell run the following commands;


[root@yourhost /tmp]# gunzip webmin-1.730.tar.gz
[root@yourhost /tmp]# tar xf webmin-1.730.tar
[root@yourhost /tmp]# cd webmin-1.730
[root@yourhost /tmp/webmin-1.730]# ./setup.sh /usr/local/webmin


When the script.sh file is run, it will ask a few questions:


- The configuration directory webmin
(can be chosen a different directory for the settings are saved when you upgrade, if you are using the same config directory this will be the only question)

- The log directory Webmin
(Location to store the webserver log files)

- Perl installation Directory
(it is usually, /usr/bin/perl ou /usr/local/bin/perl)

– Operating system type
(The script will show a list of suporteados systems, if your choice is not listed the closest, but may not work correctly)

- Web server operating Door
(default port: 10000)

- User and Password
(User and password used to access the Webmin server)

- Web server name
(name of the host on which Webmin is installed)

- SSL
(So you are asked if you have installed on your system SSL Perl libraries)

- Start Webmin in your boot
(If supported by the operating system Webmin will prompt you to start it with the startup of the machine)

After installed can be easily accessed by any computer, simply type in the browser http: // localhost: 10000 / or change localhost with the server's IP.


Do not forget to release the port on the firewall.


To view the demonstration of Webmin visit:

http://webmin-demo.virtualmin.com/
http://virtualmin-demo.virtualmin.com/

Login: demo
Pass: demo
