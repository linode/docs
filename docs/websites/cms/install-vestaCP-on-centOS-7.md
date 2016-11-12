---
author:
  name: Boiken Simixhiu	
  email: boiken.simixhiu@gmail.com
description: 'This guide help you to install the Open Source controll panel VestaCP on CentOS 7 Server.'
keywords: 'vesta,vestacp,centos,install vestacp,control panel'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Saturday, November 12th, 2016'
modified: Saturday, November 12th, 2016
modified_by:
  name: Boiken Simixhiu
title: 'Install VestaCP on CentOS'
contributor:
  name: Boiken Simixhiu
  external_resources:
- '[VestaCP Website](https://vestacp.com/)'
- '[VestaCP Documentation](https://vestacp.com/docs/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*
----


[VestaCP](https://vestacp.com/) is an Open Source web hosting control panel with premium features, secure, advanced and minimalistic design.It makes easier tasks such as ,Website creation,Database creation and managment,email hosting and many more.This guide will help you to install and run VestaCP on your CentOS Linode.

After Creating a Linode with CentOS 7 OS (You can follow the tutorial [Getting Started with Linode](https://www.linode.com/docs/getting-started) )

Log In to your Server via SSH connection (for example using PuTTY).

After opening PuTTY ,create a new connection with the IP of your newely created Linode and select SSH Protocol.
{: .note}
>Once you are connected ,log in as `root` (if you have allowed root login) or login as a user and enter the **sudo su** command to be able to execute commands as `root`.

##Installing VestaCP

1.Download the installation script with the command below:

		curl -O http://vestacp.com/pub/vst-install.sh

2.Execute the script with this command:
		
		bash vst-install.sh

This command will make the installation process begin.

3.You will have to confirm the beginning of the installation by writing `Y` and then pressing `ENTER`

[![VestaCP Installation Intro.](/docs/assets/vestacp-install-intro.bmp)](/docs/assets/vestacp-install-intro.bmp)

##Configuring VestaCP

1.After confirming the installation you will be asked for the email that will be used as administrator.Enter your email that will be used as the administrator `email` and press `Enter`

[![VestaCP Email Admin.](/docs/assets/vestacp-email-install.bmp)](/docs/assets/vestacp-email-install.bmp)
		
2.Next step you will be asked for the `FQDN`.Enter the fully qualified domain name (FQDN) that you will use for this server and press `Enter`.

[![VestaCP FQDN .](/docs/assets/vesta-fqdn-install.bmp)](/docs/assets/vesta-fqdn-install.bmp)

After entering the `FQDN` installation will begin.

3.Once the installation finishes it will give you the credentials (the `username` and `password` for the VestaCP administrator account) to login to your VestaCP .

[![VestaCP finished Installation.](/docs/assets/vesta-finished-install.bmp)](/docs/assets/vesta-finished-install.bmp)
		

##Accessing VestaCP

1.Open the link `https://your-server-ip:8083` (replace `your-server-ip` with your Linode IP) on your web browser (for example Google Chrome)

[![VestaCP SSL Warning.](/docs/assets/vesta-ssl-warning.bmp)](/docs/assets/vesta-ssl-warning.bmp)
		
Click on `Advanced` and then `Proceed to your-server-ip`

2.Next you will see the VestaCP login page (here enter the `username` and `password` VestaCP installation gave you after finishing and press `Login` button. )
		
[![VestaCP Login.](/docs/assets/vesta-ssl-warning.bmp)](/docs/assets/vesta-ssl-warning.bmp)

3.You are now logged in.

[![VestaCP Panel.](/docs/assets/vesta-panel.bmp)](/docs/assets/vesta-panel.bmp)

Now your VestaCP panel should be properly configured and ready to use.If you have more questions about VestaCP consult [their documentation.](https://vestacp.com/docs/)
		



