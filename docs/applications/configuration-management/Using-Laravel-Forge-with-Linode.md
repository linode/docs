---
author:
    name: Onwuka Gideon
    email: dongidomed@gmail.com
description: 'How to use Laravel Forge to deploy your PHP projects with Linode'
keywords: 'linode,content management,management,automation,development,laravel,php,wordpress,drupal,cms,joomla,server,Forge,Laravel Forge'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Tuesday, August 8th, 2017 
modified_by:
    name: Onwuka Gideon
published: 'Monday, September 18, 2017'
title: 'Using Laravel Forge with Linode'
external_resources:
 - '[Laravel Forge](https://forge.laravel.com)'
---


[Laravel Forge](https://forge.laravel.com) is not all about the [Laravel framework](https://laravel.com). Forge is an incredible tool that provides a GUI interface for interacting with servers seamlessly. Deploy any of your PHP related projects easily on Linode with the help of Forge which provides a GUI feature for managing and running commands on your server.

When deploying our project, we usually install Nginx, PHPMyAdmin, and PHP. Laravel Forge does all the necessary installation and configuration. The user manages configurations though the web interface without needing use SSH.


## Before You Begin

1. Sign up for a  [Laravel Forge](https://forge.laravel.com/auth/register) account if you do not have one.

2. This guide will require a [Linode](https://www.linode.com/) and an API key. For more detailed instructions, refer to [this guide](https://www.linode.com/docs/platform/api/api-key).

## Link to a Source Control (GitHub, Gitlab or Bitbucket)

If you want to deploy from Github, Gitlab or Bitbucket, you need to link them to your Forge account. Once you are logged in to your Forge Account, head to your profile tab.

1. Choose your preferred source control by clicking on the `Source Control` link on the Left.

    ![Linode API](/docs/assets/configuration-management/linking_source_control.png)

2. **Click** on either; `CONNECT TO GITHUB` , `CONNECT TO GITLAB`, or `CONNECT TO BITBUCKET`. 

    Once you link to a Source Control, the Source control website will prompt to authorize Laravel Forge and then you will be redirected back to Forge’s website.

    ![Linode API](/docs/assets/configuration-management/source_control_authorized.png)

## Adding your Linode API key to Forge.

1. Head over to your Laravel Forge Dashboard.

2. Click on `Service Providers`.

3. Select Linode and input your API key.

   ![Linode API](/docs/assets/configuration-management/adding_api_key_to_forge.png)

## Create a server

1. Click on Linode.

    ![Linode API](/docs/assets/configuration-management/create_a_server.png)

    You will then be provided with some options:

    **Credentials** This will be any cloud providers that you have linked to your account.

    **Name** The name that you want to name your server. You can name it anything you like. If you have a specific domain in mind for this particular server, then name it that. This guide uses `icy-start` as an example.

    **Server Size** The size of the server. There are many different options to fit the needs for your application.

    **Region** Wherever you want your server to be located. Ideally it will be close to where your main users will be.

    **PHP Version** The installed PHP version..

    **Database Name** If your application needs a database, then you can name it here. By default it will be named `forge`.

2. Once you have the configuration you like, go ahead and click Create Server. 

    ![Linode API](/docs/assets/configuration-management/server_credential.png)

    When you click on `create server`, a pop up will show your sudo password and database password.

    You should now see that Forge is going through the steps of creating a Linode and getting it ready based on the configured settings.

3. Green means the server is active. This will take a few seconds.

    ![Linode API](/docs/assets/configuration-management/active_servers.png)

4. Visit the public IP address of your Linode in a browser.

    ![Linode API](/docs/assets/configuration-management/server_set_up_with_php_7_1.png)

5. When the server is active, you will also receive mail from Linode with details of things that has been created.

    ![Linode API](/docs/assets/configuration-management/mail_from_linode_showing_details_created.png)

## Add a Domain Name

Adding a domain name may take some time because DNS record changes can take a while to update. A domain name also makes the process of adding an SSL certificate much easier.

1. Head back to Laravel Forge account then click on the active server. 

2. Go to your domain name provider, add an ANAME record for the domain or subdomain, and point it to the public IP address of your server. 


    ![Linode API](/docs/assets/configuration-management/adding_new_domain.png)

    - Root Domain: This is your domain name.
    - Project Type: This is the type of of project you are using, If you are building regular php, you can choose : `General PHP / Laravel`. Other options are: General PHP / Laravel, Static, HTML, Symfony, Symfony (Dev).
    - Web Directory: This is where you public files will be served from.

3. Submit the form by clicking `ADD SITE`.

    {: .note}
    >
    > A default site is automatically created for you. If no domain name is added, you can visit your public IP which is linked to the default site.


## Add our Repository

1. Click on your active servers. Under the active site, choose the domain name you added.

    ![Linode API](/docs/assets/configuration-management/adding_repository.gif)

    If you are testing out, then click on `Default`.

2. Click `Apps` on the left hand side and then select your `Git Repository`.

    ![Linode API](/docs/assets/configuration-management/adding_git_repository.png)

3. Fill in the repository field with your username and repository. Then select the branch you want to use. Click on `INSTALL REPOSITORY`. Observe that the `Repository` Field is `gitlab_username/repository_name_without_.git`. The sample image below shows `dongido/transaction-manager`:

    ![Linode API](/docs/assets/configuration-management/git_repository_name.png)

    When you click **INSTALL REPOSITORY** your project in Gitlab will be copied to the Linode server and composer install and other important commands will be done for you by forge under the background. 

4. If you visit the website again, the repository is now copied to our Linode server and everything is set up.

    ![Linode API](/docs/assets/configuration-management/site_up_and_running.png)

## Auto Deploy
These steps will show how to immediately deploy changes and features from the source directory to the live site.

1. Click `INSTALL REPOSITORY`. There you can toggle auto deploy.

    ![Linode API](/docs/assets/configuration-management/Laravel_forge_deploy.png)

2. After toggling quick deploy to `ON`, try making changes to your project on Gitlab. Revisit your site and see your changes deployed to the live site.

    ![Linode API](/docs/assets/configuration-management/laravel_forge_sites.png)

## Adding SSL to your domain name
SSL (Secure Sockets Layer) is the standard security technology for establishing an encrypted link between a web server and a browser. To add SSL:

1. Choose your server on Forge.

2. Select the domain name that you want to add SSL to. 

3. Click on `SSL` from the left options.

    ![Linode API](/docs/assets/configuration-management/laravel_forge_adding_ssl.png)

    Laravel Forge comes with LetsEncrypt which help us generate a free SSL certificate.

4. Click on `LetsEncrypt (Beta)`. If you already have an existing certificate, click on the Install Existing Certificate. 

5. If you clicked on the `LetsEncrypt (Beta)`, you will be presented with a button to obtain a certificate. Click on it and allow it to install. 

6. Activate it by clicking on the activate icon.

## Conclusion
We've seen how easy and less time consuming it is working with Forge on Linode. We have been able to deploy our PHP project to Linode Using Laravel Forge.
