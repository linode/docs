---
author:
  name: Joel Kruger
  email: jkruger@linode.com
description: 'Forcing all connections to use SSL with NodeBalancers.'
keywords: 'Linode,NodeBalancer,SSL,redirect'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, August 31st, 2015
modified_by:
  name: Joel Kruger
published: Monday, August 31st, 2015
title: Forcing SSL connections with Nodebalancers
---

The following guide will help you  obtain a valid, commercially signed SSL certificate, and install it on your NodeBalancer. This guide provides step-by-step instructions for configuring a NodeBalancer to redirect all web connections, using SSL, over port 443/HTTPS. Instructions will be provided to configure this with both the Apache and Nginx servers on Debian and Redhat based distributions.


{: .note }
> 
> Throughout this guide we will offer several suggested values for specific configuration settings, some of these values will be set by default. These settings are shown in the guide as a reference and you may need to modify them to suit your application accordingly.

## Prerequisites

- When first configuring back-end Linodes, you should set them up according to the instructions in our [Getting Started](/docs/getting-started) guide. In addition, we recommend that you implement security precautions. For assistance with this, please see our documentation: [Securing Your Server](https://linode.com/docs/security/securing-your-server)

- This guide assumes that you have already deployed two or more back-end Linodes and configured them with either a LAMP stack or a LEMP stack. If you have not, please review the following documentation for assistance with configuring your respective stack:

    - [LAMP Stack](/docs/websites/lamp/)
    - [LEMP Stack](/docs/websites/lemp/)

- In addition, this guide assumes that you have already deployed a NodeBalancer and have configured it with two or more back-end Linodes that make connections on port 80/HTTP. We recommend that you first verify that your NodeBalancer is configured correctly, prior to introducing the complexities of an encrypted connection over SSL. If you would like assistance with setting up a basic NodeBalancer configuration, please review the following documentation:

   - [Getting Started with NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers)
   - [NodeBalancer Reference Guide](/docs/platform/nodebalancer/nodebalancer-reference-guide)

    {: .note}
> This guide has been written with the assumption that you are logged in as the root user and that you will not need to prepend commands with ``sudo``.

## Install OpenSSL

1.  Issue the following commands to update the system and install the required packages for OpenSSL.

    Debian/Ubuntu users:

        apt-get update
        apt-get upgrade
        apt-get install openssl
        mkdir /etc/ssl/localcerts

    CentOS/Fedora users:

        yum install openssl
        mkdir /etc/ssl/localcerts

## Create a Certificate Signing Request (CSR)

1.  Issue the following commands to generate a CSR for the domain that you would like to configure with SSL. Be sure to change `www.example.com` to reflect the fully qualified domain name (subdomain.domainname.com) of the site you'll be using SSL with. Leave the challenge password blank. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial certificate authority (CA).

        cd /etc/ssl/localcerts

        openssl req -new -newkey rsa:2048 -nodes -days 365 -keyout www.example.com.key -out www.example.com.csr


    The following are the values we entered for our example certificate. Note that you can ignore the extra attributes.

        Generating a 2048 bit RSA private key
        ......................................................++++++
        ....++++++
        writing new private key to 'www.mydomain.com.key'
        -----
        You are about to be asked to enter information that will be incorporated
        into your certificate request.
        What you are about to enter is what is called a Distinguished Name or a DN.
        While many fields await input, you can leave some blank.
        For some fields there will be a default value.
        If you enter '.', the selected field will be left blank.
        -----
        Country name (2 letter code) [AU]: US
        State or Province name (full name) [Some-State]: New Jersey
        Locality name (eg, city) []: Absecon
        Organization name (eg, company) [Internet Widgits Pty Ltd]: MyDomain, LLC
        Organizational unit name (eg, section) []: Web Services
        Common name (eg, YOUR name) []: www.example.com
        Email address []: support@mydomain.com

        Please enter the following 'extra' attributes
        that will be sent with your certificate request:
        A challenge password []:
        An optional company name []:




2.  A `certificate signing request` file, ending with `.csr`, will be generated and placed in `/etc/ssl/localcerts`. An example of what this file will look like can be found below (yours will be unique):

        -----BEGIN CERTIFICATE REQUEST-----
        MIICpDCCAYwCAQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUx
        ITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDCCASIwDQYJKoZIhvcN
        AQEBBQADggEPADCCAQoCggEBAOGpH/RP26JljSy1Dbt/R6zU5V/cWQd8CMKwzUba
        ................................................................
        kaYVdWJ5+BXNe5AQursBYcXoo1/cl4aSbVV2XxRtNWZmpuvNCtt0iAvWyQypTNp0
        7+eFgy625DXD7n3pScFDPb/RXaawku1EB+vpG1lpwhr+bU+8mtqa/wEPC2IVzNba
        lEObO2p9I7nZZpPXc05KA+034Rc4JFoABq0j2HuxlF2tL/U/EqjWB5ksOy96c7BL
        hofUVA2XXBs=
        -----END CERTIFICATE REQUEST-----

3.  In addition, a key file ending with `.key`, will be generated and placed in `/etc/ssl/localcerts`. Execute the following command to protect the key:

        chmod 400 /etc/ssl/localcerts/www.mydomain.com.key 

    An example of what this file will look like can be found below (yours will be unique):

        -----BEGIN PRIVATE KEY-----
        MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhqR/0T9uiZY0s
        tQ27f0es1OVf3FkHfAjCsM1G2uMtGadRAFQN7lsa+W0W0tzfeJGSk4tqDanOPeJU
        3jm/Udxy18DSl2xYKhJAF8YL50UPN6Yih1p+XPIEBqKjAEn+p7BgH/R7vehZQh+z
        ................................................................
        ZegL7vs+//1jBJy3h/dcFNl7Pgiv7UlsxXhFw7aZAoGATUW7pWP1osmMFTshW6xo
        qSdRwPnDjilI9r9SEEwlcssGIYReIUfRuXnaaPLudKDeZ3GZ0kjXfbsWFOnwLyAE
        pNaMF47bTIFES5Ytqhp4rEYe5Hxn2VePrGJp/j7tAIzTXeV3IC6ICkEueKpKS2Dl
        xHtX/Rl40JHhTCiGK5eIR3E=
        -----END PRIVATE KEY----

### Submit your CSR to a Certificate Authority

1.  You may now submit the contents of this file to a commercial SSL provider (Certificate Authority) for signing. Typically, they will provide you with a field to paste the contents of your CSR file into, somewhere on their website. The following is a list of well known commercial SSL vendors, provided for your convenience:

    - [Verisign](https://www.verisign.com/)
    - [Thawte](https://www.thawte.com/)
    - [Globalsign](https://www.globalsign.com/en/)
    - [Comodo](https://www.comodo.com/)

      {:.note}
     > 
     > There are many vendors, including some listed above, that provide free SSL certificates. However, free SSL certificates typically have shorter expiration dates and less features.

2.  Once this request has been submitted, you will receive a commercially signed SSL certificate file, which will look similar to the following (yours will be unique):

        -----BEGIN CERTIFICATE-----
        MIIFSzCCBDOgAwIBAgIQVjCXC0bF9U8FypJOnL9cuDANBgkqhkiG9w0BAQsFADCB
        kDELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4G
        A1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxNjA0BgNV
        ................................................................
        RWieiEDSZqbtZRPBaGooDJ5QbdHqUanvoVzf1aB1S5RrJB5qH/UG6WbTZ07rFfsn
        age7UPo4ZwheAtpO2mhcYypBG1zln4cvxVBAcrnaa1GWwKjgwXUr5k2Pv7BXWEex
        ncHG3hwHHwhiEz6ukC2mqxA+D3KILiywgHgWcumnpeCEUQgDzy0Fz2Ip/kR/1Fkv
        DCQzME2NkT1ZdW8fdz+Y
        -----END CERTIFICATE-----

3.  Save this file as `/etc/ssl/localcerts/www.mydomain.com.crt`. Restrict permissions on file:

        chmod 400 /etc/ssl/localcerts/www.mydomain.com.crt

### Preparing a Chained SSL Certificate

1.  In some cases, CAs have not submitted a Trusted Root CA Certificate to some or all browser vendors. As a result of this, an end-user will need to *chain* his roots for certificates to be trusted by web browsers. If you receive several files from your CA ending with `.crt`(collectively referred to as a `chained SSL certificate`), they must be linked into one file, in a specific order, to provide full support with most browsers. The following example uses a chained SSL certificate that was signed by Comodo (other vendors are reputable as well). Enter the following command to prepare your chained SSL certificate:

        cat example_com.crt COMODORSADomainValidationSecureServerCA.crt  COMODORSAAddTrustCA.crt AddTrustExternalCARoot.crt > www.mydomain.com.crt 

    The contents of the resulting file will appear similar to the following (yours will be unique):

        -----BEGIN CERTIFICATE-----
        MIIFSzCCBDOgAwIBAgIQVjCXC0bF9U8FypJOnL9cuDANBgkqhkiG9w0BAQsFADCB
        ................................................................
        ncHG3hwHHwhiEz6ukC2mqxA+D3KILiywgHgWcumnpeCEUQgDzy0Fz2Ip/kR/1Fkv
        DCQzME2NkT1ZdW8fdz+Y
        -----END CERTIFICATE-----
        -----BEGIN CERTIFICATE-----
        MIIGCDCCA/CgAwIBAgIQKy5u6tl1NmwUim7bo3yMBzANBgkqhkiG9w0BAQwFADCB
        ................................................................
        j4rBYKEMrltDR5FL1ZoXX/nUh8HCjLfn4g8wGTeGrODcQgPmlKidrv0PJFGUzpII
        -----END CERTIFICATE-----
        -----BEGIN CERTIFICATE-----
        ZFRydXN0IEV4dGVybmFsIFRUUCBOZXR3b3JrMSIwIAYDVQQDExlBZGRUcnVzdCBF
        ................................................................
        Uspzgb8c8+a4bmYRBbMelC1/kZWSWfFMzqORcUx8Rww7Cxn2obFshj5cqsQugsv5
        -----END CERTIFICATE-----
        -----BEGIN CERTIFICATE-----
        MIIENjCCAx6gAwIBAgIBATANBgkqhkiG9w0BAQUFADBvMQswCQYDVQQGEwJTRTEU
        ................................................................
        6wwCURQtjr0W4MHfRnXnJK3s9EK0hZNwEGe6nQY1ShjTK3rMUUKhemPR5ruhxSvC
        -----END CERTIFICATE-----


    The chart below breaks this down a bit more clearly:

    {: .table .table-striped }
    | Certificate Type:          | Issued to:                              | Issued by:                              |
    |----------------------------|:----------------------------------------|:----------------------------------------|
    | End-user Certificate       | example.com                             | Comodo LLC                              |
    | Intermediate Certificate 1 | Comodo LLC                              | COMODORSADomainValidationSecureServerCA |
    | Intermediate Certificate 2 | COMODORSADomainValidationSecureServerCA | COMODORSAAddTrustCA                     |
    | Root certificate           | COMODORSAAddTrustCA                     | AddTrustExternalCARoot                  |



2.  Restrict permissions on the chained certificate file:

        chmod 400 /etc/ssl/localcerts/www.mydomain.com.crt


    {: .note }
    > 
    > We recommend saving all of your `.crt` and `.key` files in an offsite location, optionally in a password protected archive.

## Installing the SSL Certificate and Private Key on your NodeBalancer

### Create a configuration profile for Port 443 on your Nodebalancer


### Certificate and Private Key

1.  Go to your NodeBalancer's configuration page. If you select the HTTPS protocol, the **Certificate** and **Private Key** fields will appear.

    [![The NodeBalancer SSL Certificate Fields.](/docs/assets/nodebalancer-ssl-cert.png)](/docs/assets/nodebalancer-ssl-cert.png)

2.  Copy the contents of your SSL certificate into the **Certificate** field. If you have linked multiple segments of a chained certificate, be sure to copy all of its contents into the text field, appearing one after another.

3.  Copy your unpassphrased private key into the **Private Key** field.

4.  On your NodeBalancer `Configurations` page, select `Create Configuration` to configure each port/protocol that you would like to use, i.e. `80` and `443`.

5.  Under `Edit Configuration,`  Once selected, fill out the values in the fields as shown below:
 
    - **Port**                    443
    - **Protocol**                HTTPS
    - **Algorithm**               Round Robin
    - **Session Stickiness**      None
    - **Certificate**             < Insert your signed SSL Certificate >
    - **Private Key**             < Insert your Private Key >
    - **Health Check Type**       HTTP Valid Status
    - **Check Interval**          5
    - **Check Timeout**           3
    - **Check Attempts**          2
    - **Check HTTP Path**         /

    Then, select **`Save Changes`**. 

6.  Add as many nodes as you require for the port configuration by selecting **`Add Node`**. Once selected, fill out the values in the fields, like so:

    - **Label**                   < Backend Linode 1 >
    - **Address**                 < xxx.xxx.xxx.xxx:80 >
    - **Weight**                  100
    - **Mode**                    Accept

    {: .note }
    > 
    > In the section labelled **`Address`**,  you will need to replace `xxx.xxx.xxx.xxx` with the specific private IP address that has been provisioned for that particular Linode, followed by a colon (:) and `80`. This is because SSL terminates at the NodeBalancer.

    Then, select **`Save Changes`**.


## Configuring your Web Server with a 301 Redirect

### Configuring your vhost file for the Apache Webserver.

1.  Enable `mod_rewrite` so that you can redirect all traffic back to the NodeBalancer over port 443/HTTPS:

        a2enmod rewrite
     
    Or, you can load the module manually by appending the following to your Apache configuration file:

        LoadModule rewrite_module modules/mod_rewrite.so

    {:.caution}
    > Depending on selected distro, Debian or a Redhat, this file will be located in one of the following locations:
    >
    >     /etc/apache2/apache2.conf
    >
    >     /etc/httpd/httpd.conf

2.  Edit the Apache virtual host configuration file to establish the rewrite rules necessary to redirect all incoming traffic from port 80/HTTP, back to the NodeBalancer on port 443/HTTPS:

    {: .file-excerpt }
    /etc/apache2/sites-available/example.com.conf
    :   ~~~ apache
        <VirtualHost *:80>
          
            ...
          
             RewriteEngine    On
             RewriteCond      %{HTTP:X-Forwarded-Proto} !https
             RewriteRule      ^.*$ https://%{SERVER_NAME}%{REQUEST_URI} [L,R=301,NE]
             LogLevel alert rewrite:trace4  # Adjust log verbosity as required. ex. 1-8
         </VirtualHost>
        ~~~

    The rewrite configuration shown above is specific to Apache 2.4 or later. This means that logging gets recorded to Apache's `error.log` file. To view only the records specific to `mod_rewrite`, you can pipe the log file through grep:
    
        tail -f error_log|fgrep '[rewrite:'

    If you are using Apache 2.2, then you will need to replace the `LogLevel alert rewrite:trace` directive with the following:

    {: .file-excerpt }
    /etc/apache2/sites-available/example.com.conf
    :   ~~~ apache2
    
            ...
            
             RewriteLog       /var/log/apache2/rewrite.log
             RewriteLogLevel  5  # Adjust log verbosity as required. ex. 1-9
        ~~~

    {: .caution}
    > On RHEL based distributions, change the `Rewritelog` path to `/var/log/httpd/rewrite.log`

3.  Create the RewriteLog as referenced from above:

     - Debian / Ubuntu

           touch /var/log/apache2/rewrite.log

     - CentOS

           touch /var/log/httpd/rewrite.log

### Configuring the Nginx Webserver.

1.  Edit the Nginx server block configuration file to establish the rewrite rules to redirect all incoming traffic from port 80/HTTP, back to the NodeBalancer on port 443/HTTPS:

    {: .file-excerpt }
    /etc/nginx/sites-available/example.com.conf
    :   ~~~ nginx
        server {
            listen   80;
            server_name example.com;
            access_log /var/log/nginx/access.log;
            error_log /var/log/nginx/error.log;
            proxy_set_header X-Forwarded-Proto $scheme;
            location / {
                root   /srv/www/example.com/public_html;
                index  index.html index.htm;
                if ($http_x_forwarded_proto = "http") {
                    rewrite  ^/(.*)$  https://example.com/$1 permanent;
                    }           
                }
            }
        ~~~

2. Your configuration should now be complete. After reloading your web server, all requests made to your website that are not sent to port 443 should be redirected back to your Nodebalancer on a secure connection with SSL/TLS.

## Tips for Troubleshooting

- If you have difficulty getting the redirect to work properly or would like to see detailed information about how your SSL certificate is configured, you may wish to utilize the [Qualys online SSL Server Test](https://www.ssllabs.com/ssltest/)

- Every time that you make changes to your web server's document root file or other configuration files, be sure to reload the server:
 
- For Apache:

      service apache2 reload
      service httpd reload
      systemctl restart httpd.service
    
- For Nginx:

      service nginx reload
      systemctl restart nginx.service




- When testing behind a load balancer, using curl with the `-I` or `-L` flags can be very helpful when debugging:
     
        curl -I example.com
        curl -L example.com

  The `-I` or `--head` options will fetch the HTTP-header only. The `-L` or `--location` option will detect and display if the server indicates that the requested page has moved to a different location. This option will make curl repeat the request at the new location. If used together with `-I`, headers from all requested pages will be displayed. This is particularly useful if your rewrite rules have managed to create an infinite loop and your web page does not load. Check out the man pages for curl for more info.
