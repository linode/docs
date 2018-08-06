---
author:
  name: Nathan Melehan
  email: nmelehan@linode.com
description: 'How to migrate a LAMP website from another hosting provider to Linode.'
keywords: ["wordpress", "wordpress.com", "migrate", "website migration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-03
modified_by:
  name: Linode
published: 2018-08-03
title: How to Migrate a WordPress.com Website to Linode
external_resources:
 - '[WordPress.com: Moving to Self-Hosted WordPress](https://move.wordpress.com/)'
---

This guide describes how to export your content from WordPress.com and self-host your WordPress website on Linode. Read the [Best Practices when Migrating to Linode](/docs/platform/migrate-to-linode/best-practices-when-migrating-to-linode/) guide prior to following this guide for more information about migrating your site.

Ubuntu 18.04 is used as the distribution for the new Linode deployment in this guide. If you'd like to choose another distribution, us the examples here as an approximation for the commands you'll need to run. You will also install either a [LAMP](http://localhost:1313/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-18-04/) or [LEMP](http://localhost:1313/docs/web-servers/lemp/how-to-install-a-lemp-server-on-ubuntu-18-04/) environment on your new Linode.

{{< note >}}
WordPress.com's export feature will export pages, posts, and comments from your site, but it will not export your themes and widgets. You will need to customize your new self-hosted WordPress site's appearance after completing your migration.
{{< /note >}}

## Migrate Your Website

### Deploy Your Linode

1.  Follow Linode's [Getting Started](/docs/getting-started/) guide and choose Ubuntu 18.04 as your Linux image when deploying. Choose a Linode plan with enough storage space to accommodate the website data from your current host.

1.  Follow the [How to Secure Your Server](/docs/security/securing-your-server/) guide and create a limited Linux user with `sudo` privileges.

1.  Follow the [Install WordPress on Ubuntu 18.04](/docs/websites/cms/install-wordpress-ubuntu-18-04) guide to stand up a new web server and WordPress installation. Later in this guide you will use the WordPress credentials you create during the installation, so be sure to record them.

### Export Your WordPress.com Content

1.  Login to your WordPress.com dashboard and navigate to the `Settings` page. Choose the `Export` option from the `Settings` page:

    ![WordPress.com Settings Page](wordpressdotcom-settings.png)

1.  Click the Export All button and download the exported content from the link that appears. An XML file containing your content will be downloaded to your computer:

    ![WordPress.com Export Page](wordpressdotcom-export.png)

### Import Your Content on Linode

1.  Visit your Linode-hosted WordPress login form in your browser (available at `http://<your-linode-ip>/wp-admin`) and login with your WordPress credentials.

1.  Navigate to the Import page of the Tools section. The WordPress importer plugin will be listed:

    ![WordPress Tools Page](tools-import-wordpress.png)

1.  Choose the `Install Now` link and then run this plugin. On the page that appears, click the `Choose File` button and locate the XML file you previously exported from WordPress.com to your computer:

    ![WordPress Importer Plugin - Page 1](wordpress-importer-plugin-1.png)

1.  A page will appear that surfaces a few import options:

    ![WordPress Importer Plugin - Page 1](wordpress-importer-plugin-2.png)

    You are able to assign your imported posts to:

    -   Your previous WordPress.com user, which will also be imported
    -   A brand new user that the import plugin will create
    -   One of the WordPress users you've already created on your Linode as part of deploying your web server

    **Be sure to enable** the *Download and import file attachment* option on this page.

1.  Submit this form. Your content will now be imported.

1.  Navigate to the `Permalinks` page in the `Settings` section:

    ![WordPress Permalinks](wordpress-permalinks.png)

1.  Choose the *Day and name* option and save the change. This option matches the permalink style used on WordPress.com.

## Migrating DNS Records

The last step required to migrate is to update your DNS records to reflect your new Linode's IP. Once this is done, visitors will start loading the page from your Linode.

{{< content "use-linode-name-servers" >}}

## Next Steps

The WordPress.com team recommends installing the [Jetpack plugin](https://jetpack.com/) on your new self-hosted WordPress site. This free plugin is maintained by the WordPress.com team and provides features available on your WordPress.com site, including analytics, site management tools, and access to the [WordPress.com apps](https://apps.wordpress.com/). [Premium versions](https://jetpack.com/pricing/) of the Jetpack plugin provide extra features.

If you had subscribers on your WordPress.com site, you can also migrate them to your new self-hosted site. This requires that you install the Jetpack plugin and uses Jetpack's [subscription migration tool](https://jetpack.com/support/subscription-migration-tool/).

Your new self-hosted WordPress site uses the default themes and widgets. Review the WordPress.org documentation for [themes](https://codex.wordpress.org/Using_Themes#Adding_New_Themes_using_the_Administration_Panels) and [widgets](https://codex.wordpress.org/WordPress_Widgets) to learn how to customize your site's appearance.