---
author:
  name: Linode
  email: docs@Linode.com
description: 'Use cPanel to manage services on your CentOS Linode.'
keywords: ["cpanel", "Linode control panel", "install cpanel", "cpanel centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/control-panels/cpanel/centos-6/','websites/cms/cpanel-on-centos-6-5/','websites/cms/cpanel-on-centos-5/','websites/cms/cpanel-on-centos/']
modified: 2017-11-08
modified_by:
  name: Edward Angert
published: 2016-09-07
title: Install cPanel on CentOS
external_resources:
 - '[cPanel Home Page](https://www.cpanel.com/)'
 - '[cPanel Support](https://www.cpanel.com/support/)'
---

![Install cPanel on CentOS](/docs/assets/install-cpanel-on-centos/Install_cPanel_smg.jpg)

[cPanel](http://cpanel.com) is a commercial web-based control panel for server systems. It can help ease the burden of common system administration tasks such as website creation, database deployment and management, and more. This guide will help you get up and running with cPanel on your CentOS Linode.


{{< note >}}

**Linode does not sell cPanel licenses**

You'll need to [obtain a VPS license directly from cPanel](https://store.cpanel.net/view/cpanel/license-options) or an authorized distributor. Additionally, Linode does not provide cPanel support, although you may contact [cPanel support](https://www.cpanel.com/support/) directly once you've purchased a license. This product **must** be installed on a freshly deployed CentOS Linode. These instructions should be performed as the `root` user via SSH.
{{< /note >}}


## DNS Prerequisites

cPanel includes options for hosting your own DNS services. We generally recommend using [Linode DNS services](/docs/dns-guides/configuring-dns-with-the-linode-manager) because it provides a stable, redundant, and easily managed DNS platform. If you elect to run your own DNS services on a single Linode using cPanel, please be aware that such a setup provides no redundancy.

Should you wish to provide DNS services, you'll need to add *A records* for your nameservers in your WHM as described in the [DNS on cPanel guide](/docs/websites/cms/set-up-dns-services-on-cpanel/#nameserver-selection).

If you plan to use a domain name for nameservers for which you will also be hosting DNS services, you'll need to ask your domain name registrar to create [DNS glue records](http://en.wikipedia.org/wiki/Domain_Name_System#Circular_dependencies_and_glue_records) based on your Linode's IP addresses before proceeding.

## Kernel Prerequisites

cPanel needs to run on the CentOS kernel. To configure your Linode to boot the CentOS kernel instead of the default Linode kernel, edit the CentOS configuration profile and select GRUB2 from the Boot Settings menu. Save the changes and reboot your Linode. For more information, [see our guide](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel#recommended-distributions) on running the distribution-supplied kernel on a Linode.

## Install cPanel

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

Before proceeding, make sure you've purchased a cPanel license. You may obtain a license from the [cPanel Store](https://store.cpanel.net/). Next, log into your Linode as the `root` user via SSH to its IP address (found on the "Remote Access" tab in the Linode Manager).

1. Issue the following command to download and install cPanel. Note that the installation process may take a long time to complete:

        cd /home && curl -o latest -L https://securedownloads.cpanel.net/latest && sh latest

2. Verify the cPanel license:

        /usr/local/cpanel/cpkeyclt

## Configure cPanel

1. Access cPanel at `https://198.51.100.0:2087` (replace `198.51.100.0` with your Linode's IP address or domain name). If your browser displays an SSL warning message like the one below, you can ignore and continue for now. In Google Chrome, click **ADVANCED**, then the **Proceed** link as shown:

    [![A browser warning for an untrusted certificate.](/docs/assets/ssl-warning.png)](/docs/assets/ssl-warning.png)

2. Log in with the username `root` and your root password.

3. Read and accept the license agreement to continue:

    [![cPanel license agreement.](/docs/assets/267-cpanel-whm-01-license-large.png)](/docs/assets/267-cpanel-whm-01-license-large.png)

4. Provide an appropriate contact email address. Optionally, you may also enter an SMS address, AIM name, or ICQ number as well:

    [![cPanel contact information entry.](/docs/assets/268-cpanel-whm-02-01-networking-contact-information.png)](/docs/assets/268-cpanel-whm-02-01-networking-contact-information.png)

5. Enter the fully qualified domain name (FQDN) for your server:

    [![cPanel hostname/FQDN entry.](/docs/assets/269-cpanel-whm-02-02-networking-hostname.png)](/docs/assets/269-cpanel-whm-02-02-networking-hostname.png)

6. Appropriate DNS resolvers should be automatically filled in for you, but you may wish to check the values listed against the "Remote Access" tab in the Linode Manager:

    [![cPanel DNS resolver entries.](/docs/assets/270-cpanel-whm-02-03-networking-resolvers.png)](/docs/assets/270-cpanel-whm-02-03-networking-resolvers.png)

7. Make sure the main network device is set to `eth0`:

    [![cPanel main network device selection.](/docs/assets/271-cpanel-whm-02-04-networking-ethernet-device.png)](/docs/assets/271-cpanel-whm-02-04-networking-ethernet-device.png)

8. Once you have ensured that the information above is correct, press **Save & Go to Step 3**.

9. When presented with the *Setup IP Addresses* section, click **Skip This Step and Use Default Settings** to continue:

    [![cPanel IP address configuration.](/docs/assets/272-cpanel-whm-03-setup-ip-addresses.png)](/docs/assets/272-cpanel-whm-03-setup-ip-addresses.png)

### DNS Configuration

Step 4 of the cPanel installation provides options for DNS configuration.

#### Using Linode Nameservers

If you intend to use Linode's nameservers (or those provided by a third party) for authoritative DNS services, make sure you select *Disabled* in the *Name Server* column:

[![cPanel DNS server selection using Linode nameservers.](/docs/assets/273-cpanel-whm-04-01-nameservers-linode-large.png)](/docs/assets/273-cpanel-whm-04-01-nameservers-linode-large.png)

List your desired nameservers in the fields provided:

[![Linode nameservers](/docs/assets/278-cpanel-whm-04-01A-nameservers.png)](/docs/assets/278-cpanel-whm-04-01A-nameservers.png)

When you've finished, click on **Save & Go to Step 5**.

#### Using Self-Managed DNS

If you wish to operate your own DNS servers on your Linode, select either **BIND** or **NSD** under the *Name Server* column. You must list the nameservers you set up in the "DNS Prerequisites" section of this document. Consult Linode's guide on setting up your own nameservers in WHM using a single IP address, available in our [Set up DNS Services on cPanel](/docs/websites/cms/set-up-dns-services-on-cpanel) guide.

[![cPanel DNS server selection using custom nameservers.](/docs/assets/274-cpanel-whm-04-02-nameservers-custom-large.png)](/docs/assets/274-cpanel-whm-04-02-nameservers-custom-large.png)

When you've finished, click on **Save & Go to Step 5**.

### Services

Step 5 of the cPanel installation covers configuration options for additional cPanel services.

1. We recommend against installing an FTP server on your Linode, as FTP is an outdated and insecure protocol. Instead, we recommend using [SFTP](/docs/platform/linode-beginners-guide/#how-do-i-upload-files-to-my-linode) to upload and download files. However, you may install an FTP server if you wish. SFTP is available by default for any main cPanel username. If you need to add file access for multiple users, you may want to install Pure-FTPd during the configuration phase.

    [![cPanel FTP server selection.](/docs/assets/275-cpanel-whm-05-ftp-large.png)](/docs/assets/275-cpanel-whm-05-ftp-large.png)

2. Choose whether or not to enable cPHulk. Please note, if you are locked out of cPanel due to multiple failed login attempts, you can release the lockout by following the instructions in cPanel's [cPHulk Brute Force Protection](https://documentation.cpanel.net/display/ALD/cPHulk+Brute+Force+Protection) documentation:

    [![cPanel cPHulk Brute Force Protection](/docs/assets/279-cpanel-whm-05-01-cphulk-protection.png)](/docs/assets/279-cpanel-whm-05-01-cphulk-protection.png)

3. After reviewing all options on this page, click on **Save & Go to Step 6**

4. You may choose to enable or disable support for filesystem quotas. Unless you actually need to track disk usage on a per-user basis, it's best to leave this disabled:

    [![cPanel quota support selection.](/docs/assets/277-cpanel-whm-07-quotas.png)](/docs/assets/277-cpanel-whm-07-quotas.png)

5. Click on **Finish Setup Wizard**. You will be brought to the *Feature Showcase* page, where you can enable additional features offered by cPanel. After reviewing these options, you can click on **Save Settings** to enable extra features, or **Exit to WHM**.

That's it! cPanel should now be properly configured on your Linode. For product support, please be sure to contact [cPanel support](http://cpanel.net/support.html) with any further questions you may have.

