---
author:
  name: Linode
  email: docs@linode.com
modified: 2019-11-26
modified_by:
  name: Linode
published: 2019-11-26
contributor:
  name: Bagas Sanjaya
description: 'Signing certificates with your CA.'
keywords: ["ssl", "tls", "certificate authority", "ca"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: 'Certificate Authority with OpenSSL - Part 3: Signing Certificates'
external_resources:
  - '[OpenSSL CA guide by Jamie Nguyen: Sign Certificates](https://jamielinux.com/docs/openssl-certificate-authority/sign-server-and-client-certificates.html)'
  - '[OpenSSL Manual Pages (master version)](https://www.openssl.org/docs/manmaster/)'
---

This guide, in Part 3 of *Certificate Authority with OpenSSL* series, will deal with signing both server and client certificate requests. The signage will be done using intermediate CA generated in Part 2.

## Before You Begin

-  Follow Part 2 guide if you don't already have intermediate CA.

-  You need certificate requests (CSRs) submitted from third-parties, be it yourself (if you act as internal CA) or external entities (if you act as public CA). See [Obtain a Commercially Signed TLS Certificate](/docs/security/ssl/obtain-a-commercially-signed-tls-certificate/) guide for instructions to generate CSR for submission to your CA.

-  Switch to CA user:

        # su - linode-ca

## Sign Certificates

1.  Place all CSR requests on `~/linode-ca/intermediate/csr` directory.

2.  Copy intermediate CA configuration file to same file, but with `.san.cnf` extension. The latter will be used for signing CSR with Subject Alternative Name (SAN):

        $ cd ~/linode-ca/intermediate
        $ cp config/intermediate.cnf config/intermediate.san.cnf

3.  Add `subjectAltName` entry to `server_cert` and `usr_cert` extension section. It reads SAN from environment variable:

    {{< file "~/ca/intermediate/config/intermediate.san.cnf" ini >}}
...
[ usr_cert ]
...
subjectAltName = ${ENV::SAN}
...

[ server_cert ]
...
subjectAltName = ${ENV::SAN}
{{< /file >}}

4.  Determine SAN entries to be included to the signed certificate, by examining the CSR:

        $ openssl req -noout -text -in csr/others.csr.pem

    If the CSR contains SAN, the output contains `X509v3 Subject Alternative Name` entry, which looks like:

    {{< output >}}
        Requested Extensions:
            X509v3 Subject Alternative Name:
                DNS:www.others.io, DNS:*.others.io
{{< /output >}}

    If the entry above doesn't exist, SAN isn't available in the CSR, and you can skip step 5 below.

5.  Export SAN entries to the environment variable. Replace with SAN from previous step:

        $ export SAN="DNS:www.others.io, DNS:*.others.io"

6.  Sign the CSR with your intermediate CA. Either apply `server_cert` extension (for use on servers) or `usr_cert` extension (for user and client authentication). Give a year of validity plus few days as grace period if the requester don't yet renew. Use `intermediate.cnf` (for CSR without SAN) or `intermediate.san.cnf` (for CSR with SAN):

        $ openssl ca -config config/intermediate.san.cnf -extensions server_cert -days 375 -notext -md sha256 -in csr/others.csr.pem -out certs/others.cert.pem

    {{< output >}}
Using configuration from config/intermediate.san.cnf
Enter pass phrase for /home/linode-ca/ca/intermediate/private/linode-ca-intermediate.key.pem: phrase
...
Sign the certificate? [y/n]:y
1 out of 1 certificate requests certified, commit? [y/n]y
{{< /output >}}

7.  **Verify** the newly-signed certificate by:

        $ openssl x509 -noout -text -in cert/others.cert.pem

    The output looks like:

    {{< output >}}
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 4096 (0x1000)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = US, ST = PA, O = Linode, OU = Linode CA, CN = Linode Intermediate CA, emailAddress = ca@linode.com
        Validity
            Not Before: Nov 25 10:58:37 2019 GMT
            Not After : Dec  4 10:58:37 2020 GMT
        Subject: C = US, ST = CA, L = Stockton, O = Others, OU = Other Party, CN = others.io, emailAddress = contact@others.io
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                ...
               Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            Netscape Cert Type:
                SSL Server
            Netscape Comment:
                OpenSSL Generated Server Certificate
            X509v3 Subject Key Identifier:
                5D:5A:C5:62:2F:6D:C0:C5:CB:E2:8F:73:3C:BB:CA:16:5B:B2:F8:62
            X509v3 Authority Key Identifier:
                keyid:83:17:15:5E:8B:62:DE:BB:9E:EF:B1:A3:FF:D2:AA:7B:6D:1B:50:CF
                DirName:/C=US/ST=PA/L=Philadelphia/O=Linode/OU=Linode CA/CN=Linode Root CA/emailAddress=ca@linode.com
                serial:10:00

            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Extended Key Usage:
                TLS Web Server Authentication
            X509v3 Subject Alternative Name:
                DNS:www.others.io, DNS:*.others.io
    Signature Algorithm: sha256WithRSAEncryption
        ...
{{< /output >}}

    Some points from the output above:

    -  The `Issuer` refers to intermediate CA, and `Subject` refers to the entity listed in the CSR.

    -  Depending whether you applied `server_cert` or `usr_cert` extension during signing the certificate, the corresponding entry options added are reflected in the output.

    - `CA:FALSE` in `X509v3 Basic Constraints` entry indicated that the certificate cannot be used as CA, thus called *leaf certificate*.

    - `X509v3 Subject Alternative Name` contains SAN entries which are valid for the certificate. Those should match with SAN from the CSR.

8.  Also verify chain of trust. `OK` indicates that certificate trust is valid:

        $ openssl verify -CAfile certs/linode-ca.chain.cert.pem

    {{< output >}}
certs/others.cert.pem: OK
{{< /output >}}

9.  Verify that `index.txt` database contain a line mentioning the certificate, similar to:

    {{< file "~/ca/intermediate/index.txt" txt >}}
V       201204105837Z           1000    unknown /C=US/ST=CA/L=Stockton/O=Others/OU=Other Party/CN=others.io/emailAddress=contact@others.io
{{< /file >}}

## Deploy Certificate

Send the signed certificate and CA chain file back to the requester for deployment to server and client machines.

When deploying certificate, also add CA file to key store of each systems, depending on the application:

1.  To add into system-wide key store (for use by most applications):

       **Debian & Ubuntu**:

       1.  Place CA chain file (`linode-ca.chain.cert.pem`) into key store directory:

            # cp /path/to/linode-ca.chain.cert.pem /usr/share/ca-certificates/linode-ca.crt

       2.  Append to `ca-certificate.conf`:

        {{< file "/etc/ca-certificate.conf" ini >}}
...
linode-ca.crt
{{< /file >}}

       3.  Update the key store:

            # update-ca-certificates

       **CentOS**:

       1.  Place CA chain file into key store source directory:

            # cp /path/to/linode-ca.chain.cert.pem /etc/pki/ca-trust/source/anchors

       2.  Update the key store:

            # update-ca-trust

2.  If you have PHP applications, add certificate key store bundle that is updated from step 1 to PHP configuration:

    {{< file "/etc/php.ini" ini >}}
...
openssl.cafile="/path/to/ca-certificates.crt"
...
{{< /file >}}

3.  Browsers (such as Firefox and Chrome) use their own key store. Please refer to documentation of each browser for instructions to add the trusted CA.

4.  For Java applications, refer to [Java documentation](https://docs.oracle.com/en/java/javase/11/tools/keytool.html) for using `keytool` to import CA certificates.

## To be Continued

From this guide, you had signed certificates using your CA, including certificates with Subject Alternative Name. Over time, you may noticed that the certificates you issued have been abused. Head to [Part 4](/docs/security/ssl/certificate-authority-openssl-crl/) for revoking certificates with Certificate Revoking Lists (CRL) or [Part 5](/docs/security/ssl/certificate-authority-openssl-ocsp/) for revoking with Online Certificate Status Protocol (OCSP).
