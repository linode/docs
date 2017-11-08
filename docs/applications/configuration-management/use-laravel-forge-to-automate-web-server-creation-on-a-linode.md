---
author:
    name: Onwuka Gideon
    email: dongidomed@gmail.com
description: 'This guide shows how to use Laravel Forge to automate deployment of your PHP projects on a Linode.'
keywords: ["content management", "web-server automation", "laravel", "php", "wordpress", "drupal", "cms", "joomla", "Laravel Forge"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-20
modified_by:
    name: Onwuka Gideon
published: 2017-09-18
title: 'Use Laravel Forge to Automate Web-Server Creation on a Linode'
external_resources:
 - '[Laravel Forge](https://forge.laravel.com)'
---

![Laravel Forge Banner](/docs/assets/configuration-management/Laravel_Forge.jpg)

## What is Laravel Forge

[Laravel Forge](https://forge.laravel.com) is a tool for deploying and configuring web applications. It was developed by the makers of the [Laravel framework](https://laravel.com), but can be used to automate the deployment of any web application that uses a PHP server.

Creating a fully-functioning web server is normally a complicated and time-consuming process, involving the installation of multiple components such as Nginx, MySQL, and PHP. Laravel Forge automates all of the necessary installation and configuration, allowing you to get your website up and running quickly.

Once your server has been created, deploying updates becomes as simple and painless as pushing to your repository on Github. Also, you can easily manage the configuration of your website though a web interface. Finally, Forge automatically provides advanced security features, such as free SSL certificates (through [Let's Encrypt](https://letsencrypt.org/)) and automatic firewall configuration.


## Before You Begin

1. Sign up for a [Laravel Forge](https://forge.laravel.com/auth/register) account if you do not have one.

2. This guide will require a [Linode](https://www.linode.com/) account and an API key. For more detailed instructions, refer to [this guide](https://www.linode.com/docs/platform/api/api-key).

## Link to a Source Control Service

If you want to be able to quickly deploy from Github, Gitlab or Bitbucket, you will need to link these sites to your Forge account. From your Forge dashboard, select the **Your Profile** tab.

1. Choose your preferred source control by clicking on the **Source Control** link on the Left.

    ![Linode API](/docs/assets/configuration-management/linking_source_control.png)

2. Click on the source control service you would like to connect to.

    Once you link to a source control service, you will be prompted to authorize Laravel Forge. You will then be redirected back to Forge’s website.

    ![Linode API](/docs/assets/configuration-management/source_control_authorized.png)

## Adding Your Linode API Key to Forge

1. Open your Laravel Forge Dashboard.

2. Click on **Service Providers**.

3. Select **Linode** and input your API key.

   ![Linode API](/docs/assets/configuration-management/adding_api_key_to_forge.png)

## Create a Server

1. Click on **Linode**.

    ![Linode API](/docs/assets/configuration-management/create_a_server.png)

    You will then be provided with some options:

    **Credentials:** Any cloud providers that you have linked to your account.

    **Name:** A name for your server. You can choose any name you like.

    **Server Size:** The size of the server.

    **Region:** The datacenter where you want your server hosted. Choose a location close to where you expect the majority of users to be.

    **PHP Version:** The installed PHP version.

    **Database Name:** If your application needs a database, then you can name it here. By default it will be named `forge`.

2. Once you have finished selecting options, click **Create Server**. A pop up will show you the sudo and database passwords that have been automatically generated for you. Be sure to copy these values and store them in a secure place.

    ![Linode API](/docs/assets/configuration-management/server_credential.png)

    Forge will now perform the steps necessary to create and configure a Linode based on the settings you chose earlier.

3. A green check in the **Status** column means the server is active. This will take a few seconds.

    ![Linode API](/docs/assets/configuration-management/active_servers.png)

4. Navigate to the public IP address of your Linode in a browser.

    ![Linode API](/docs/assets/configuration-management/server_set_up_with_php_7_1.png)

5. When the setup process has completed, you will receive an email containing details about your new server.

    ![Linode API](/docs/assets/configuration-management/mail_from_linode_showing_details_created.png)

## Add a Domain Name

If you want to use Let's Encrypt to obtain a free SSL certificate for your website, you will need to buy a Fully Qualified Domain Name (FQDN) and set it to point to your new server.

1. Head back to Laravel Forge account then click on the active server.

2. Go to your domain name provider, add an ANAME record for the domain or subdomain, and point it to the public IP address of your server.


    ![Linode API](/docs/assets/configuration-management/adding_new_domain.png)

    - Root Domain: This is your domain name.
    - Project Type: This is the type of project you are using. If you are building regular PHP, you can choose `General PHP/Laravel`. Other options include Static, HTML, Symfony, and Symfony (Dev).
    - Web Directory: This is the directory from which public files will be served.

3. Submit the form by clicking **ADD SITE**.

    {{< note >}}
If you do not add a domain name, you can still access your server through its public IP address.
{{< /note >}}

## Add a Repository

1. Click on your active servers. Under the active site, choose the domain name you added in the previous step.

    ![Linode API](/docs/assets/configuration-management/adding_repository.gif)

2. Click **Apps** on the left-hand side and then select your Git repository.

    ![Linode API](/docs/assets/configuration-management/adding_git_repository.png)

3. Fill in the repository field with your username and repository. Then select the branch you want to use. Click on **INSTALL REPOSITORY.** Observe that the repository field is `gitlab_username/repository_name_without_.git`. The sample image below shows `dongido/transaction-manager`:

    ![Linode API](/docs/assets/configuration-management/git_repository_name.png)

4. If you visit the website again, the repository is now copied to your Linode server and everything is set up.

    ![Linode API](/docs/assets/configuration-management/site_up_and_running.png)

## Quick Deploy
These steps will show how to immediately deploy changes from the source directory to the live site.

1. From the **INSTALL REPOSITORY** menu, toggle **Quick Deploy** to "on".

    ![Linode API](/docs/assets/configuration-management/Laravel_forge_deploy.png)

2. Make changes to your project on Github or Gitlab and commit them to the master branch. Your live site will be updated to reflect the changes.

    ![Linode API](/docs/assets/configuration-management/laravel_forge_sites.png)

## Adding SSL to Your Domain Name
SSL (Secure Sockets Layer) is the standard security technology for establishing an encrypted link between a web server and a browser. To add SSL:

1. Choose your server on Forge.

2. Select the domain name of your server.

3. Click on **SSL** from the menu on the left.

    ![Linode API](/docs/assets/configuration-management/laravel_forge_adding_ssl.png)

    Laravel Forge comes with LetsEncrypt which help us generate a free SSL certificate.

4. If you already have an SSL certificate, click on the Install Existing Certificate. Otherwise, select **LetsEncrypt (Beta)**.

5. If you chose to use LetsEncrypt, you will be presented with a button to obtain a certificate. Click on it and allow it to install.

6. Activate your new certificate by clicking on the **activate** icon.

