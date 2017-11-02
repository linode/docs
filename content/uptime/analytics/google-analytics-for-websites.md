---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Get in-depth website visitor statistics with Google Analytics on your website.'
keywords: ["analytics", "google analytics", "analytics", "tracking", "statistics"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-01-29
modified_by:
  name: Elle Krout
published: 2015-01-29
title: Google Analytics for Websites
external_resources:
 - '[Analytics Help](https://support.google.com/analytics/?hl=en#topic=3544906)'
 - '[Google Analytics Developers](https://developers.google.com/analytics/)'
 - '[Google Analytics for WordPress](/docs/uptime/analytics/google-analytics-on-wordpress)'
---

Google Analytics offers detailed statistics related to visitor traffic and sales for your website, allowing you to better know your audience. It can be beneficial to any website owner interested in growing their visitor base.

Although Google Analytics provides a way to add the tracking code to your webpages, if you are not using PHP includes, Server Side Includes, or another form of layout template, the process can be tedious and inefficient. This guide provides two alternatives to inserting the Google Analytics tracking code to your website, depending on your website's set-up.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

This guide also assumes you have configured your Apache server as described in our [LAMP](/docs/websites/lamp/) guides with your publicly accessible directory located at something similar to `/var/www/example.com/public_html`. Replace all instances of `example.com` with your own domain information.
{{< /note >}}

## Signing Up for Google Analytics

Prior to adding Google Analytics to your website, you need to sign up and set up your Google Analytics account.

1.  Navigate to the [Google Analytics](http://www.google.com/analytics) website, clicking the **Access Google Analytics** button to the top right.

2.  Click **Sign Up**.

3.  Be sure the **Website** option is selected, then enter your account information as desired. Be sure that your website URL is accurate.

    ![Google Analytics account creation](/docs/assets/googleana-wordpress-signup.png)

4.  Press **Get Tracking ID**, and read through and accept the Google Analytics Terms of Service.

5.  You will then be given your **Tracking ID** and **tracking code**. Make note of both of these items, you will use them later.


You can now add this code to your website through [PHP](#add-through-php), or an [external Javascript file](#add-through-external-javascript).

## Add Through PHP

If your website is coded using PHP (your files will end in `.php`), you can add the tracking code through a PHP script. This is useful if you are not using a separate PHP file for your header, or otherwise want to keep the code itself outside of your header file. This also makes any additional changes to the tracking code far more efficient, since you will only have to edit one file.

1.  Navigate to the directory your website is hosted in:

        cd /var/www/example.com/public_html

2.  Create a file named `googleanalytics.php` and copy your tracking code:

    {{< file "/var/www/example.com/public_html/googleanalytics.php" >}}
<script>
 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

 ga('create', 'UA-00000000-0', 'auto');
 ga('send', 'pageview');

</script>

{{< /file >}}


    {{< note >}}
If you copy the above code, replace `UA-00000000-0` with your **tracking ID**.

At this time you may want to consider enabling the *[demographics](https://support.google.com/analytics/answer/2819948?hl=en)* feature of Google Analytics. If you decide to do so, you will need to add an additional line of code to your JavaScript in the steps below. Insert the following between the lines containing `ga('create', 'UA-00000000-0', 'auto');` and `ga('send', 'pageview');`:

ga('require', 'displayfeatures');

Should you decide to disable the demographics feature at a later date, simply remove the above code.
{{< /note >}}

3.  If your website does not have a separate header file, and you need to insert the code in every page, skip to step 6; otherwise, open and add the following code to your header document (`header.php` here) after your `<body>` tag:

    {{< file-excerpt "/var/www/example.com/public_html/header.php" >}}
<?php include_once("googleanalytics.php") ?>

{{< /file-excerpt >}}


    You have now added Google Analytics to your website! It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics. You need not follow the rest of this guide.

4.  If your PHP-enabled website does not have a header template, then you can insert the needed code to your website through the terminal. Make sure you are in the directory that holds your website's files.

    Through using the *stream editor* command (`sed`), you can insert the needed code into multiple documents at once:

        sed -i 's/<body>/<body><?php include_once("googleanalytics.php") ?>/g' *.php

    {{< note >}}
If the `<body>` tag of your website contains other variables, please adjust the two instances of `<body>` in the above code to match your current coding.
{{< /note >}}

5.  To see if the code was successfully inserted into your website's files, you can either open your website in your browser and view the source file, or open up a file in the terminal. When you view the file, you should see the code inserted immediately after the `<body>` tag:

    {{< file-excerpt "/var/www/example.com/public_html/index.php" >}}
<body><?php include_once("googleanalytics.php") ?>

{{< /file-excerpt >}}


You have now added Google Analytics to your website! It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics.

## Add Through External Javascript

If your website cannot use PHP (its files end in `.html`, `.htm`, or otherwise), you can insert the Google Analytics code through your terminal, using an external Javascript file and the `sed` command.

1.  Navigate to the directory your website is hosted in:

        cd /var/www/example.com/public_html

2. (Optional) If you already have a Javascript folder, change directories to that folder. Otherwise, create a Javascript folder now:

        mkdir javascript

    Navigate to your newly-made folder:

        cd javascript

3.  Create a `ga.js` file to hold your Google Analytics code. Insert the following code, replacing `UA-00000000-0` with your **tracking ID**:

    {{< file-excerpt "/var/www/example.com/public_html/javascript/ga.js" >}}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-00000000-0', 'auto');
ga('send', 'pageview');

{{< /file-excerpt >}}


    {{< note >}}
At this time you may want to consider enabling the *[demographics](https://support.google.com/analytics/answer/2819948?hl=en)* feature of Google Analytics. If you decide to do so, you will need to add an additional line of code to your JavaScript in the steps below. Insert the following between the lines containing `ga('create', 'UA-00000000-0', 'auto');` and `ga('send', 'pageview');`:

ga('require', 'displayfeatures');

Should you decide to disable the demographics feature at a later date, simply remove the above code.
{{< /note >}}

7.  Use the `sed` command to insert a link to the JavaScript file holding your tracking code. Sed which will search for and replace all instances of your `<head>` tag with `<head><script type="text/javascript" src="javascript/ga.js"></script>`:

        sed -i 's@<head>@<head><script type="text/javascript" src="javascript/ga.js"></script>@g' *.html

    {{< note >}}
Change the `.html` ending to match the ending of your website's files.
{{< /note >}}

8.  To check that the code has been successfully inserted into your `.html` files, you can either open up your website in your browser and view the source code, or view a file in your terminal. The folllowing should appear in conjunction to your `<head>` tag:

    {{< file-excerpt "/var/www/example.com/public_html/index.html" >}}
<head><script type="text/javascript" src="javascript/ga.js"></script>

{{< /file-excerpt >}}


    You have now added Google Analytics to your website! It may take up to twenty-four hours for any data concerning your website to show up on Google Analytics.

