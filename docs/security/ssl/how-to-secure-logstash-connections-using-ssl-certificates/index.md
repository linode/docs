---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Secure Logstash input using SSL certificates.'
og_description: 'Secure Logstash input using SSL certificates.'
keywords: ['secure logstash with ssl', 'logstash ssl setup', 'logstash ssl certificate']
tags: ['security','ssl']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-10-15
modified: 2020-10-15
modified_by:
  name: Linode
title: "How to Secure Logstash Input Using SSL Certificates"
h1_title: "Securing Logstash Input Using SSL Certificates"
contributor:
  name: Dan Nielsen
  link: https://github.com/danielsen
external_resources:
 - '[Logstash Home Page](https://www.elastic.co/logstash)'
 - '[Filebeat Overview](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html)'
slug: how-to-secure-logstash-input-using-ssl-certificates
---

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Introduction

**Logstash** is a server-side data processing pipeline that consumes data from a variety of sources, transforms it, and then passes it to storage. This guide focuses on hardening Logstash inputs. Why might you want to harden the pipeline input? [Logstash](https://www.elastic.co/logstash) is often run as internal network service, that is to say it's not available outside of the local network to the broader internet. In those cases, access to the inputs is open and has no restrictions. However, there may be occasions where you need to communicate with a Logstash instance outside your local network. In that situation it's desirable to protect the input traffic using SSL certificates.

This guide explores how an organization certificate authority can be generated to sign server and client certificates used in connection authentication.

{{< note >}}
The commands in this guide are for CentOS systems but can easily be modified for other Linux distributions.
{{< /note >}}

## Install Logstash

If you already have Logstash installed, skip ahead to the [Generate Certificates](#generate-certificates) section.

1.  Install dependencies and import the Elastic GPG key.

        sudo yum install -y java-1.8.0-openjdk-headless epel-release
        sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

1.  Add a configuration file for the Elastic repository at `/etc/yum.repos.d/elastic.repo` using the text editor of your choice:

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

1.  Update and install Logstash:

        sudo yum update
        sudo yum install logstash
        sudo systemctl enable logstash

1.  Add the logstash HTTP plugin. This guide is using the HTTP input plugin as an example, but any plugin that support SSL can be used.

        sudo /usr/share/logstash/bin/logstash-plugin install logstash-input-http

## Generate Certificates

1.  Generate an organization certificate using the following command:

        sudo openssl genrsa -out /etc/pki/tls/private/org_ca.key 2048
        sudo openssl req -x509 -new -nodes -key /etc/pki/tls/private/org_ca.key -sha256 -days 3650 -out /etc/pki/tls/private/org_ca.crt

    This command asks you a few questions.

    {{< output >}}
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
{{</ output >}}

1.  Create a directory for the configuration file for Logstash:

        sudo mkdir -p /etc/pki/tls/conf

1.  In this configuration you need to change the `commonName` configuration line to the server's FQDN or IP address. Create the configuration file, `logstash.conf` in the new directory you created, `/etc/pki/tls/conf`, as shown below, replacing the `X` values with your own.

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

    {{< note >}}
If this Logstash service is available on multiple host names, or if you intend to use this certificate on multiple hosts, those should be added to the `[alt_names]` section. Otherwise, that section can be removed along with the `subjectAltName` line.
{{</ note >}}

1.  Create a signing key and CSR.

        sudo openssl genrsa -out /etc/pki/tls/private/logstash.key 2048
        sudo openssl req -sha512 -new -key /etc/pki/tls/private/logstash.key -out logstash.csr -config /etc/pki/tls/conf/logstash.conf

1.  Change permissions on the folders to allow writing the `org_ca.serial` and `logstash_combined.crt` files.

        sudo chmod g+w /etc/pki/tls/private/
        sudo chmod o+w /etc/pki/tls/certs/

1.  Get the certificate authority serial number.

        sudo openssl x509 -in /etc/pki/tls/private/org_ca.crt -text -noout -serial | tail -1 | cut -d'=' -f2 > /etc/pki/tls/private/org_ca.serial

1.  Create the organizational Logstash certificate.

        sudo openssl x509 -days 3650 -req -sha512 -in logstash.csr -CAserial /etc/pki/tls/private/org_ca.serial -CA /etc/pki/tls/private/org_ca.crt -CAkey /etc/pki/tls/private/org_ca.key -out /etc/pki/tls/certs/org_logstash.crt -extensions v3_req -extfile /etc/pki/tls/conf/logstash.conf

1.  Create the final combined certificate that uses the data in both the `org_logstash.crt` and `org_ca.crt` files. This is the certificate that Logstash presents to identify itself.

        sudo cat /etc/pki/tls/certs/org_logstash.crt /etc/pki/tls/private/org_ca.crt > /etc/pki/tls/certs/logstash_combined.crt

1.  Rename the key to have the `.pem` extension. This is a temporary file used for reformatting.

        sudo mv /etc/pki/tls/private/logstash.key /etc/pki/tls/private/logstash.key.pem

1.  Grant permissions to read the key.

        sudo chmod g+r /etc/pki/tls/private/logstash.key.pem

1.  Format the private key for use in Logstash, writing it back out to `logstash.key` without the .pem extension.

        sudo openssl pkcs8 -in /etc/pki/tls/private/logstash.key.pem -topk8 -nocrypt -out /etc/pki/tls/private/logstash.key

## Configure Logstash

1.  The user `logstash` should already exist. You can reset the password with the passwd command and set it to whatever you desire:

        sudo passwd logstash

1.  Create a Logstash configuration file using the text editor of your choice. Replace the password with the password you set above.

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

1.  Open Logstash HTTP ports on the firewall.

        sudo firewall-cmd --permanent --zone public --add-port 8080/tcp
        sudo firewall-cmd --reload

## Testing

At this point you should be able to run Logstash, push a message, and see the output on the Logstash host. If you're testing from a remote machine, copy the organization CA certificate at `/etc/pki/tls/private/org_ca.crt` to the remote machine for use in verifying the connection.

1.  On the Logstash host:

        sudo /usr/share/logstash/bin/logstash --path.settings /etc/logstash

1.  And on a remote host, replacing the `SuperSeCreT` with the logstash user's password, and `/path/to/org_ca.crt` with the path where your copy of the certificate is located:

        curl --user "logstash:SuperSeCreT" https://<domain_or_ip>:8080 -H "Content-Type: application/json" -d '{"test":"A Log"}' --cacert /path/to/org_ca.crt

## Securing the Connection With Peer Verification

You can stop here and use the setup as is, or proceed to setup peer verification. When using peer verification Logstash requires that incoming connections present their own certificate for verification rather than a username and password. You may find this method easier to script when automatically deploying hosts or applications that push messages to Logstash.

{{< note >}}
The remote client host needs copies of the organization certificate, organization certificate key, and organization certificate serial number to generate its certificate. Make sure to copy those files before proceeding. Alternatively, you can generate the client certificate on the Logstash host and copy that to the client host when complete.
{{< /note >}}

1.  Begin by changing the Logstash configuration file to remove the `username` and `password` fields and add `ssl_verify_mode` and `ssl_certificate_authorities`.

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

1.  Create a client certificate configuration file using the text editor of your choice.

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

1.  Generate the client certificate.

        openssl genrsa -out /etc/pki/tls/private/client.key 2048
        openssl req -sha512 -new -key /etc/pki/tls/private/client.key -out client.csr -config client_crt.conf
        openssl x509 -days 3650 -req -sha512 -in client.csr -CAserial /etc/pki/tls/private/org_ca.serial -CA /etc/pki/tls/private/org_ca.crt -CAkey /etc/pki/tls/private/org_ca.key -out /etc/private/tls/certs/client.crt -extensions v3_req -extensions usr_cert -extfile client_crt.conf
        cat /etc/pki/tls/certs/client.crt /etc/pki/tls/private/org_ca.crt > /etc/pki/tls/certs/client_combined.crt

1.  To test, make sure that Logstash is running with the new configuration and on the client host run the following curl command:

        curl https://<domain_or_ip>:8080 -H "Content-Type: application/json" -d '{"test":"A Log"}' --cacert /etc/pki/tls/private/org_ca.crt --cert /etc/pki/tls/certs/client_combined.crt --key /etc/pki/tls/private/client.key

1.  As before, you should see the submitted message written to `stdout` on the Logstash host.

    {{< caution >}}
Please see the [section on cleaning up](#cleaning-up) to ensure that testing artifacts are
tidied up correctly.
{{< /caution >}}

## Additional Examples

### Filebeat

**Filebeat** is popular log shipper for collecting log events and shipping them to Elasticsearch or Logstash. [Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html) is part of the Elastic software collection. This section of the guide assumes that you're installing Filebeat on a different host than Logstash.

1.  If you have not already installed Filebeat, follow the first steps of the [Install Logstash](#install-logstash) section, including creating the elastic repository configuration file, then install Filebeat.

       yum install filebeat
       systemctl enable filebeat # To enable filebeat on boot

1.  Follow the steps to [create a client certificate](#gen-client-crt) on the Filebeat host.

#### Configure Filebeat

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

1.  On the Logstash host, add a `beats` input to the logstash configuration file using the text editor of your choice.

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

1.  Make sure that port 5044 is open on the Logstash host's firewall.

        firewall-cmd --permanent --zone public --add-port 5044/tcp
        firewall-cmd --reload

1.  Start Logstash and Filebeat.

        # On the logstash host
        systemctl start logstash
        # On the filebeat host
        systemctl start filebeat

Lines written to the files configured in the `filebeat.yml` file now appear in the Logstash pipeline.

## Cleaning Up

If you ran Logstash manually to test but didn't change to the `logstash` user beforehand, there are some file permissions that need to be corrected before running Logstash through `systemd`.

1.  Run the following commands to remove these files:

        rm -f /var/lib/logstash.lock
        chown logstash:logstash /var/lib/logstash/{dead_letter_exchange,queue}

1.  If you used the `http` input for testing, but don't plan on running it in production, don't forget to close the firewall port with the following commands:

        firewall-cmd --permanent --zone public --remove-port 8080/tcp
        firewall-cmd --reload
