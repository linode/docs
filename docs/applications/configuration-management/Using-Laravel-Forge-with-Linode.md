---
author:
    name: Onwuka Gideon
    email: dongidomed@gmail.com
description: 'How to use Laravel Forge to deploy your php projects with Linode'
keywords: 'linode,content management,management,automation,development,laravel,php,wordpress,drupal,cms,joomla,server,Forge,Laravel Forge'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: [  ]
modified: Tuesday, August 8th, 2017 
modified_by:
    name: Onwuka Gideon
published: ' '
title: 'Using Laravel Forge with Linode'
external_resources:
 - '[Laravel Forge](https://forge.laravel.com)'
---


[Laravel Forge](https://forge.laravel.com) is not all about the [Laravel framework](https://laravel.com). Forge is an incredible tool that provides a GUI interface for interacting with servers seamlessly. It’s in the family of Laravel products that help developers focus on developing and not deploying and hosting. You can deploy any of your PHP related project easily on Linode with the help of Forge which provides a GUI feature for managing and running commands on your Linode server.

 By default, when deploying our project, we usually install Nginx, PHPMyAdmin, PHP and many other things needed. Laravel Forge does all the necessary installation and configuration for you, you just need to do a little configuration and your website will be up.

 This guide covers how to use Laravel Forge with Linode.
 

## Before You Begin

1. Sign up for a Larvel Forge account if you don't have one ([Laravel Forge](https://forge.laravel.com/auth/register))
2. Sign up or Log into your Linode account. ([Linode](https://www.linode.com/))

## Link to a Source Control (GitHub, Gitlab or Bitbucket)

If you want to deploy from either of these services( Github, Gitlab or bitbucket), you need to link them to your Forge account. Once you are logged in to your Forge Account, head to your profile tab.

1. Choose your preferred source control by clicking on the `Source Control` Link on the Left.

[![Linode API](/docs/assets/configuration-management/linking_source_control.png)](/docs/assets/configuration-management/linking_source_control.png)

2. **Click** on either; `CONNECT TO GITHUB` , `CONNECT TO GITLAB`, or `CONNECT TO BITBUCKET`. In this tutorial I'll Gitlab, So I clicked on `CONNECT TO GITLAB`. 

Once you select the Source Control you want, you’ll be redirected to the Source control website where you need to authorize Laravel Forge and then you will be redirected back to Forge’s website.

[![Linode API](/docs/assets/configuration-management/source_control_authorized.png)](/docs/assets/configuration-management/source_control_authorized.png)


## Add SSH keys to your profile.
You should have received an email already about details of your ssh from above. 

[![Linode API](/docs/assets/configuration-management/adding_public_key.png)](/docs/assets/configuration-management/adding_public_key.png)

Click on the `SSH Keys` and upload your local SSH Key by following the link on the mail or see How to create and copy an SSH Key.  Once you have your SSH key, add a name and your key to the form and submit by clicking on `ADD KEY`


## Get your Linode API key
Laravel Forge needs your Linode’s API key to connect to Linode. 

1. Follow this guide to get your Linode API key https://www.linode.com/docs/platform/api/api-key

## Adding your Linode API key to Forge.

1. Head over to your Laravel Forge Dashboard.

2. Click on `Service Providers`.

3. Select Linode and input your API key. This is the key you just created above.

   [![Linode API](/docs/assets/configuration-management/adding_api_key_to_forge.png)](/docs/assets/configuration-management/adding_api_key_to_forge.png)


## Create a server

1. Click on Linode.

    [![Linode API](/docs/assets/configuration-management/create_a_server.png)](/docs/assets/configuration-management/create_a_server.png)

    You will then be provided with some options:

**Credentials** This will be any cloud providers that you have linked to your account.

**Name** The name that you want to name your server. You can name it anything you like. If you have a specific domain in mind for this particular server, then name it that. I named mine `icy-start`.

**Server Size** The size of the server that you'd like to create. Here we have many different options so pick whatever fits the needs for your application. This is the server option in Linode.

**Region** Wherever you want your server to be located. Ideally you'd want it to be close to where you believe your main users will be.

**PHP Version** This will be the php version that will be installed on your Linode server.

**Database Name** If your application needs a database, then you can name it here. By default it will be named `forge`.

2. Once you have the configuration you like, go ahead and click Create Server. 

   [![Linode API](/docs/assets/configuration-management/server_credential.png)](/docs/assets/configuration-management/server_credential.png)

When you click on `create server`, you will get a pop up showing your sudo password and database password. There are the details of the database that has been created for you.

Now, your newly created server will be listed in the Active server below. You should now see that Forge is going through the paces of creating a server, configuring it, and getting it ready based on the settings we just input.

Once the new server is ready to go, you will see it's green and good to go(By default, it takes some seconds).


[![Linode API](/docs/assets/configuration-management/active_servers.png)](/docs/assets/configuration-management/active_servers.png)

When you visit your IP Address, you will see that our server has been set up for us.

[![Linode API](/docs/assets/configuration-management/server_set_up_with_php_7_1.png)](/docs/assets/configuration-management/server_set_up_with_php_7_1.png)

When the server is active, you will also receive mail from Linode with details of things that has been created.

[![Linode API](/docs/assets/configuration-management/mail_from_linode_showing_details_created.png)](/docs/assets/configuration-management/mail_from_linode_showing_details_created.png)

You will also receive a mail that a public key was added to your gitlab account.

Now, lets confirm that the server is created on Linode also, head over to linode under the linode tab, you should see a node that has been created.


[![Linode API](/docs/assets/configuration-management/linode_created.png)](/docs/assets/configuration-management/linode_created.png)


## Pointing your domain name

If you intend to visit the site you're setting up via a real domain (versus just testing it by visiting the IP address), you have to add the domain because DNS record changes can take a while to update. 

1. Now head back to Laravel Forge account then click on the active server. 

2. Go to your domain name provider, add an ANAME record for the domain or subdomain, and point it to the public IP address of your server. Your public IP address is as seen in the screenshot below, mine is: `41.33.92.166` That's it!


[![Linode API](/docs/assets/configuration-management/adding_new_domain.png)](/docs/assets/configuration-management/adding_new_domain.png)

- Root Domain: This is your domain name.
- Project Type: This is the type of of project you are using, If you are building regular php, you can choose : ` General PHP / Laravel`. ( the other option available are: General PHP / Laravel, Static, HTML, Symfony, Symfony (Dev).       
- Web Directory: This is where you public files will be served from.

3. Submit the form by clicking `ADD SITE`.


{: .note}
>
> By default, a default site is created for you, so if you don’t want to add a domain name now, you can visit your public IP which is linked to the Default site created.


## Adding our repository and auto-deployment

1. Click on your active servers then under the active site, choose the domain name you added. If you are just testing out, then click on the `Default`.

[![Linode API](/docs/assets/configuration-management/adding_repository.gif)](/docs/assets/configuration-management/adding_repository.gif)

2. Click on Apps on the left hand side and then select your `Git Repository`.

[![Linode API](/docs/assets/configuration-management/adding_git_repository.png)](/docs/assets/configuration-management/adding_git_repository.png)

3. Fill in the repository field with your username and repository then select the branch you want to use. Now, click on INSTALL REPOSITORY. Take a closer look how the `Repository` Field is inserted which is  gitlab_username/repository_name_without_.git`. 

eg: 

```
    dongido/transaction-manager
```

[![Linode API](/docs/assets/configuration-management/git_repository_name.png)](/docs/assets/configuration-management/git_repository_name.png)


When you click **INSTALL REPOSITORY** your project in Gitlab will be copied to the Linode server and composer install and other important commands will be done for you by forge under the background. 

If you visit the website again, you will see that the repository is now copied to our Linode server and everything is set up.

[![Linode API](/docs/assets/configuration-management/site_up_and_running.png)](/docs/assets/configuration-management/site_up_and_running.png)

## Auto deploy.
In this era of Continuous integration where we always want to keep making changes or adding features to our live site and want the changes to get deployed immediately.

The next page that you will get after clicking on the `INSTALL REPOSITORY`. There you can set the auto deploy immediately.

[![Linode API](/docs/assets/configuration-management/Laravel_forge_deploy.png)](/docs/assets/configuration-management/Laravel_forge_deploy.png)


Here, you just need to change the quick deploy to `ON`. Then try making change to your project on gitlab and revisit you site and see your changes appear.

if in any way, you are not on the page, you can get to the deploy page by:

1. Choose thue site that you are working on.

2. Make sure the `quick deploy` option is set to ON.

[![Linode API](/docs/assets/configuration-management/laravel_forge_sites.png)](/docs/assets/configuration-management/laravel_forge_sites.png)


## Adding SSL to your domain name
SSL (Secure Sockets Layer) is the standard security technology for establishing an encrypted link between a web server and a browser. To add SSL:

1. Choose your server on Forge.

2. Select the domain name that you want to add SSL to. 

3. Click on `SSL` from the left options.


[![Linode API](/docs/assets/configuration-management/laravel_forge_adding_ssl.png)](/docs/assets/configuration-management/laravel_forge_adding_ssl.png)

Laravel Forge comes with LetsEncrypt which help us generate a free SSL certificate.  

1. Click on the `LetsEncrypt (Beta)` (if you already have an existing certificate, click on the Install Existing Certificate). 

2. If you clicked on the `LetsEncrypt (Beta), you will be presented with a button to obtain a certificate, 

3. click on it and allow it to install. 

4. Activate it by clicking on the activate icon.

You are done!

## Conclusion
In this article, we've seen how easy and less time consuming it is working with Forge on Linode. We have been able to deploy our PHP project to Linode Using Laravel Forge.
