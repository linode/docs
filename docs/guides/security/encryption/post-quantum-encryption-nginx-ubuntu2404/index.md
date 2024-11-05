---
slug: post-quantum-encryption-nginx-ubuntu2404
title: "Post Quantum Encryption with NGINX on Ubuntu 24.04"
description: "Learn how to set up NGINX on Ubuntu 24.04 with support for the post-quantum cryptography X25519Kyber768Draft00 / ML-KEM key exchange in TLS 1.3."
authors: ["Seweryn Krajczok", "Jan Schaumann"]
contributors: ["Linode"]
published: 2024-10-30
keywords: ['X25519Kyber768Draft00','X25519MLKEM768', 'ML-KEM','post-quantum cryptography','tls 1.3','cybersecurity','ubuntu 24.04','key exhange','OpenSSL','encryption','secure website']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Open Quantum Safe](https://openquantumsafe.org/)'
- '[OpenSSL Library](https://openssl-library.org/)'
- '[open-quantum-safe/oqs-provider on GitHub](https://github.com/open-quantum-safe/oqs-provider)'
relations:
    platform:
        key: post-quantum-encryption-nginx
        keywords:
            - distribution: Ubuntu 24.04
---

The National Institute of Standards and Technology (NIST) recently [released](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards) its first finalized Post-Quantum Encryption Standards to protect against quantum computer attacks. This includes the Module-Lattice-based Key-Encapsulation Mechanism standard (ML-KEM, defined in [FIPS-203](https://csrc.nist.gov/pubs/fips/203/final)). It is already being implemented in the industry using an early [pre-standardization draft](https://datatracker.ietf.org/doc/draft-tls-westerbaan-xyber768d00/) for use with TLS.

Deploying this algorithm for your web server currently requires some additional steps. The process may vary depending on your operating system's version of OpenSSL. This guide shows how to deploy this algorithm with NGINX on Ubuntu 24.04, using the [Open Quantum Safe (OQS) provider](https://github.com/open-quantum-safe/oqs-provider) for OpenSSL, which is used to enable the post quantum encryption algorithm. After it is configured for the web server, several ways to verify that the server is using the algorithm are demonstrated.

## Before You Begin

1.  To follow along with the steps in the guide, create a Compute Instance running Ubuntu 24.04. See the [Get started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) and [Create a compute instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance) product documentation for instructions. You may also choose to adapt the configuration from this guide to an existing NGINX installation.

1.  Follow the [Set up and secure a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) product documentation to appropriately secure your system.

1. To implement the algorithm in NGINX, a TLS certificate is required. When using a certificate from a public certificate authority, a domain name or subdomain must be assigned to your Linode instance. Visit your domain name registrar's website, to assign a new record to your Linode instance's IP address. Your IP address is [displayed in the cloud manager](https://techdocs.akamai.com/cloud-computing/docs/managing-ip-addresses-on-a-compute-instance#viewing-ip-addresses). If you use the Linode DNS Manager, visit the [manage DNS records](https://techdocs.akamai.com/cloud-computing/docs/manage-domains) product documentation to view instructions for assigning a new A/AAAA record to your IP address.

1.  For an overview of how TLS encryption works, review the [Understanding TLS Certificates and Connections](/docs/guides/what-is-a-tls-certificate/) guide.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Dependencies

Once your Ubuntu 24.04 compute instance is set up and secured, install the dependencies and system packages needed to build the OQS provider.

1.  Update your package list to ensure you download the latest available versions:

    ```command
    sudo apt update
    ```

1.  Install `cmake`, a cross-platform build system generator that helps automate the compilation and build process for software projects:

    ```command
    sudo apt install -y cmake
    ```

1.  Install `libssl-dev`, which provides development libraries and headers for OpenSSL, needed to build software that requires cryptographic functions and secure communications:

    ```command
    sudo apt install -y libssl-dev
    ```

1.  Install `ninja-build`, a fast and lightweight build system designed to run builds in parallel, speeding up the compilation of large projects:

    ```command
    sudo apt install -y ninja-build
    ```

### Check if you have already installed OpenSSL 3.x +

```command
openssl version
```

If OpenSSL 3.x+ is already installed, go to the "Install the oqs-provider" step.

## Update OpenSSL

1. Update OpenSSL from Ubuntu repositories:

    ```command
    sudo apt install -y openssl
    ```

1. Verify that you now have OpenSSL >= 3.x:

    ```command
    openssl version
    ```

## Install `oqs-provider`

The oqs-provider is a library that integrates post-quantum cryptographic algorithms into OpenSSL. This section outlines the steps needed to install it and leverage this advanced cryptography.

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
    scripts/fullbuild.sh
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

    The tail of the output from the tests should resemble:

    ```output
    100% tests passed, 0 tests failed out of 6

    Total Test time (real) =  93.97 sec

    All oqsprovider tests passed.
    ```

### Configure OpenSSL to Use the OQS Provider

Use `nano` to edit the OpenSSL configuration file:

```command
sudo nano /etc/ssl/openssl.cnf
```

Add the following lines at the end:

```file {title="/etc/ssl/openssl.cnf"}
# PQC via OpenQuantumSafe
[provider_sect]
default = default_sect
oqsprovider = oqsprovider_sect

[default_sect]
activate = 1

[oqsprovider_sect]
activate = 1
```

When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

### Check Provider Version Information

List the active OpenSSL providers to verify the installation:

```command
openssl list -providers
```

You should see output similar to the following:

```output
Providers:
  default
    name: OpenSSL Default Provider
    version: 3.0.13
    status: active
  oqsprovider
    name: OpenSSL OQS Provider
    version: 0.7.1-dev
    status: active
```

## Verify the Quantum-Safe KEM Algorithms are Available

Run:

```command
openssl list -kem-algorithms -provider oqsprovider | egrep -i "(kyber|kem)768"
```

Output should resemble:

```output
  kyber768 @ oqsprovider
  p384_kyber768 @ oqsprovider
  x448_kyber768 @ oqsprovider
  x25519_kyber768 @ oqsprovider
  p256_kyber768 @ oqsprovider
  mlkem768 @ oqsprovider
  p384_mlkem768 @ oqsprovider
  x448_mlkem768 @ oqsprovider
  X25519MLKEM768 @ oqsprovider
  SecP256r1MLKEM768 @ oqsprovider
```

## Set Up NGINX

### Install NGINX

Use `apt` to install NGINX:

```command
sudo apt install nginx
```

### Set up TLS/SSL Certificates

Ensure that you include the necessary certificates (whether self-signed or from a trusted Certificate Authority) to enable proper TLS/SSL functionality. Without certificates, you won’t be able to establish a secure HTTPS connection.

-   **Using Let's Encrpyt (Recommended for Production)**: To use automatic certificate renewal with Let's Encrypt, follow [Use Certbot to Enable HTTPS with NGINX on Ubuntu](/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu/) to properly configure the Nginx server.

-   **Using Self-Signed Certificate (Suitable for Testing/Development)**: To use a self-signed certificate, see our [Enable TLS/SSL for HTTPS](/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/) guide, or create certificates using the following command:

    1.  First create the directory for your certificates:

        ```command
        sudo mkdir /opt/certs
        ```

    1.  Then generate the self-signed certificate:

        ```command
        sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /opt/certs/pqc.key -out /opt/certs/pqc.crt
        ```

### Configure NGINX

1.  Edit the main Nginx configuration file:

    ```command
    sudo nano /etc/nginx/nginx.conf
    ```

1.  Locate the `http` block and add the highlighted lines to include configuration files in the `/etc/nginx/nginx.conf` directory:

    ```file {title="/etc/nginx/nginx.conf" hl_lines="2,3" linenostart="18"}
    http {
        #Include additional configuration files
        include /etc/nginx/conf.d/pqc.conf;
        ...
    }
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Create a server configuration file called `pqc.conf` in the `/etc/nginx/conf.d/` directory:

    ```command
    sudo nano /etc/nginx/conf.d/pqc.conf
    ```

    Paste this snippet into the file. **Be sure to update the `ssl_certificate` and `ssl_certificate_key` parameters** with the correct file paths for your certificate files:

    ```file {title="/etc/nginx/conf.d/pqc.conf"}
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

1.  Reload the NGINX service:

    ```command
    sudo systemctl reload nginx
    ```

## Verify Nginx Is Using Post-Quantum Algorithms

### Option 1: test with `openssl s_client` command

To test the TLS configuration with Kyber groups using the `openssl s_client` command, you can use the following options:

```command
openssl s_client -groups x25519_kyber768 -connect localhost:443
```

### Option 2: Capture connection using tcpdump

1. Enable Kyber support in either Google Chrome or Mozilla Firefox:

    - Chrome:

        1. Open Chrome and navigate to [chrome://flags](chrome://flags).

        1. In the search bar, enter `TLS 1.3 post-quantum key agreement`.

        1. Toggle the option to Enabled for `#enable-tls13-kyber` or `#use-ml-kem`.

    - Firefox:

        1. Open Chrome and navigate to [about:config](about:config).

        1. In the search bar, enter `security.tls.enable_kyber`.

        1. Toggle the option to True for `security.tls.enable_kyber`.

1.  Run tcpdump to capture the network traffic between your browser and the server. In a terminal on your workstation:

    ```command
    sudo tcpdump -w pqc.pcap host <your-linode-IP-address>
    ```

1.  Visit your site using Chrome or Firefox.

1.  Use Wireshark/Tshark to analyze the captured data:

    ```command
    tshark -r pqc.pcap -V | grep X25519Kyber768Draft00
    ```

    Look for the use of `x25519Kyber768Draft00` as one of the key shares within the TLS handshake extension. You should see output like this:

    ```output
    Extension: key_share (len=1263) X25519Kyber768Draft00, x25519
                    Type: key_share (51)
                    Length: 1263
    ```

### Option 3: Display TLS Connection Details with PHP

These steps create an index.php page on your web server that displays information about your encryption algorithm:

1.  On your web server, install PHP 8.3 with FPM:

    ```command
    sudo apt install -y php-fpm
    ```

1.  Edit `/etc/nginx/conf.d/pqc.conf`:

    1.  Change the `index` parameter to point to the new `index.php` file:

        ```file {title="/etc/nginx/conf.d/example.com.conf"}
        server {
            ...
            index             index.php;
            ...
        ```

    1.  Add a new `location ~ \.php$` block above the existing `location /` block:

        ```file {title="/etc/nginx/conf.d/example.com.conf" hl_lines="4-8"}
        server {
            ...

                location ~ \.php$ {
                    include snippets/fastcgi-php.conf;
                    fastcgi_param SSL_CURVE $ssl_curve;
                    fastcgi_pass unix:/var/run/php/php-fpm.sock;
                }

                location / {
                    try_files $uri $uri/ =404;
                }
        }
        ```

1.  Create a file named `index.php` in /var/www/example.com with this snippet:

    ```command
    sudo mkdir -p /var/www/example.com
    ```

    ```file {title="/var/www/example.com/index.php"}
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SSL Curve Information</title>
    </head>
    <body>
        <h1>Your SSL Curve Information</h1>

        <?php
            $ssl_curve = $_SERVER['SSL_CURVE'];

            if ($ssl_curve === '0x6399') {
                echo "<p class='secure'>You are using X25519Kyber768Draft00 which is post-quantum secure.</p>";
            } elsif ($ssl_curve === '0x4588') {
                echo "<p class='secure'>You are using X25519MLKEM768, which is post-quantum secure.</p>";
            } else {
                echo "<p class='not-secure'>You are using SSL Curve: {$ssl_curve} which is not post-quantum secure.</p>";
            }
        ?>

    </body>
    </html>
    ```

1.  Reload NGINX:

    ```command
    sudo systemctl reload nginx
    ```

1.  Visit your website in your browser. If Kyber support is enabled in your browser, and if the TLS handshake with the web server uses the algorithm, you should see:

    ```output
    You are using X25519Kyber768Draft00 which is post-quantum secure
    ```

    Otherwise, this message is displayed:

    ```output
    You are using SSL Curve: X25519 which is not post-quantum secure.
    ```

{{< note >}}
Remember that currently not all browsers support post-quantum algorithms. These browsers offer compatibility:

- Enabled by default for Chrome 124+ on Desktop. For older Chrome versions or on mobile, you need to toggle `TLS 1.3 post-quantum key agreement` / `#use-ml-kem` in [chrome://flags](chrome://flags).

- Enabled by default for Edge 124+.

- Enabled by default for recent Opera and Brave.

- Enabled for Firefox 124+ if you turn on `security.tls.enable_kyber` in [about:config](about:config). Firefox 128+: turn on `network.http.http3.enable_kyber` for QUIC/HTTP3.
{{< /note >}}
