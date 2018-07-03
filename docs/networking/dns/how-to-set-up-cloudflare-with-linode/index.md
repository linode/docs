---
author:
  name: Nathan Melehan
  email: nmelehan@linode.com
description: 'Learn how to use Cloudflare with a website running on Linode.'
keywords: ["cloudflare", "dns"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-06-26
modified_by:
  name: Nathan Melehan
published: 2018-06-26
title: "How to Set Up Cloudflare with Linode"
external_resources:
  - '[Cloudflare Support](https://support.cloudflare.com/hc/en-us)'
  - '[DNS Records: An Introduction](https://linode.com/docs/networking/dns/dns-records-an-introduction/)'
---

[Cloudflare](https://www.cloudflare.com) provides a *content delivery network* (*CDN*) for websites, APIs, and other applications hosted on the web. The Linode platform is compatible with Cloudflare, so if you run a web application on a Linode, you can enroll it in Cloudflare's CDN. Using the Cloudflare network can speed up your application's response time and protect your Linode from denial-of-service attacks.

## How Cloudflare Works

Cloudflare operates a network of servers around the globe, and when you sign up for their product those servers will cache the content from your application. These caching servers are referred to as [*edge servers*](https://www.cloudflare.com/learning/cdn/glossary/edge-server/).

In this arrangement, the Linode that's running your web application is referred to as the [*origin server*](https://www.cloudflare.com/learning/cdn/glossary/origin-server/), as it is the origin of all content that will be served by Cloudflare.

After you sign up for Cloudflare, your site's visitors will no longer directly open connections on your Linode. Instead, they will open connections on the edge servers in Cloudflare's network, and those edge servers will open connections on your Linode to retrieve the content for each request.

To enable this network flow, Cloudflare will take control over the DNS records for your domain. You will no longer use Linode's DNS servers or any other DNS services for that domain. Cloudflare assigns their edge servers' IP addresses to your DNS records.

## Benefits of Using Cloudflare

Because the edge servers will receive your visitors' requests and can cache your content, using Cloudflare offers these core benefits:

-   **Downtime protection.** If your web server experiences unexpected downtime, Cloudflare can continue to serve a cached version of your site while your system administrators investigate the issue on your origin server.
-   **Lower server load.** If an edge server responds to your visitor's request with a cached version of that request's content, then your origin server does not need to generate that content, and so it has to do less work over time.
-   **Faster response time.** The edge servers in Cloudflare's network will often be geographically closer to your visitors, so the cached content that they serve will be returned to your visitors more quickly. For example, if your origin server is located in Linode's Dallas region, but one of your visitors is located in Argentina, a round trip between Argentina and Dallas would feature a higher latency than a round trip between Argentina and Cloudflare's edge servers in South America. This will be true all around the world, which means that you can keep your origin server in one location but still have fast service everywhere.

Cloudflare exposes settings for what content should be cached and the duration that cache should be valid for.

### DDoS Protection

In addition to caching content, Cloudflare's network is also engineered to absorb and deflect Distributed Denial of Service (DDoS) attacks. While your Linode may be able to deflect smaller attacks by specifying firewall rules, Cloudflare's network is able to handle much larger attacks that would overwhelm your firewall.

### Keeping Your Linode's IP secret

When you set up Cloudflare, you should keep your Linode's IP address secret from everyone except for Cloudflare. This is because if an attacker were able to find out what that IP was, they could still direct a DDoS towards it. To keep the address hidden, make sure that none of your domains and DNS records reference it.

If you were previously attacked and are setting up Cloudflare to protect yourself, you should [contact Linode Support](https://linode.com/docs/platform/support/#contacting-linode-support) and request a new IP address for your Linode for use with Cloudflare.

## Set Up Cloudflare

Cloudflare offers a free tier of service which enables the benefits described by this guide. This free tier will be used to explore how to sign up for the service. You will need a registered domain and [DNS record](https://linode.com/docs/networking/dns/dns-manager-overview/#dns-set-up-checklist) set up on your Linode before proceeding with these steps.

1.  Create an account on the [Cloudflare](https://dash.cloudflare.com/sign-up) site.

2.  After creating your account, you are presented with a form that asks for your domain name:

    ![Cloudflare setup - enter domain](cloudflare-setup-enter-domain.png "Cloudflare setup - enter domain")

3.  The Cloudflare site will present a screen explaining that the service is scanning your current DNS records:

    ![Cloudflare setup - DNS record scan dialog](cloudflare-setup-scan-dialog.png "Cloudflare setup - DNS record scan dialog")

4.  The *Select a Plan* screen will ask you to choose a plan. Select the free tier. You can upgrade your plan later if you'd like.

    ![Cloudflare setup - select plan](cloudflare-setup-select-plan.png "Cloudflare setup - select plan")

5.  The Cloudflare site will present the DNS query results for your domain. The query scans the current DNS records for the apex of your domain (e.g. `example.com`) and common subdomains (e.g. `www.example.com`). This scan will likely not detect custom subdomains (e.g. `mysubdomain.example.com`). You can manually add any of your current records that were missed by the scan using the provided form.

    ![Cloudflare setup - DNS record scan results](cloudflare-setup-scan-results.png "Cloudflare setup - DNS record scan results")

    The table displays an *orange cloud* icon for hostnames that will be routed through Cloudflare's network. A *gray cloud* denotes hostnames which bypass Cloudflare's network. You can toggle between these two options. Consult Cloudflare's [documentation](https://support.cloudflare.com/hc/en-us/articles/200169626-What-subdomains-are-appropriate-for-orange-gray-clouds-) to determine which services you should route through their network.

6.  You will need to change the [name servers](https://linode.com/docs/networking/dns/dns-records-an-introduction/#name-servers) configured with your domain registrar to the ones listed under the *To* heading. This sets Cloudflare's nameservers as the *authoritative name servers* for your domain.

    ![Cloudflare setup - authoritative name servers](cloudflare-setup-name-servers.png "Cloudflare setup - authoritative name servers")

    You can check your domain registrar information by using a `whois` website like [whois.net](https://whois.net). The steps for changing your authoritative name servers vary slightly depending on which registrar you used. Cloudflare provides a [list of instructions](https://support.cloudflare.com/hc/en-us/articles/205195708-Step-3-Change-your-domain-name-servers-to-Cloudflare#step3) for common registrars.

7.  Cloudflare will present a dashboard for your new site. If you haven't changed the nameserver values with the registrar or if the changes haven't propogated, a `Status: Website not active (DNS modification pending)` message will display:

    ![Cloudflare overview - website not active](cloudflare-overview-not-active.png "Cloudflare overview - website not active")

    Otherwise, you will see a `Status: Active` message:

    ![Cloudflare overview - website active](cloudflare-overview-active.png "Cloudflare overview - website active")


## Set Up SSL with Cloudflare

Cloudflare's SSL settings can be controlled from the *Crypto* section of your site's dashboard:

![Cloudflare crypto - SSL mode](cloudflare-crypto-ssl-mode.png "Cloudflare crypto - SSL mode")

### How SSL Works with Cloudflare

Prior to joining Cloudflare, your web server directly responded to your visitors' requests. If you had previously enabled HTTPS, your web server provided your SSL certificate. When using Cloudflare, your visitors will connect to Cloudflare's edge servers, which do not host your SSL certificate by default.

On their free plan, Cloudflare's edge servers will instead serve a *Universal SSL* certificate, and this option is enabled by default. The free Universal SSL certificate also features the domains of other Cloudflare customers. Their edge servers will decrypt HTTPS requests they receive from your visitors using this certificate in order to cache and filter the content.

This arrangement means that a secure connection symbol will be displayed by your web browser when visiting your site, even if you had not set up SSL at all on your Linode before. Having said that, if you do not have SSL set up on your origin server, then the traffic between the edge servers and your origin server will still be unencrypted.

In total, there are four different SSL modes:

-   **Off**: Cloudflare will only serve content over HTTP from its edge servers. HTTPS requests will be redirected to HTTP by the edge servers. The edge servers will only open HTTP connections to your origin server.

-   **Flexible SSL**: Edge servers will respond to HTTPS requests. Edge servers will only make connections to your origin over HTTP.

    {{< note >}}
If your web server is configured to redirect all HTTP requests to HTTPS while using the Flexible SSL mode with Cloudflare, visitors will encounter a redirect loop when attempting to view your site.
{{< /note >}}

-   **Full SSL**: All connections between your visitors and the edge servers will be redirected to HTTPS, and the edge servers will only open HTTPs connections to your origin. This option requires that you set up SSL on your origin web server. The certificate you use on the origin will not be validated by Cloudflare; in other words, you can use a [self-signed certificate](https://www.linode.com/docs/security/ssl/create-a-self-signed-tls-certificate/).

-   **Full SSL (strict)**: As the *Full SSL* option, but Cloudflare will also validate the origin's certificate. A valid certificate can be obtained through a trusted commercial certificate provider, through [Let's Encrypt](https://letsencrypt.org), or from Cloudflare (referred to as a *Cloudflare Origin CA Certificate*).

### Set Up SSL on the Origin Server

Setting up SSL on your origin server will enable you to use the *Full SSL* or *Full SSL (strict)* modes. If you already have SSL set up on the origin, you should already be able to use those modes.

If you do not have a certificate for your origin server, Cloudflare provides an easy way of getting one via their own [*Origin CA*](https://blog.cloudflare.com/cloudflare-ca-encryption-origin/) (Certificate Authority). This certificate can be used with the *Full SSL (strict)* mode.

{{< caution >}}
Certificates from Cloudflare's Origin CA are only trusted inside the Cloudflare network. This means that if you set one up on your origin server but then later stop using Cloudflare, the installed certificate will not be valid for visitors to your site. You will need to obtain and install a new certificate from another trusted authority in this circumstance.
{{< /caution >}}

1.  From the Crypto tab of the Cloudflare dashboard, scroll to the *Origin Certificates* panel and click the *Create Certificate* button:

    ![Cloudflare crypto - origin certificates panel](cloudflare-crypto-origin-certificates.png "Cloudflare crypto - origin certificates panel")

2.  In the panel that appears, leave the options for private key/CSR generation, hostname, and certificate validity duration in their default values. Scroll to the bottom of this panel and click *Next*.

3.  Another panel will appear that shows the new certificate (in PEM format by default) and private key.

    ![Cloudflare crypto - new certificate and private key](cloudflare-crypto-origin-certificate-installation.png "Cloudflare crypto - new certificate and private key")

    Copy the contents of these into two files on your computer: name the certificate file example.com.pem, and the private key file example.com.key. Substitute your domain name for example.com in those filenames.

4.  Upload these files to your Linode. You can upload files by using an SFTP client like [FileZilla](https://linode.com/docs/tools-reference/file-transfer/filezilla/). Or, you can use the command line tool [rsync](https://linode.com/docs/tools-reference/tools/introduction-to-rsync/).

5.  Configure your Linode's web server software to listen on port 443 (HTTPS) to use the new certificate and private key. Instructions for doing this can vary by which web server software you use:

    -    Cloudflare has a number of guides for installing the Origin CA certificate with different software packages: [Cloudflare Support > SSL > Origin CA](https://support.cloudflare.com/hc/en-us/sections/207182687-Origin-CA).
    -    You can also adapt instructions from Linode's various SSL Certificate guides: [Guides & Tutorials > Security, Upgrades & Backups > SSL Certificates](https://www.linode.com/docs/security/ssl/).

6.  Be sure to restrict the file permissions of your certificate and private key files on your Linode so that only your web server process can read them. For example, if your files are stored in the directory `/etc/ssl/certs/example.com/`, run:

        sudo chown -R root:root /etc/ssl/certs/example.com/
        sudo chmod -R 400 /etc/ssl/certs/example.com/

    These commands will change ownership of that directory and its files to `root:root` and give read access only to the `root` user.

7.  After you've finished updating the configuration of the web server, restart or reload the web server process.

8.  From the Crypto tab of the Cloudflare dashboard, set your SSL mode to *Full SSL (Strict)*.

If you see an error from Cloudflare when visiting your site, your web server's SSL configuration may be incorrect. You can troubleshoot this by reviewing your web server's error logs.

### Set Up Dedicated SSL on the Edge Servers

The Universal SSL certificate that is provide for free is shared with other customers. This certificate will have a *common name* that looks similar to `sni170707.cloudflaressl.com`. This certificate uses SNI (Server Name Indication) technology to function, but this technology is incompatible with [some much older browsers](https://en.wikipedia.org/wiki/Server_Name_Indication#Implementation).

It is possible to order a [dedicated SSL certificate](https://support.cloudflare.com/hc/en-us/articles/228009108-Dedicated-SSL-Certificates) from Cloudflare whose common name is your domain name and which isn't shared with other customers. This is a fully managed solution from Cloudflare, and the certificate provided will auto-renew.

These certificates can be entirely administered through the Cloudflare website. To purchase this service from Cloudflare, scroll to the *Edge Certificates* panel of the *Crypto* section on Cloudflare's dashboard and click *Order SSL Certificate*.

There are two options for dedicated SSL certificates: a $5/month plan will cover your domain and a wildcard representing one-level subdomains, and a $10/month plan will also cover up to 50 specific subdomains. These certificates also require SNI compatibility in web browsers. You can purchase these certificates while otherwise remaining on the free Cloudflare tier.

![Cloudflare crypto - edge certificates panel](cloudflare-crypto-edge-certificates.png "Cloudflare crypto - edge certificates panel")

If you would like to upload your own SSL certificate from another authority, you can do so by clicking the *Upload Custom SSL Certificate* button in the *Edge Certificates* panel. This functionality requires that you subscribe to the *Business Website* Cloudflare tier.

## Next Steps

The Cloudflare dashboard offers a wide array of settings and features that you can explore:

![Cloudflare dashboard header](cloudflare-dashboard-header.png "Cloudflare dashboard header")

For more information on the features in each section, click the `Help` link in the bottom-right corner of that feature's panel.
