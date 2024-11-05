---
slug: post-quantum-encryption-nginx-debian11
title: "Post Quantum Encryption with NGINX on Debian 11"
description: "Learn how to set up a Debian 11 Nginx web server with support for the post-quantum cryptography X25519Kyber768Draft00 / ML-KEM key exchange in TLS 1.3."
authors: ["Seweryn Krajczok", "Jan Schaumann"]
contributors: ["Linode"]
published: 2024-11-05
keywords: ['X25519Kyber768Draft00','X25519MLKEM768', 'ML-KEM', 'post-quantum cryptography','tls 1.3','cybersecurity','debian 11','key exhange','OpenSSL','encryption','secure website']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Open Quantum Safe](https://openquantumsafe.org/liboqs/)'
- '[OpenSSL Library](https://openssl-library.org/)'
- '[GitHub: Open Quantum Safe oqs-provider](https://github.com/open-quantum-safe/oqs-provider)'
relations:
    platform:
        key: post-quantum-encryption-nginx
        keywords:
            - distribution: Debian 11
---

The National Institute of Standards and Technology (NIST) recently [released](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards) its first finalized Post-Quantum Encryption Standards to protect against quantum computer attacks. This includes the Module-Lattice-based Key-Encapsulation Mechanism standard (ML-KEM, defined in [FIPS-203](https://csrc.nist.gov/pubs/fips/203/final)). It is already being implemented in the industry using an early [pre-standardization draft](https://datatracker.ietf.org/doc/draft-tls-westerbaan-xyber768d00/) for use with TLS.

Deploying this algorithm for your web server currently requires some additional steps. The process may vary depending on your operating system's version of OpenSSL. This guide shows how to deploy this algorithm with NGINX on Debian 11, using the [Open Quantum Safe (OQS) provider](https://github.com/open-quantum-safe/oqs-provider) for OpenSSL, which is used to enable the post quantum encryption algorithm.

_Note_: we chose Debian 11 here to illustrate the process of building OpenSSL and NGINX from sources.  See [this guide](/docs/guides/security/encryption/post-quantum-encryption-nginx-ubuntu2404/) for a document guiding you through the setup on an Ubuntu 24.04 system instead.

## Before You Begin

1.  To follow along with the steps in the guide, create a Compute Instance running Debian 11. See the [Get started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) and [Create a compute instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance) product documentation for instructions. You may also choose to adapt the configuration from this guide to an existing NGINX installation.

1.  Follow the [Set up and secure a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) product documentation to appropriately secure your system.

1. To implement the algorithm in NGINX, a TLS certificate is required. When using a certificate from a public certificate authority, a domain name or subdomain must be assigned to your Linode instance. Visit your domain name registrar's website, to assign a new record to your Linode instance's IP address. Your IP address is [displayed in the cloud manager](https://techdocs.akamai.com/cloud-computing/docs/managing-ip-addresses-on-a-compute-instance#viewing-ip-addresses). If you use the Linode DNS Manager, visit the [manage DNS records](https://techdocs.akamai.com/cloud-computing/docs/manage-domains) product documentation to view instructions for assigning a new A/AAAA record to your IP address.

1.  For an overview of how TLS encryption works, review the [Understanding TLS Certificates and Connections](/docs/guides/what-is-a-tls-certificate/) guide.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

### Install Dependencies

Once your Debian 11 compute instance is set up and secured, install the dependencies and system packages needed to build OpenSSL and the OQS provider.

1.  First, update your package list to ensure you download the latest available versions:

    ```command
    sudo apt update
    ```

1.  Next, install `make`, a build automation tool used to compile and link programs from source code. It reads instructions from a Makefile, which defines how to compile and build the software:

    ```command
    sudo apt install -y make
    ```

1.  Now install `gcc` (GNU Compiler Collection), which compiles source code written in languages like C and C++ into executable programs. It is essential for building OpenSSL and other software from source code:

    ```command
    sudo apt install -y gcc
    ```

## Install OpenSSL from Source

Debian 11 comes with OpenSSL version `1.1.1w` by default, but the OQS provider requires OpenSSL 3.x. Therefore, you need to build a newer version from source.

1.  First, change into your user's home directory, if not already:

    ```command
    cd ~
    ```

1.  Download the OpenSSL source code:

    ```command
    wget https://github.com/openssl/openssl/releases/download/openssl-3.4.0/openssl-3.4.0.tar.gz
    ```

1.  Download the corresponding signature file:

    ```command
    wget https://github.com/openssl/openssl/releases/download/openssl-3.4.0/openssl-3.4.0.tar.gz.asc
    ```

### Verify the OpenSSL Code Signature

Before proceeding with the installation, verify the integrity and authenticity of the downloaded files using GnuPG (`gnupg`).

1.  First, install `gnupg`:

    ```command
    sudo apt -y install gnupg
    ```

1.  Next, import the public OpenSSL signing key:

    ```command
    gpg --search-keys openssl@openssl.org
    ```

    When prompted, press the <kbd>1</kbd> key followed by <kbd>ENTER</kbd> to choose the key from `openssl@openssl.org`:

    ```output
    gpg: directory '/home/{{< placeholder "USERNAME" >}}/.gnupg' created
    gpg: keybox '/home/{{< placeholder "USERNAME" >}}/.gnupg/pubring.kbx' created
    gpg: data source: https://keys.openpgp.org:443
    (1)	OpenSSL <openssl@openssl.org>
        4096 bit RSA key 216094DFD0CB81EF, created: 2024-04-08
    Keys 1-1 of 1 for "openssl@openssl.org".  Enter number(s), N)ext, or Q)uit >
    ```

    Afterward, you should see output similar to the following:

    ```output
    gpg: /home/{{< placeholder "USERNAME" >}}/.gnupg/trustdb.gpg: trustdb created
    gpg: key 216094DFD0CB81EF: public key "OpenSSL <openssl@openssl.org>" imported
    gpg: Total number processed: 1
    gpg:               imported: 1
    ```

1.  Verify the fingerprint of the imported key to ensure it matches OpenSSL's official key:

    ```command
    gpg --fingerprint openssl@openssl.org
    ```

    You should see output similar to the following:

    ```output
    pub   rsa4096 2024-04-08 [SC] [expires: 2026-04-08]
          BA54 73A2 B058 7B07 FB27  CF2D 2160 94DF D0CB 81EF
    uid           [ unknown] OpenSSL <openssl@openssl.org>
    ```

1.  Finally, verify the OpenSSL source file against its signature:

    ```command
    gpg --verify openssl-3.4.0.tar.gz.asc openssl-3.4.0.tar.gz
    ```

    You should see a confirmation similar to the output below:

    ```output
    gpg: Signature made Tue 22 Oct 2024 12:27:03 PM UTC
    gpg:                using RSA key BA5473A2B0587B07FB27CF2D216094DFD0CB81EF
    gpg: Good signature from "OpenSSL <openssl@openssl.org>" [unknown]
    ```

    {{< note >}}
    If you see a warning message about not having a trusted signature, it does not impact the validity of the signature:

    ```output
    gpg: WARNING: This key is not certified with a trusted signature!
    gpg:          There is no indication that the signature belongs to the owner.
    Primary key fingerprint: BA54 73A2 B058 7B07 FB27  CF2D 2160 94DF D0CB 81EF
    ```

    The warning message appears because the OpenSSL signing key has not yet been marked as "trusted" in your GnuPG keyring.
    {{< /note >}}

### Build OpenSSL

After verifying the source code, the next step is to build OpenSSL from source.

1.  Extract the downloaded OpenSSL archive:

    ```command
    tar zxf openssl-3.4.0.tar.gz
    ```

1.  Change into the extracted OpenSSL source directory:

    ```command
    cd openssl-3.4.0
    ```

1.  Configure the OpenSSL build, specifying the installation path as `/opt` and setting the appropriate runtime library search path:

    ```command
    ./Configure --prefix=/opt '-Wl,-rpath,$(LIBRPATH)'
    ```

1.  Use `make` to compile the OpenSSL source code:

    ```command
    make
    ```

    {{< note >}}
    This process may take a few minutes depending on your system.
    {{< /note >}}

1.  Install the compiled OpenSSL files to the specified location:

    ```command
    sudo make install
     ```

    {{< note >}}
    This process may take a few minutes depending on your system.
    {{< /note >}}

1.  Verify that the correct version of OpenSSL is installed:

    ```command
    /opt/bin/openssl version
    ```

    This should return the version number of the OpenSSL build you just installed to `/opt/bin`:

    ```output
    OpenSSL 3.4.0 22 Oct 2024 (Library: OpenSSL 3.4.0 22 Oct 2024)
    ```

1.  Now check the active version via the basic `openssl` command:

    ```command
    openssl version
    ```

    This should still show `1.1.1w`, the default version bundled with Debian 11:

    ```output
    OpenSSL 1.1.1w  11 Sep 2023
    ```

In order to complete the installation, you need to make sure that the version you installed in `/opt/bin` is used instead.

### Add `/opt/bin` to Your `PATH`

Adjust your `PATH` environment variable to prioritize the `/opt/bin` directory.

1.  Open your `~/.bashrc` file in a command line text editor such as `nano`:

    ```command
    nano ~/.bashrc
    ```

    Append the following line to the end of the file:

    ```file {title="~/.bashrc"}
    export PATH=/opt/bin:$PATH
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Apply the changes:

    ```command
    source ~/.bashrc
    ```

1.  Use the basic `openssl` command to recheck the active version of OpenSSL:

    ```command
    openssl version
    ```

    The output should now show version `3.3.2`, which you installed in `/opt/bin`:

    ```output
    OpenSSL 3.3.2 3 Sep 2024 (Library: OpenSSL 3.3.2 3 Sep 2024)
    ```

## Install `oqs-provider`

The `oqs-provider` is a library that integrates post-quantum cryptographic algorithms into OpenSSL. This section outlines the steps needed to install it and leverage this advanced cryptography.

### Install Dependencies

A couple of dependencies must be installed prior to `oqs-provider`, along with Git:

1.  First, change back into your user's home directory:

    ```command
    cd ~
    ```

1.  Install `git`, a distributed version control system that can manage code repositories:

    ```command
    sudo apt install -y git
    ```

1.  Now install `cmake`, a cross-platform build system generator that helps automate the compilation and build process for software projects:

    ```command
    sudo apt install -y cmake
    ```

1.  Finally, install `ninja-build`, a build system designed to run builds in parallel, which reduces the compilation time of large projects:

    ```command
    sudo apt install -y ninja-build
    ```

### Clone the `oqs-provider` Repository

1.  Use `git` to clone the `oqs-provider` repository from GitHub:

    ```command
    git clone https://github.com/open-quantum-safe/oqs-provider.git
    ```

1.  Change into the `oqs-provider` directory:

    ```command
    cd oqs-provider
    ```

### Build `oqs-provider`

1.  Set the OpenSSL root directory and build the `oqs-provider` using the provided script:

    ```command
    env OPENSSL_ROOT=/opt CMAKE_PARAMS="-DOPENSSL_CRYPTO_LIBRARY=/opt/lib64/libcrypto.so" bash scripts/fullbuild.sh
    ```

    {{< note >}}
    This process may take a few minutes depending on your system.
    {{< /note >}}

1.  Use `cmake` to install the compiled `oqs-provider`:

    ```command
    sudo cmake --install _build
    ```

1.  Run the test suite to verify the `oqs-provider` build:

    ```command
    scripts/runtests.sh
    ```

### Configure OpenSSL to Use the OQS Provider

1.  Use `nano` to edit the OpenSSL configuration file:

    ```command
    sudo nano /opt/ssl/openssl.cnf
    ```

    Add the following lines at the end:

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
    In this case, you are editing the `/opt/ssl/openssl.cnf` file, not the configuration file for the system OpenSSL.
    {{< /note >}}

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

### Check Provider Version Information

1.  List the active OpenSSL providers to verify the installation:

    ```command
    openssl list -providers
    ```

    You should see output similar to the following:

    ```output
    Providers:
      default
        name: OpenSSL Default Provider
        version: 3.4.0
        status: active
      oqsprovider
        name: OpenSSL OQS Provider
        version: 0.7.1-dev
        status: active
    ```

## Install Nginx from Source

The version of Nginx available for Debian 11 uses OpenSSL version `1.1.1w`. In order to use OpenSSL 3.x, you must build Nginx from source.

### Fetch Nginx Source

1.  Before continuing, change back into your user's home directory:

    ```command
    cd ~
    ```

1.  Use `wget` to download the Nginx source files:

    ```command
    wget https://nginx.org/download/nginx-1.27.2.tar.gz
    ```

1.  Also download the corresponding signature for verification:

    ```command
    wget https://nginx.org/download/nginx-1.27.2.tar.gz.asc
    ```

### Verify the Signature

1.  Download the public key:

    ```command
    wget https://nginx.org/keys/pluknet.key
    ```

1.  Import the key:

    ```command
    gpg --import pluknet.key
    ```

1.  Verify the signature:

    ```command
    gpg --verify nginx-1.27.2.tar.gz.asc nginx-1.27.2.tar.gz
    ```

    If verification succeeds, you should see output similar to the following:

    ```output
    gpg: Signature made Wed 02 Oct 2024 03:31:12 PM UTC
    gpg:                using RSA key D6786CE303D9A9022998DC6CC8464D549AF75C0A
    gpg:                issuer "s.kandaurov@f5.com"
    gpg: Good signature from "Sergey Kandaurov <s.kandaurov@f5.com>" [unknown]
    gpg:                 aka "Sergey Kandaurov <pluknet@nginx.com>" [unknown]
    gpg: WARNING: This key is not certified with a trusted signature!
    gpg:          There is no indication that the signature belongs to the owner.
    Primary key fingerprint: D678 6CE3 03D9 A902 2998  DC6C C846 4D54 9AF7 5C0A
    ```

    {{< note >}}
    Nginx uses individual developer keys to sign its releases, so don't be alarmed if you see unfamiliar names during verification. If verification fails, additional signing keys can be found at [https://nginx.org/en/pgp_keys.html](https://nginx.org/en/pgp_keys.html).
    {{< /note >}}

### Install Dependencies

A couple of libraries are required before building Nginx:

1.  Install `zlib1g-dev`, a compression library for handling compressed content:

    ```command
    sudo apt install -y zlib1g-dev
    ```

1.  Install `libcre3` and `libcre3-dev` to support regular expressions, often used for URL matching:

    ```command
    sudo apt install -y libpcre3 libpcre3-dev
    ```

### Build Nginx

1.  Extract the source:

    ```command
    tar zxf nginx-1.27.2.tar.gz
    ```

1.  Change into the extracted source directory:

    ```command
    cd nginx-1.27.2
    ```

1.  Configure the build with the necessary flags:

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
    ```

    Except for the destination `prefix`, this example uses the same configuration parameters as the binary package. This is to retain feature parity and integrate with system scripts. The last three options passed to the `configure` script are necessary to use the OpenSSL version built earlier.

1.  Compile Nginx:

    ```command
    make
    ```

1.  Install Nginx:

    ```command
    sudo make install
    ```

1.  Create the necessary directories for temporary file storage:

    ```command
    sudo mkdir /var/lib/nginx
    ```

1.  Create a directory for additional configuration files:

    ```command
    sudo mkdir /opt/nginx/conf.d
    ```

### Configure Nginx

1.  Edit the main Nginx configuration file:

    ```command
    sudo nano /opt/nginx/nginx.conf
    ```

    Add the following line to the top of the file to specify the user:

    ```file {title="/opt/nginx/nginx.conf"}
    user www-data; #add this to the top of the file
    ```

    Locate the `http` block and add the highlighted lines to include configuration files in the `/opt/nginx/nginx.conf` directory:

    ```file {title="/opt/nginx/nginx.conf" hl_lines="2,3" linenostart="18"}
    http {
        #Include additional configuration files
        include /opt/nginx/conf.d/pqc.conf;
        ...
    }
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Create a server configuration file called `pqc.conf` in the `/opt/nginx/conf.d/` directory:

    ```command
    sudo nano /opt/nginx/conf.d/pqc.conf
    ```

    Give it the following contents:

    ```file {title="/opt/nginx/conf.d/pqc.conf"}
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name example.com www.example.com;

        root /var/www/example.com;
        index index.html index.php;

        ssl_certificate /opt/certs/pqc.crt;
        ssl_certificate_key /opt/certs/pqc.key;

        ssl_protocols TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ecdh_curve X25519MLKEM768:x25519_kyber768:p384_kyber768:x25519:secp384r1:x448:secp256r1:secp521r1;

        location / {
            try_files $uri $uri/ =404;
        }
    }
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

### Set up TLS/SSL Certificates

Ensure that you include the necessary certificates (whether self-signed or from a trusted Certificate Authority) to enable proper TLS/SSL functionality. Without certificates, you won’t be able to establish a secure HTTPS connection.

-   **Using Let's Encrpyt (Recommended for Production)**: To use automatic certificate renewal with Let's Encrypt, follow [Use Certbot to Enable HTTPS with NGINX on Ubuntu](/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu/) to properly configure the Nginx server.

-   **Using Self-Signed Certificate (Suitable for Testing/Development)**: To use a self-signed certificate, see our [Enable TLS/SSL for HTTPS](/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/) guide, or create certificates using the following command:

    1.  First create the directory for your certificates:

    ```command
    sudo mkdir /opt/certs
    ```

    2.  Then generate the self-signed certificate:

    ```command
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /opt/certs/pqc.key -out /opt/certs/pqc.crt
    ```

### Configure `systemd` and Start Nginx

1.  Create a `systemd` service file for Nginx:

    ```command
    sudo nano /etc/systemd/system/nginx.service
    ```

    Give it the following contents:

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

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Start the Nginx service:

    ```command
    sudo service nginx start
    ```

Nginx should now be installed, configured, and running with OpenSSL 3.x support.

## Verify Nginx Is Using Post-Quantum Algorithms

Run the `openssl` command with the flags shown below:

```command
openssl s_client -groups X25519MLKEM768 -connect localhost:443
```

This command specifically checks for the `X25519_Kyber768` algorithm during a TLS connection.
