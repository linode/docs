---
author:
  name: Phil Zona
  email: docs@linode.com
description: Install OpenVAS 8 to scan your system for vulnerabilities.
keywords: 'openvas,ubuntu,install openvas'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, December 7th, 2016
modified_by:
  name: Linode
published: 'Wednesday, December 7th, 2016'
title: Install OpenVAS 8 on Ubuntu 16.04
---

In this guide, you'll learn how to install OpenVAS 8 on Ubuntu 16.04. OpenVAS, the *Open Vulnerability Assessment System*, is a framework of tools that allow you to scan your system for thousands of known vulnerabilities. 

OpenVAS consists of a database, which stores results and configurations, a regularly updated feed of *NVTs*, or network vulnerability tests, a scanner, which runs the NVTs, and the Greenbone Security Assistant, a graphical interface that allows you to manage vulnerability scans from a web application. For more information about the architecture of the software, refer to the [OpenVAS website](http://www.openvas.org/software.html).

{: .caution}
> OpenVAS is a powerful security tool that is capable of scanning remote hosts as well as your local machine. This guide is intended for monitoring vulnerabilities on machines that you control or have permission to scan. If you use OpenVAS scan remote servers owned by others, be sure that you have a full understanding of the responsibilities involved and potential consequences.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

{: .note}
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install OpenVAS

1.  OpenVAS is not included in the default Ubuntu repositories, so we'll first need to install its PPA:

        sudo apt-get install software-properties-common
        sudo add-apt-repository ppa:mrazavi/openvas

    The first command installs the `software-properties-common` package, which is required for adding certain repositories. The second command will output a list of instructions for how to install OpenVAS. We'll explain each of these instructions in the following steps. You don't need to explicitly import the GPG key, as it will be added to your keyring automatically with the second command. However, you should verify that your output includes:

        gpg: key 4AA450E0: public key "Launchpad PPA for Mohammad Razavi" imported

    {: .note}
    The `openvas` repository and its packages are *not* officially supported by Ubuntu. If you'd like to review its contents, signing key, and fingerprint before installing OpenVAS, you can do so [here](https://launchpad.net/~mrazavi/+archive/ubuntu/openvas).

2.  After adding the repository, update your system packages and install the `openvas` package:

        sudo apt-get update
        sudo apt-get install openvas

    When installing `openvas`, you'll be prompted to configure a Redis database for application data, such as tasks and configurations. Select **yes** when asked if you'd like to add a socket at `/var/run/redis/redis.sock`:

    [![OpenVAS Redis socket configuration.](/docs/assets/openvas-redis-configuration.png)](/docs/assets/openvas-redis-configuration.png)
         
3.  Install the SQLite database. This is used to store the [CVEs](https://cve.mitre.org/) we'll obtain in the next steps:

        sudo apt-get install sqlite3

4.  Sync the OpenVAS NVT feed. This allows your installation to access tests for the most current vulnerabilities and exposures:

        sudo openvas-nvt-sync

    {: .note}
    > This feed is maintained by OpenVAS and is updated about once per week. To keep your NVT feed current, we recommend running this command regularly, or setting up a [cron job](https://www.linode.com/docs/tools-reference/tools/schedule-tasks-with-cron) to automate the process.

5.  Run the following commands to sync SCAP (Security Content Automation Protocol) and CERT (Computer Emergency Readiness Team) vulnerability data to a local database. The synchronization will take several minutes, and you can monitor its progress in the output:

        sudo openvas-scapdata-sync
        sudo openvas-certdata-sync

6.  Restart the OpenVAS scanner and manager:

        sudo service openvas-scanner restart
        sudo service openvas-manager restart

7.  Finally, rebuild the OpenVAS database, so the manager can access the NVT data we downloaded previously:

        sudo openvasmd --rebuild --progress

## Configure a Proxy

OpenVAS is designed to run on a local computer, not a remote server. Additionally, it only listens for connections on IPv6. To provide easy access to the manager, we'll install [nginx](https://www.nginx.com/) to use as a proxy.

1.  Install nginx:

        sudo apt-get install nginx

2.  Create a virtual host file for your OpenVAS installation:

        sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/openvas

3.  Add the following to your OpenVAS virtual host file within the `location` block:

    {: .file-excerpt}
    /etc/nginx/sites-available/openvas
    :   ~~~
        location / {
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   Host      $http_host;
            proxy_pass         https://ip6-localhost:443;
        }

    This configures nginx to proxy incoming requests to port `443` on localhost over IPv6. The `ip6-localhost` hostname is configured in your `/etc/hosts` file by default. If you're performing [additional configuration](https://www.linode.com/docs/websites/nginx/how-to-configure-nginx) to nginx, such as configuring name-based virtual hosting, you can modify other settings at this time.

4.  Enable the OpenVAS virtual host and remove the default site:

        sudo ln -s /etc/nginx/sites-available/openvas /etc/nginx/sites-enabled/openvas
        sudo rm /etc/nginx/sites-enabled/default

5.  Restart nginx to apply your changes:

        sudo systemctl restart nginx

## Configure OpenVAS

OpenVAS is now installed, and we're almost ready to start using it to scan for vulnerabilities. However, we should first change the default password to prevent unauthorized access.

From your Linode, run:

    sudo openvasmd --user=admin --new-password=your_password

This changes the password for the `admin` user to a value of your choosing. Replace `your_password` with your new password. You can also create a new administrative user by replacing `new_user` in the following command:

    sudo openvasmd --create-user=new_user

This method creates a random password even if you specify one. To change the password for a newly created user, use the syntax of the first command, substituting the username and your desired password. To create a new guest user without admin privileges, use the `gsad` (Greenbone Security Assistant Daemon) tool:

    sudo gsad --guest-username=new_user --guest-password

Replace `new_user` and `your_password` with the appropriate values. For a complete list of administrative features available with the OpenVAS CLI, use `openvasmd --help` and `gsad --help`.

## Scan Your System with OpenVAS

Congratulations! OpenVAS is now ready to use. In this section, we'll provide a basic tutorial for logging into the Greenbone Security Assistant (GSA) web application and running a basic vulnerability scan.

1.  On your local computer, navigate to your Linode's IP address or domain name in a web browser. You should be proxied to the GSA Login page.

    In most browsers, you will first encounter a security warning. This happens because OpenVAS generates a self-signed SSL certificate upon installation, and your host is not recognized as a trusted certificate authority.

    To verify the certificate in Chrome:

    -   Click the warning icon next to `https://` in the URL bar, and choose "Details" under the message that is displayed.
    -   In the "Security Overview" pane, click the "View Certificate" button.
    -   A small window will appear, showing information about the self-signed certificate. Click "Details" to expand the window and show more information.
    -   Scroll to the bottom and find the `SHA 1` Fingerprint.
    -   On your Linode, run `sudo openssl x509 -noout -in /var/lib/openvas/CA/servercert.pem -fingerprint -sha1`.
    -   Compare the two fingerprints. If they match, it's safe to ignore the warning and proceed.

    To verify the certificate in Firefox:

    -   Click the "Advanced" button on the warning page in your browser.
    -   Additional details will be displayed, including an error code, which will be something like `SEC_ERROR_UNKNOWN_ISSUER`. Click the error code to view more information.
    -   A pane will be displayed, showing the "Certificate Chain" for your server.
    -   On your Linode, run `cat /var/lib/openvas/CA/servercert.pem` and look for the `-----BEGIN CERTIFICATE-----` line in the output.
    -   Compare the two certificates to ensure they match. If they do, it's safe to click "Add Exception" and proceed.

2.  The next page you see will be a login for the Greenbone Security Assistant, the graphical web interface for the OpenVAS manager. Enter the credentials for your `admin` user and click "Login."

    [![Greenbone Security Assistant login page.](/docs/assets/openvas-gsa-login.png)](/docs/assets/openvas-gsa-login.png)

3.  The welcome screen will display instructions on how to use the tool. OpenVAS uses "Tasks" to manage scans, but to start running one right away, simply enter a hostname or IP address in the text box under "Quick Start" and click "Start Scan." This schedules a scan of the specified host to start immediately and sets the page contents to refresh every 30 seconds so you can see the progress in real time.

    [![Greenbone Security Assistant Task Wizard.](/docs/assets/openvas-gsa-task-wizard.png)](/docs/assets/openvas-gsa-task-wizard.png)

    {: .note}
    >The Quick Start screen will not appear on login after you've scheduled 3 or more tasks. However, you can access this screen at any time, click the "Scan Management" tab at the top of the screen, select "Tasks," and hover over the purple magic wand icon in the top bar. From there, you can select "Task Wizard" or "Advanced Task Wizard" to create a new task quickly and easily.

4.  The reports showing results of your tasks can be accessed at any time while the scan is in progress. The time a scan takes to complete will depend on the services running on a host, and may vary significantly. To view the results of a scan, select "Scan Management" in the top navigation bar, and click "Reports."

    To view the details of a specific task, click its name under "Task." In the example below, it was called "Immediate scan of IP localhost" when we created it with the Task Wizard:

    [![List of reports.](/docs/assets/openvas-gsa-reports.png)](/docs/assets/openvas-gsa-reports.png)

5.  A "Task Details" screen will be displayed, showing information such as status, and the number of vulnerabilities detected. To view the details of any vulnerabilities that were found, click the number next to "Results." In our example, there were 33:

    [![Details of the selected task.](/docs/assets/openvas-gsa-task-details.png)](/docs/assets/openvas-gsa-task-details.png)

6.  The "Results" page will list potential vulnerabilities found in the scan. To sort them, click the heading of any column at the top of the page. Note that if you run scans on multiple servers, you'll need to sort the results by host to determine which servers are affected by vulnerabilities.

    [![List of results found by the scan.](/docs/assets/openvas-gsa-results.png)](/docs/assets/openvas-gsa-results.png)

    To view details of a vulnerability, such as the method of detection, impact to your system, and in some cases a solution, click the name of the vulnerability. In the example below, OpenVAS has detected that we haven't changed the default login credentials, and it tells us how to resolve the issue:

    [![Details of a vulnerability result.](/docs/assets/openvas-gsa-result-details.png)](/docs/assets/openvas-gsa-result-details.png)

    Once you resolve a vulnerability, return to the "Tasks" screen, and click the green play button icon under "Actions" to run the scan again. When the task completes, the vulnerability should no longer be present in your results.

## Troubleshooting

Occasionally, you may receive a 502 Bad Gateway error when you try to connect via browser. In most cases, this is caused by one of the OpenVAS daemons stopping. To check for problems:

    sudo netstat -plntu

Your output should include the following lines:

    Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
    tcp        0      0 0.0.0.0:9391            0.0.0.0:*               LISTEN      3579/openvassd: Wai
    tcp6       0      0 :::443                  :::*                    LISTEN      7046/gsad
    tcp6       0      0 :::9390                 :::*                    LISTEN      3577/openvasmd

These lines represent the OpenVAS scanner, the Greenbone Security Assistant, and the OpenVAS manager, respectively. If one of these lines is not present, simply start the daemon and try to reconnect. For example, if the `gsad` program is stopped, run `sudo gsad start`. The syntax is the same for each of these daemons.

