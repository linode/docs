---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Secure logstash input using SSL certificates.'
og_description: 'Secure logstash input using SSL certificates.'
keywords: ['logstash', 'logging', 'SSL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-08
modified_by:
  name: Linode
title: "Secure logstash input using SSL certificates."
h1_title: "Secure logstash input using SSL certificates."
contributor:
  name: Dan Nielsen
  link: https://github.com/danielsen
external_resources:
 - '[Logstash Home Page](https://www.elastic.co/logstash)'
 - '[Filebeat Overview](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html)'
---

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Introduction

**Logstash** is a server-side data processing pipeline that consumes data from a variety of sources, transforms it, and then passes it to storage. This guide will focus on hardening logstash inputs. Why might you want to harden the pipeline input? Logstash is often run as internal network service, that is to say it's not available outside of the local network to the broader internet. In those cases, access to the inputs is open and has no restrictions. However, there may be occasions in which you need to communicate with a logstash instance outside your local network. In that situation it's desirable to protect the input traffic using SSL certificates.

This guide will explore how an organization certificate authority can be generated to sign server and client certificates used in connection authentication.

{{< note >}}
The commands in this guide are for CentOS systems but can easily be modified for other Linux distributions.
{{< /note >}}

## Install Logstash <a name="install-logstash"></a>

Install dependencies and import the Elastic GPG key. If you already have Logstash installed, skip ahead to the [Generate Certificates](#generate-certificates) section.

        yum install -y java-1.8.0-openjdk-headless epel-release
        rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

Add a configuration file for the Elastic repository at `/etc/yum.repos.d/elastic.repo`

{{< file "/etc/yum.repos.d/elastic.repo" conf >}}
[elasticsearch-7.x]
name=Elastic repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
{{< /file >}}

Update and install Logstash

        yum update
        yum install logstash
        systemctl enable logstash

Add the logstash HTTP plugin. This guide is using the HTTP input plugin as an example but any plugin that support SSL can be used.

        /usr/share/logstash/bin/logstash-plugin install logstash-input-http

## Generate Certificates<a name="generate-certificates"></a>

Generate an organization certificate

        openssl genrsa -out /etc/pki/tls/private/org_ca.key 2048
        openssl req -x509 -new -nodes -key /etc/pki/tls/private/org_ca.key -sha256 -days 3650 -out /etc/pki/tls/private/org_ca.crt

Create a certificate configuration file for logstash

        mkdir -p /etc/pki/tls/conf

In this configuration you'll want to change the `commonName` configuration line to the server's FQDN or IP address. If this logstash service will be available on multiple host names or if you intend to use this certificate on multiple hosts, those should be added to the `[alt_names]` section, otherwise that section can be removed along with the `subjectAltName` line.

{{< file "/etc/pki/tls/conf/logstash.conf" conf >}}
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
countryName                     = XX
stateOrProvinceName             = XXXXXX
localityName                    = XXXXXX
postalCode                      = XXXXXX
organizationName                = XXXXXX
organizationalUnitName          = XXXXXX
commonName                      = XXXXXX
emailAddress                    = XXXXXX

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = DOMAIN_1
DNS.2 = DOMAIN_2
DNS.3 = DOMAIN_3
DNS.4 = DOMAIN_4
{{< /file >}}

Create a signing key and CSR.

        openssl genrsa -out /etc/pki/tls/private/logstash.key 2048
        openssl req -sha512 -new -key /etc/pki/tls/private/logstash.key -out logstash.csr -config /etc/pki/tls/conf/logstash.conf

Get the certificate authority serial number.

        openssl x509 -in /etc/pki/tls/private/org_ca.crt -text -noout -serial | tail -1 | cut -d'=' -f2 > /etc/pki/tls/private/org_ca.serial

Create the logstash certificate. This is the certificate that's logstash will present to identify itself.

        openssl x509 -days 3650 -req -sha512 -in logstash.csr -CAserial /etc/pki/tls/private/org_ca.serial -CA /etc/pki/tls/private/org_ca.crt -CAkey /etc/pki/tls/private/org_ca.key -out /etc/pki/tls/certs/org_logstash.crt -extensions v3_req -extfile /etc/pki/tls/conf/logstash.conf
        cat /etc/pki/tls/certs/logstash.crt /etc/pki/tls/private/org_ca.crt > /etc/pki/tls/certs/logstash_combined.crt

Format the private key for use in logstash.

        mv /etc/pki/tls/private/logstash.key /etc/pki/tls/private/logstash.key.pem && \
            openssl pkcs8 -in /etc/pki/tls/private/logstash.key.pem -topk8 -nocrypt -out /etc/pki/tls/private/logstash.key

## Configure Logstash

Create a logstash configuration file.

{{< file "/etc/logstash/conf.d/logstash.conf" conf >}}
input {
    http {
        password => "SuperSeCreT"
        user => "logstash"
        ssl => true
        ssl_certificate => "/etc/pki/tls/certs/logstash_combined.crt"
        ssl_key => "/etc/pki/tls/private/logstash.key"
    }
}
output {
    stdout {
        codec => rubydebug
    }
}
{{< /file >}}

Open logstash HTTP ports on the firewall.

        firewall-cmd --permanent --zone public --add-port 8080/tcp
        firewall-cmd --reload

## Testing

At this point you should be able to run logstash, push a message, and see the output on the logstash host. If you're testing from a remote machine, copy the organization CA certificate at `/etc/pki/tls/private/org_ca.crt` to the remote machine for use in verifying the connection.

One the logstash host:

        su logstash
        /usr/share/logstash/bin/logstash --path.settings /etc/logstash

And on a remote host:

        curl --user "logstash:SuperSeCreT" https://<domain_or_ip>:8080 -H "Content-Type: application/json" -d '{"test":"A Log"}' --cacert /path/to/org_ca.crt


## Securing the Connection With Peer Verification

You can stop here and use the setup as is, or proceed to setup peer verification. When using peer verification logstash will require that incoming connections present their own certificate for verification rather than a username and password. You may find this method easier to script when automatically deploying hosts or applications that push messages to logstash.

{{< note >}}
The remote client host will need copies of the organization certificate, organization certificate key, and organization certificate serial number to generate it's certificate. Make sure to copy those files before proceeding. Alternatively, you can generate the client certificate on the logstash host and copy that to the client host when complete.
{{< /note >}}

Begin by changing the logstash configuration file to remove the `username` and `password` fields and add `ssl_verify_mode` and `ssl_certificate_authorities`.

{{< file "/etc/logstash/conf.d/logstash.conf" conf >}}
input {
    http {
        ssl => true
        ssl_certificate => "/etc/pki/tls/certs/logstash_combined.crt"
        ssl_certificate_authorities = ["/etc/pki/tls/private/org_ca.crt"]
        ssl_key => "/etc/pki/tls/private/logstash.key"
        ssl_verify_mode => "force_peer"
    }
}
output {
    stdout {
        codec => rubydebug
    }
}
{{< /file >}}

Create a client certificate config file.<a name="gen-client-crt"></a>

{{< file "/etc/pki/tls/conf/client_crt.conf" conf >}}
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
countryName                     = XX
stateOrProvinceName             = XXXXXX
localityName                    = XXXXXX
organizationName                = XXXXXX
organizationalUnitName          = XXXXXX
commonName                      = XXXXXX
emailAddress                    = XXXXXX

[ usr_cert ]
# Extensions for server certificates (`man x509v3_config`).
basicConstraints = CA:FALSE
nsCertType = client, server
nsComment = "OpenSSL Server / Client Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment, keyAgreement, nonRepudiation
extendedKeyUsage = serverAuth, clientAuth

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth, clientAuth
{{< /file >}}

Generate the client certificate.

        openssl genrsa -out /etc/pki/tls/private/client.key 2048
        openssl req -sha512 -new -key /etc/pki/tls/private/client.key -out client.csr -config client_crt.conf
        openssl x509 -days 3650 -req -sha512 -in client.csr -CAserial /etc/pki/tls/private/org_ca.serial -CA /etc/pki/tls/private/org_ca.crt -CAkey /etc/pki/tls/private/org_ca.key -out /etc/private/tls/certs/client.crt -extensions v3_req -extensions usr_cert -extfile client_crt.conf
        cat /etc/pki/tls/certs/client.crt /etc/pki/tls/private/org_ca.crt > /etc/pki/tls/certs/client_combined.crt

To test, make sure that logstash is running with the new config and on the client host run:

        curl https://<domain_or_ip>:8080 -H "Content-Type: application/json" -d '{"test":"A Log"}' --cacert /etc/pki/tls/private/org_ca.crt --cert /etc/pki/tls/certs/client_combined.crt --key /etc/pki/tls/private/client.key

As before you should see the submitted message written to `stdout` on the logstash host.

{{< caution >}}
Please see the [section on cleaning up](#cleaning-up) to ensure that testing artifacts are
tidied up correctly.
{{< /caution >}}

## Additional Examples

### Filebeat

**Filebeat** is popular log shipper for collecting log events and shipping them to Elasticsearch or Logstash. [Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html) is part of the Elastic software collection. This section of the guide assumes that you're installing Filebeat on a different host than Logstash.

If you have not already installed Filebeat, follow the first steps of the [Install Logstash](#install-logstash) section including creating the elastic repository configuration file then install Filebeat.

       yum install filebeat
       systemctl enable filebeat # To enable filebeat on boot

Follow the steps to [create a client certificate](#gen-client-crt) on the Filebeat host.

Configure Filebeat

{{< file "/etc/filebeat/filebeat.yml" conf >}}
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /path/to/a.log
output.logstash:
  hosts: ["<domain_or_ip>:5044"]
  ssl:
    certificate_authorities: ["/etc/pki/tls/private/org_ca.crt"]
    certificate: "/etc/pki/tls/certs/client_combined.crt"
    key: "/etc/pki/tls/private/client.key
{{< /file >}}

On the Logstash host add a `beats` input to the logstash config file.

{{< file "/etc/logstash/conf.d/logstash.conf" conf >}}
input {
    beats {
        port => 5044
        ssl => true
        ssl_certificate => "/etc/pki/tls/certs/logstash_combined.crt"
        ssl_certificate_authorities = ["/etc/pki/tls/private/org_ca.crt"]
        ssl_key => "/etc/pki/tls/private/logstash.key"
        ssl_verify_mode => "force_peer"
    }
}
output {
    stdout {
        codec => rubydebug
    }
}
{{< /file >}}

Make sure that port 5044 is open on the Logstash host's firewall.

        firewall-cmd --permanent --zone public --add-port 5044/tcp
        firewall-cmd --reload

Start Logstash and Filebeat

        # On the logstash host
        systemctl start logstash
        # On the filebeat host
        systemctl start filebeat

Lines written to the files configured in the `filebeat.yml` file will now appear in the Logstash pipeline.

## Cleaning Up <a name="cleaning-up"></a>

If you ran Logstash manually to test and didn't change to the `logstash` user beforehand there are some file permissions that need to be corrected before running Logstash through `systemd`.

        rm -f /var/lib/logstash.lock
        chown logstash:logstash /var/lib/logstash/{dead_letter_exchange,queue}

If you used the `http` input for testing but don't plan on running it in production don't forget to close the firewall port.

        firewall-cmd --permanent --zone public --remove-port 8080/tcp
        firewall-cmd --reload
