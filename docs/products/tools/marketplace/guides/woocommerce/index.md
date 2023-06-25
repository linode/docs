---
description: "Learn how to deploy WooCommerce, the most popular ecommerce plugin, on Wordpress through the Linode Marketplace."
keywords: ['woocommerce','wordpress','marketplace apps','ecommerce','e-commerce','cms']
tags: ["cloud-manager","linode platform","cms","wordpress","marketplace"]
published: 2019-04-02
modified: 2023-06-06
title: "Deploy WooCommerce through the Linode Marketplace"
aliases: ['/platform/marketplace/marketplace-woocommerce/','/platform/marketplace/how-to-deploy-woocommerce-with-marketplace-apps/', '/platform/one-click/how-to-deploy-woocommerce-with-one-click-apps/','/platform/one-click/one-click-woocommerce/','/guides/how-to-deploy-woocommerce-with-one-click-apps/','/guides/how-to-deploy-woocommerce-with-marketplace-apps/','/guides/woocommerce-marketplace-app/']
external_resources:
- '[WooCommerce Docs](https://docs.woocommerce.com/)'
- '[Introduction to eCommerce for WordPress](https://woocommerce.com/guides/ecommerce-for-wordpress-intro/)'
- '[New Store Owners Guide](https://woocommerce.com/guides/new-store/)'
- '[WooCommerce Storefront Theme](https://woocommerce.com/storefront/)'
- '[WooCommerce Themes by Industry](https://woocommerce.com/product-category/themes/storefront-child-theme-themes/)'
- '[WooCommerce Extensions](https://woocommerce.com/product-category/woocommerce-extensions/)'
---

[WooCommerce](https://woocommerce.com/) is a popular open source eCommerce plugin for WordPress that can power online storefronts to sell both digital and physical products for small-to-large businesses. A variety of [themes for WooCommerce](https://woocommerce.com/product-category/themes/storefront-child-theme-themes/) are available so you can create a store that looks the way you want it to.  WooCommerce takes payments via major credit cards, bank transfers, [PayPal](https://woocommerce.com/products/woocommerce-gateway-paypal-checkout/), and other providers like [Stripe](https://woocommerce.com/products/stripe/). The WooCommerce plugin is free, but some themes and extensions have a cost.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** WooCommerce should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used, though a minimum of a 4GB Dedicated CPU Compute Instance is recommended for production websites.

### WooCommerce Options

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
- **Would you like to be able to send password reset emails for WordPress?** Creates the required DNS records and configures the server so you can send emails from WordPress, such as for resetting a password.
- **Would you like to use a free Let's Encrypt SSL certificate?** If you would like to use the free Let's Encrypt CA to generate TLS/SSL certificates, select *Yes*.

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

1.  Open your web browser and navigate to `http://[domain]/wp-admin/`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's IPv4 address or rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

    ![Screenshot of the browser's URL bar](wordpress-browser-url.png)

1.  Within the login page that appears, enter the username (*admin username*) that you created when you deployed this instance and the associated password that was automatically generated. Then click the **Log In** button.

    ![Screenshot of the WordPress login form](wordpress-login.png)

1.  Once logged in, the WordPress Admin Dashboard appears. From here, you can create new posts, add users, modify the theme, and adjust any settings.

    ![Screenshot of the WordPress dashboard](wordpress-admin.png)

### Viewing Your Website

Open a web browser and navigate to `http://[domain]`, replacing *[domain]* with the custom domain you entered during deployment or your Compute Instance's IPv4 address or rDNS domain. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS. Your WordPress site should now be displayed.

### Complete the WooCommerce Setup Wizard

1. After logging in to the WordPress Admin interface, initiate the WooCommerce Setup Wizard by clicking the **Start Selling** button within the WooCommerce Setup banner that appears on the dashboard. You can also initiate the Setup Wizard by hovering over *WooCommerce* on the left menu and selecting **Home**.

    ![Screenshot of WooCommerce setup card](woocommerce-setup.png)

1. Follow each step of the Setup Wizard by entering in your store address details, selecting the industry, selecting the types of products that you intend on selling, entering additional business details, and selecting a theme.

    {{< note >}}
    Some WooCommerce features and themes require a monthly or yearly paid subscription or otherwise cost money. When going through the Setup Wizard, be aware of the cost of each optional feature you select.
    {{< /note >}}

1. Depending on the options you select, you may be asked to create a [Jetpack](https://jetpack.com/) account or connect your existing account. This enables you to use Jetpack's suite of tools within WordPress. Jetpack offers a free tier as well as multiple paid tiers. See [Jetpack Pricing](https://cloud.jetpack.com/pricing). You can safely ignore this screen if you do not wish to use Jetpack services.

1. Once the Setup Wizard has finished, you are taken to *WooCommerce* > *Home* within your WordPress Admin dashboard. From here, you are presented with a checklist of tasks you may need to complete before selling products. This includes adding products, setting up a payment processor, creating tax rules, and more. See the [WooCommerce Documentation site](https://woocommerce.com/documentation/) to get help completing these steps and using your WooCommerce store.

{{< content "email-warning-shortguide" >}}

## Going Further

Now that your WordPress installation is deployed, you can start adding content and modifying it to suit your needs. Here are a few links to help get you started:

- [WordPress Support](https://wordpress.org/support/): Learn the basic workflows for using WordPress.
- [Securing WordPress](/docs/guides/how-to-secure-wordpress/): Advice on securing WordPress through HTTPS, using a secure password, changing the admin username, and more.
- [WordPress Themes](https://wordpress.org/themes/#): A collection of *thousands* of WordPress themes.
- [Marketplace Apps Repository](https://github.com/linode-solutions/marketplace-apps): Review the deployment Ansible playbooks.

{{< content "marketplace-update-note-shortguide">}}
