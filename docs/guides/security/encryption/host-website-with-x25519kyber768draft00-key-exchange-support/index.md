---
slug: host-website-with-x25519kyber768draft00-key-exchange-support
title: "Host Website With X25519kyber768draft00 Key Exchange Support"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-09-16
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

DRAFT DEBIAN 11 Set up a Web Server and Host a Website on Linode that supports the X25519Kyber768Draft00 Key Exchange in TLS 1.3 (Post-quantum cryptography)

NIST recently [released](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards) the first finalized Post-Quantum Encryption Standards to withstand the attacks of a quantum computer. This includes the Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM, defined in [FIPS-203](https://csrc.nist.gov/pubs/fips/203/final), which has already been implemented in the industry using an early [pre-standardization draft](https://datatracker.ietf.org/doc/draft-tls-westerbaan-xyber768d00/) for use with TLS. Deploying this algorithm for use by your web server currently still requires a few additional steps, and may differ depending on which version of OpenSSL the OS comes with. In this document, we show you how to build OpenSSL 3.x and the Open Quantum Safe provider on a Debian 11 system; for instructions on an Ubuntu 24.04 LTS system, please see [this document](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558967). Stay tuned for other post-quantum cryptography updates in the near future!

Before You Begin, make sure that you are familiar with:
-   [Guides - Create a Compute Instance](https://www.linode.com/docs/products/compute/compute-instances/guides/create/)
-   [Guides - Setting Up and Securing a Compute Instance](https://www.linode.com/docs/products/compute/compute-instances/guides/set-up-and-secure/?tabs=macos%2Cmost-distributions%2Cubuntu-debian-kali-linux)
-   [Understanding TLS Certificates and Connections](https://www.linode.com/docs/guides/what-is-a-tls-certificate/)

# Step-by-step guide

-   [Create a new Linode](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-CreateanewLinode)
-   [Install the necessary components ](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Installthenecessarycomponents)
    -   [Install dependencies and system packages needed for further installation](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Installdependenciesandsystempackagesneededforfurtherinstallation)
    -   [Install OpenSSL from sources](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-InstallOpenSSLfromsources)
        -   [Fetch OpenSSL sources](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-FetchOpenSSLsources)
        -   [Verify the code signature](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Verifythecodesignature)
        -   [Build a OpenSSL](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-BuildaOpenSSLtalk-287041talk-287058)
    -   [Install the oqs-provider](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Installtheoqs-provider)
        -   [Install dependencies and clone the repository](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Installdependenciesandclonetherepository)
        -   [Build oqs-provider](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Buildoqs-providertalk-287030talk-287040talk-287049)
        -   [Open the config file and add the following lines at the end:](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Opentheconfigfileandaddthefollowinglinesattheend:)
        -   [Checking provider version information](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Checkingproviderversioninformation)
    -   [Install Nginx from sources](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-InstallNginxfromsources)
        -   [Fetch Nginx sources](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-FetchNginxsources)
        -   [Verify the code signature](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Verifythecodesignature.1)
        -   [Install the required dependencies](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Installtherequireddependencies)
        -   [Build nginx](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Buildnginx)
        -   [Configure Nginx](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-ConfigureNginx)
        -   [Create a configuration file for the server in the /opt/nginx/conf.d/ directory, such as pqc.conf:](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Createaconfigurationfilefortheserverinthe/opt/nginx/conf.d/directory,suchaspqc.conf:talk-287045)
        -   [Create a system service file for Nginx to automatically manage the server:](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-CreateasystemservicefileforNginxtoautomaticallymanagetheserver:talk-287048talk-287051)
        -   [Start the service](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Starttheservice)
-   [Check if the post quantum algorithms are used by nginx](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Checkifthepostquantumalgorithmsareusedbynginxtalk-287052)
-   [Related links](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558981#DRAFTDEBIAN11SetupaWebServerandHostaWebsiteonLinodethatsupportstheX25519Kyber768Draft00KeyExchangeinTLS1.3(Postquantumcryptography)-Relatedlinks)

## Create a new Linode

Begin by [creating a new Linode](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance). In this example, we are using an Ubuntu Debian 11 instance.

## Install the necessary components

### Install dependencies and system packages needed for further installation

```command
sudo apt update
```

```command
sudo apt install -y make
```

```command
sudo apt install -y gcc
```

-   **make** is a build automation tool used to compile and link programs from source code. It reads instructions from a Makefile, which defines how to compile and build the project.
-   **gcc** (GNU Compiler Collection) provides a compiler that converts source code written in languages like C, C++, and others into executable programs. It is essential for building software from source code.

### Install OpenSSL from sources

#### Fetch OpenSSL sources

The default version of OpenSSL shipped with Debian 11 is 1.1.1w. The Open Quantum Safe OpenSSL provider requires OpenSSL >= 3.x, so we will build a newer version from source. First, we'll download the sources and accompanying signature:

```command
wget https://github.com/openssl/openssl/releases/download/openssl-3.3.2/openssl-3.3.2.tar.gz

```command
wget https://github.com/openssl/openssl/releases/download/openssl-3.3.2/openssl-3.3.2.tar.gz.asc
```

#### Verify the code signature

Next, we want to verify the signature. For this, we will need to install **gnupg**, import the public OpenSSL signing key, and verify the signature:

```command
sudo apt -y install gnupg
```

```command
gpg --search-keys openssl@openssl.org
```

```output
gpg: data source: https://keys.openpgp.org:443
(1) OpenSSL <openssl@openssl.org>
      4096 bit RSA key 216094DFD0CB81EF, created: 2024-04-08
Keys 1-1 of 1 for "openssl@openssl.org".  Enter number(s), N)ext, or Q)uit > 1
gpg: key 216094DFD0CB81EF: public key "OpenSSL <openssl@openssl.org>" imported
gpg: Total number processed: 1
gpg:           	imported: 1
```

```command
gpg --fingerprint openssl@openssl.org
```

```output
pub   rsa4096 2024-04-08 [SC] [expires: 2026-04-08]
      BA54 73A2 B058 7B07 FB27  CF2D 2160 94DF D0CB 81EF
uid       	[ unknown] OpenSSL <openssl@openssl.org>
```

```command
gpg --verify openssl-3.3.2.tar.gz.asc openssl-3.3.2.tar.gz
```

```output
gpg: Signature made Tue Sep  3 08:46:51 2024 EDT
gpg:            	using RSA key BA5473A2B0587B07FB27CF2D216094DFD0CB81EF
gpg: Good signature from "OpenSSL <openssl@openssl.org>" [ultimate]
```

{{< note >}}
If you do not have a trust path to the OpenSSL key or have not explicitly trusted it, you may also see a warning message. That does not impact the validity of the signature.
{{< /note >}}

#### Build a OpenSSL

```command
tar zxf openssl-3.3.2.tar.gz
```

```command
cd openssl-3.3.2
```

```command
./Configure --prefix=/opt '-Wl,-rpath,$(LIBRPATH)'
```

```command
make
```

```command
sudo make install
```

To verify that OpenSSL has been correctly installed and is the version you intended to install:

```command
/opt/bin/openssl version
```

At this point, you probably want to add `/opt/bin` to your `PATH` environment variable in your shell startup file (e.g., `~/.bashrc` or system wide in `/etc/profile`).

### Install the oqs-provider

#### Install dependencies and clone the repository

```command
sudo apt install -y git cmake ninja-build
```

```command
git clone https://github.com/open-quantum-safe/oqs-provider.git
```

```command
cd oqs-provider
```

-   **cmake**: A cross-platform build system generator that helps automate the compilation and build process for software projects.
-   **ninja-build**: A fast and lightweight build system designed to run builds in parallel, speeding up the compilation of large projects.

#### Build oqs-provider

```command
env OPENSSL_ROOT=/opt CMAKE_PARAMS="-DOPENSSL_CRYPTO_LIBRARY=/opt/lib64/libcrypto.so" bash scripts/fullbuild.sh
```

```command
sudo cmake --install _build
```

```command
export PATH=/opt/bin:$PATH
```

```command
scripts/runtests.sh
```

#### Open the config file and add the following lines at the end:

```file {title="/opt/ssl/openssl.cnf"}
# PQC via OpenQuantumSafe
[provider_sect]
default = default_sect
oqsprovider = oqsprovider_sect

[default_sect]
activate = 1

[oqsprovider_sect]
activate = 1
```

{{< note >}}
In this case, we are editing the file /opt/ssl/openssl.cnf, not the configuration file for the system OpenSSL!
{{< /note >}}

#### Checking provider version information

```command
openssl list -providers
```

```output
Providers:
  default
    name: OpenSSL Default Provider
    version: 3.3.2
    status: active
  oqsprovider
    name: OpenSSL OQS Provider
    version: 0.6.2-dev
    status: active
```

### Install Nginx from sources

The version of Nginx built for the Debian 11 packages use OpenSSL version 1.1.1w, so wee need to build Nginx with OpenSSL 3.x ourselves.

#### Fetch Nginx sources

```command
wget https://nginx.org/download/nginx-1.26.2.tar.gz
```

```command
wget https://nginx.org/download/nginx-1.26.2.tar.gz.asc
```

#### Verify the code signature

Nginx signs its releases with an individual developer's key instead of a package signing key. If you encounter issues verifying a release, additional signing keys may be required. You can find these keys at [https://nginx.org/en/pgp_keys.html](https://nginx.org/en/pgp_keys.html).

```command
wget https://nginx.org/keys/pluknet.key
```

```command
gpg --import pluknet.key
```

```command
gpg --verify nginx-1.26.2.tar.gz.asc nginx-1.26.2.tar.gz
```

```output
gpg: Signature made Tue Aug 13 08:48:05 2024 EDT
gpg:            	using RSA key D6786CE303D9A9022998DC6CC8464D549AF75C0A
gpg:            	issuer "s.kandaurov@f5.com"
gpg: Good signature from "Sergey Kandaurov <s.kandaurov@f5.com>" [unknown]
gpg:             	aka "Sergey Kandaurov <pluknet@nginx.com>" [unknown]
gpg: WARNING: The key's User ID is not certified with a trusted signature!
gpg:      	There is no indication that the signature belongs to the owner.
Primary key fingerprint: D678 6CE3 03D9 A902 2998  DC6C C846 4D54 9AF7 5C0A
```

#### Install the required dependencies

```command
sudo apt install -y zlib1g-dev
```

```command
sudo apt install -y libpcre3 libpcre3-dev
```

-   **zlib1g-dev**: Provides the development files for `zlib`, a compression library used by Nginx to handle compressed content (like gzip) and perform efficient data compression and decompression.
-   **libpcre3 and libpcre3-dev**: Provide the PCRE (Perl Compatible Regular Expressions) library and its development files, which Nginx uses for regular expression support, such as in location matching and URL rewriting.

#### Build nginx

In this example, we're using the same configuration parameters as used by the binary package, except for our destination prefix. This allows us to retain feature parity and integrate the service with our usual system scripts. The last three options passed to the `configure` script shown here are needed to use the OpenSSL version we built above.

```command
tar zxf nginx-1.26.2.tar.gz
```

```command
cd nginx-1.26.2
```

```command
./configure --with-cc-opt='-g -O2 -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' \
        --with-ld-opt='-Wl,-z,relro -Wl,-z,now -fPIC'      \
        --prefix=/opt                                      \
        --conf-path=/opt/nginx/nginx.conf              	\
        --http-log-path=/var/log/nginx/access.log      	\
        --error-log-path=/var/log/nginx/error.log      	\
        --lock-path=/var/lock/nginx.lock               	\
        --pid-path=/run/nginx.pid                      	\
        --modules-path=/opt/lib/nginx/modules              \
        --http-client-body-temp-path=/var/lib/nginx/body   \
        --http-fastcgi-temp-path=/var/lib/nginx/fastcgi    \
        --http-proxy-temp-path=/var/lib/nginx/proxy        \
        --http-scgi-temp-path=/var/lib/nginx/scgi          \
        --http-uwsgi-temp-path=/var/lib/nginx/uwsgi        \
        --with-compat                                  	\
        --with-debug                                   	\
        --with-http_ssl_module                         	\
        --with-http_stub_status_module                 	\
        --with-http_realip_module                      	\
        --with-http_auth_request_module                	\
        --with-http_v2_module                          	\
        --with-http_dav_module                         	\
        --with-http_slice_module                       	\
        --with-threads                                 	\
        --with-http_addition_module                    	\
        --with-http_gunzip_module                      	\
        --with-http_gzip_static_module                 	\
        --with-http_sub_module                         	\
        --with-pcre                                    	\
        --with-openssl-opt=enable-tls1_3               	\
        --with-ld-opt="-L/opt/lib64 -Wl,-rpath,/opt/lib64" \
        --with-cc-opt="-I/opt/include"
[...]
```

```command
make
```

```command
sudo make install
```

```command
sudo mkdir /var/lib/nginx
```

```command
sudo mkdir /opt/nginx/conf.d
```

#### Configure Nginx

After building, add a line to the main Nginx configuration file to include configuration files in the /opt/nginx/nginx.conf directory:

```file {title="/opt/nginx/nginx.conf"}
user www-data; #add this to the top of the file

http {
        ...
   	 # Include additional configuration files
	    include /opt/nginx/conf.d/pqc.conf;
}
```

#### Create a configuration file for the server in the /opt/nginx/conf.d/ directory, such as pqc.conf:

```file {title="/opt/nginx/conf.d/pqc.conf"}
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com www.example.com;

    root /var/www/example.com;
    index index.html index.php;

    ssl_certificate /opt/certs/example.com.crt;
    ssl_certificate_key /opt/certs/example.com.key;

    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ecdh_curve x25519_kyber768:p384_kyber768:x25519:secp384r1:x448:secp256r1:secp521r1;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

{{< note type="warning" >}}
**Remember!**
**Don't forget to add certificates to enable TLS!** Ensure that you include the necessary certificates, even if they are self-signed, to enable proper TLS/SSL functionality. Without certificates, you won’t be able to establish a secure HTTPS connection.

If you want to use automatic certificate renewal with Let's Encrypt, follow [Use Certbot to Enable HTTPS with NGINX on Ubuntu](https://www.linode.com/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu/) to properly configure the Nginx server. If u want to use self-signed certificate, follow this guide: [Enable TLS/SSL for HTTPS](https://www.linode.com/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/), or you can easily create certificates using the following command:

```command
sudo mkdir /opt/certs
```

```command
'sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /opt/certs/pqc.com.key -out /opt/certs/pqc.com.crt'
```

{{< note >}}
Note: a self-signed certificate is only suitable for testing or debugging purposes!
{{< /note >}}
{{< /note >}}

#### Create a system service file for Nginx to automatically manage the server:

```file {title="/etc/systemd/system/nginx.service"}
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/run/nginx.pid
ExecStartPre=/opt/sbin/nginx -t
ExecStart=/opt/sbin/nginx
ExecReload=/opt/sbin/nginx -s reload
ExecStop=/opt/sbin/nginx -s stop
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

#### Start the service

```command
sudo service nginx start
```

## Check if the post quantum algorithms are used by nginx

The easiest and quickest way to test the algorithms used by nginx in our custom installation here is to run the openssl command shown below:

```command
openssl s_client -groups x25519_kyber768 -connect localhost:443
```

For additional methods, see our [Ubuntu-PQC guide](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558967).

## Related links
[DRAFT UBUNTU Set up a Web Server and Host a Website on Linode that supports the X25519Kyber768Draft00 Key Exchange in TLS 1.3 (Post-quantum cryptography)](https://collaborate.akamai.com/confluence/pages/viewpage.action?pageId=1012558967)
[https://openquantumsafe.org/](https://openquantumsafe.org/liboqs/)
[https://openssl-library.org/](https://openssl-library.org/)
[https://pq.cloudflareresearch.com](https://pq.cloudflareresearch.com/)
[https://github.com/open-quantum-safe/oqs-provider](https://github.com/open-quantum-safe/oqs-provider)