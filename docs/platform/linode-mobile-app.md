---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Linode Manager Mobile App'
keywords: 'Linode Manager,mobile,app,iOS,Android'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Wednesday, September 30th, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
    name: Linode
title: 'Linode Manager Mobile App'
contributor:
    name: Bill Bardon
    link: 
---

#Linode Manager Mobile App

##Introduction

Linode offers a mobile app for Android and Apple devices. With this app you can perform most of the tasks you would do from the web-based Linode Manager, including creating, booting and resizing Linodes, accessing via console, monitoring, managing DNS records, and configuring NodeBalancers.

This guide was created using Linode Manager version 1.1.2. The example screenshots are from the Android version, but the app is consistent across platforms.

###Install the app

To get started with mobile app you can use the links Linode provides on the [mobile page](https://www.linode.com/mobile) or search the app catalog on your device's store app.

1.  Install the app on your device.

    For Android: Go to the Google Play Store and search for Linode Manager. 
    ![Linode Manager in the Play Store](/docs/assets/app-store1.png)

    Press `Install`. The app requires no special access privileges.
    ![LM asks for no privileges!](/docs/assets/app-store-permissions.png)
    ![LM installing](/docs/assets/app-store-installing.png)

    For iPhone/iPad: Go to the Apple App Store and search for Linode Manager. Press `Free` to install the app. A new icon will appear on your screen.

2.  Launch and log in

    Launch the app from the store page or your home screen. 
    ![Launch](/docs/assets/app-store-installed.png)

    You are presented a login screen. Enter the same user name and password you use to log in to the Linode Manager web site.
    ![LM welcome/login screen](/docs/assets/app-welcome.png)

    If you use [two-factor authentication](/docs/security/linode-manager-security-controls#two-factor-authentication), you will then be asked for the code.
    ![Enter your two-factor code](/docs/assets/app-two-factor.png)

3.  User interface.

    ![LM main screen](/docs/assets/app-linodes.png)

    Consistent features of the app include a menu, an action button, and control buttons.

    Menu: the menu is accessed by the standard three-bar button at top left. This provides navigation to the major areas of Linode Manager.
    ![LM menu](/docs/assets/app-menu.png)

    Action button: while using the app, the primary action is taken by pressing the button at top right. If you are in DNS, for example, there is a large `+` at top right that you press to add a new domain. Once in the Add Domain screen, the button at top right changes to `DONE` to save your new domain entry.

    Control buttons: these large rectangular buttons appear within the main screen area, and allow additional actions.

###Create a Linode

From the main screen, to create a new Linode VPS

1.  Press the `+` at top right.
    ![LM main screen](/docs/assets/app-linode-add.png)

2.  Choose the VPS configuration.
    ![Linode plan](/docs/assets/app-linode-size.png)

3.  Select the payment method.
    ![Payment method](/docs/assets/app-linode-billing.png)

4.  Choose the data center where you want your new Linode to run.
    ![Choose a data center](/docs/assets/app-linode-dc.png)

5.  Linode makes a large selection of base Linux distributions (at time of writing, 21 distros!) available for automated install. Select your preferred distribution.
    ![Choose a distribution](/docs/assets/app-linode-distro.png)

6.  Enter a password for the root account on the new VPS. You will need this to log in on the new VPS with LISH or ssh.
    ![The Linode is ready to add](/docs/assets/app-linode-ready-to-add.png)

7.  When all the choices are made, press the `BUY` at top right. Confirm your decision and the process of creating the Linode will begin. 
    ![Confirm the new Linode](/docs/assets/app-linode-confirm-purchase.png)
    ![Adding the new Linode](/docs/assets/app-linode-add-progress.png)

{: .note}
>To understand when and how you will be billed, see [Billing and Payments](/docs/platform/billing-and-payments).

8.  Your new Linode appears in the Linodes screen with a default name. 
    ![LM new Linode](/docs/assets/app-linode-new.png)

    Press it to open the dashboard. The status will show as `BRAND NEW`, and it is powered off. 
    ![LM new Linode status](/docs/assets/app-linode-new-status.png)

    Press the `Edit` pencil icon at top right to rename it and optionally move it to a display group (a handy way to organize nodes if you have a number of them.) 
    ![Edit Linode name and group](/docs/assets/app-linode-edit.png)

    Enter a new name or group and press the `DONE` button at top right.
    ![LM Linode renamed](/docs/assets/app-linode-edit-done.png)

9.  Finally, press the `BOOT` button to start it up. Confirm your action.
    ![LM new Linode in main screen](/docs/assets/app-linode-renamed.png)
    ![Yes, please boot up](/docs/assets/app-linode-boot-confirm.png)

    The status will soon change to `BOOTING` and then `RUNNING`.
    ![New Linode booting up](/docs/assets/app-linode-booting.png)
    ![New Linode running, normal status](/docs/assets/app-linode-running.png)

###Resize a Linode

Resizing your Linode will actually move your image and IP address to a new host. Make sure if you are downsizing that your application will run in the reduced memory size and that your disk image will have sufficient space.

1.  Open the dashboard for the Linode you want to resize.

1.  Press the `Resize` button on the Linode dashboard.

2.  Select the new size option you desire.
    ![Resize choice](/docs/assets/app-linode-resize.png)

3.  Press the `BUY` button. You will be asked to confirm your choice.
    ![Confirm you want to resize choice](/docs/assets/app-linode-resize-confirm.png)

4.  The dashboard will display `JOBS RUNNING` until the resize is complete. 
    ![Resizing taking place](/docs/assets/app-linode-resize-running.png)

    As soon as the resize completes, the dashboard status will change back to `BRAND NEW`. Press the `BOOT` button to start it up, and the status will soon change to `BOOTING` and then `RUNNING`.

###Reboot a Linode

Ensure that you understand all the effects of performing a reboot. If your VPS is brand new and you have not configured any services yet, a reboot test will show you how the app controls and displays this process. If you have done any work beyond a new default image, read the [Reboot Survival Guide](/docs/uptime/reboot-survival-guide) for a checklist to ensure that your server is prepared to handle an unexpected reboot, and considerations for scheduled downtime.

1.  To initiate a reboot, open the dashboard for the Linode you want to reboot.

2.  Press the `REBOOT` button. You will need confirm that you want to reboot this Linode.
    ![Confirm you want to reboot](/docs/assets/app-linode-reboot-confirm.png)

3.  The dashboard status will change to `BOOTING`, and then back to `RUNNING`.

###Monitoring performance

For a basic sense of your Linode's health and patterns of usage, charts provided in the Linode Manager will show you several metrics.

1.  Open the dashboard for the Linode you want to monitor. Small charts are displayed in the lower part of the screen. These are more than icons, they show live data in a thumbnail format.
    ![Dashboard monitoring charts](/docs/assets/app-linode-charts.png)

2.  Press each thumbnail in turn to view a larger chart. These charts display best in landscape view (the app will give you a hint to turn your phone if you are in portrait.)

3.  There are two time periods available. Swipe left to view the two-week chart, swipe back right to return to the eight-hour chart.

###Console access

Linode Manager provides two methods of console access: SSH using an SSH client app, or LISH using a browser.

To start SSH:

1.  Press the `SSH` button on the dashboard. Linode Manager will use the default handler you have installed for SSH connections. If you don't have an SSH client installed, a notice will appear informing you. ConnectBot is a good client to install if you need one.
    ![You need an SSH app](/docs/assets/app-linode-ssh-missing.png)

2.  Enter the SSH port if you have changed it from the default 22. Change the user name if you prefer to log in as a non-root user. Then press `Connect`. 
    ![SSH parameters](/docs/assets/app-linode-ssh-connect.png)

    Your client app will launch and connect to your Linode console.
    ![Connected with SSH](/docs/assets/app-linode-ssh-password.png)

3.  When finished, enter `exit` `Enter` at the prompt. Close your client app.

To start LISH:

1.  Press the `LISH Console` button. Linode Manager will launch your default browser app and start the LISH console in your browser. Tap the screen to bring up the keyboard and enter your user name and password.
    ![LISH screen](/docs/assets/app-linode-lish.png)

2.  When finished, enter `exit` `Enter` at the prompt, then press the Back button to close the browser.

###DNS

Managing domain name server records is easy with the Linode Manager app. For more detail on DNS, see [Introduction to DNS Records](/docs/networking/dns/introduction-to-dns-records) and for basic domain zone setup see [DNS Manager](/docs/networking/dns/dns-manager).

1.  To add a new domain zone, open the DNS screen from the menu.
    ![DNS manager](/docs/assets/app-DNS.png)

2.  Press the `+` button. An Add Domain screen will display.
    ![Add a domain](/docs/assets/app-DNS-add.png)

3.  Enter the domain name, an email address, and whether this will be the Master or a Slave domain zone.
    ![Domain type](/docs/assets/app-DNS-master.png)

4.  Press `DONE`. Your new zone will be created at Linode.

5.  To add A, CNAME, MX, and other types of records, press the domain name in the list to open the record editing screen.
    ![Domain records](/docs/assets/app-DNS-records.png)

6.  Press `ADD` next to the type of record you want to add.

7.  Fill in the appropriate values. Again, see the Introduction to DNS Records to understand the purpose and usage of the various types.
    ![Add a domain record](/docs/assets/app-DNS-record-add.png)

8.  Press `DONE` to save the new record.

9.  To delete an existing record, long-press on the record. A delete confirmation prompt will appear. Press `OK` to delete the record.
    ![Delete a domain record](/docs/assets/app-DNS-record-delete.png)


###NodeBalancers

Author note:::Would Linode be interested in providing access to a demo configuration for a day so that I can write this part of the article?::

###Guides

Author note:::Failing to open with error message - "Unable to resolve host library.linode.com"::

![Library error, will replace with good screenshot](/docs/assets/app-linode-library.png)

###Account

This menu option displays a screen showing your monthly transfer usage, current account balance, and a button to update your credit card information.

1.  Open Accounts from the menu.
    ![Account status](/docs/assets/app-account.png)

2.  View your transfer and balance.

3.  Optionally, revise your credit card by pressing the `UPDATE CREDIT CARD` button.
    ![Credit information](/docs/assets/app-creditcard.png)
