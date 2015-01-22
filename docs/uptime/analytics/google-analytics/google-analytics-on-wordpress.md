---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Get in-depth website visitor statistics with Google Analytics on your WordPress website.'
keywords: 'analytics,google analytics,wordpress,analytics,tracking,statistics'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['']
modified: Tuesday, January 28th, 2014
modified_by:
  name: Elle Krout
published: 'Monday, February 22nd, 2010'
title: Google Analytics on WordPress
external_resources:
- '[Analytics Help](https://support.google.com/analytics/?hl=en#topic=3544906)'
- '[Google Analytics Developers](https://developers.google.com/analytics/)'
---

Google Analytics offers statistics and analysis related to visitor traffic for your WordPress website, allowing you to better know your audience.

This guide provides three ways to add Google Analytics to your website: By directly adding the analytics code to your theme, and two plugin options. Prior to using this guide you should have completed our [Manage Web Content with WordPress](/docs/websites/cms/manage-web-content-with-wordpress) guide, and have a fully-configured WordPress website set up.

{: .note}
>
>The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Signing Up for Google Analytics

Prior to adding Google Analytics to your website, you need to sign up and set up your Google Analytics account.

1.  Navigate to the [Google Analytics](http://www.google.com/analytics) website, clicking the **Access Google Analytics** button to the top right.

2.  Click **Sign Up**.

3.  Be sure the **Website** option is selected, then enter your account information as desired. Be sure that your website URL is accurate.

    ![Google Analytics account creation](/docs/assets/googleana-wordpress-signup.png)

4.  Press **Get Tracking ID**, and read through and accept the Google Analytics Terms of Service.

5.  You will then be given your **Tracking ID** and **tracking code**. Make note of both of these items, you will use them later.

You are now set up with Google Analytics and can decide how to procede with adding the code to your WordPress website: [Directly](#directly-add-google-analytics-to-your-wordpress-website) or [through a plugin](#add-google-analytics-through-a-plugin).

## Directly Add Google Analytics to Your WordPress Website

WordPress is written in PHP, so adding a Google Analytics code is as easy as altering a single file in your WordPress theme.

{: .note}
>
>Always replace `example.com` with your own domain information.

1.  Navigate to your theme directory:

        cd /var/www/example.com/public_html/wp-content/themes

2.  Use the `ls` command to see your list of theme folders. Note the folder name of the theme are you *currently* using:

        ls

4.  Navigate to the folder that denotes the *current* theme you are using. In this example we are using the default Twenty Fifteen theme:

        cd twentyfifteen

5.  Open `header.php`:

        nano header.php

6.  Add your Google Analytics **tracking code** underneath the `<body <?php body_class(); ?>>` tag:

    {: .file-excerpt}
    /var/www/example.com/public_html/wp-content/themes/header.php
    :   ~~~
        <script>
         (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
         (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
         m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
         })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

         ga('create', 'UA-00000000-0', 'auto');
         ga('send', 'pageview');

        </script>
        ~~~

    {: .note}
    >
    >If you copy the above code replace `UA-00000000-0` with your **tracking ID**.

7.  **CTRL-X** then **Y** to exit the editor.

8.  To determine the success of the above process, open your WordPress website in your browser, then view the source code. You should see the Google Analytics code inserted below the `<body>` tag. It is highlighted in the below example:

    ![Google Analytics source check](/docs/assets/googleana-wordpress-source.png)

Congratulations! You have added Google Analytics to your WordPress website. It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics.

##Add Google Analytics Through A Plugin

In this section, we will explore adding Google Analytics to a WordPress website through two popular plugins. These plugins both add Google Analytics dashboards to your adminstration interface and inject the tracking code into your theme. If you have already added Google Analytics through the above method, these plugins can also complement that process by adding in-dashboard features, should you desire to view your analytics within WordPress itself.

###Google Analytics Dashboard for WP

The Google Analytics Dashboard for WP is a comprehensive WordPress plugin that incorporates Google Analytics to your dashboard home, allowing you to track changes in visitors from the moment you log in. It is a powerful plugin that also offers both back- and frontend features allowing you to share your Google Analytics results with everyone from visitors to blog contributors.

1.  Prior to installing the Google Analytics for WP plugin you will need to add **PHP Curl** to your Linode. Log in to your server through SSH to update and install PHP Curl:

        apt-get update && apt-get install php5-curl

2.  Log in to your WordPress dashboard and navigate to your **Add New Plugins** link. Seach, download, and enable **Google Analytics for WP**. A Google Analytics section will to added to the navigation pane to the left.

3. Click on the **Google Analytics** link and select **Authorize Plugin**. It will ask for an access code, which you can get by clicking the **Get Access Code** link. You will need to log in to your Google account and allow the plugin to view your Google Analytics data.

    ![Google Analytics Dashboard for WP](/docs/assets/googleana-wordpress-forwp1.png)

4.  Copy the resulting code and insert it in the textbox. From here you can select the domain you are using Google Analytics for, and alter other settings as needed.

5.  If you have not already inserted the tracking code within your website, make sure **Tracking Options** under the **Tracking Code** link is set to **Enabled**. Otherwise, this can be disabled.

    ![Google Analytics Dashboard for WP tracking enabled](/docs/assets/googleana-wordpress-forwp2.png)

Both a dashboard to use in WordPress and Google Analytics is now set up on your WordPress website. You can procede to use WordPress as usual. It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics.


###Google Analytics by Yoast

Google Analytics by Yoast also inserts Google Analytics dashboard options within your WordPress dashboard. Google Analytics by Yoast allows for more customization of your analytics, but cannot be shared with other authors or visitors of your WordPress website.

1.  Log in to your WordPress dashboard and navigate to your **Add New Plugin**  link. Search for and download **Google Analytics by Yoast**. Once activated, a Google Analytics section will be added to the left navigation pane.

2.  Click on the **Analytics** link. From here you will need to Authenticate with your Google account by selecting the button.   You will need to log in to your Google account and allow Google Analytics Dasboard to view your Google Analytics data.

3.  Copy the resulting code and paste it into the box. From here you can select the domain you are using Google Analytics for, and alter other settings as needed.

    ![Google Analytics by Yoast](/docs/assets/googleana-wordpress-yoast.png)

4. From here, you must select your Analytics profile from the drop-down menu and save changes. Be aware that if your domain information is not entered correctly, this plugin will not work. It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics.


