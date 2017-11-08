---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Get in-depth website visitor statistics with Google Analytics on your WordPress website.'
keywords: ["analytics", "google analytics", "wordpress", "analytics", "tracking", "statistics"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-01-29
modified_by:
  name: Elle Krout
published: 2015-01-29
title: Google Analytics for WordPress
external_resources:
 - '[Analytics Help](https://support.google.com/analytics/?hl=en#topic=3544906)'
 - '[Google Analytics Developers](https://developers.google.com/analytics/)'
 - '[Google Analytics for Websites](/docs/uptime/analytics/google-analytics-for-websites)'
---

Google Analytics offers detailed statistics related to visitor traffic and sales for your website, allowing you to better know your audience. It can be beneficial to any website owner interested in growing their visitor base.

This guide provides three ways to add Google Analytics to WordPress: By directly adding the analytics code to your theme and two plugin options. Prior to using this guide, you should have completed our [Manage Web Content with WordPress](/docs/websites/cms/manage-web-content-with-wordpress) guide and have a fully configured WordPress website set up.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Sign Up for Google Analytics

Prior to adding Google Analytics to your website, you need to sign up for a Google Analytics account.

1.  Navigate to the [Google Analytics](http://www.google.com/analytics) website, then click the **Access Google Analytics** button at the top right.

2.  Click **Sign Up**.

3.  Be sure the **Website** option is selected, then enter your account information as desired. Be sure that your website URL is accurate.

    ![Google Analytics account creation](/docs/assets/googleana-wordpress-signup.png)

4.  Press **Get Tracking ID**, and read through and accept the Google Analytics Terms of Service.

5.  Make sure to note the **Tracking ID** and **tracking code**, you will use them again in this guide.

You are now set up with Google Analytics and can decide how to proceed with adding the code to your WordPress website: [Through your theme](#add-google-analytics-through-a-theme) or [through a plugin](#add-google-analytics-through-a-plugin).

## Add Google Analytics Through a Theme

WordPress uses PHP includes, so adding a Google Analytics code is as easy as altering a single file in your WordPress theme.

{{< note >}}
This guide assumes you have configured your LAMP server as described in our guides, with your publicly accessible directory located at something similar to `/var/www/example.com/public_html`. Replace all instances of `example.com` with your own domain information.
{{< /note >}}

1.  Navigate to your theme directory:

        cd /var/www/example.com/public_html/wp-content/themes

2.  Use the `ls` command to see your list of theme folders. Note the folder name of the theme are you *currently* using:

        ls

3.  Navigate to the folder that denotes the *current* theme you are using. In this example we are using the default Twenty Fifteen theme:

        cd twentyfifteen

4.  Open `header.php` and add your Google Analytics **tracking code** underneath the `<body <?php body_class(); ?>>` tag:

    {{< file-excerpt "/var/www/example.com/public_html/wp-content/themes/header.php" >}}
/**
 * Google Analytics code block
*/

<script>
 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

 ga('create', 'UA-00000000-0', 'auto');
 ga('send', 'pageview');

</script>

{{< /file-excerpt >}}


    {{< note >}}
If you copy the above code, replace `UA-00000000-0` with your **tracking ID**.

At this time you may want to consider enabling the *[demographics](https://support.google.com/analytics/answer/2819948?hl=en)* feature of Google Analytics. If you decide to do so, you will need to add an additional line of code to your JavaScript in the steps below. Insert the following between the lines containing `ga('create', 'UA-00000000-0', 'auto');` and `ga('send', 'pageview');`:

ga('require', 'displayfeatures');

Should you decide to disable the demographics feature at a later date, simply remove the above code.
{{< /note >}}

5.  To determine the success of the above process, open your WordPress website in a browser, then right click and select View Page Source. You should see the Google Analytics code inserted below the `<body>` tag. It is highlighted in the below example:

    ![Google Analytics source check](/docs/assets/googleana-wordpress-source.png)

Congratulations! You have added Google Analytics to your WordPress website. It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics. Please note that if you change the theme you will have to redo the above steps.

## Add Google Analytics Through a Plugin

This section explores adding Google Analytics to a WordPress website through two popular plugins. These plugins both add Google Analytics dashboards to your administration interface and insert the tracking code into your theme. If you have already added Google Analytics through the above method, these plugins can complement that process by adding in-dashboard features, should you desire to view your analytics within WordPress itself.

If you do not want to incorporate an added dashboard to WordPress, and would rather monitor your visitors and demographics from the Google Analytics website, consider using the method of adding your code through your chosen theme, [as shown above](#add-google-analytics-through-a-theme).

### Google Analytics Dashboard for WP

The Google Analytics Dashboard for WP is a comprehensive WordPress plugin that incorporates Google Analytics to your dashboard home, allowing you to track changes in visitors from the moment you log in. It is a powerful plugin that also offers both backend and frontend features allowing you to share the Google Analytics results with everyone from visitors to blog contributors.

1.  Prior to installing the Google Analytics for WP plugin you will need to add **PHP Curl** to your Linode. Log in to your server through SSH to update and install PHP Curl:

        apt-get update && apt-get install php5-curl

2.  Log in to your WordPress dashboard and navigate to the **Add New** link under the Plugins menu. Search for, download, and enable [Google Analytics for WP](https://wordpress.org/plugins/google-analytics-dashboard-for-wp/). A Google Analytics link will be added to the navigation pane to the left.

3. Click on the **Google Analytics** link and select **Authorize Plugin**. It will ask for an access code, which you can acquire by clicking the **Get Access Code** link. You will need to log in to your Google account and allow the plugin to view your Google Analytics data.

    ![Google Analytics Dashboard for WP](/docs/assets/googleana-wordpress-forwp1.png)

4.  Copy the resulting code and insert it in the appropriate text field. From here, you can select the appropriate domain and alter other settings as needed.

5.  If you have not already inserted the tracking code within your website, make sure **Tracking Options** under the **Tracking Code** link is set to **Enabled**. Otherwise, this can be disabled.

    ![Google Analytics Dashboard for WP tracking enabled](/docs/assets/googleana-wordpress-forwp2.png)

Google Analytics Dashboard for WP has now been set up and configured. You can proceed to use WordPress as usual. It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics.


### Google Analytics by Yoast

Google Analytics by Yoast inserts a Google Analytics section to your WordPress dashboard, and adds your tracking code to your website. Google Analytics by Yoast allows for wider customization of your analytics within your WordPress administration interface, but cannot be shared with other authors or visitors of your WordPress website.

1.  Log in to your WordPress dashboard and navigate to the **Add New** link in the Plugins menu. Search for, download, and extract [Google Analytics by Yoast](https://wordpress.org/plugins/google-analytics-for-wordpress/). Once activated, a Google Analytics link is added to the left navigation pane.

2.  Click on the **Analytics** link. You will need to authenticate with your Google account by selecting the authenticate button, logging in to your Google account and allowing Google Analytics by Yoast to view your Google Analytics data.

3.  Copy the resulting code and paste it into the box. From here, select the domain you are using Google Analytics for and alter other settings as needed. Be aware that if your domain information is not entered correctly, this plugin does not work.

    ![Google Analytics by Yoast](/docs/assets/googleana-wordpress-yoast.png)

Google Analytics by Yoast has now been set up. It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics.

