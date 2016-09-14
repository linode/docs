---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Tomcat9 brings bunch of new features like support for HTTP/2 and multiple certificates per Virtual Host via SNI extension.'
keywords: 'tomcat9,ecdsa,ecc,sni,'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Wednesday, September 14th, 2016'
modified: Wednesday, Month 14th, 2016
modified_by:
  name: Linode
title: 'Tomcat9, ECDSA/ECC (Elliptic Curve) Certificates and HTTP/2'
contributor:
  name: Igor Cicimov
  link: https://github.com/icicimov/
  external_resources:
- '[Tomcat9 documentation](https://tomcat.apache.org/tomcat-9.0-doc/index.html)'
- '[Tomcat Youtube channel](https://www.youtube.com/channel/UCpqpJ0-G1lYfUBQ6_36Au_g)'
- '[Tomcat HTTP/2 demo app](https://github.com/jfclere/h2_demos)'
- '[HTTP/2 implementation tracking](https://github.com/http2/http2-spec/wiki/Implementations)'
- '[H2C simple HTTP/2 command line test tool](https://github.com/fstab/h2c)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

## Introduction

Tomcat9 brings bunch of new features of which support for HTTP/2 and multiple certificates per Virtual Host via SNI extension are most important ones. This needs Java 1.8, the latest APR/TC (Tomcat Native) release 1.2.x, since SNI support in current Java 1.8 is useless, which in turn requires OpenSSL version 1.0.2g installed. Early users of HTTP/2, according to one of the main Tomcat developers Mark Thomas, reported improvement of up to 20% in page speed due to its benefits like multiplexing, header compression and server push (servlet 4.0 API needed). By default HTTP/2 (h2) protocol is SSL, as expected the whole internet to be over https only in near future, but there is a clear-text version as well called h2c.

The ECDSA certificates are smaller, meaning faster processing time on the server and less CPU usage which in term means less latency and more security. It's in the early day of adoption by the clients though so for some time we will need to support both certificate types, ECDSA and RSA.

Nice things to have so I setup a test Tomcat9 server on Ubunut 14.04.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide assumes you have a fully functional Ubuntu 14.04 sytem. It's agood idea to update your system before you start.

        sudo apt-get update && sudo apt-get upgrade

3.  The guide uses aptitude to install the needed packages but you can use apt-get as well instead. If you don't have aptitude installed you can do so now.

		sudo apt-get install -y aptitude

4.  Please note the versions of the software installed were the current versions in the time of writing the article.

{:.note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Setup

We start by installing and setup of the prerequisites mentioned in the Introduction.

### OpenSSL

Standard compile procedure, we start by installing some needed packages:

	igorc@sl01:/opt$ sudo aptitude install zlib1g-dev zlibc libcrypto++-dev

and then downloading and extracting the source:

	igorc@sl01:/opt$ sudo wget http://www.openssl.org/source/openssl-1.0.2g.tar.gz
	igorc@sl01:/opt$ sudo tar -xzf openssl-1.0.2g.tar.gz
	igorc@sl01:/opt$ sudo chown -R igorc\: openssl-1.0.2g

Next we change to the source directory and create the openssl.ld file:

	igorc@sl01:/opt$ cd openssl-1.0.2g/
	igorc@sl01:~/openssl-1.0.2g$ vi openssl.ld
	OPENSSL_1.0.0 {
		global:
		*;
	};

and finally compile and install the software:

	igorc@sl01:/opt/openssl-1.0.2g$ ./config --prefix=/opt/openssl zlib-dynamic shared -Wl,--version-script=/home/igorc/openssl-1.0.2g/openssl.ld -Wl,-Bsymbolic-functions
	igorc@sl01:/opt/openssl-1.0.2g$ make depend
	igorc@sl01:/opt/openssl-1.0.2g$ make all
	igorc@sl01:/opt/openssl-1.0.2g$ sudo make install

This will set OpenSSL 1.0.2g under /opt/openssl directory:

	igorc@sl01:/opt/openssl-1.0.2g$ ls -l /opt/openssl
	total 16
	drwxr-xr-x 2 root root 4096 Apr  2 19:18 bin
	drwxr-xr-x 3 root root 4096 Apr  2 19:18 include
	drwxr-xr-x 4 root root 4096 Apr  2 19:18 lib
	drwxr-xr-x 6 root root 4096 Apr  2 19:18 ssl

### Java8

One liner installation:

	igorc@sl01:/opt$ sudo echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections && echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | sudo tee -a /etc/apt/sources.list && echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" | sudo tee -a /etc/apt/sources.list && sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EEA14886 && sudo aptitude update && sudo aptitude install -y oracle-java8-installer && sudo aptitude install -y oracle-java8-set-default

This will add the needed Ubuntu ppa, install the latest Oracle 1.8 JDK and set it as default Java environment.

### Tomcat9

#### Installation

Get and unpack the latest Tomcat9 release, alfa version v9.0.0.M4 at the moment of this writing, and setup tomcat user:

	igorc@sl01:/opt$ sudo groupadd -r -g 501 tomcat9
	igorc@sl01:/opt$ sudo useradd -r -c "Tomcat9 user" -s /bin/false -M -d /usr/share/tomcat9 -g 501 -u 501 -G www-data tomcat9
	igorc@sl01:/opt$ sudo wget http://apache.uberglobalmirror.com/tomcat/tomcat-9/v9.0.0.M4/bin/apache-tomcat-9.0.0.M4.tar.gz
	igorc@sl01:/opt$ sudo tar -xzf apache-tomcat-9.0.0.M4.tar.gz
	igorc@sl01:/opt$ sudo mv apache-tomcat-9.0.0.M4 /usr/share/tomcat9
	igorc@sl01:/opt$ sudo ln -sf /usr/share/tomcat9/logs /var/log/tomcat9
	igorc@sl01:/opt$ sudo ln -sf /usr/share/tomcat9/work /var/cache/tomcat9
	igorc@sl01:/opt$ sudo ln -sf /usr/share/tomcat9/conf /etc/tomcat9

#### TC-Native

We install the needed packages first:

	igorc@sl01:/opt$ sudo aptitude install libapr1-dev libssl-dev

and then we download and etract the tcnative source, xtract and build it against oopenssl-1.0.2g we installed previously:

	igorc@sl01:/opt$ sudo wget http://apache.mirror.digitalpacific.com.au/tomcat/tomcat-connectors/native/1.2.5/source/tomcat-native-1.2.5-src.tar.gz
	igorc@sl01:/opt$ sudo tar -xzf tomcat-native-1.2.5-src.tar.gz
	igorc@sl01:/opt$ cd tomcat-native-1.2.5-src/native
	igorc@sl01:/opt/tomcat-native-1.2.5-src/native$ ./configure --prefix=/usr --libdir=/usr/lib --with-apr=/usr/bin/apr-1-config --with-java-home=/usr/lib/jvm/java-8-oracle --with-ssl=/opt/openssl
	igorc@sl01:/opt/tomcat-native-1.2.5-src/native$ make
	igorc@sl01:/opt/tomcat-native-1.2.5-src/native$ sudo make install

We check that tcnative is properly linked to the right openssl version (in case you have more than one installed):

	igorc@sl01:/opt/tomcat-native-1.2.5-src/native$ ldd /usr/lib/libtcnative-1.so.0.2.5
	linux-vdso.so.1 =>  (0x00007ffcd2ba5000)
	libssl.so.1.0.0 => /opt/openssl/lib/libssl.so.1.0.0 (0x00007f67d06a1000)
	libcrypto.so.1.0.0 => /opt/openssl/lib/libcrypto.so.1.0.0 (0x00007f67d0251000)
	libapr-1.so.0 => /usr/lib/x86_64-linux-gnu/libapr-1.so.0 (0x00007f67d0020000)
	libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007f67cfe02000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f67cfa3d000)
	libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007f67cf839000)
	libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007f67cf620000)
	libuuid.so.1 => /lib/x86_64-linux-gnu/libuuid.so.1 (0x00007f67cf41b000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f67d0b3e000)

#### Config and SSL setup

I wanted to test the ECDSA certificate type and multi-certificate support in tomcat9. First create ECC cert and install it so tomcat can find it:

	$ openssl req -new -x509 -nodes -newkey ec:<(openssl ecparam -name secp384r1) -keyout cert_ecdsa.key -out cert_ecdsa.crt -days 7200 -subj '/C=AU/ST=New South Wales/L=Sydney/O=My Corporation Ltd./OU=DevOps/CN=tomcat9.mydomain.com
	$ sudo mkdir /etc/etc/ssl
	$ sudo cp cert_ecdsa.key cert_ecdsa.crt /etc/tomcat9/ssl/

Then created a standard RSA one too:

	$ openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
	$ openssl rsa -passin pass:x -in server.pass.key -out server.key
	$ rm server.pass.key
	$ openssl req -new -key server.key -out server.csr -subj '/C=AU/ST=New South Wales/L=Sydney/O=My Corporation Ltd./OU=DevOps/CN=tomcat9.mydomain.com'
	$ openssl x509 -req -days 7200 -in server.csr -signkey server.key -out server.crt
	Signature ok
	subject=/C=AU/ST=New South Wales/L=Sydney/O=My Corporation Ltd./OU=DevOps/CN=tomcat9.mydomain.com
	Getting Private key
	$ sudo cp server.key server.crt /etc/tomcat9/ssl/

Now we can configure Tomcat9's SSL/TLS connector with HTTP/2 support. Replace the default <Connector> section in the tomcat's server.xml file, in our case /etc/tomcat9/server.xml, with the one below:

    <Connector port="8443" protocol="org.apache.coyote.http11.Http11AprProtocol"
               maxThreads="150" SSLEnabled="true" scheme="https" secure="true" >
        <UpgradeProtocol className="org.apache.coyote.http2.Http2Protocol" />
        <SSLHostConfig honorCipherOrder="true" disableCompression="true" protocols="all"
                       ciphers="EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384
                       EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4
                       EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4" >
            <Certificate certificateKeyFile="conf/ssl/cert_ecdsa.key"
                         certificateFile="conf/ssl/cert_ecdsa.crt"
                         type="EC" />
            <Certificate certificateKeyFile="conf/ssl/server.key"
                         certificateFile="conf/ssl/server.crt"
                         type="RSA" />
        </SSLHostConfig>
    </Connector>

Now we can start the server:

	igorc@sl01:/opt$ sudo /usr/share/tomcat9/bin/startup.sh
	Using CATALINA_BASE:   /usr/share/tomcat9
	Using CATALINA_HOME:   /usr/share/tomcat9
	Using CATALINA_TMPDIR: /usr/share/tomcat9/temp
	Using JRE_HOME:        /usr
	Using CLASSPATH:       /usr/share/tomcat9/bin/bootstrap.jar:/usr/share/tomcat9/bin/tomcat-juli.jar
	Tomcat started.

and check for the features we need in the log file:

	igorc@sl01:/opt$ sudo grep -E "AprLifecycleListener|h2" /var/log/tomcat9/catalina.out
	02-Apr-2016 20:29:05.875 INFO [main] org.apache.catalina.core.AprLifecycleListener.lifecycleEvent Loaded APR based Apache Tomcat Native library 1.2.5 using APR version 1.5.1.
	02-Apr-2016 20:29:05.875 INFO [main] org.apache.catalina.core.AprLifecycleListener.lifecycleEvent APR capabilities: IPv6 [true], sendfile [true], accept filters [false], random [true].
	02-Apr-2016 20:29:05.881 INFO [main] org.apache.catalina.core.AprLifecycleListener.initializeSSL OpenSSL successfully initialized (OpenSSL 1.0.2g  1 Mar 2016)
	02-Apr-2016 20:29:05.883 INFO [main] org.apache.coyote.http11.AbstractHttp11Protocol.configureUpgradeProtocol The ["https-apr-8443"] connector has been configured to support negotiation to [h2] via ALPN

We can see the APR connector, the correct OpenSSL version and the h2 protocol available via ALPN (Application-Layer Protocol Negotiation).

## Testing

### CuRL

To test the server I used the trusted curl. It came up it was little bit painful to set it up due to lot of prerequisites but since I've done it I might show it here as well. There are some other HTTP/2 testing tools available that you can use in case you have domain name registered with proper DNS resolution setup.

First the SPDY (Google extension which is now becoming obsolete with http2) support:

	igorc@sl01:~$ git clone https://github.com/tatsuhiro-t/spdylay.git
	igorc@sl01:~$ cd spdylay/
	igorc@sl01:~$ autoreconf -i
	igorc@sl01:~$ automake
	igorc@sl01:~$ autoconf
	igorc@sl01:~$ ./configure
	igorc@sl01:~$ make -I/opt/openssl/include/
	igorc@sl01:~$ sudo make install
	igorc@sl01:~$ locate libspdylay.so.7
	/opt/spdylay/lib/.libs/libspdylay.so.7
	/opt/spdylay/lib/.libs/libspdylay.so.7.2.0
	/usr/local/lib/libspdylay.so.7
	/usr/local/lib/libspdylay.so.7.2.0
	igorc@sl01:~$ sudo ln -s /usr/local/lib/libspdylay.so.7 /lib/x86_64-linux-gnu/libspdylay.so.7
	igorc@sl01:~$ sudo ln -s /usr/local/lib/libspdylay.so.7.2.0 /lib/x86_64-linux-gnu/libspdylay.so.7.2.0
	igorc@sl01:~$ sudo ldconfig

Next is nghhtp2:

	igorc@sl01:~$ git clone https://github.com/nghttp2/nghttp2.git
	igorc@sl01:~$ cd nghttp2
	igorc@sl01:~$ autoreconf -i
	igorc@sl01:~$ automake
	igorc@sl01:~$ autoconf
	igorc@sl01:~$ OPENSSL_CFLAGS="-I/opt/openssl/include" OPENSSL_LIBS="-L/opt/openssl/lib -lssl -lcrypto -ldl" ./configure PYTHON=/usr/bin/python3
	igorc@sl01:~$ make
	igorc@sl01:~$ sudo make install
	igorc@sl01:~$ sudo updatedb
	igorc@sl01:~$ locate libnghttp2.so.14
	/opt/nghttp2/lib/.libs/libnghttp2.so.14
	/opt/nghttp2/lib/.libs/libnghttp2.so.14.6.0
	/opt/nghttp2-1.9.1/lib/.libs/libnghttp2.so.14
	/opt/nghttp2-1.9.1/lib/.libs/libnghttp2.so.14.6.0
	/usr/local/lib/libnghttp2.so.14
	/usr/local/lib/libnghttp2.so.14.6.0
	igorc@sl01:~$ sudo ln -s /usr/local/lib/libnghttp2.so.14 /lib/x86_64-linux-gnu/libnghttp2.so.14
	igorc@sl01:~$ sudo ln -s /usr/local/lib/libnghttp2.so.14.0.2 /lib/x86_64-linux-gnu/libnghttp2.so.14.0.2
	igorc@sl01:~$ sudo ldconfig

Finally checking the versions installed:

	igorc@sl01:~$ nghttp --version
	nghttp nghttp2/1.10.0-DEV
	igorc@sl01:~$ nghttpx --version
	nghttpx nghttp2/1.10.0-DEV
	igorc@sl01:~$ nghttpd --version
	nghttpd nghttp2/1.10.0-DEV
	igorc@sl01:~$ h2load --version
	h2load nghttp2/1.10.0-DEV

We can use this tool as SSL proxy if needed (nothing to do with the test, just mentioning):

	$ sudo nghttpx \
		--frontend=*,443 \
		--backend=localhost,8080 \
		--private-key-file=/path/to/key.key \
		--certificate-file=/path/to/cert.crt

Or turn it into service:

	$ sudo cp ~/nghttp2/contrib/nghttpx-init /etc/init.d/nghttpx
	$ sudo service nghttpx restart

And finally CuRL:

	igorc@sl01:~$ wget https://curl.haxx.se/download/curl-7.48.0.tar.gz
	igorc@sl01:~$ tar -xzf curl-7.48.0.tar.gz
	igorc@sl01:~$ cd curl-7.48.0/
	igorc@sl01:~$ PKG_CONFIG_LIBDIR=/opt/openssl/lib/pkgconfig/ ./configure --with-ssl=/opt/openssl --with-nghttp2=/usr/local
	igorc@sl01:~$ make && sudo make install

Now we set the correct binary and library paths so curl can find them:

	igorc@sl01:~$ export PATH=/opt/openssl/bin:/usr/local/bin:igorc@sl01:~$PATH
	igorc@sl01:~$ export LD_LIBRARY_PATH=/opt/openssl/lib:igorc@sl01:~$LD_LIBRARY_PATH

Check the openssl and curl binaries and their features:

	igorc@sl01:~$ openssl version
	OpenSSL 1.0.2g  1 Mar 2016

	igorc@sl01:~$ curl --version
	curl 7.48.0 (x86_64-pc-linux-gnu) libcurl/7.48.0 OpenSSL/1.0.2g zlib/1.2.8 nghttp2/1.10.0-DEV
	Protocols: dict file ftp ftps gopher http https imap imaps pop3 pop3s rtsp smb smbs smtp smtps telnet tftp
	Features: IPv6 Largefile NTLM NTLM_WB SSL libz TLS-SRP HTTP2 UnixSockets

From the above output we can confirm that curl has http2 support.

With all this done we can run the test. I tested for both when we have only ECDSA/ECC certificateconfigured in Tomcat, since I wanted to see this cert in action:

	igorc@sl01:~$ curl --http2 -v -k -s -S -I https://localhost:8443/ -o /dev/null
	*   Trying 127.0.0.1...
	* Connected to localhost (127.0.0.1) port 8443 (#0)
	* ALPN, offering h2
	* ALPN, offering http/1.1
	* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
	* successfully set certificate verify locations:
	*   CAfile: /etc/ssl/certs/ca-certificates.crt
	  CApath: none
	* TLSv1.2 (OUT), TLS header, Certificate Status (22):
	} [5 bytes data]
	* TLSv1.2 (OUT), TLS handshake, Client hello (1):
	} [512 bytes data]
	* TLSv1.2 (IN), TLS handshake, Server hello (2):
	{ [75 bytes data]
	* TLSv1.2 (IN), TLS handshake, Certificate (11):
	{ [710 bytes data]
	* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
	{ [181 bytes data]
	* TLSv1.2 (IN), TLS handshake, Server finished (14):
	{ [4 bytes data]
	* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
	} [70 bytes data]
	* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
	} [1 bytes data]
	* TLSv1.2 (OUT), TLS handshake, Finished (20):
	} [16 bytes data]
	* TLSv1.2 (IN), TLS change cipher, Client hello (1):
	{ [1 bytes data]
	* TLSv1.2 (IN), TLS handshake, Finished (20):
	{ [16 bytes data]
	* SSL connection using TLSv1.2 / ECDHE-ECDSA-AES256-GCM-SHA384
	* ALPN, server accepted to use h2
	* Server certificate:
	*  subject: C=AU; ST=New South Wales; L=Sydney; O=My Corporation Ltd.; OU=DevOps; CN=tomcat9.mydomain.com
	*  start date: Apr  4 02:41:03 2016 GMT
	*  expire date: Dec 21 02:41:03 2035 GMT
	*  issuer: C=AU; ST=New South Wales; L=Sydney; O=My Corporation Ltd.; OU=DevOps; CN=tomcat9.mydomain.com
	*  SSL certificate verify result: self signed certificate (18), continuing anyway.
	* Using HTTP2, server supports multi-use
	* Connection state changed (HTTP/2 confirmed)
	* TCP_NODELAY set
	* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
	} [5 bytes data]
	* Using Stream ID: 1 (easy handle 0x22dc050)
	} [5 bytes data]
	> HEAD / HTTP/1.1
	> Host: localhost:8443
	> User-Agent: curl/7.48.0
	> Accept: */*
	>
	{ [5 bytes data]
	* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
	} [5 bytes data]
	< HTTP/2.0 200
	< content-type:text/html;charset=UTF-8
	< date:Mon, 04 Apr 2016 02:45:38 GMT
	<
	* Connection #0 to host localhost left intact
	igorc@sl01:~$

and when both cert types are configured as per our example above:

	igorc@sl01:~$ curl --http2 -v -k -s -S -I https://localhost:8443/ -o /dev/null
	*   Trying 127.0.0.1...
	* Connected to localhost (127.0.0.1) port 8443 (#0)
	* ALPN, offering h2
	* ALPN, offering http/1.1
	* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
	* successfully set certificate verify locations:
	*   CAfile: /etc/ssl/certs/ca-certificates.crt
	  CApath: none
	* TLSv1.2 (OUT), TLS header, Certificate Status (22):
	} [5 bytes data]
	* TLSv1.2 (OUT), TLS handshake, Client hello (1):
	} [512 bytes data]
	* TLSv1.2 (IN), TLS handshake, Server hello (2):
	{ [75 bytes data]
	* TLSv1.2 (IN), TLS handshake, Certificate (11):
	{ [958 bytes data]
	* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
	{ [333 bytes data]
	* TLSv1.2 (IN), TLS handshake, Server finished (14):
	{ [4 bytes data]
	* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
	} [70 bytes data]
	* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
	} [1 bytes data]
	* TLSv1.2 (OUT), TLS handshake, Finished (20):
	} [16 bytes data]
	* TLSv1.2 (IN), TLS change cipher, Client hello (1):
	{ [1 bytes data]
	* TLSv1.2 (IN), TLS handshake, Finished (20):
	{ [16 bytes data]
	* SSL connection using TLSv1.2 / ECDHE-RSA-AES256-GCM-SHA384
	* ALPN, server accepted to use h2
	* Server certificate:
	*  subject: C=AU; ST=New South Wales; L=Sydney; O=My Corporation Ltd.; OU=DevOps; CN=tomcat9.mydomain.com
	*  start date: Apr  4 02:07:04 2016 GMT
	*  expire date: Dec 21 02:07:04 2035 GMT
	*  issuer: C=AU; ST=New South Wales; L=Sydney; O=My Corporation Ltd.; OU=DevOps; CN=tomcat9.mydomain.com
	*  SSL certificate verify result: self signed certificate (18), continuing anyway.
	* Using HTTP2, server supports multi-use
	* Connection state changed (HTTP/2 confirmed)
	* TCP_NODELAY set
	* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
	} [5 bytes data]
	* Using Stream ID: 1 (easy handle 0x1387050)
	} [5 bytes data]
	> HEAD / HTTP/1.1
	> Host: localhost:8443
	> User-Agent: curl/7.48.0
	> Accept: */*
	>
	{ [5 bytes data]
	* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
	} [5 bytes data]
	< HTTP/2.0 200
	< content-type:text/html;charset=UTF-8
	< date:Mon, 04 Apr 2016 02:21:07 GMT
	<
	* Connection #0 to host localhost left intact
	igorc@sl01:~$

in which case the server sends the RSA type (notice the different start and expire dates). In both cases we can see HTTP/2 connection being established.

