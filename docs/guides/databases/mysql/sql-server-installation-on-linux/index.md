---
slug: sql-server-installation-on-linux
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['RHEL', 'SUSE', 'Ubuntu', 'SQL Server Installation', 'SQL Server Command-Line Tools']
tags: ['database', 'mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-23
modified_by:
  name: Linode
title: "SQL Server Installation on RHEL, SUSE, and Ubuntu"
h1_title: "How to Install SQL Server on RHEL, SUSE, and Ubuntu"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/

---

In addition to Windows platforms, SQL Server is supported on Red Hat Enterprise Linux (RHEL), SUSE Linux Enterprise Server (SLES), and Ubuntu. It is also supported as a Docker image, which can run on Docker Engine on Linux or Docker for Windows/Mac. Specifically, this guide focuses on the necessary steps required to install SQL Server on RHEL, SLES, and Ubuntu platforms.

## Prerequisites to install SQL Server

### Prerequisites for RHEL operating system

To install SQL Server on Red Hat Enterprise Linux, you must be running RHEL operating system versions 7.7 - 7.9 or RHEL versions 8.0 - 8.5, with a minimum of 2 GB of memory. Additionally, underlying file systems must be either XFS or EXT4, and at least 6 GB of free disk space is required.

RHEL version 8 does not come preinstalled with python2, which is a requirement of SQL Server. In this case, it needs to be installed before the SQL Server installation. Following are the Bash Linux shell commands that need to be executed, and verified that python2 is selected as the interpreter.

1. Configure Python2 as the default interpreter using the command below:

        sudo alternatives --config python

1. If python2 is not configured, install python2 and openssl10 using the following commands:

        sudo yum install python2
        sudo yum install compat-openssl10

### Prerequisites for SLES operating system

To install SQL Server on SUSE Linux Enterprise Server, you must be running operating system version v15 with a minimum of 2 GB of memory. Additionally, underlying file systems must be either XFS or EXT4, and at least 6 GB of free disk space is required.

### Prerequisites for Ubuntu platform

To install SQL Server on an Ubuntu platform, you must be running Ubuntu operating system versions 16.04, 18.04, or 20.04 with a minimum of 2 GB of memory. Additionally, underlying file systems must be either XFS or EXT4, and at least 6 GB of free disk space is required.

## Installation of SQL Server

### Install SQL Server on RHEL

Microsoft stores the package repository separately for RHEL 7 and 8 which you must download.

1. To download the SQL Server 2019 Red Hat repository configuration file, execute the following commands from the Bash Linux shell:

    - For RHEL version 7, use the following command:

            sudo curl -o /etc/yum.repos.d/mssql-server.repo https://packages.microsoft.com/config/rhel/7/mssql-server-2019.repo

    - For RHEL version 8, use the following command:

            sudo curl -o /etc/yum.repos.d/mssql-server.repo https://packages.microsoft.com/config/rhel/8/mssql-server-2019.repo

1. Run the following command to install SQL Server:

        sudo yum install -y mssql-server**

1. Launch the SQL Server Configuration Manager utility (`mysql-conf`) to complete the setup of SQL Server.

        sudo /opt/mssql/bin/mssql-conf setup

1. Follow the prompts to set the SQL Server Agent password and choose the appropriate edition of SQL Server.

1. Accept the license terms and confirm the administrative password. This completes the setup of SQL Server.

1. You can verify that the SQL Server service is running by issuing the following command:

        systemctl status mssql-server

1. (Optional) If your database server installation requires remote server access, open the SQL Server port on the firewall on RHEL. The default SQL Server port is TCP **1433** (for security reasons, you may have changed this default port number in an earlier step). If you are running *FirewallD* for your firewall, you can use the following commands:

        sudo firewall-cmd --zone=public --add-port=1433/tcp --permanent sudo firewall-cmd --reload

### Install SQL Server on SLES

To install the **mssql-server** package on SLES, execute the following commands from the Bash Linux shell.

1. Download the SQL Server 2019 SLES repository configuration file:

        sudo zypper addrepo -fc https://packages.microsoft.com/config/sles/15/mssql-server-2019.repo

1. Refresh the repositories using the command below:

        sudo zypper --gpg-auto-import-keys refresh

1. Microsoft package signing key must be installed on your system. Use the following command to import the key:

        sudo rpm --import <https://packages.microsoft.com/keys/microsoft.asc>

1. Execute the following command to install SQL Server:

        sudo zypper install -y mssql-server

1. Launch the SQL Server Configuration Manager utility (mysql-conf) to complete the setup of SQL Server.

        sudo /opt/mssql/bin/mssql-conf setup

1. Follow the prompts to set the SQL Server Agent password and choose the appropriate edition of SQL Server.

1. Accept the license terms and confirm the administrative password. This completes the setup of SQL Server.

1. You can verify that the SQL Server service is running by issuing the following command:

        systemctl status mssql-server

1. (Optional) If your database server installation requires remote server access, you might need to open the SQL Server TCP port (default **1433** or port that you may have changed it to in an earlier step) on your firewall. If you are using the SuSE firewall, you need to edit the `/etc/sysconfig/SuSEfirewall2` configuration file. Modify the **FW\_SERVICES\_EXT\_TCP** entry to include the SQL Server port number as follows:

        FW\_SERVICES\_EXT\_TCP="1433"

### Install SQL Server on Ubuntu

To install the **mssql-server** package on Ubuntu, execute the following commands from the Bash Linux shell.

1. Import the public repository GPG keys:

        wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -

1. Register the SQL Server Ubuntu repository for SQL Server.

    - For Ubuntu version 16.04, use the following command:

            sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/16.04/mssql-server-2019.list)"

    - For Ubuntu version 18.04, use the following command:

            sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/18.04/mssql-server-2019.list)"

    - For Ubuntu version 20.04, use the following command:

            sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2019.list)"

1. Execute the following commands to install SQL Server:

        sudo apt-get update
        sudo apt-get install -y mssql-server

1. Launch the SQL Server Configuration Manager utility (mysql-conf) to complete the setup of SQL Server.

        sudo /opt/mssql/bin/mssql-conf setup

1. Follow the prompts to set the SQL Server Agent password and choose the appropriate edition of SQL Server.

1. Accept the license terms and confirm the administrative password. This completes the setup of SQL Server.

1. You can verify that the SQL Server is running by issuing the following command:

        systemctl status mssql-server --no-pager**

1. (Optional) If you require remote database connectivity, you may need to open the SQL Server TCP port (default **1433**) on your Ubuntu firewall.

## Installation of SQL Server Command-Line Tools

To interact with the SQL Server database, you need to install the command-line tools like **sqlcmd** and **bcp** on the Bash Linux shell. These tools can run the *Transact-SQL* statements on the database server.

### Install Command-Line Tools on RHEL

1. Download the Microsoft Red Hat repository configuration file.

    - For RHEL version 7, use the following command:

            sudo curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/7/prod.repo

    - For RHEL version 8, use the following command:

            sudo curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/8/prod.repo

1. (Optional, if you are installing SQL Server and **sqlcmd** tools on a new machine) If you already have previous version of **mssql-tools** installed, you need to remove any older unixODBC packages as follows:

        sudo yum remove unixODBC-utf16 unixODBC-utf16-devel

1. Execute the following command to install **mssql-tools** with the unixODBC developer package (`unixODBC-devel`):

        sudo yum install -y mssql-tools unixODBC-devel

1. Add `/opt/mssql-tools/bin/` to your **PATH** environment variable. This enables you to run the tools without having to prefix the command with a full path specification. The following commands should be executed to modify the **PATH** for both login sessions and interactive/non-login sessions:

        echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash\_profile echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc source ~/.bashrc

1. Validate the installation by connecting to SQL Server instance using the **sqlcmd** utility:

        sqlcmd -S localhost -U SA -P 'YourPassword'

### Install Command-Line Tools on SLES

1. Add the SQL Server repository to Zypper:

        sudo zypper addrepo -fc https://packages.microsoft.com/config/sles/15/prod.repo

        sudo zypper --gpg-auto-import-keys refresh

1. Install the **mssql-tools** with the unixODBC developer package (`unixODBC-devel`):

        sudo zypper install -y mssql-tools unixODBC-devel

1. Add `/opt/mssql-tools/bin/` to your **PATH** environment variable. This enables you to run the tools without having to prefix the command with a full path specification. The following commands should be executed to modify the **PATH** for both login sessions and interactive/non-login sessions:

        echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash\_profile echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc source ~/.bashrc**

1. Validate the installation by connecting to SQL Server instance using the **sqlcmd** utility:

        sqlcmd -S localhost -U SA -P 'YourPassword'

### Install Command-Line Tools on Ubuntu

1. By default, **curl** is not installed on Ubuntu. To install **curl**, execute the following:

        sudo apt-get update sudo apt install curl**

1. Import the public repository GPG keys:

        curl <https://packages.microsoft.com/keys/microsoft.asc> | sudo apt-key add -

1. Register the Microsoft Ubuntu repository:

    - For Ubuntu version 16.04, use the following command:

            curl <https://packages.microsoft.com/config/ubuntu/16.04/prod.list> | sudo tee /etc/apt/sources.list.d/msprod.list

    - For Ubuntu version 18.04, use the following command:

            curl <https://packages.microsoft.com/config/ubuntu/18.04/prod.list> | sudo tee /etc/apt/sources.list.d/msprod.list

    - For Ubuntu version 20.04, use the following command:

            curl <https://packages.microsoft.com/config/ubuntu/20.04/prod.list> | sudo tee /etc/apt/sources.list.d/msprod.list

1. Update the sources list and execute the installation command with the unixODBC developer package (`unixodbc-dev`):

        sudo apt-get update

        sudo apt-get install mssql-tools unixodbc-dev

1. Update to the latest version of **mssql-tools** by executing the following commands:

        sudo apt-get update

        sudo apt-get install mssql-tools

1. Add `/opt/mssql-tools/bin/` to your **PATH** environment variable. This enables you to run the tools without having to prefix the command with a full path specification. The following commands should be executed to modify the **PATH** for both login sessions and interactive/non-login sessions:

        echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash\_profile echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc source ~/.bashrc

1. Validate the installation by connecting to SQL Server instance using the **sqlcmd** utility:

        sqlcmd -S localhost -U SA -P 'YourPassword'

## Conclusion

Microsoft SQL Server is no longer limited to Microsoft Windows platforms. It has been ported to a variety of Linux platforms including Red Hat Enterprise Linux (RHEL), SUSE Linux Enterprise Server (SLES), and Ubuntu. The expansion of platform support over the years has helped solidify SQL Server’s relevance in the database server industry.
