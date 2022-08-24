---
slug: install-countly-analytics
author:
  name: Linode Community
  email: docs@linode.com
description: "Countly Community Edition is a free open source alternative to Google Analytics for your online properties. Install it with the help of this guide."
og_description: "Countly Community Edition is a free open source alternative to Google Analytics for your online properties. Install it with the help of this guide."
keywords: ['google analytics alternative','self hosted analytics','open source analytics']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-23
modified_by:
  name: Nathaniel Stickman
title: "Installing Countly Community Edition on Ubuntu 20.04"
h1_title: "Installing Countly Community Edition on Ubuntu 20.04"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Countly: Community Edition](https://count.ly/community-edition)'
- '[Vultr: How to Install Countly Analytics on Ubuntu 16.10](https://www.vultr.com/docs/how-to-install-countly-analytics-on-ubuntu-16-10)'
---

The Countly analytics platform offers an alternative to the titan that is Google Analytics. In addition to cover many of the same features as Google Analytics, and some more, Countly also has a marked emphasis on privacy.

In this tutorial, learn about how you can start using Countly for your analytics needs. Countly Community Edition is free to use, and it runs in a self-hosted server environment. Through this guide, you can learn all the steps needed to get your own Countly server up and tracking activity on your applications.

To compare the Community Edition with the Enterprise Edition, take a look at Countly's [pricing page](https://count.ly/pricing#compare-editions).

In contrast to Google Analytics, Countly puts more emphasis on privacy and an all-in-one feature set. Countly's data gathering offers compliance with GDPR, HIPAA, and other privacy standards. Meanwhile, it provides not just visitor analytics, but also a wider range of analytics related to marketing.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Countly Analytics Community Edition

Countly has several installation options. For this tutorial, two of the most straightforward and versatile have been selected. This includes a method using a single command-line command to download and install Countly and a method using Docker.

### Installing Countly from the GitHub Repository

1. Clone the Countly server GitHub repository. This example clones the repository to the current user's home directory. The process creates a new subdirectory there, `countly-server`:

        cd ~
        git clone https://github.com/Countly/countly-server.git

1. Run the included installation script. The script requires root access for the installation, so you should first switch to the superuser. Then, navigate to the subdirectory where the script is held, and run it:

        sudo su -
        cd /home/example-user/countly-server/bin
        bash countly.install.sh

    Afterward, you can exit the superuser shell with:

        exit

1. Replace the `default` NGINX configuration with Countly's [own NGINX configuration file](https://github.com/Countly/countly-server/blob/master/bin/config/nginx.server.conf). Typically, you can find the `default` configuration file at `/etc/nginx/sites-available/default`.

    Additionally, you should extend the `server_name` property with the domain name and/or remote IP address you intend to use to access your Countly server through. For instance, this example adds the domain name `example.com` and the remote IP address `192.0.2.0`:

    {{< file "/etc/nginx/sites-available/default" conf >}}
# [...]

	server_name  localhost example.com 192.0.2.0;

# [...]
    {{< /file >}}

1. Open the HTTP ports on your server's firewall. Typically, the firewalls on Ubuntu and Debian systems are managed with UFW. Using it, you can open the relevant ports on with:

        sudo ufw allow http
        sudo ufw reload

1. Access your Countly instance by navigating to one of the enabled addresses (that is, the `server_name` values from the NGINX configuration) in your web browser.

### Installing Countly via Docker

Countly can also be installed using Docker. This gives you the advantage of a distinct and easily manageable environment to run your Countly analytics in. And Countly's Docker installation is production ready.

1. Install Docker and Docker Compose. Docker runs Countly's processes in containerized environments. Docker Compose manages the installation and coordination of the multiple Docker containers that make up Countly, keeping all the pieces in sync.

    To install Docker, follow our guide [Installing and Using Docker on Ubuntu and Debian](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/).

    Then, to install the Docker Compose plugin, use the following command:

        sudo apt install docker-compose-plugin

1. Create a directory for your Countly installation, and change into that directory. This guide creates a directory named `countly-app` in the current user's home directory for this purpose:

        mkdir ~/countly-app
        cd countly-app

1. Download the Docker Compose configuration files for Countly:

        curl -O https://raw.githubusercontent.com/Countly/countly-server/master/docker-compose.yml
        curl -O https://raw.githubusercontent.com/Countly/countly-server/master/bin/docker/nginx.server.conf

1. Modify the `docker-compose.yml` file to use the NGINX configuration you just downloaded:

        sed -i 's/bin\/docker\/nginx.server.conf/nginx.server.conf/g' docker-compose.yml

1. Open the HTTP ports on your server's firewall. Typically, the firewalls on Ubuntu and Debian systems are managed with UFW, which you can open the relevant ports on with:

        sudo ufw allow http
        sudo ufw reload

1. Start up Countly using Docker Compose's `up` command:

        sudo docker compose up

1. You should now be able to navigate to your server's IP address in a web browser to now see the Countly registration page.

    [![Countly registration page](countly-registration_small.png)](countly-registration.png)


1. Alter the permissions for the certificate directory. Doing so allows Docker to give its NGINX container access to the certificate:

        sudo chmod -R 777 /etc/letsencrypt

1.

{{< file "docker-compose.yml" >}}
# [...]

  nginx:
    image: 'bitnami/nginx'
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - './nginx.server.conf:/opt/bitnami/nginx/conf/server_blocks/countly.conf:ro'
      - '/etc/letsencrypt:/etc/letsencrypt:ro'

# [...]
{{< /file >}}

### (Optional) Assign Countly DNS

Countly does not require you to use a DNS for your server, but doing so can make your Countly instance easier to access. It gives you access to the instance via custom domain name, rather than just the assigned remote IP address.

To set up DNS on a Linode server, refer to our collection of guides on the [Linode DNS manager](/docs/products/networking/dns-manager/guides/). The process there is straightforward and can have your server running through a DNS quickly.

### (Optional) Assigning Countly TLS via Let’s Encrypt

Another optional step is giving your Countly instance an SSL certificate. Doing so secures its traffic using HTTPS.

The following steps show you how to apply an SSL certificate to Countly using [Certbot](https://certbot.eff.org). Certbot allows you to easily request and download a free certificate from [Let's Encrypt](https://letsencrypt.org).

1. Update the [Snap](https://snapcraft.io/docs/getting-started) app store. Snap provides application bundles that work across major Linux distributions and comes by default with all Ubuntu releases since 16.04:

        sudo snap install core && sudo snap refresh core

1. Remove any existing Certbot installation:

        sudo apt remove certbot

1. Install Certbot:

        sudo snap install --classic certbot

1. Download a certificate using standalone verification. When prompted, accept the terms of service, enter an email address for notifications about renewal, and enter your site's domain name:

        sudo certbot certonly --standalone

    Certbot outputs the location from which the new certificate can be accessed, typically something like this (replacing `example.com` with your domain name): `/etc/letsencrypt/live/example.com`.

1. Access the NGINX site configuration again, and make the following modifications to the beginning of the file.

    These changes first add a server for port `80` that redirects traffic to the HTTPS URL. Then they alter the existing server definition to listen on port `443`, the HTTPS port, and to use the SSL certificate created above.

    Replace `example.com` in this example with your server's domain name:

{{< file "/etc/nginx/sites-available/default" conf >}}
 server {
         listen      80;
         server_name localhost;
         access_log  off;
         rewrite ^ https://$host$request_uri? permanent;
 }

 server {
         listen   443 ssl;
         server_name  localhost example.com;

         ssl_certificate      /etc/letsencrypt/live/example.com/fullchain.pem;
         ssl_certificate_key  /etc/letsencrypt/live/example.com/privkey.pem;

         access_log  off;
# [...]
{{< /file >}}

1. Now, when navigating to your Countly instance in a web browser, you should be redirected to the HTTPS URL.

    You can optionally also add your server's remote IP address to the configuration above and use that as well to access Countly. However, you may receive a certificate warning in your browser. This is because the certificate was issued for your server's domain name, not its IP address.

## Using Countly

Now that your Countly instance is up and running, you are ready to start setting it up for use. This next series of sections first covers the initial setup within the Countly interface. Then, you can see how to set up the Countly client SDK within your application.

### Creating an Administrator Account and Logging In

When you first access Countly, you are presented with a form to register an administrator user for your instance.

[![Countly registration page](countly-registration_small.png)](countly-registration.png)

Accessing the address for your Countly instance after this initial setup directs you to the login page.

[![Countly login page](countly-login_small.png)](countly-login.png)

### Adding an Application to the Countly Dashboard

Submitting the form to create your administrator account automatically directs you to a page to create a new for your Countly instance.

[![Creating a new application in Countly](countly-create-app_small.png)](countly-create-app.png)

You can also reach this form later from the Countly dashboard by selecting the **Add new app** button in the upper right.

### Accessing the Countly Dashboard

From there you are directed to your Countly dashboard, the same page you land on for subsequent logins.

[![Countly dashboard](countly-dashboard_small.png)](countly-dashboard.png)

From here, you can survey the analytics generated by your Countly instance and manage all aspects of your Countly operations.

## How to Set Up the Countly Client for Analytics

To get Countly to start collecting analytics, you need to embed one of its client SDKs within your application.

Countly has numerous client SDKs to fit your needs. From web applications to mobile to common languages for server, desktop, and other applications — Countly has clients ready for your application.

You can see Countly's [full list of client SDKs](https://support.count.ly/hc/en-us/articles/360037236571-Downloading-and-Installing-SDKs) for more information on how to download and operate each.

To demonstrate, the rest of this section shows how you can employ the Countly web client for a web application.

1. Ensure your client-side files include or have access to the Countly SDK file.

    Running the Countly server as shown above, the SDK is actually automatically hosted alongside your Countly instance. Assuming your server's domain is `example.com`, you can find the SDK at: `example.com/sdk/web/countly.min.js`.

    Additionally, the file itself can be found among the Countly server files. Starting from the base Countly server directory, the SDK file is located at: `frontend/express/public/sdk/web/countly.min.js`. You can then copy that file to your web application's client-side files.

    The Countly SDK can also be accessed from Countly's own CDN, which you can learn about in their [web SDK documentation](https://github.com/Countly/countly-sdk-web#3-use-a-cdn-content-delivery-network).

    For these steps, it is assumed that you have made a copy of the `countly.min.js` file. They also assume that you added it to a `lib` subdirectory with your client-side code.

1. Add the following code to the `head` section of one of your application's web pages.

    Replace `EXAMPLE_COUNTLY_APP_KEY` with the **App Key** found in your Countly instance. Likewise, replace `https://example.com` with your server's URL.

    {{< file "index.html" >}}
<!-- [...] -->
<script type='text/javascript'>

// Initialize variables to be used by the Countly client.
var Countly = Countly || {};
Countly.q = Countly.q || [];

// Provide the application key from the Countly dashboard.
Countly.app_key = "EXAMPLE_COUNTLY_APP_KEY";

// Provide the URL for your Countly server instance.
Countly.url = "https://example.com";

// These next two start pushing function calls to queue. Both
// are recommended configurations.

// Track sessions automatically.
Countly.q.push(['track_sessions']);
// Track web page views automatically.
Countly.q.push(['track_pageview']);

// Load the Countly script asynchronously.
(function() {
var cly = document.createElement('script'); cly.type = 'text/javascript';
cly.async = true;

// Replace the URL here with the location of your Countly client SDK file.
cly.src = 'lib/countly.min.js';
cly.onload = function(){Countly.init()};
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(cly, s);
})();
</script>
<!-- [...] -->
    {{< /file >}}

1. Begin incorporating Countly event calls into your application. Here is an example of one such call, used for a button on the page:

    {{< file "index.html" >}}
<html>
<head>
<!-- [...] -->
<script type='text/javascript'>
function clickEvent(ob){
  Countly.q.push(['add_event',{
    key:"asyncButtonClick",
    segmentation: {
      "id": ob.id
    }
  }]);
}
</script>
</head>
<body>
<!-- [...] -->
<input type="button" id="asyncTestButton" onclick="clickEvent(this)" value="Test Button">
<!-- [...] -->
</body>
</html>
    {{< /file >}}

Navigating to your web application should now generate page views in Countly. Activating an event (the "Test Button" above) similarly now shows in Countly.

[![Countly page visitors](countly-visitors_small.png)](countly-visitors.png)

[![Countly page events](countly-events_small.png)](countly-events.png)

## Conclusion

You are now ready to run with your Countly analytics. With your analytics server set up and your client embedded, you can begin diving deeper on your Countly configuration. Take a look through the [Countly documentation](https://support.count.ly/hc/en-us) to learn all the possibilities and see more of what Countly is capable of.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
