---
slug: plausible
title: "Installing Plausible for Website Analytics"
description: 'Learn how to install the analytics tool Plausible that can use to help keep your website analytics private.'
keywords: ['plausible','analytics']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["TechHut"]
published: 2023-06-27
modified_by:
  name: Linode
---

[Plausible](https://plausible.io/) is a free and open source website analytics tool that does not rely on external services. Plausible allows you to track visitors, demographic data, device data, and much more. Plausible has a graphical interface that provides charts and maps that provide insight into the performance of your website server. Setting Plausible up on Akamai Connected Cloud and integrating it within your application is straightforward.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/).

1.  You need to generate an [API Token](/docs/products/tools/api/guides/manage-api-tokens/).

1.  [Deploy a Docker Marketplace App](/docs/products/tools/marketplace/guides/docker/). This includes creating your limited sudo user, your SSH public key, the previously generated API token, the domain you'd like to use and an email address, the preferred image, region, plan, and root password. There are additional options for opening ports to allow email, however this is only needed if you'll be allowing others to register for this Plausible instance. Once ready click on *Create Linode*. The process will take about 5-10 minutes to complete.

1.  You need a domain name configured in the [DNS Manager](/docs/products/networking/dns-manager/get-started/). Create A/AAAA records pointing to the server hosting Docker.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Cloning the Plausible Repository

1.  After you created your Compute Instance, you can [login via SSH](/docs/guides/connect-to-server-over-ssh/) via your local terminal. Once you login, update and upgrade your server.

    ```command
    sudo apt update && sudo apt upgrade -y
    ```

1.  Now that your system is up to date, clone the repository from Plausible containing the Docker compose file and the configuration files.

    ```command
    git clone https://github.com/plausible/hosting
    cd hosting
    ```

## Adding Required Configurations

1.  There is a file called `plausible-conf.env` within the hosting folder. This contains the environmental variables for the Docker compose file. The most important variables to configure are the `SECRET_KEY_BASE` and the `BASE_URL` variables. You can generate a security key with the command below.
​
    ```command
    openssl rand -base64 64 | tr -d '\n' ; echo
    ```

1.  Use a tool such as nano or vim to edit the `plausible-conf.env` file. Add your domain to the `BASE_URL` variable. For now, use the HTTP protocol rather than HTTPS. In a later section, you will change this after generating the proper SSL certification.

1.  Once you've added the URL and key, save the file.

1.  Next, use nano or vim to open the `docker-compose.yml` file. Change any database passwords for security.
​
## Deploying the Container

1.  Using the command below, deploy the container.
​
    ```
    sudo docker-compose up -d
    ```

1.  With the container running, navigate to port 8000 on your domain name to ensure that your new Plausible website is up and running. For instance, if you had the domain example.com, you'd enter the following:
​
    ```
    http://example.com:8000
    ```
​
    If you see the Plausible website you, Plausible was deployed successfully.

## Reverse Proxy and Certificate

Now, you need to set up NGINX server software and configure it to run your Plausible website.

1.  Install NGINX with the command below.
​
    ```
    sudo apt update
    sudo apt install nginx
    ```

1.  Allow the ports *80* and *443* in NGINX.
​
    ```
    sudo ufw allow "Nginx Full"
    ```

1.  Create a configuration profile in the `/etc/nginx/sites-available/` directory. You can call this anything. The command below uses nano, but feel free to use your preferred editor.
​
    ```
    sudo nano /etc/nginx/sites-available/plausible.conf
    ```

1.  Copy and paste the following configuration text into your empty configuration file. Be sure to change the `example.com` domain to the domain you wish to use. In this case do not include *http* or *https*.
​
    ```file {title="/etc/nginx/sites-available/plausible.conf"}
    server {
        listen       80;
        listen       [::]:80;
        server_name  example.com;
    ​
        access_log  /var/log/nginx/plausible.access.log;
        error_log   /var/log/nginx/plausible.error.log;
    ​
        location / {
          proxy_pass http://localhost:8000;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
    ```

    Save the file and exit the editor. This configuration is for HTTP only. In the next step, when we acquire our SSL certificate, Certbot will implement HTTPS automatically.

1.  The next command links this new configuration in `sites-available` to `sites-enabled`.
​
    ```
    sudo ln -s /etc/nginx/sites-available/plausible.conf /etc/nginx/sites-enabled/
    ```

1.  We can use a NGINX command to verify that the configuration is correct. After it says the test was successful, reload the NGINX service.

    ```
    sudo nginx -t
    sudo systemctl reload nginx
    ```

Now that the service is reloaded, visit your website without the port to ensure the new configuration is working.
​
## Adding a TLS (SSL) Certification with Certbot
​
Adding an SSL certificate to any website is an important step for both security and user confidence. Generating a TLS certificate for our NGINX proxy is straightforward.

1.  First, install Certbot.
​
    ```
    sudo apt install certbot python3-certbot-nginx
    ```

1.  With the application installed, run Certbot with the domain name you have chosen. After running this command, there will be additional prompts.

    ```
    sudo certbot --nginx -d your.domain.here
    ```

    You'll need to enter your email, accept Certbot's terms of service, decide if you'd like to share your email, and then select if you'd like all HTTP traffic redirected to HTTPS. This is optional, but redirecting is generally a good idea.

    If successful, you'll see a "congratulations" message with some additional information. At this point, you should go back into your `plausible-conf.env` from earlier and change your `BASE_URL` so this reflects the domain being served over HTTPS.
​
## Accessing Plausible and Additional Configuration
​
You're done! You can now create your account, add your website, and retrieve the code snippet you will include on your website. When adding the code to your website, make sure it's in a location that is visible on every page. This can be done with a plugin in WordPress or with the code injection on Ghost. The inclusion process will be slightly different for every platform and service.
​
There are many more configuration options and changes you can make. For example, such as [adding a variable to disable registration](https://plausible.io/docs/self-hosting-configuration). Additionally, setting up email servers and notification was not covered in this article. For more options and advanced configuration, please check out [Plausible's official documentation](https://plausible.io/docs/self-hosting).