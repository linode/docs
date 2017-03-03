---
author:
  name: 
  email: 
description: ''
keywords: ''
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, January 21, 2015
modified_by:
  name: Linode
published: ''
title: How to install OpenConnect Server on Ubuntu
---

**ocserv** (OpenConnect server, [http://www.infradead.org/ocserv/index.html](http://www.infradead.org/ocserv/index.html)) is a VPN server compatible with the OpenConnect VPN client. It is believed to be compatible with the protocol used by CISCO's AnyConnect SSL VPN. 

Here we install **oserv 0.8.8** on **Ubuntu 14.04** step by step.
## Preparation
Before start, always remember to keep the system updated.

	$ apt-get update
	$ apt-get upgrade -y

Make local source directory.

	$ mkdir -p /opt/src

Pull source tarball from remote server.

	$ cd /opt/src
	$ wget ftp://ftp.infradead.org/pub/ocserv/ocserv-0.8.8.tar.xz

Decompress the tarball.

	$ tar -Jxvf ocserv-0.8.8.tar.xz

Install ocserv required dependencies.

	$ apt-get install build-essential \
	pkg-config \
	libgnutls28-dev \
	gnutls-bin \
	libwrap0-dev \
	libpam0g-dev \
	libseccomp-dev \
	libreadline-dev \
	libnl-route-3-dev \
	libprotobuf-c0-dev \
	libhttp-parser-dev \
	libpcl1-dev \
	libopts25-dev \
	autogen

Make ocserv config file directory

	$ mkdir -p /etc/ocserv

## Installation

Next step, build ocserv from source code.

	$ cd /opt/src/ocserv-0.8.8
	$ ./configure --sysconfdir=/etc/ocserv
	$ make && make install

After success, **ocserv** could be found at ** /usr/local/sbin/ocserv**.

## Configuration

### Generate CA certificate

First create a directory for CA.

	$ mkdir -p /etc/ocserv/CA

Then, Create a CA template file.

	$ cd /etc/ocserv/CA
	$ vim ca.tmpl

Input the following content:

	cn = "VPN CA"
	organization = "CA ORGANIZATION"
	serial = 1
	expiration_days = 3650
	ca
	signing_key
	cert_signing_key
	crl_signing_key

Save and exit editor. Then generate CA.

	$ certtool --generate-privkey --outfile ca-key.pem
	$ certtool --generate-self-signed \
	--load-privkey ca-key.pem \
	--template ca.tmpl --outfile ca-cert.pem

### Generate local server certificate

Create server certificate template file.

	$ vim  server.tmpl

Input the following content:

	cn = "www.example.com"
	organization = "MyCompany"
	serial = 2
	expiration_days = 3650
	encryption_key
	signing_key
	tls_www_server

Save and exit editor. Then generate server certificate.

	$ certtool --generate-privkey --outfile server-key.pem
	$ certtool --generate-certificate \
	--load-privkey server-key.pem \
	--load-ca-certificate ca-cert.pem \
	--load-ca-privkey ca-key.pem \
	--template server.tmpl \
	--outfile server-cert.pem

link the server certificate and the private key. 

	$ ln -s /etc/ocserv/CA/server-cert.pem /etc/ssl/certs/ocserv-cert.pem
	$ ln -s /etc/ocserv/CA/server-key.pem  /etc/ssl/private/ocserv-key.pem

### Configure .conf file

	$ cp /opt/src/ocserv-0.8.8/doc/sample.config /etc/ocserv/ocserv.conf

Edit ocserv.conf, change following lines content.

	auth = "plain[/etc/ocserv/ocserv.passwd]"
	listen-host = 0.0.0.0
	server-cert = /etc/ssl/certs/ocserv-cert.pem
	server-key = /etc/ssl/private/ocserv-key.pem
	run-as-group = nobody
	ipv4-network = 10.10.110.0
	ipv4-netmask = 255.255.255.0
	dns = 8.8.8.8
	dns = 8.8.4.4

Must remember to **comment out** the route

	# route = 192.168.1.0/255.255.255.0
	# route = 192.168.5.0/255.255.255.0

### Create password file

	$ ocpasswd -c /etc/ocserv/ocserv.passwd USERNAME

Type the password twice.

### Forward

Edit /etc/sysctl.conf, change the line like the following:

	 net.ipv4.ip_forward=1

Then

	$ sysctl -p

## Run

Execute the command to running ocserv.

	$ ocserv -c /etc/ocserv/ocserv.conf

If we need some debug infomation, just run like this.

	$ ocserv -c /etc/ocserv/ocserv.conf -f -d 1

 
