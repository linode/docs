---
author:
  name: Linode
  email: docs@linode.com
modified: 2019-11-24
modified_by:
  name: Linode
published: 2019-11-24
contributor:
  name: Bagas Sanjaya
description: 'Generating intermediate pair for signing certificates.'
keywords: ["ssl", "tls", "certificate authority", "ca"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: 'Certificate Authority with OpenSSL - Part 2: Intermediate Pair'
external_resources:
  - '[OpenSSL CA guide by Jamie Nguyen: Creating Intermediate Pair](https://jamielinux.com/docs/openssl-certificate-authority/create-the-intermediate-pair.html)'
  - '[OpenSSL Manual Pages (master version)](https://www.openssl.org/docs/manmaster/)'
---

In this guide, we will generate intermediate pair (private key and CA certificate). Intermediate CA is an entity that can sign certificates on behalf of root CA. This is used primarily for security reasons, so if intermediate CA become compromised, it can be revoked by root CA and new intermediate pair can be generated and used instead.

## Before You Begin

-  This guide is Part 2 of our *Certificate Authority with OpenSSL* series. You will need a root pair (private key and CA certificate). Follow [Part 1](/docs/security/ssl/certificate-authority-openssl-introduction-root-pair/) if you don't already have one. It also contains excerpt of what CA is, how it worked, and benefits of having your own CA.

-  Switch to CA user:

        # su - linode-ca

## Directory Structure and Configuration File Preparation

1.  Create directory structures to store intermediate CA files:

        $ mkdir ~/ca/intermediate
        $ mkdir ~/ca/intermediate/{certs,config,crl,csr,newcerts,private}

2.  Create database, serial and CRL number file:

        $ touch ~/ca/intermediate/index.txt
        $ echo 1000 | tee ~/ca/intermediate/serial ~/linode-ca/intermediate/crlnumber

3.  Add intermediate CA configuration file, as below:

    {{< file "~/ca/intermediate/config/intermediate.cnf" ini >}}
[ ca ]
# Intermediate CA configuration

# See `man ca`
default_ca = CA_default

[ CA_default ]
# Directory and file locations.
dir               = /home/linode-ca/ca/intermediate
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
RANDFILE          = $dir/private/.rand

# The root key and root certificate.
private_key       = $dir/private/linode-ca-intermediate.key.pem
certificate       = $dir/certs/linode-ca-intermediate.cert.pem

# For certificate revocation lists.
crlnumber         = $dir/crlnumber
crl               = $dir/crl/linode-ca-intermediate.crl.pem
crl_extensions    = crl_ext
default_crl_days  = 30

# Use SHA-256 as default hashing method
default_md        = sha256

name_opt          = ca_default
cert_opt          = ca_default
default_days      = 375
preserve          = no
policy            = policy_loose

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

## Make the Intermediate Pair

1.  Generate the intermediate key. As in the root key, use RSA 4096-bit with AES-256 and a pass phrase. Replace `phrase` with your strong pass phrase. Then set the permission to read-only:

        $ cd ~/ca/intermediate
        $ openssl genrsa -aes256 -out private/linode-ca-intermediate.key.pem 4096

    {{< output >}}
Generating RSA private key, 4096 bit long modulus (2 primes)
.......++++
............++++
e is 65537 (0x010001)
Enter pass phrase for private/linode-ca-intermediate.key.pem: phrase
Verifying - Enter pass phrase for private/linode-ca-intermediate.key.pem: phrase
{{< /output >}}

        $ chmod 400 private/linode-ca-intermediate.key.pem

2.  Create *certificate signing request (CSR)* with intermediate key. Replace with DN information of your intermediate CA:

    {{< note >}}
DN information for intermediate CA should match the root CA counterpart, except that `Common Name` must be different.
{{< /note >}}

        $ openssl req -new -sha256 -config config/intermediate.cnf -key private/linode-ca-intermediate.key.pem -out csr/linode-ca-intermediate.csr.pem

    {{< output >}}
Enter pass phrase for private/linode-ca-intermediate.key.pem:
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
Common Name []:Linode Intermediate CA
Email Address []:ca@linode.com
{{< /output >}}

3.  Sign the intermediate CA's CSR with root CA. Apply `v3_intermediate_ca` extension. Validity of intermediate CA should be shorter than root CA, for example 3600 days:

        $ openssl ca -config ../root/config/root.cnf -extensions v3_intermediate_ca -days 3600 -md sha256 -notext -in csr/linode-ca-intermediate.csr.pem -out certs/linode-ca-intermediate.cert.pem

    {{< output >}}
Using configuration from ../root/config/root.cnf
Enter pass phrase for /home/linode-ca/ca/root/private/linode-ca-root.key.pem: phrase
...
Sign the certificate? [y/n]: y
{{< /output >}}

4.  **Verify** the newly-generated pair by:

        $ openssl x509 -noout -text -in certs/linode-ca-intermediate.cert.pem

    The output will be similar to below:

    {{< output >}}
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 4096 (0x1000)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = US, ST = PA, L = Philadelphia, O = Linode, OU = Linode CA, CN = Linode Root CA, emailAddress = ca@linode.com
        Validity
            Not Before: Nov 23 10:44:28 2019 GMT
            Not After : Oct  1 10:44:28 2029 GMT
        Subject: C = US, ST = PA, O = Linode, OU = Linode CA, CN = Linode Intermediate CA, emailAddress = ca@linode.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (4096 bit)
                ...
       X509v3 extensions:
            X509v3 Subject Key Identifier:
                83:17:15:5E:8B:62:DE:BB:9E:EF:B1:A3:FF:D2:AA:7B:6D:1B:50:CF
            X509v3 Authority Key Identifier:
                keyid:5E:53:95:83:8C:06:66:E0:2F:CD:4E:A0:07:6D:3F:6F:3A:86:6C:A4

            X509v3 Basic Constraints: critical
                CA:TRUE, pathlen:0
            X509v3 Key Usage: critical
                Digital Signature, Certificate Sign, CRL Sign
    Signature Algorithm: sha256WithRSAEncryption
        ...
{{< /output >}}

    Note the `pathlen:0` entry in `X509v3 Basic Constraints`. This means that there aren't any further CA below this intermediate CA. Also, `Locality` information is omitted from `Subject` entry.

5.  Also **verify** that chain of trust between intermediate and root CA is intact:

        $ openssl verify -CAfile ../root/certs/linode-ca-root.cert.pem certs/linode-ca-intermediate.cert.pem

    {{< output >}}
certs/linode-ca-intermediate.cert.pem: OK
{{< /output >}}

6.  When a client tries verifying a certificate that is signed by intermediate CA, the intermediate CA must also be verified against root CA. To satisfy this requirement, concatenate **intermediate and root CA** (not vice versa) to create CA chain file:

        $ cat certs/linode-ca-intermediate.cert.pem ../root/certs/linode-ca-root.cert.pem > certs/linode-ca.chain.cert.pem

    {{< note >}}
The CA chain includes both intermediate and root CA because the root CA is unknown yet to the clients.
{{< /note >}}

    In [Part 3](/docs/security/ssl/certificate-authority-openssl-signing-certificates/), this chain CA will be used to verify certificates signed by intermediate CA.

7.  Change permissions on intermediate CA to read-only:

        $ chmod 444 certs/linode-ca-intermediate.cert.pem

## To be Continued on Part 3

Now you have full CA chain (root and intermediate pairs), along with chain of trust. This enables you to sign certificate requests from your clients with intermediate CA, which in turns be verified and trusted by root CA. Continue to [Part 3](/docs/security/ssl/certificate-authority-openssl-signing-certificates/) of this series to sign certificates.
