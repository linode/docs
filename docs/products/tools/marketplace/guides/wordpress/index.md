---
author:
  name: Linode
  email: docs@linode.com
description: "WordPress is an industry standard CMS. Follow this guide to deploy WordPress on Linode using Marketplace Apps."
keywords: ['wordpress','wp cli','marketplace apps', 'cms', 'deploy wordpress with marketplace', 'easy install wordpress']
tags: ["debian","cloud manager","linode platform","cms","wordpress","marketplace","ssl","web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-28
modified: 2022-03-29
modified_by:
  name: Linode
title: "Deploying WordPress through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[WordPress Codex (Documentation)](https://codex.wordpress.org/)'
aliases: ['/platform/marketplace/deploying-wordpress-with-marketplace-apps/', '/platform/one-click/deploying-wordpress-with-one-click-apps/','/guides/deploying-wordpress-with-one-click-apps/','/guides/deploying-wordpress-with-marketplace-apps/','/guides/wordpress-marketplace-app/']
---

[WordPress](https://wordpress.org/) is an industry standard open source CMS (content management system) used by the majority of the web. With 60 million users around the globe, WordPress provides an intuitive platform for content-focused websites for both personal and business use. Its focus on best-in-class usability and flexibility makes it possible to have a customized website up and running in minutes.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** WordPress should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:**  Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used, though a minimum of a 4GB Dedicated CPU Compute Instance is recommended for production websites.

### WordPress Options

- **Email address** *(required)*: Enter the email address you wish to use when configuring the WordPress admin user, generating SSL certificates, and optionally creating DNS records for a custom domain.
- **Admin Username** *(required)*: Username for your WordPress admin user account.
- **Admin Password** *(required)*: Password for your WordPress admin user account.
- **MySQL `root` password** *(required)*: The root password for your MySQL database.
- **WordPress Database Password** *(required)*: The root password for your WordPress database.
- **Website Title:** Enter a title for your WordPress site.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Would you like to be able to send password reset emails for WordPress?** Creates the required DNS records and configures the server so you can send emails from WordPress, such as for resetting a password.
- **Would you like to use a free Let's Encrypt SSL certificate?** If you would like to use the free Let's Encrypt CA to generate TLS/SSL certificates, select *Yes*.

## Getting Started After Deployment

### Accessing the WordPress Admin Dashboard

1.  Open your web browser and navigate to `http://[domain]/wp-admin/`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's IPv4 address or rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing IP addresses and rDNS.

    ![Screenshot of the browser's URL bar](wordpress-browser-url.png)

1.  Within the login page that appears, enter the username (*admin username*) and password (*admin password*) that you created when you deployed this instance. Then click the **Log In** button.

    ![Screenshot of the WordPress login form](wordpress-login.png)

1.  Once logged in, the WordPress Admin Dashboard appears. From here, you can create new posts, add users, modify the theme, and adjust any settings.

    ![Screenshot of the WordPress dashboard](wordpress-admin.png)

### Viewing Your Website

Open a web browser and navigate to `http://[domain]`, replacing *[domain]* with the custom domain you entered during deployment or your Compute Instance's IPv4 address or rDNS domain. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing IP addresses and rDNS. Your WordPress site should now be displayed.

### Manually Configure a Domain

If you didn't set up a domain during the deployment process, you can add it manually following the instructions in this section. Before beginning, make sure you have a registered domain name.

1. Within the *name servers* for your domain name, create an [*A record*](/docs/networking/dns/dns-records-an-introduction/#a-and-aaaa). The *hostname* / *name* field should be *@* for a bare domain (`example.tld`) or should specify the subdomain you wish to use, such as *app* for `app.example.tld`. It's common to create two A records, one using *@* and one using *www*. The IP address should be the IPv4 address of your new Compute Instance. If you do not have a name server, consider using Linode's [DNS Manager](/docs/guides/dns-manager/).

1. Update WordPress so that it uses your new domain name. This can be done directly in the WordPress Admin panel or through the command line. See [Changing The Site URL](https://wordpress.org/support/article/changing-the-site-url/) to learn more.

    1. Log in to Admin dashboard. See [Accessing the WordPress Admin Dashboard](#accessing-the-wordpress-admin-dashboard).

    1. Click on the **Settings** link in the sidebar and then click on the **General** option from the dropdown menu that appears.

        ![Screenshot of the Settings menu with General highlighted](wordpress-settings-general.png)

    1. Within the *General Settings* form, update the **WordPress Address (URL)** and **Site Address (URL)** fields with the full domain you assigned to your site (such as `http://example.com` or `http://www.example.com`)

        ![Screenshot of the WordPress/Site Address URL fields](wordpress-site-address.png)

    1. Click the **Save Changes** button at the bottom of the form.

## Going Further

Now that your WordPress installation is deployed, you can start adding content and modifying it to suit your needs. Here are a few links to help get you started:

- [WordPress Support](https://wordpress.org/support/): Learn the basic workflows for using WordPress.
- [Securing WordPress](https://www.linode.com/docs/guides/how-to-secure-wordpress/): Advice on securing WordPress through HTTPS, using a secure password, changing the admin username, and more.
- [WordPress Themes](https://wordpress.org/themes/#): A collection of *thousands* of WordPress themes.

{{< content "marketplace-update-note-shortguide">}}
