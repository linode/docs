---
 author:
 name: Linode Community
 email: docs@linode.com
description: ‘The Apache Solr search platform provides web administrators with a customizable and scalable open source solution for managing online content. Solr indexes all uploaded data, resulting in extremely fast search results, whether used enterprise-wide or with a single website. In addition to a built in web control interface, programmers can can also link access via client API's provided for several different languages.
keywords: 'vim, editor'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Search With Solr'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
  - '[Apache Solr Reference Guide](https://lucene.apache.org/solr/guide/6_6/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

Upon completing the steps in this guide, you will have a fully installed Solr instance ready to integrate with your website, as well as performed some basic configuration.

## Before You Begin

1. Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

{: .note}
> Some of the commands below require elevated privilidges to execute, and must be prefixed with `sudo` when necessary.

# Install Solr

While various ways of installing Solr exist, downloading from the Apache website ensures you will receive the latest version.

## Update System And Install Pre-requisites

1. Update system packages.

    **Debian & Ubuntu**

        apt update -y && apt upgrade -y

    **Fedora & RHEL based**

        yum update -y && yum upgrade -y

    **Arch Linux**

        pacman -Syyu

    **openSUSE**

        zypper up

2. Install Java 8 JDK.

    **Debian & Ubuntu**

    1. Add the Java 8 repository, download the gpg key, and install Java 8. 

            echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list

            echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list

            apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886

            apt update

            apt install oracle-java8-installer 

    2. In most systems, the *oracle-java8-set-default* package will also be downloaded and installed. To verify, run the following command and check for matching output. If your output does not match, continue to step 3. Otherwise, Java 8 installation is complete.

            dpkg --list | grep oracle

    *Output*
        
        ii  oracle-java8-installer        8u144-1~webupd8~0            all          Oracle Java(TM) Development Kit (JDK) 8
        ii  oracle-java8-set-default      8u144-1~webupd8~0            all          Set Oracle JDK 8 as default Java

    3. Install the *oracle-java8-set-default* package.

        apt install oracle-java8-set-default

    **Fedora & RHEL based**

        yum install java-1.8.0-openjdk.x86_64

    **Arch Linux**

        pacman -S jre8-openjdk 

    **openSUSE**

        zypper in java-1_8_0-openjdk

    Once Java is installed, verify the installation by running the following command:

        java -version

    Your output should be similar to the lines below:

    *Output*

        openjdk version "1.8.0_144"
        OpenJDK Runtime Environment (IcedTea 3.5.1) (suse-13.3-x86_64)
        OpenJDK 64-Bit Server VM (build 25.144-b01, mixed mode)

## Download And Install The Latest Version Of Apache Solr

As of the publishing date, the latest version on Apache's website is *6.6.0*. 

1. Navigate to the `/opt` directory and download Solr.

        cd /opt

        wget http://apache.claz.org/lucene/solr/6.6.0/solr-6.6.0.tgz

{: .note}
> If `wget` is not yet installed on your distribution, install it via your distribution's package manager.

2. Extract the Solr installation script from the downloaded archive.

        tar xzf solr-6.6.0.tgz solr-6.6.0/bin/install_solr_service.sh --strip-components=2

3. Execute the Solr installation script. For Arch Linux users, skip this step and follow the steps under **Arch Linux**.

        bash ./install_solr_service.sh solr-6.6.0.tgz

    **Arch Linux**

    1. Download the installation script for Arch Linux.

            wget https://github.com/Darkstar90/solr-arch-install/blob/master/install_solr_service_arch.sh

    2. Execute the custom Arch Linux installation script.

            bash ./install_solr_service_arch.sh solr-6.6.0.tgz 

## Open The Solr Firewall Port

Solr listens on port 8983 by default, and it must be opened to allow access to the web interface. Execute the commands using your preferred firewall manager from the options below.

1. Open port 8983.

    **FirewallD**

            sudo firewall-cmd --zone=public --add-port=8983/tcp --permanent
            sudo firewall-cmd --reload

    **UFW**

            ufw allow 8983/tcp comment "Solr port"

    **Iptables**

            iptables -A INPUT -p tcp --dport 8983 -j ACCEPT -m comment --comment "Solr port"

{: .note}
> Don't forget to save your Iptables rule using *iptables-persistent*, otherwise it will be lost following an ensuing server reboot.

## Access The Solr Admin Page

Solr is managed from a web-facing administration page, which can be reached via your Linode's IP address or domain name on port 8983.

1. In a web browser, enter your Linode's IP address or domain name, followed by port 8983.

    **Example**

        192.168.0.101:8983/solr

## Secure The Solr Admin Page

The Solr admin page is not secure by default, so setting up a password protected login page is recommended.

1. Navigate to `/opt/solr/server/etc` and edit the `webdefault.xml` file, adding the below content to the very end of the file, right before `</web-app>`.

{: .file}
**/opt/solr/server/etc/webdefault.xml**
~~~
. . . 

  <login-config>
        <auth-method>BASIC</auth-method>
        <realm-name>Solr Admin Auth</realm-name>
  </login-config>

  <security-constraint>
        <web-resource-collection>
              <web-resource-name>Solr Admin Auth</web-resource-name>
              <url-pattern>/*</url-pattern>
        </web-resource-collection>
        <auth-constraint>
              <role-name>user</role-name>
        </auth-constraint>
  </security-constraint>

. . . 
~~~

2. In the same directory, edit the `jetty.xml` file and add the below content at the very end of the file, right before `</Configure>`.

{: .file}
**/opt/solr/server/etc/jetty.xml**
~~~
. . . 

 <Call name="addBean">
    <Arg>
     <New class="org.eclipse.jetty.security.HashLoginService">
      <Set name="name">Solr Admin Auth</Set>
      <Set name="config"><SystemProperty name="jetty.home" default="."/>/etc/realm.properties</Set>
      <Set name="refreshInterval">0</Set>
     </New>
   </Arg>
 </Call>

. . . 
~~~

3. Create a `realm.properties` file in the current directory to add the user login information.

{: .file}
**/opt/solr/server/etc/realm.properties**
~~~
admin: admin123,user
~~~

Here, `admin:` yields a username of "admin" with a password of "admin123". `user` attributes this new user to the "user" role-name set in `webdefault.xml`. You may also configure this file with your own chosen username and password. 

4. Restart the solr service.

        systemctl restart solr

5. Now when accessing the Solr admin page, authentication will be required before you can proceed. If desired, you may also use this process to secure other web pages within Solr. For example, if you have two Solr search cores created, "core1" and "core2", you can limit access to both using the following format:

    1. Add additional `<url-pattern>` lines to `webdefault.xml`.
    
            <url-pattern>/core1/*</url-pattern> 
            <url-pattern>/core2/*</url-pattern> 

# Where to Go From Here

With Solr installed on your Linode, you are now ready to create search indexes and add data, or integrate it with your web application/website. If you need help with this, the [Apache Solr Reference Guide](https://lucene.apache.org/solr/guide/6_6/) page on the Apache Solr website is a great place to start. 
