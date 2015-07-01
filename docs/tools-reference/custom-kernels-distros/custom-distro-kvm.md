---
author:
    name: Darryl Hon
    email: docs@linode.com
description: 'How to run a custom Linux distribution on a KVM Linode'
keywords: 'kvm,custom distro,centos,virt-manager,vm-install'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
contributor:
    name: Darryl Hon
modified: Friday, April 3, 2015
modified_by:
    name: James Stewart
published: 'Saturday, July 17th, 2010'
title: 'Installing a Custom Linux Distribution on a KVM Linode'
---

#Installing a Custom Linux Distribution on a KVM Linode

Linode has a great selection of system images that are ready to get you up and running fast. But sometimes you may need a more customized deployment that might include boot-time encryption for legal/policy compliance, deep-customization; or maybe you just want to roll your own installation. This guide will lead you through to deploy a customized CentOS in-place installation on a KVM-hypervisor Linode without the commonly used virt-manager GUI or virt-installer command-line tool.

Using Xen? [See this guide.](https://www.linode.com/docs/tools-reference/custom-kernels-distros/running-a-custom-linux-distro-on-a-linode-vps)

See the [Addendum](#add) at the end of the guide for more info and QAs.

##Creating the Virtual Machine Instance
- Setting the default Linode instance hypervisor:
	- Log in to the Linode Manager.
	- Click on the **Account** tab.
	- Under the **Hypervisor Preference** header, ensure **KVM** is selected.
	- Click the **Save** button. 

	[![KVM Hypervisor Preference](/docs/assets/snap001.png)](/docs/assets/snap001.png)

- Create the new Linode instance:
	- Click on the **Linodes** tab.
	- Click on the **Add a Linode** button
	- Select the preferred plan and instance location.
	- Click the **Add this Linode!** button.

- Disable Lassie:
	- Click on the name of the newly created instance.
	- Click on the **Settings** tab.
	- Under Shutdown Watchdog, set Lassie is currently to **disabled**.
	- Click on the **Save Changes** button

	[![Lassie Disabled](/docs/assets/snapresize0014.png)](/docs/assets/snapresize0014.png)


##Creating the System Disks
One temporary disk will be needed for the installation media, and as many disks as needed to achieve your preferred system layout. In this guide, we will keep it simple and use only one disk for the entire system.

- Click on the **Dashboard** sub-tab.
- Under the **Disks** header, Click on **Create a new Disk**.
- Under the **Edit Disk** header, enter **media** as the name.
- Select **ext4** as the type.
- Enter **512MB** as the size.
- Click the **Save Changes** button.

	[![Media Disk](/docs/assets/snap0004.png)](/docs/assets/snap0004.png)
- Click on **Create a new Disk** again
- Enter **system** as the name.
- Select **ext4** as the type.
- Enter **8192MB** as the size.
- Click on the **Save Changes** button.

	[![System Disk](/docs/assets/snap0005.png)](/docs/assets/snap0005.png)

##Loading the Installation Media
- Click on the **Rescue** tab.
- Make a note of path to disk mappings. In this guide **/dev/sda** is the **media** disk, **/dev/sdb** is the **system** disk.
- Click on the **Reboot Into Rescue Mode** button.

	[![Rescue Mode](/docs/assets/snap0006.png)](/docs/assets/snap0006.png)
- Click on the **Remote Access** tab.
- Under the **Console Access** header, click on the **Launch Lish Ajax Console** link.

	[![Launch Lish](/docs/assets/snap0007.png)](/docs/assets/snap0007.png)
- Enter the following commands into the Lish Web Console:
	1. mkdir /mnt/system	
	2. mount /dev/sdb /mnt/system
	3. cd /mnt/system
	4. wget http://less.cogeco.net/CentOS/6.6/isos/x86_64/CentOS-6.6-x86_64-netinstall.iso
		> Alternate mirrors: http://www.centos.org/download/mirrors/
	5. dd if= CentOS-6.6-x86_64-netinstall.iso of=/dev/sda
	6. shutdown –Ph now

	[![Lish Commands](/docs/assets/snapresize0009.png)](/docs/assets/snap0009.png)
	> What just happened? Linodes do not have a CD/DVD drive, we solve this challenge by turning the media disk created earlier to effectively appear as one.

- Close the Lish Web Console window.

{: .note}
> 
> Learn more about Lish [here.](https://www.linode.com/docs/networking/using-the-linode-shell-lish)
> Alternatively use Lish via SSH with PuTTY and enjoy copy-paste!

##Creating an Installer Configuration Profile
- Click on the **Dashboard** tab
- Under the **Dashboard** header, Click on **Create a new Configuration Profile**
- Enter a friendly name for your profile
- Under **Boot Settings**, Select **Direct Disk** as the Kernel
- Under **Block Device Assignment**:
	- Set **/dev/sda** to **media**
	- Set **/dev/sdb** to **system**
- Under **Filesystem/Boot Helpers**, set all options to **No**
- Click on the **Save Changes** button

	[![Temporary Profile](/docs/assets/snapresize0013.png)](/docs/assets/snap0013.png)

##Starting the Installation in Text
You will be treated to a classic console experience. When entering commands, always follow with an enter key. At the text based installation use the directional arrow keys and the tab key to select and navigate. Do not fret, there is a pretty mouse GUI at the end of the tunnel.

- Click on the **Remote Access** Tab
- Under the **Console Access** header, click on **Launch Lish Ajax Console**
- Enter the command:
	1. configs
- Confirm the Configuration Profile created earlier is present.

	[![Boot Profiles](/docs/assets/snap0017.png)](/docs/assets/snap0017.png)

- Enter the command then press enter:
	1. boot 2
- When prompted to continue...

	[![Tricky Prompt](/docs/assets/snap0019.png)](/docs/assets/snap0019.png) 

	- Press the **ESC** key to show the Boot prompt (slightly broken)
	- Enter the command then press enter:
		1. linux console=ttyS0

	[![Console Fix](/docs/assets/snap0020.png)](/docs/assets/snap0020.png) 

	{: .caution}
	> 
	>If you accidently press enter when initially prompted, the process will appear to freeze. This is because the installer defaults to console output on tty0, however the KVM console is at ttyS0. Just go to the Linode Dashboard, shutdown the server, then repeat this section from the beginning.

- When prompted, use the arrow keys to select your preferred language.
- At the **Installation Method** dialog, use the arrow keys to highlight **URL** then press the tab key to highlight **OK**, then press enter.

	[![NetInstall](/docs/assets/snap0022.png)](/docs/assets/snap0022.png)

- At the **Configure TCP/IP** dialog, press arrow down keys until the **OK** button is highlighted, then press enter.
- At the **URL Setup** dialog, enter the web address of the mirror nearest to the server. Use the arrow keys to navigate to the **OK** button, then press the enter key.
	1. http://mirror.its.sfu.ca/mirror/CentOS/6.6/os/x86_64/

	> Alternate mirrors: [http://www.centos.org/download/mirrors/](http://www.centos.org/download/mirrors/ "http://www.centos.org/download/mirrors/")

	[![NetInstall Mirror](/docs/assets/snap0025.png)](/docs/assets/snap0025.png)

- Watch as the installer retrieves installer data from the mirror.
- At the **Would you like to use VNC** dialog, press the enter key to default to using VNC.

	[![VNC Option](/docs/assets/snap0027.png)](/docs/assets/snap0027.png)

	{: .caution}
	> 
	> VNC must be used, the text based installer has difficulty handling the disk selection process later on.

- At the **VNC configuration** prompt, enter a secure but temporary password, navigate to **OK**, then press enter.

	{: .caution}
	> 
	> Avoid using the No Password option. Bots or someone else can easily interfere with your installation instantly!

- A notice will display the **IP address** of the Linode that should be entered into your preferred VNC client.

	[![VNC Standingby](/docs/assets/snapresize0029.png)](/docs/assets/snap0029.png)

	{: .note}
	> 
	> We use TightVNC for this guide, it can be downloaded [here.](http://www.tightvnc.com/download.php) You can use any VNC client you prefer.

- Open TightVNC, then enter the **IP address** of your Linode **plus a colon and the number 1** into the Remote Host field.

	[![TightVNC Login](/docs/assets/snap0030.png)](/docs/assets/snap0030.png)

	{: .note}
	> 
	> The installer uses the non-default port 1.

- Click the **connect** button, enter your password when prompted.

##Continuing the Installation with a GUI
Congratulations, you've made it to the GUI portion of the install! To keep this guide simple we will assume you will proceed with the installation defaults and we will detail only the pertinent bits.

[![VNC Install](/docs/assets/snap0032.png)](/docs/assets/snap0032.png)

- Proceed through installation until prompted for **Which type of installation you would like?**
	- Select **Replace Existing Linux System(s)** then click the **Next** button.

	[![Storage Installation Type](/docs/assets/snapresize0033.png)](/docs/assets/snap0033.png)

	> For those wanting to setup DMCrypt and boot-time encryption, do so now and also select Create Custom Layout. You may wish to refer to a guide specifically on full system encryption.
- Two nearly identical disks will appear on left panel. The larger disk is the system disk and smaller capacity disk is the installation media created earlier.
	- At the left panel: Click on the disk with the **larger capacity**.
	- In the middle rib: Click on the **arrow pointing to the right panel** button.
	> The storage drive selected earlier should now appear on the right panel.
	- At the right panel: Click on the **Boot Loader radio button** (circle).

	[![Target Device Selection](/docs/assets/snapresize0034.png)](/docs/assets/snap0034.png)

- Click on the **Next** button.

	[![Volume Layout](/docs/assets/snapresize0035.png)](/docs/assets/snap0035.png)

	> The installer will suggest a LVM layout on the disk select earlier. Make any additional layout changes, such as separating mount points to their own logical volumes, etc.
- Click on the **Next** button.
- At this screen you can add a boot loader password.

	{: .note}
	> 
	> This in no way encrypts the drive, it simply adds another level of access control.

- Click on the **Next** button.
- Select the preferred installation type.

	[![Package Installation Type](/docs/assets/snapresize0037.png)](/docs/assets/snap0037.png)

	> In this example, we select minimal. Minimal is best suited for very small instances, forcing the admin to manually install only the required packages. If this is not a concern or sounds like a hassle, select one of the other types.

- Click the **Next** button and enjoy the lightning fast install. (less than a minute on minimal)

	[![Install Progress](/docs/assets/snapresize0039.png)](/docs/assets/snap0039.png)

- Bask in the awe, almost. Clicking on the **Reboot** button will end your VNC session and system messages about the shutdown will be output on your Lish Web Console.

	[![Install Progress](/docs/assets/snapresize0040.png)](/docs/assets/snap0040.png)

- Close the Lish Web Console. (optional)

##Finalizing the Configuration Profile
- Click on the **Dashboard** sub-tab.
- Under the **Dashboard** header, next to your configuration profile, click on **Edit**.
- Under **Block Device Assignment**:
	- Change **/dev/sda** to **system**
	- Change **/dev/sdb** to **None**

	[![Profile Update](/docs/assets/snap0047.png)](/docs/assets/snap0047.png)

- Click on the **Save Changes** button.
- Under the **Disks** header, next to the media disk, click **Remove**

	[![Remove Media Disk](/docs/assets/snap0048.png)](/docs/assets/snap0048.png)

- Under the **Dashboard** header, below your configuration, click on the **Boot** button.
- If the Lish Web Console is still open you will see the boot process begin shortly, including a brief view of the **GNU GRUB**. (fully usable)

	[![Grub Boot](/docs/assets/snap0050.png)](/docs/assets/snap0050.png)

- If you added a boot-time password, or encrypted the system partition using DMCrypt/LUKs, you will need to use the Lish Web Console to enter your password to finish the boot process.

##Congratulations!
You’ve made it through this guide and successfully deployed a customized installation.

[![Lish Login Prompt](/docs/assets/snap0051.png)](/docs/assets/snap0051.png)

Now is a perfect time to begin [Securing Your Server.](https://www.linode.com/docs/security/securing-your-server)

<br><br><br>
----------
##Addendum<a name="add"></a>
**Why does this guide even exist?**
> Virt-Manager and Virt-Installer are not available on Linode and you will find most online documentation points you to using one of the two tools. If you are familiar with KVM then it might only be a complication, but if you are new to KVM then it can be exceedingly frustrating.

**How is this guide different from the Xen targeted version?**
> Take full advantage of your Linode’s bandwidth and storage speed - perform the heavy lifting in place. The Xen guide involves uploading a live Linux partition. Even a minimal install on most modern Linux distributions is several gigabytes in size. This can take an excruciatingly long time depending on your connection bandwidth.

**Why perform a custom installation instead of using an image already at Linode?**
>The images at Linode are excellent and often a very good starting point, however if you need deep customization or boot-time encryption: the former is more efficient to perform during installation, the second is not impossible but is terribly complicated and not recommended to setup afterwards. Your project or policy may also have other requirements, including full deployment traceability – installation from a known source vs. post-install audit and risk analysis.

**Why CentOS? Why 6.6?**
> We chose CentOS 6.6 because it is the freely available and stable derivative of its commercial brother we use in production. Otherwise the guide is highly applicable across any other modern Linux distribution.

**Can I install the 32-bit version?**
> The installation process for both x86_64 and x86 versions are exactly the same. You only need to make sure the architecture of the iso downloaded and the netinstall URL provided during the console installation screen match. The console installer is smart enough to alert you if a mistake has been made.

**Why bother with encryption?**
> That depends on your requirements. It might not matter much for a hobby machine, but if you are handling customer data many countries have strict laws on how data is to be stored.

**Is attaching a simple encrypted volume enough?**
> Again, that depends on your requirements. Policies or laws may require additional protective measures to reduce exposure to systems analysis.

**If boot-time password is enabled, do I need to login to console to enter it every time the server is booted?**
> Yes.

**Can the boot-time password be automated?**
> Anything is possible, make it happen.
