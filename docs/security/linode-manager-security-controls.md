---
author:
  name: Linode
  email: docs@linode.com
description: 'How to use two-factor authentication and other security controls in the Linode Manager.'
keywords: ["two-factor authentication", "password", "security", "Linode Manager", "token"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linode-manager-security/']
modified: 2014-10-23
modified_by:
  name: Linode
published: 2013-05-02
title: Linode Manager Security Controls
---

The [Linode Manager](https://manager.linode.com) is the gateway to all of your Linode products and services, and you should take steps to protect it from unauthorized access. This guide documents several Linode Manager features that can help mitigate your risk. Whether you're worried about malicious users gaining access to your username and password, or authorized users abusing their access privileges, the Linode Manager's built-in security tools can help. You'll start by enabling two-factor authentication to protect your account with a physical token, setting up an IP address whitelist, and then configuring security event notifications for your Linode Manager account. You'll also learn how to control API access, configure user accounts, and force password expirations.

## Two-Factor Authentication

Two-factor authentication increases the security of your Linode Manager account by requiring two forms of authentication — something you have, and something you know. You're already familiar with this concept if you've ever used a debit card at an ATM machine. The debit card is something you have, and the PIN access code is something you know. You need both the debit card and the PIN to access your bank account.

If you enable this optional feature in the Linode Manager, you'll access your Linode Manager account using your smartphone as a physical token in addition to your username and password. This additional layer of security reduces the risk that an unauthorized individual will gain access to your Linode Manager account.

### Selecting a Token Application

Before you enable two-factor authentication in the Linode Manager, you should select a token application for your smartphone. We'll use Google Authenticator as an example in this guide, but you can use any application that supports the Time-based One-Time Password (TOTP) algorithm. For example, you can use any of the following applications:

-   [Google Authenticator](http://support.google.com/accounts/bin/answer.py?hl=en&answer=1066447) (iPhone/Android/BlackBerry)
-   [Duo Mobile](http://guide.duosecurity.com/third-party-accounts) (iPhone/Android)
-   [Amazon AWS MFA](https://aws.amazon.com/iam/details/mfa/) (Android)
-   [Authomator](https://appworld.blackberry.com/webstore/docs/22517879/?lang=en) (BlackBerry 10)

Install one of these applications on your smartphone before continuing.

### Enabling

You'll need to enable two-factor authentication to start using it with your Linode Manager account. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **my profile** link.
3.  Enter your password, and then click **Authenticate**.

    [![Re-enter your password.](/docs/assets/1271-manager_reauth_linodedemo.png)](/docs/assets/1271-manager_reauth_linodedemo.png)

4.  Select the **Password & Authentication** tab.
5.  In the **Two-Factor Authentication** section, click **Enable Two-Factor Authentication**, as shown below.

    [![Two-Factor Authentication.](/docs/assets/1286-manager_2factor_disabled-2.png)](/docs/assets/1269-manager_2factor_disabled.png)

6.  The window shown below appears. Write down the **Secret Key** and store it in a safe place.

    [![The key and QR code for two-factor authentication.](/docs/assets/1291-manager_2factor_key_qr-4.png)](/docs/assets/1291-manager_2factor_key_qr-4.png)

    {{< caution >}}
Do not refresh this page until you have configured Google Authenticator on your phone. The key will be shown only once. If you get locked out of your account, [contact support](/docs/support) to regain access.
{{< /caution >}}

7.  On your smartphone, open Google Authenticator.
8.  Tap the plus (**+**) button, as shown below.

    [![The Google Authenticator start screen.](/docs/assets/1287-google_auth_start_crop-2.png)](/docs/assets/1277-google_auth_start_crop.png)

9.  Tap **Time Based**, as shown below.

    [![Add a new account in Google Authenticator.](/docs/assets/1288-google_auth_scan_crop-2.png)](/docs/assets/1276-google_auth_scan_crop.png)

10. Tap **Scan Barcode**.
11. Point your smartphone's camera at the barcode on your computer screen. The app creates a new token for your Linode Manager login automatically. It will be labeled **LinodeManager:user**, as shown below.

    [![Your token in Google Authenticator. You can enter the key manually instead if you prefer not to scan the barcode.](/docs/assets/1289-google_auth_token_crop-2.png)](/docs/assets/1278-google_auth_token_crop.png)

12. Verify that your Linode Manager login has been added to Google Authenticator, and that it is generating a new token every 30 seconds.
13. In the Linode Manager, enter the token from your smartphone in the **Generated Token** field, and then click **Confirm my token, and enable two-factor auth**.

That's it! You've successfully enabled two-factor authentication and set up token generation on your smartphone.

### Logging In

Now that you have set up two-factor authentication for your account, you'll need to have your token handy whenever you log in to your account. Here's how to log in to the Linode Manager with two-factor authentication enabled:

1.  Open the [Linode Manager](https://manager.linode.com) in your web browser.
2.  On your smartphone, open Google Authenticator, and then select your **LinodeManager:user** account, as shown below.

    [![Your token in Google Authenticator.](/docs/assets/1289-google_auth_token_crop-2.png)](/docs/assets/1278-google_auth_token_crop.png)

3.  In your web browser, enter your username and password and click **Log in**. The webpage shown below appears.

    [![Enter your token.](/docs/assets/1270-manager_login_token_470042.png)](/docs/assets/1270-manager_login_token_470042.png)

4.  Enter your token, and then click **Authenticate**. Checking the box below the authentication option will add your computer to the trusted computer list for 30 days, and generate a confirmation email to the address on file for your account.

You have successfully logged in to the Linode Manager using two-factor authentication.

### Scratch Code

It's also suggested that you generate a one-time use scratch code. In the event that your smartphone is unavailable or the token is lost, you can use this code one time to log back in to the Linode Manager and regenerate the secret key. By default the scratch code is disabled.

1.  Click on the **generate** link to create a code.

    [![Generate Scratch Code.](/docs/assets/1364-manager_2fa_enabled_sm.png)](/docs/assets/1361-manager_2fa_enabled.png)

2.  A pop-up window will appear asking you to confirm the action. Click **OK**.

    [![Confirmation Window.](/docs/assets/1362-warning_generate_scratchcode.png)](/docs/assets/1362-warning_generate_scratchcode.png)

3.  The scratch code is displayed. This code will be displayed only once, so write it down and store it somewhere safe.

    [![Confirmation Window.](/docs/assets/1365-manager_scratchcode_enabled_sm.png)](/docs/assets/1363-manager_scratchcode_enabled.png)

### Generating a New Key

The Linode Manager allows you to generate a new secret key for your two-factor authentication token device. This is a good way to start using a new smartphone as your two-factor token device. Here's how to generate a new secret key:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **My Profile** link.
3.  Enter your password, and then click **Authenticate**.
4.  Select the **Password & Authentication** tab.
5.  In the *Two-Factor Authentication* section, click **Regenerate Secret Key**, as shown below.

    [![Regenerate Secret Key.](/docs/assets/1364-manager_2fa_enabled_sm.png)](/docs/assets/1361-manager_2fa_enabled.png)

A new secret key and barcode will be generated for your account and displayed on the screen. Follow the instructions in the [Enabling Two-Factor Authentication](#enabling) section to add the new key to your smartphone.

### Disabling

You can disable two-factor authentication for your Linode Manager account at any time. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **my profile** link.
3.  Enter your password, and then click **Authenticate**.
4.  Select the **Password & Authentication** tab.
5.  In the **Two-Factor Authentication** section, select **Disable**, as shown below.

    [![Disabling Two-Factor Authentication.](/docs/assets/1292-2f-disable-1.png)](/docs/assets/1292-2f-disable-1.png)

6.  A confirmation window appears asking if you want to disable two-factor authentication. Click **OK**.

You have successfully disabled the two-factor authentication feature for your Linode Manager account.

### Recovery Procedure

If you lose your token and get locked out of the Linode Manager, email <support@linode.com> to regain access to your account.

Should you need us to disable your Two-Factor Authentication, the following information is required:

1. An image of the front and back of the payment card currently associated with your account, which clearly shows the last 6 digits, expiration date, and cardholder name.
2. An image of the front and back of a matching government-issued photo ID.

## IP Address Whitelisting

The IP Address Whitelist feature protects your Linode Manager account from unauthorized access attempts by accepting connections only from the IP addresses you specify. It's easy to use. Just enable the feature, add your IP address, and log in. If you ever attempt to log in from an IP address that is not on the whitelist, you'll receive an email notification — you can click the link in the email message to add the new IP address to the whitelist.

### Enabling

The first step is enabling the IP address whitelist feature in the Linode Manager. Here's how:

1.  Find your computer's or router's IP address.
2.  Log in to the [Linode Manager](https://manager.linode.com).
3.  Select the **my profile** link.
4.  Enter your password, and then click **Authenticate**.
5.  Select the **Password & Authentication** tab.
6.  In the *Account Security* section, select **Enabled** from the **Status** menu, as shown below.

    [![Enabling the IP address whitelist feature.](/docs/assets/1294-2f-whitelist-1.png)](/docs/assets/1294-2f-whitelist-1.png)

7.  Click **Save security setting**. The IP address whitelist feature will be enabled.
8.  In the *Account Security* section, select the **Edit Whitelist** link to add your IP address, as shown below.

    [![Enabling the IP address whitelist feature.](/docs/assets/1295-2f-whitelist-2.png)](/docs/assets/1295-2f-whitelist-2.png)

9.  Enter your IP address and netmask, and then click **Add IP**. You can add as many IP addresses as you want.

The IP address whitelist feature is now enabled for your Linode Manager account.

### Adding Additional IP Addresses Remotely

Now that the IP address whitelist feature is enabled and you've added one or more IP addresses, your Linode Manager account is protected from unauthorized access attempts originating from any IP address not on the whitelist. However, it is easy to add additional IP addresses to the whitelist when you're away from home. Just attempt to log in to the Linode Manager from the new IP address and you'll receive an email notification — click the link in the email message to add the new IP address to the whitelist. You can also add additional IP addresses using the **my profile** page in the Linode Manager, as described in the previous section.

### Disabling

You can disable the IP address whitelist feature at any time. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **my profile** link.
3.  Enter your password, and then click **Authenticate**.
4.  Select the **Password & Authentication** tab.
5.  In the *Account Security* section, select **Disabled** from the **Status** menu, as shown below.

    [![Disabling the IP address whitelist feature.](/docs/assets/1296-2f-whitelist-3.png)](/docs/assets/1296-2f-whitelist-3.png)

6.  Click **Save security setting**.

The IP address whitelist feature is disabled. From now on you will be able to log in to the Linode Manager from any IP address.

## Security Event Notifications

By default, the Linode Manager automatically notifies you via email when any Linode jobs are added to the *Host Job Queue*. Referred to as *event notifications*, this security control can help you monitor your Linode Manager account's activity. You can also subscribe to an RSS feed, or disable email event notifications entirely. This section shows you how to configure event notifications.

### Email

You can enable and disable event notifications sent via email in the Linode Manager. This feature is enabled for all accounts by default, but you can disable it or reenable it at any time. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **my profile** link.
3.  Enter your password, and then click **Authenticate**.
4.  Select the **Notifications** tab.
5.  In the *Linode Events Email* section, click **Toggle Event Email Notifications**, as shown below.

    [![Toggling the Events Email Notification.](/docs/assets/1297-2f-events-1.png)](/docs/assets/1297-2f-events-1.png)

If the events email notification was enabled before you clicked the button, it is now disabled, and vice versa.

### RSS

The event notifications for your Linode Manager account are also available as an RSS feed. The URL is displayed in the Linode Manager on your profile — you can add it to any RSS reader. You can also regenerate the URL. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **my profile** link.
3.  Enter your password, and then click **Authenticate**.
4.  Select the **Notifications** tab.
5.  The RSS feed URL is displayed in the *Linode Events RSS* section, as shown below.

    [![Finding the RSS event notifications URL.](/docs/assets/1298-2f-events-2.png)](/docs/assets/1298-2f-events-2.png)

6.  To regenerate the URL for the RSS feed, click **Generate a new RSS key**.

If you regenerated the URL for the RSS feed, you will need to update it in your RSS reader.

## API Access

The [Linode API](https://www.linode.com/api/) is a programmatic interface for many of the features available in the Linode Manager. It's an indispensable tool for developers, but it's also a potential attack vector. For this reason, the Linode Manager provides two security controls for your account's API key. First, you can generate a new API key if you suspect that your existing key has been compromised. And if you're not using the API key, you can remove access to it altogether.

For details on generating and removing API keys, please see the [API Key](/docs/api/key) article.

## Next Steps
If you've completed this guide, you've proactively taken steps to protect your Linode Manager account. But don't stop here! There are a couple other steps that some users should take to secure their Linode Manager accounts. Take some time and work through the following action items outlined in our other guides.

### Configuring User Accounts

Organizations that have multiple individuals accessing the same Linode Manager account should create separate *user accounts* for each individual. Once you've created the accounts, you can assign permissions to restrict access to certain areas of the control panel. This is useful for groups that need to grant all team members access to the Linode Manager, or organizations that just want their billing department to have a separate account to receive invoices and billing information. For more information, see our guide on [Accounts and Passwords](/docs/accounts-and-passwords).

### Forcing Password Expirations

Some organizations have policies that require users to change their passwords every so often. The Linode Manager can be configured to force users to change their passwords every 1, 3, 6, or 12 months. For more information, see the documentation on [Passwords in the Linode Manager](/docs/platform/accounts-and-passwords/#passwords).
