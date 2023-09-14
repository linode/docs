---
description: "Deploy UTunnel VPN on a Linode Compute Instance. This provides you with a cloud-based subscription service that allows users to create VPN servers."
keywords: ['vpn','security','tunnel']
tags: ["marketplace", "linode platform", "cloud manager"]
bundles: ['network-security']
published: 2021-12-10
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy UTunnel VPN through the Linode Marketplace"
external_resources:
- '[UTunnel](https://www.utunnel.io/)'
aliases: ['/guides/deploying-utunnel-marketplace-app/','/guides/utunnel-marketplace-app/']
authors: ["Linode"]
---

[UTunnel VPN](https://www.utunnel.io/) lets you set up your own private VPN server quickly and easily; no technical expertise is required. It is well suited for small and medium businesses to set up easy and secure remote access for their employees, or for anyone who wants to keep their data private using their own VPN. UTunnel VPN supports multiple VPN protocols and comes with a server management console, secure 256-bit encryption, easy team management, single sign-on, 2-factor authentication, and an inbuilt firewall.

{{< note >}}
A license is required to use UTunnel. See [UTunnel's Pricing page](https://www.utunnel.io/vpn-server-pricing-plans) for more information on available plans and their associated costs. A free 14-day trial is installed by default.
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** UTunnel should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the UTunnel VPN App

In order to use UTunnel VPN, you need to create an account on [UTunnel.io](https://dashboard.utunnel.io/user/signup/)

1.  Log in to the UTunnel VPN [dashboard](https://dashboard.utunnel.io/) and click on either Create a Server now option or select Create Server button to create a new server.

    ![UTunnel Dashboard setup](utunnel_dashboard1.png)

1.  The Create Server screen appears. Here you can provide your billing address details. This step is optional. You can either provide the details and click on the Proceed button or select the Skip button to do it later from My Account tab on your dashboard.

    ![UTunnel Dashboard setup](utunnel_dashboard2.png)

1.  The next step is to select `On-Premise option` and enter the server details as given below:

    - Package: You can select from Basic or Standard subscription options
    - Server Type: Select On-Premise
    - Server Name: An easily identifiable name of your choice
    - IP address: Enter your server IP address
    - VPN accounts: Select the number of VPN users you want to allow access to this server
    - Coupon: Enter if you have any coupon available

    Click on the Proceed button toward the right bottom of the screen.

    ![UTunnel Dashboard setup](utunnel_dashboard3.png)

1.  You should now be on the Order Summary screen which displays the details of your order. Click **Proceed**.

    ![UTunnel Dashboard setup](utunnel_dashboard4.png)

1.  Now enter your credit card details as required on the screen and click on Pay Now option.

    ![UTunnel Dashboard setup](utunnel_dashboard5.png)

1.  You are now redirected to the dashboard. Here you can see the status of server creation.

    ![UTunnel Dashboard setup](utunnel_dashboard6.png)

1.  You will be redirected to the Server Details screen where the registration token is displayed. Please copy the registration token to safe place, this token is required when you deploy the server.

    ![UTunnel Dashboard setup](utunnel_dashboard7.png)

1.  Now it's the time to connect to your server via SSH. You need sudo access to complete below steps. After the successful login, execute below commands. Remember to replace the string 'REGISTRATION_TOKEN' in the first command with the actual token you obtained in above step.

        sudo /utunnel/bin/utnservice register REGISTRATION_TOKEN

    Now it's the time to start UTunnel Service on your server. Run following command for the same.

        sudo /utunnel/bin/utnservice start

Now that you’ve deployed your UTunnel VPN instance, checkout [the official UTunnel VPN documentation](https://help.utunnel.io/About-UTunnel-VPN) to learn how to further utilize your UTunnel instance.

{{< content "marketplace-update-note-shortguide">}}