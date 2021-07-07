---
author:
  name: Linode
  email: docs@linode.com
description: 'Revoke certificates with Online Certificate Status Protocol.'
keywords: ['ssl', 'tls', 'certificate authority', 'online certificate status protocol', 'ocsp']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-12-04
modified: 2019-12-04
modified_by:
  name: Linode
title: "Certificate Authority with OpenSSL - Part 5: Online Certificate Status Protocol"
contributor:
  name: Bagas Sanjaya
external_resources:
  - '[OpenSSL CA guide by Jamie Nguyen: OCSP](https://jamielinux.com/docs/openssl-certificate-authority/online-certificate-status-protocol.html)'
  - '[OpenSSL Manual Pages (master version)](https://www.openssl.org/docs/manmaster/)'
---

[Online Certificate Status Protocol (OCSP)](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol) is an Internet protocol used for obtaining validity status of certificate. It was created as an alternative to CRL.

When client applications (such as web browser) try to validate the certificate, a query will be sent to OCSP server (responder) which its address is specified in the certificate. The responder then listen to the query and return the status of certificate.

This guide is the final part of *Certificate Authority with OpenSSL* series. Here we will generate OCSP pair for use on built-in responder by OpenSSL, then revoke the certificate to see OCSP in action.

## Before You Begin

-  As in [Part 4 (CRL)](/docs/security/ssl/certificate-authority-openssl-crl/), you need list of certificates which will be revoked, which can be obtained from your client who wants to revoke the certificated, or being informed by third-party that reports certificate abuse.

-  Switch to CA user:

        # su - linode-ca

## Generate OCSP Pair

The OCSP responder requires separate pair for signing responses to requesting clients, and it must be signed by same CA that also sign the being checked certificate.

1.  In order to use OCSP, the responder URI must be encoded into certificates signed by CA. Append `authorityInfoAccess` directive to both `server_cert` and `usr_cert` extension section of intermediate CA configuration (both `intermediate.cnf` and `intermediate.san.cnf`). Replace with domain you wish to serve the responder:

    {{< file "~/ca/intermediate/config/intermediate.cnf" ini >}}
...
[ usr_cert ]
...
authorityInfoAccess = OCSP;URI:http://ocsp.ca.linode.com

...
[ server_cert ]
...
authorityInfoAccess = OCSP;URI:http://ocsp.ca.linode.com

...
{{< /file >}}

2.  Generate 4096-bit RSA private key, encrypted with AES-256 algorithm and a pass phrase. Replace `phrase` with your chosen strong pass phrase:

        $ cd ~/ca/intermediate
        $ openssl genrsa -aes256 -out private/linode-ca-ocsp.key.pem 4096

    {{< output >}}
Generating RSA private key, 4096 bit long modulus (2 primes)
..........................................................................................................................................................++++
................................................................................................................................................................................................................................................................................................++++
e is 65537 (0x010001)
Enter pass phrase for private/linode-ca-ocsp.key.pem: phrase
Verifying - Enter pass phrase for private/linode-ca-ocsp.key.pem: phrase
{{< /output >}}

3.  Create the CSR request. Replace with DN information of your CA:

    {{< caution >}}
The DN should match the signing CA, but `Common Name` must be fully-qualified domain (FQDN) for OCSP responder.
{{< /caution >}}

        $ openssl req -new -sha 256 -config config/intermediate.cnf -key private/linode-ca-ocsp.key.pem -out csr/linode-ca-ocsp.csr.pem

    {{< output >}}
Enter pass phrase for private/linode-ca-ocsp.key.pem: phrase
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
Common Name []:ocsp.ca.linode.com
Email Address []:ca@linode.com
{{< /output >}}

4.  Use intermediate CA to sign CSR of OCSP responder. Apply `ocsp` extension and give validity period of a year plus few days:

        $ openssl ca -config config/intermediate.cnf -extensions ocsp -days 375 -notext -md sha256 -in csr/linode-ca-ocsp.csr.pem -out certs/linode-ca-ocsp.cert.pem

    {{< output >}}
Using configuration from config/intermediate.cnf
Enter pass phrase for /home/linode-ca/ca/intermediate/private/linode-ca-intermediate.key.pem: phrase
...
Sign the certificate? [y/n]:y
1 out of 1 certificate requests certified, commit? [y/n]y
Write out database with 1 new entries
Data Base Updated
{{< /output >}}

5.  **Verify** that the OCSP responder certificate has proper extension applied:

        $ openssl x509 -noout -text -in certs/linode-ca-ocsp.cert.pem

    The output should contain `OCSP Signing` extended key usage:

    {{< output >}}
...
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            X509v3 Subject Key Identifier:
                77:AF:19:28:A6:DA:64:FD:B1:27:F8:C9:08:CE:37:5F:F5:9F:F8:D9
            X509v3 Authority Key Identifier:
                keyid:83:17:15:5E:8B:62:DE:BB:9E:EF:B1:A3:FF:D2:AA:7B:6D:1B:50:CF

            X509v3 Key Usage: critical
                Digital Signature
            X509v3 Extended Key Usage: critical
                OCSP Signing
...
{{< /output >}}

    {{< note >}}
All certificates that have been signed prior to this point (signing OCSP certificate) don't have OCSP information embedded. You need to revoke and re-sign them to include it.
{{< /note >}}

## Run the Responder and Revoke Certificate

1.  Create directory to store revoked certificates:

        $ mkdir certs/revoked

2.  Place certificate that is about to be revoked into revoked directory, replace `test-ocsp.cert.pem` with actual certificate file name:

        $ mv certs/test-ocsp.cert.pem certs/revoked

3.  Run the responder on `localhost` with arbitrary port (here we choose 2560). Use chained file of intermediate CA, and specify the OCSP pair for response signage. Instead of storing to CRL, the OCSP responder directly reads `index.txt` database. For security reasons, limit request count to only one per responder invocation:

    {{< caution >}}
Order of arguments passed to `ocsp` are important. See `ocsp(1ssl)` manual page for full, proper syntax.
{{< /caution >}}

        $ openssl ocsp -port 2560 -index index.txt -CA certs/linode-ca.chain.cert.pem -rkey private/linode-ca-ocsp.key.pem -rsigner certs/linode-ca-ocsp.cert.pem -nrequest 1

4.  On the other terminal session, send query to the responder at `localhost`. `-issuer` option points to intermediate CA certificate (not the bundle), while `-cert` specify the certificate which will be queried. Hash the response with SHA-256 algorithm:

        $ openssl ocsp -resp_text -url http://127.0.0.1:2560 -CAfile certs/linode-ca.chain.cert.pem -issuer certs/linode-ca-intermediate.cert.pem -sha256 -cert certs/revoked/test-ocsp.cert.pem

    The output will look like:

    {{< output >}}
OCSP Response Data:
    OCSP Response Status: successful (0x0)
    Response Type: Basic OCSP Response
    Version: 1 (0x0)
    Responder Id: C = US, ST = PA, L = Philadelphia, O = Linode, OU = Linode CA, CN = ocsp.ca.linode.com, emailAddress = ca@linode.com
    Produced At: Dec  2 10:54:02 2019 GMT
    Responses:
    Certificate ID:
      Hash Algorithm: sha256
      Issuer Name Hash: 3F1F9F8697CC6358598009B2CF50B299272C91CBC77AD5FF8FE7F57491810EDC
      Issuer Key Hash: 41F10858B1527EBE6FBF7120E52708EBDD01D91B9CE9CE99C12F58438DF57E25
      Serial Number: 1003
    Cert Status: good
    This Update: Dec  2 10:54:02 2019 GMT

    Response Extensions:
        OCSP Nonce:
            0410EBC4B322DBAD52F75FC2C2996D9F3648
    Signature Algorithm: sha256WithRSAEncryption
    ...
Response verify OK
certs/revoked/test-ocsp.cert.pem: good
        This Update: Dec  2 10:54:02 2019 GMT
{{< /output >}}

    Note from the output:

    -  `OCSP Response Status` of `successful` indicates that the response have been successfully received.
    -  `Responder ID` refers to DN information of OCSP certificate.
    -  `Cert Status` determines revocation status of queried certificate. Since it haven't been revoke yet, the output would be `good`.
    -  `Certificate ID`  refers to the queried certificate and its issuer. Note that `Issuer Name Hash` and `Issuer Key Hash` will be different than those displayed here depending on your CA and creation time of certificates.

5.  Now revoke the certificate:

    {{< note >}}
You can optionally specify revocation reason with `-crl_reason`. Refer to `ca(1ssl)` manual page for supported reasons.
{{< /note >}}

        $ openssl ca -config config/intermediate.cnf -revoke certs/revoked/test-ocsp.cert.pem

    {{< output >}}
Using configuration from config/intermediate.cnf
Enter pass phrase for /home/linode-ca/ca/intermediate/private/linode-ca-intermediate.key.pem: phrase
Revoking Certificate 1003.
Data Base Updated
{{< /output >}}

6.  Re-run step 3 and 4. The output now reflect the revoked status of certificate with its `Revocation Time`:

    {{< output >}}
OCSP Response Data:
    OCSP Response Status: successful (0x0)
    Response Type: Basic OCSP Response
    Version: 1 (0x0)
    Responder Id: C = US, ST = PA, L = Philadelphia, O = Linode, OU = Linode CA, CN = ocsp.ca.linode.com, emailAddress = ca@linode.com
    Produced At: Dec  3 08:50:36 2019 GMT
    Responses:
    Certificate ID:
      Hash Algorithm: sha256
      Issuer Name Hash: 3F1F9F8697CC6358598009B2CF50B299272C91CBC77AD5FF8FE7F57491810EDC
      Issuer Key Hash: 41F10858B1527EBE6FBF7120E52708EBDD01D91B9CE9CE99C12F58438DF57E25
      Serial Number: 1003
    Cert Status: revoked
    Revocation Time: Dec  3 08:40:49 2019 GMT
    This Update: Dec  3 08:50:36 2019 GMT

    Response Extensions:
        OCSP Nonce:
            04104F0AC4B0E13F5F31E2569250CA9810B9
    Signature Algorithm: sha256WithRSAEncryption
    ...
Response verify OK
certs/revoked/test-ocsp.cert.pem: revoked
        This Update: Dec  3 08:50:36 2019 GMT
        Revocation Time: Dec  3 08:40:49 2019 GMT
{{< /output >}}

## Conclusion

This concludes *Certificate Authority with OpenSSL* series. You should now run and manage your own CA with OpenSSL tools. Those tools are basic and minimal, however. If you need polished, production ready certificate system, have a look at [Dogtag](https://www.dogtagpki.org).
