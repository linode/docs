---
description: "WordPress is an industry standard CMS. Follow this guide to deploy WordPress on Linode using Marketplace Apps."
keywords: ['wordpress','wp cli','marketplace apps', 'cms', 'deploy wordpress with marketplace', 'easy install wordpress']
tags: ["debian","cloud manager","linode platform","cms","wordpress","marketplace","ssl","web applications"]
published: 2020-09-28
modified: 2023-06-06
modified_by:
  name: Linode
title: "Deploy WordPress through the Linode Marketplace"
external_resources:
- '[WordPress Codex (Documentation)](https://codex.wordpress.org/)'
aliases: ['/platform/marketplace/deploying-wordpress-with-marketplace-apps/', '/platform/one-click/deploying-wordpress-with-one-click-apps/','/guides/deploying-wordpress-with-one-click-apps/','/guides/deploying-wordpress-with-marketplace-apps/','/guides/wordpress-marketplace-app/']
authors: ["Linode"]
---

[WordPress](https://wordpress.org/) is an industry standard open source CMS (content management system) used by the majority of the web. With 60 million users around the globe, WordPress provides an intuitive platform for content-focused websites for both personal and business use. Its focus on best-in-class usability and flexibility makes it possible to have a customized website up and running in minutes.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** WordPress should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:**  Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though a minimum of a 4GB Dedicated CPU Compute Instance is recommended for production websites.

### WordPress Options

- **Webserver Stack** *(required)*: Chose which webserver to use for the WordPress deployment, Apache2 or NGINX.
- **Email address** *(required)*: Enter the email address you wish to use when configuring the WordPress admin user, generating SSL certificates, and optionally creating DNS records for a custom domain.
- **WordPress Admin Username** *(required)*: Username for your WordPress admin user account. Defaults to `admin` if no username is entered.
- **WordPress Database Username** *(required)*: MySQL username for the WordPress database user. Defaults to `wordpress` if no username is entered.
- **WordPress Database Name** *(required)*: Name for the WordPress MySQL database. Defaults to `wordpress` if no database name is defined.
- **Website Title:** Enter a title for your WordPress site.

    {{< note >}}
    The passwords for the WordPress Admin User, WordPress Database User and MySQL root user are automatically generated and provided in the file `/root/.linode_credentials.txt` when the WordPress deployment completes.
    {{< /note >}}

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started After Deployment

### Obtain the Credentials

Once the app has been *fully* deployed, you need to obtain the credentials from the server.

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console:** Within the Cloud Manager, navigate to **Linodes** from the left menu, select the Compute Instance you just deployed, and click the **Launch LISH Console** button. Log in as the `root` user. See [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH:** Log in to your Compute Instance over SSH using the `root` user. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

1.  Once logged in, access the credentials file by runing the following command:

    ```command
    cat /root/.linode_credentials.txt
    ```

1.  This displays the passwords that were automatically generated when the instance was deployed. Once you save these passwords, you can safely delete this file.

### Accessing the WordPress Admin Dashboard

1.  Open your web browser and navigate to `http://[domain]/wp-admin/`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). You can also use your IPv4 address, though the connection will not be secure. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

    ![Screenshot of the browser's URL bar](wordpress-browser-url.png)

    {{< note >}}
    A TLS/SSL certificate is automatically generated for your custom domain, enabling you to connect to the site over the `https` protocol. If you did not enter a custom domain, a TLS/SSL certificate is configured on the rDNS domain instead. Connections using your IP address are not secured and will use the `http` protocol.
    {{< /note >}}

1.  Within the login page that appears, enter the username (*admin username*) that you created when you deployed this instance and the associated password that was automatically generated. Then click the **Log In** button.

    ![Screenshot of the WordPress login form](wordpress-login.png)

1.  Once logged in, the WordPress Admin Dashboard appears. From here, you can create new posts, add users, modify the theme, and adjust any settings.

    ![Screenshot of the WordPress dashboard](wordpress-admin.png)

### Viewing Your Website

Open a web browser and navigate to `http://[domain]`, replacing *[domain]* with the custom domain you entered during deployment or your Compute Instance's IPv4 address or rDNS domain. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS. Your WordPress site should now be displayed.

### Manually Configure a Domain

If you didn't set up a domain during the deployment process, you can add it manually following the instructions in this section. Before beginning, make sure you have a registered domain name.

1. Within the *name servers* for your domain name, create an [*A record*](/docs/guides/dns-overview/#a-and-aaaa). The *hostname* / *name* field should be *@* for a bare domain (`example.tld`) or should specify the subdomain you wish to use, such as *app* for `app.example.tld`. It's common to create two A records, one using *@* and one using *www*. The IP address should be the IPv4 address of your new Compute Instance. If you do not have a name server, consider using Linode's [DNS Manager](/docs/products/networking/dns-manager/).

1. Update WordPress so that it uses your new domain name. This can be done directly in the WordPress Admin panel or through the command line. See [Changing The Site URL](https://wordpress.org/support/article/changing-the-site-url/) to learn more.

    1. Log in to Admin dashboard. See [Accessing the WordPress Admin Dashboard](#accessing-the-wordpress-admin-dashboard).

    1. Click on the **Settings** link in the sidebar and then click on the **General** option from the dropdown menu that appears.

        ![Screenshot of the Settings menu with General highlighted](wordpress-settings-general.png)

    1. Within the *General Settings* form, update the **WordPress Address (URL)** and **Site Address (URL)** fields with the full domain you assigned to your site (such as `http://example.com` or `http://www.example.com`)

        ![Screenshot of the WordPress/Site Address URL fields](wordpress-site-address.png)

    1. Click the **Save Changes** button at the bottom of the form.

### Resetting Your Admin Password or Email Address

If you need to reset your admin user's password and you aren't receiving the password reset request email, you can update the password from command line. This method also allows you to update the email address for your admin account without needing an email confirmation.

1. Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Navigate to the directory of your WordPress installation:.

    ```command
    cd /var/www/wordpress
    ```

1.  Using the WP-CLI, update either the password or email address. You can also update other values as needed. See [WP-CLI wp user update command](https://developer.wordpress.org/cli/commands/user/update/).

    **Update password** (replace *[user]* with the username of the user you want to update and *[password]* with the password you wish to use):

    ```command
    wp user update [user] --user_pass="[password]" --allow-root
    ```

    **Update email** (replace *[user]* with the username of the user you want to update and *[email]* with the email address you wish to use):

    ```command
    wp user update [user] --user_email="[email]" --allow-root
    ```

## Going Further

Now that your WordPress installation is deployed, you can start adding content and modifying it to suit your needs. Here are a few links to help get you started:

- [WordPress Support](https://wordpress.org/support/): Learn the basic workflows for using WordPress.
- [Securing WordPress](/docs/guides/how-to-secure-wordpress/): Advice on securing WordPress through HTTPS, using a secure password, changing the admin username, and more.
- [WordPress Themes](https://wordpress.org/themes/#): A collection of *thousands* of WordPress themes.
- [Marketplace Apps Repository](https://github.com/linode-solutions/marketplace-apps): Review the deployment Ansible playbooks.

{{< content "marketplace-update-note-shortguide">}}
