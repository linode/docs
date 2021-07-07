---
author:
  name: Linode
  email: docs@linode.com
modified: 2019-11-21
published: 2019-11-21
modified_by:
  name: Linode
contributor:
  name: Bagas Sanjaya
description: 'Introduction to Certificate Authority and generating root pair for your own CA.'
keywords: ["ssl", "tls", "certificate authority", "root ca", "root pair"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: 'Certificate Authority with OpenSSL - Part 1: Introduction and Root Pair'
external_resources:
  - '[OpenSSL CA guide by Jamie Nguyen: Creating Root Pair](https://jamielinux.com/docs/openssl-certificate-authority/create-the-root-pair.html)'
  - '[OpenSSL Manual Pages (master version)](https://www.openssl.org/docs/manmaster/)'
---
[OpenSSL](https://www.openssl.org) is a cryptographic and SSL/TLS library for [public-key infrastructure](https://en.wikipedia.org/wiki/Public_key_infrastructure). The tools provided by OpenSSL can be used to act as your own [certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).

This guide is the first of a five-part series. Part 1 and [2](/docs/security/ssl/certificate-authority-openssl-intermediate-pair/) will walk you through creating root and intermediate pairs respectively, which forms a CA chain. [Part 3](/docs/security/ssl/certificate-authority-openssl-signing-certificates/) deals with signing certificate requests from clients of your CA. [Part 4](/docs/security/ssl/certificate-authority-openssl-crl/) and [5](/docs/security/ssl/certificate-authority-openssl-ocsp/) discuss about revoking certificates by means of [Certificate Revocation Lists (CRL)](https://en.wikipedia.org/wiki/Certificate_revocation_list) and [Online Certificate Status Protocol (OCSP)](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol) respectively.

## Introduction to Certificate Authority

A certificate authority (CA) is an entity that issue digital certificates, which the certificate issued certifies ownership of a public key by named subject. Third-parties can thus rely upon signatures of private key that correspond to the certified public key. In this case, a CA is trusted third-party, both by subject (owner) of a public key and parties relied upon the certificate.

CA issues digital certificates that contains public key of the subject, while the corresponding private key is kept secret by subject who generates the key pair. One of responsibility of CA is verifying credentials of an applicant (client), with variety of standards and tests. This ensures that public key contained in the certificate really belongs to the entity listed as subject.

All CA have a root pair, that is a self-signed, most trustworthy pair that identifies a root CA. With this pair, intermediate pairs are signed, and inherited trustworthiness from root pair. Client certificates are signed using these intermediate pairs, and also trusted with respect to root CA. This forms [chain of trust](https://en.wikipedia.org/wiki/Chain_of_trust), in form of a tree structure.

One of most popular use of CA is signing certificates used in [HTTPS](https://en.wikipedia.org/wiki/HTTPS). Certificates can also be used for encrypting or signing messages with [S/MIME](https://en.wikipedia.org/wiki/S/MIME) protocol, although its usage is beneficial mostly to verifying messages in public mailing lists.

While you can instead [create and use self-signed certificate](/docs/security/ssl/create-a-self-signed-tls-certificate/), having a CA can be useful in following scenarios:

1. You administer an intranet network, and you wish to have your own public-key infrastructure to manage your certificates.

2. Large organizations and governments that need to pass confidental information to trusted recipients.

3. You simply don't have registered domain name, but you want enabling HTTPS for your website, and web browsers need to trust the certificate used on it.

4. You have clients that need to authenticate to your server, but you want to avoid high costs of commercial CA.

{{< caution >}}
Running a public CA requires you to adhere to [CA/Browser Forum Baseline Requirements](https://cabforum.org/wp-content/uploads/CA-Browser-Forum-BR-1.6.6.pdf), including preventing fraudulent certificates and participating in [certificate transparency](https://en.wikipedia.org/wiki/Certificate_Transparency) initiative. If you run CA in intranet/private network, you still need to comply to policy of your organization.

If you have public, Internet-faced servers, it is better to [obtain commercially-signed certificate](/docs/security/ssl/obtain-a-commercially-signed-tls-certificate/) from reputable CA. This way, clients don't get certificate warnings or errors when they connect to your server.
{{< /caution >}}

## Create User for CA (Recommended)

Since we will deal with cryptographic pairs of private and public keys, we strongly recommended to create separate user for running CA.

**Debian & Ubuntu**:

    # addgroup linode-ca
    # adduser --ingroup linode-ca linode-ca

**Other Systems**:

    # groupadd linode-ca
    # useradd -g linode-ca

Switch user to CA user. All commands will now be run as this user:

    # su - linode-ca

## Directory Structure and Configuration File Preparation

1.  Create root directory, in which all certificates and key pairs are stored:

        $ mkdir ~/ca

2.  Create directory structure for root CA:

        $ mkdir ~/ca/root
        $ mkdir ~/ca/root/{certs,config,crl,newcerts,private}

3.  Create database and serial number file:

        $ touch ~/ca/root/index.txt
        $ echo 1000 > ~/ca/root/serial

4.  Add configuration file for root CA, as below:

    {{< file "~/ca/root/config/root.cnf" ini >}}
# Root CA configuration

[ ca ]
# See `man ca`
default_ca = CA_default

[ CA_default ]
# Directory and file locations.
dir               = /home/linode-ca/ca/root
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
RANDFILE          = $dir/private/.rand

# The root key and root certificate.
private_key       = $dir/private/linode-ca-root.key.pem
certificate       = $dir/certs/linode-ca-root.cert.pem

# For certificate revocation lists.
crlnumber         = $dir/crlnumber
crl               = $dir/crl/linode-ca-root.crl.pem
crl_extensions    = crl_ext
default_crl_days  = 30

# Use SHA-256 as default hashing method
default_md        = sha256

name_opt          = ca_default
cert_opt          = ca_default
default_days      = 375
preserve          = no
policy            = policy_strict

[ policy_strict ]
# The root CA should only sign intermediate certificates that match.
# See the POLICY FORMAT section of `man ca`.
countryName             = match
stateOrProvinceName     = match
organizationName        = match
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ policy_loose ]
# Allow the intermediate CA to sign a more diverse range of certificates.
# See the POLICY FORMAT section of the `ca` man page.
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional

[ req ]
# Options for the `req` tool (`man req`).
default_bits        = 2048
distinguished_name  = req_distinguished_name
string_mask         = utf8only

# SHA-1 is deprecated, so use SHA-2 instead.
default_md          = sha256

# Extension to add when the -x509 option is used.
x509_extensions     = v3_ca

[ req_distinguished_name ]
# Text to display for Distinguished Name prompt
countryName                     = Country Name (2 letter code)
stateOrProvinceName             = State or Province Name
localityName                    = Locality Name
0.organizationName              = Organization Name
organizationalUnitName          = Organizational Unit Name
commonName                      = Common Name
emailAddress                    = Email Address

# Optionally, specify some defaults.
countryName_default             = US
stateOrProvinceName_default     = PA
localityName_default            = Philadelphia
0.organizationName_default      = Linode
organizationalUnitName_default  =
emailAddress_default            =

[ v3_ca ]
# Extensions for a typical CA (`man x509v3_config`).
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
# Extensions for a typical intermediate CA (`man x509v3_config`).
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ usr_cert ]
# Extensions for client certificates (`man x509v3_config`).
basicConstraints = CA:FALSE
nsCertType = client, email
nsComment = "OpenSSL Generated Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection

[ server_cert ]
# Extensions for server certificates (`man x509v3_config`).
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[ crl_ext ]
# Extension for CRLs (`man x509v3_config`).
authorityKeyIdentifier=keyid:always

[ ocsp ]
# Extension for OCSP signing certificates (`man ocsp`).
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, digitalSignature
extendedKeyUsage = critical, OCSPSigning
{{< /file >}}

## Make the Root Pair

1.  Generate RSA 4096-bit root key. Encrypt with AES-256 and a pass phrase (replace `phrase` with your strong pass phrase). Set permission on root key to read-only:

        $ cd ~/ca/root
        $ openssl genrsa -aes256 -out private/linode-ca-root.key.pem

    {{< output >}}
Generating RSA private key, 4096 bit long modulus (2 primes)
.............................++++
.......................................................................++++
e is 65537 (0x010001)
Enter pass phrase for private/linode-ca-root.key.pem: phrase
Verifying - Enter pass phrase for private/linode-ca-root.key.pem: phrase
{{< /output >}}

        $ chmod 400 private/linode-ca-root.key.pem

2.  Use the root key to generate root certificate, with long expiry date (for example, 7200 days). The `-x509` switch is used to create self-signed certificate, with `v3_ca` extensions applied:

        $ openssl req -config config/root.cnf -key private/linode-ca-root.key.pem -x509 -new -sha256 -extensions v3_ca -days 7200 -out certs/linode-ca-root.cert.pem

    You will see prompt which asked for details of your root certificate. Such information are called *Distinguished Name (DN)*. These will be embedded to the certificate, so double check your input before you press enter. Replace with DN information of your root CA:

    {{< output >}}
Enter pass phrase for private/linode-ca-root.key.pem: phrase
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [US]:US
State or Province Name [PA]:PA
Locality Name [Philadelphia]:Philadelphia
Organization Name [Linode]:Linode
Organizational Unit Name []:Linode CA
Common Name []:Linode Root CA
Email Address []:ca@linode.com
{{< /output >}}

3.  Now the root pair have been generated, **verify it** by:

        $ openssl x509 -noout -text -in certs/linode-ca-root.cert.pem

    This will output text version of root certificate. This will look like below. Note that `Modulus` hashes have been omitted for the sake of privacy:

    {{< output >}}
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            16:f7:f2:dd:f9:29:51:6f:0b:83:0d:80:27:24:15:ff:f0:9a:d9:ed
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = US, ST = PA, L = Philadelphia, O = Linode, OU = Linode CA, CN = Linode Root CA, emailAddress = ca@linode.com
        Validity
            Not Before: Nov 20 10:36:34 2019 GMT
            Not After : Aug  7 10:36:34 2039 GMT
        Subject: C = US, ST = PA, L = Philadelphia, O = Linode, OU = Linode CA, CN = Linode Root CA, emailAddress = ca@linode.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (4096 bit)
                ...
        X509v3 extensions:
            X509v3 Subject Key Identifier:
                5E:53:95:83:8C:06:66:E0:2F:CD:4E:A0:07:6D:3F:6F:3A:86:6C:A4
            X509v3 Authority Key Identifier:
                keyid:5E:53:95:83:8C:06:66:E0:2F:CD:4E:A0:07:6D:3F:6F:3A:86:6C:A4

            X509v3 Basic Constraints: critical
                CA:TRUE
            X509v3 Key Usage: critical
                Digital Signature, Certificate Sign, CRL Sign
    Signature Algorithm: sha256WithRSAEncryption
        ...
{{< /output >}}

    Some points for the output above:

    -  `Validity` entries (`Not Before` and `Not After`) determine valid range date for the certificate. The former refers to the date the certificate was created (and signed in case of self-signed certificate), and the latter refers to actual expiration date.

    -  `X509v3` extensions entry contains `CA:TRUE` basic constraint. This is required for root CA to be able to sign intermediate CA, in addition to `Digital Signature`, `Certificate Sign`, and `CRL Sign` key usage.

    - `Issuer` is the entity that issue the certificate, while `Subject` is the entity which the certificate is issued to. Since this certificate is self-signed, both entries are identical.

4.  Since the certificate contains sensitive information, protect it by changing permissions to read only:

        $ chmod 444 certs/linode-ca-root.cert.pem

## To be Continued on Part 2

By now you should have a root pair (root private key and CA certificate). While on some guides on the Internet use this certificate to directly sign certificates from clients, we recommend to use intermediate CA instead. To generate intermediate CA, see [Part 2](/docs/security/ssl/certificate-authority-openssl-intermediate-pair/) of this series.
