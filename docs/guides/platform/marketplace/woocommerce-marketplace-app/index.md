---
slug: woocommerce-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to deploy WooCommerce, the most popular ecommerce plugin, on Wordpress through the Linode Marketplace."
keywords: ['woocommerce','wordpress','marketplace apps','ecommerce','e-commerce','cms']
tags: ["cloud-manager","linode platform","cms","wordpress","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-02
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying WooCommerce through the Linode Marketplace"
aliases: ['/platform/marketplace/marketplace-woocommerce/','/platform/marketplace/how-to-deploy-woocommerce-with-marketplace-apps/', '/platform/one-click/how-to-deploy-woocommerce-with-one-click-apps/','/guides/how-to-deploy-woocommerce-with-marketplace-apps/']
contributor:
  name: Linode
external_resources:
- '[WooCommerce Docs](https://docs.woocommerce.com/)'
- '[Introduction to eCommerce for WordPress](https://woocommerce.com/guides/ecommerce-for-wordpress-intro/)'
- '[New Store Owners Guide](https://woocommerce.com/guides/new-store/)'
- '[WooCommerce Storefront Theme](https://woocommerce.com/storefront/)'
- '[WooCommerce Themes by Industry](https://woocommerce.com/product-category/themes/storefront-child-theme-themes/)'
- '[WooCommerce Extensions](https://woocommerce.com/product-category/woocommerce-extensions/)'
---
## WooCommerce Marketplace App

[WooCommerce](https://woocommerce.com/) is a popular open source eCommerce plugin for WordPress that can power online storefronts to sell both digital and physical products for small-to-large businesses. A variety of [themes for WooCommerce](https://woocommerce.com/product-category/themes/storefront-child-theme-themes/) are available so you can create a store that looks the way you want it to.  WooCommerce takes payments via major credit cards, bank transfers, [PayPal](https://woocommerce.com/products/woocommerce-gateway-paypal-checkout/), and other providers like [Stripe](https://woocommerce.com/products/stripe/). The WooCommerce plugin is free, but some themes and extensions have a cost.

## Deploy WooCommerce with Marketplace Apps

{{< content deploy-marketplace-apps >}}

### WooCommerce Options

| **Field** | **Description** |
|:--------------|:------------|
| **Website Title** | Your WordPress site's title. |
| **E-Mail Address** | E-Mail address for your WordPress admin user. This is also used as the SOA email address if you also enter a domain. *Required*. |
| **Admin Username** | Username for your WordPress admin user. *Required*. |
| **Admin Password** | Password for your WordPress admin user. *Required*. |
| **MySQL root Password** | The root password for your MySQL database. *Required*. |
| **WordPress Database Password** | The root password for your WordPress database. *Required*. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Enable passwordless sudo access for the limited user?** | If you entered an SSH Public Key above and it is for the limited user account, select `Yes`, this allows SSH to use Public Key login for the limited user (recommended). Select `No` if you want SSH to rely on using password login for the limited user account. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH (recommended). Select `No` to allow the root account to login via SSH. |
| **Configure automatic security updates** | Select `Yes` to have the system automatically update WordPress with the latest security updates. Select `No` to if you wish to manage all updates manually. |
| **Use fail2ban to prevent automated intrusion attemps?** | Select `Yes` to install fail2ban. Select `No` to not install fail2ban during installation. If you chose `No`, you can install fail2ban later by following the [Using Fail2ban to Secure Your Server](/docs/security/basics/using-fail2ban-to-secure-your-server-a-tutorial/) guide. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your WordPress site. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Do you need an MX record for this domain?** | Check `Yes` if you plan on using WordPress to send email. The installer, along with your `API Token` (required) sets up the necessary MX records in the DNS Manager. Select `No` if you do not plan on using WordPress to send email. You can [add an MX record manually](/docs/networking/dns/dns-records-an-introduction/#mx) at a later time if you change your decision. |
| **Do you need an SPF record for this domain?** | Check `yes` if you plan on using WordPress to send email. The installer, along with your `API Token` (required) sets up the necessary SPF records in the DNS Manager. Select `No` if you do not plan on using WordPress to send email. You can [add an SPF record manually](/docs/networking/dns/dns-records-an-introduction/#spf) at a later time if you change your decision. |
| **Would you like to use a free Let's Encrypt SSL certificate?** | Select `Yes` if you would like the install to create an SSL certificate for you, or `No` if you do not. You cannot create secure, encrypted conferences without an SSL certificate. Validation of your SSL certificate can take up to two hours to complete.|

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Select an Image** | Debian 10 is currently the only image supported by the WooCommerce Marketplace App, and it is pre-selected on the Linode creation page. *Required* |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*.* |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). As a plugin for WordPress, WooCommerce is an extremely flexible CMS that can be supported on any size Linode. We suggest you build your WooCommerce app on a Linode plan that reflects how much content you plan on featuring, as well as how much traffic you plan on having on your site. For small sites, a 1GB Linode (Nanode) or a 2GB Linode should be enough. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required* |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required* |

When you've provided all required Linode Options, click on the **Create** button. **Your WooCommerce app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning.** After WooCommerce has finished installing, a confirmation email will be sent to the email address you provided during configuration, at which point you will be able to [access your site](#getting-started-after-your-deployment).

## Getting Started After Deployment

### Access Your WooCommerce Site

After WooCommerce and WordPress have finished installing, you will be able to access your site by copying your Linode's IPv4 address and entering it in the browser of your choice. To find your Linode's IPv4 address:

1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

1. Find the Linode you just created when deploying your app and select it.

1. Navigate to the **Networking** tab.

1. Your IPv4 address will be listed under the **Address** column in the **IPv4** table.

1. Copy and paste the IPv4 address into a browser window. You should see your WooCommerce site's home page.

1.  Once you have accessed your site via the browser, you can log in to the WordPress administrative interface and [start configuring your store](#complete-the-woocommerce-setup-wizard).

    The address of the WordPress login page is `http://< your IP address >/wp-login.php`. Or, you can click on the log in link that's visible on your site's home page, as highlighted below. Enter the credentials you previously specified in the **Admin Username** and **Admin Password** fields when you deployed the app.

    ![Log in to your WordPress site.](wordpress-login.png)

### Complete the WooCommerce Setup Wizard

When you first log in to the WordPress admin interface, you will be presented with a banner that asks you to complete the WooCommerce setup wizard:

![WooCommerce Setup Wizard Banner](woocommerce_setup_wizard_banner.png "WooCommerce setup wizard banner")

Click on the **Run the Setup Wizard** button to visit this form and start your store configuration.

### Software Included


| **Software** | **Description** |
|:--------------|:------------|
| [**MySQL Server**](https://www.mysql.com/) | Relational database. |
| [**PHP 7**](https://www.php.net/) | WordPress is written in PHP and requires PHP to operate. |
| [**Apache HTTP Server**](https://httpd.apache.org/) | Web server used to serve the WordPress site. |
| [**WordPress**](https://wordpress.org/) | Content management system. |
| [**WP CLI**](https://wp-cli.org/) | The command line interface for WordPress. |
| [**WooCommerce**](https://woocommerce.com/) | An online storefront plugin for WordPress. |

{{< content "email-warning-shortguide" >}}

{{< content "marketplace-update-note-shortguide">}}
