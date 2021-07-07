---
author:
  name: Linode
  email: docs@linode.com
description: 'Revoke certificates by CRL'
keywords: ['ssl','tls','certificate authority','certificate revocation lists','crl']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-27
modified: 2019-11-27
modified_by:
  name: Linode
title: "Certificate Authority with OpenSSL - Part 4: Certificate Revocation Lists"
contributor:
  name: Bagas Sanjaya
external_resources:
- '[OpenSSL CA guide by Jamie Nguyen: CRL](https://jamielinux.com/docs/openssl-certificate-authority/certificate-revocation-lists.html)'
- '[OpenSSL Manual Pages (master version)](https://www.openssl.org/docs/manmaster/)'
---

A [Certificate Revocation List (CRL)](https://en.wikipedia.org/wiki/Certificate_revocation_list) is a list of certificates that have been revoked by issuing CA before expiration date. Client applications (such as web browsers) can use CRL to check validity (revocation status) of certificates that are used. Once the certificate have been revoked and added into CRL, clients will issue *invalid certificate* warning.

This guide, on part 4 of our *Certificate Authority with OpenSSL* series, will outline how to revoke certificates that have been signed by your CA by means of CRL. The other way to revoke certificate is using *Online Certificate Status Protocol*, which is explained on [Part 5](/docs/security/ssl/certificate-authority-openssl-ocsp/).

## Before You Begin

1.  You need to get list of certificates which you wish to revoke. This can be done by being contacted by your client who wants to revoke the certificate, or by party that report abuse of your signed certificate.

2.  Switch to CA user:

        # su - linode-ca

## Generate CRL

1.  In order for CRL location to be included into signed certificates, the corresponding configuration entry must be present. Append `crlDistributionPoints` to both `server_cert` and `usr_cert` extension sections of intermediate CA configuration (if you follow Part 4 guide, the configuration files are both `intermediate.cnf` and `intermediate.san.cnf`). Replace with URL you wish to publish the CRL:

    {{< file "~/ca/intermediate/config/intermediate.cnf" ini >}}
...
[ usr_cert ]
...
crlDistributionPoints = URI:http://ca.linode.com/linode-ca.crl.pem

...
[ server_cert ]
crlDistributionPoints = URI:http://ca.linode.com/linode-ca.crl.pem

...
{{< /file >}}

2.  Generate the CRL file based on `index.txt` database. Give the validity of a day (because CRL is often updated with new certificate revocation):

        $ cd ~/ca/intermediate
        $ openssl ca -gencrl -crldays 1 -config config/intermediate.cnf -out crl/linode-ca.crl.pem

3.  Check CRL contents by:

        $ openssl crl -noout -text -in crl/linode-ca.crl.pem

    Since no certificates are revoked yet, the output should contain `No Revoked Certificates`.

    {{< note >}}
Ideally, CRL should be generated shortly after revoking a certificate, in order for revocation to take effect.
{{< /note >}}

    {{< note >}}
All certificates that had been signed prior to creating first CRL don't have CRL information embedded. You need to revoke and re-sign them to embed it.
{{< /note >}}

## Revoke Certificate

1.  Create new directory to store revoked certificates:

        $ mkdir certs/revoked

2.  Place certificates that are about to be revoked in directory above. Replace with actual certificate file name:

        $ mv certs/test-crl.cert.pem certs/revoked/

3.  Revoke the certificate:

    {{< note >}}
You can optionally add `-crl_reason` argument to specify revocation reason. Refer to `ca(1ssl)` manual page for list of supported reasons.
{{< /note >}}

        $ openssl ca -config config/intermediate.cnf -revoke certs/revoked/test-crl.cert.pem

    {{< output >}}
Using configuration from config/intermediate.cnf
Enter pass phrase for /home/linode-ca/ca/intermediate/private/linode-ca-intermediate.key.pem: phrase
Revoking Certificate 1001.
Data Base Updated
{{< /output >}}

4.  [Regenerate the CRL](#generate-crl).

5.  **Verify** the contents of CRL by:

        $ openssl crl -noout -text -in crl/linode-ca.crl.pem

    The CRL now contains list of revoked certificates, like:

    {{< output >}}
...
Revoked Certificates:
    Serial Number: 1001
        Revocation Date: Nov 28 11:52:44 2019 GMT
...
{{< /output >}}

6.  Also verify that `index.txt` database contains entry for revoked certificate, which prefixed with `R`:

    {{< file "~/ca/intermediate/index.txt" >}}
...
R       200306102615Z   191128115244Z   1001    unknown /C=US/ST=CA/L=Riverside/O=Test/OU=Test/CN=Test Certificate for CRL/emailAddress=test@test.io
...
{{< /file >}}
