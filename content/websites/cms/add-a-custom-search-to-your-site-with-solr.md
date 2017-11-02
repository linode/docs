---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Index and search your site''s content with Apache Solr, a custom, fast, enterprise-grade, open source search solution.'
keywords: ["solr", "enterprise search", "lucene", "web search"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-13
modified: 2017-09-13
modified_by:
  name: Linode
title: 'Add a Custom Search to your Site with Solr'
contributor:
  name: Andrew Lescher
  link: https://www.linkedin.com/in/andrew-lescher-87027940
external_resources:
  - '[Apache Solr Reference Guide](https://lucene.apache.org/solr/guide/6_6/)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

Apache Solr is an open source search platform that provides administrators with a customizable and scalable solution for managing online content. Solr can be configured to index all uploaded data, resulting in fast search results, whether used enterprise-wide or with a single website. In addition to a built-in web control interface, developers can also link access via a client API.

![Add a Custom Search to your Site with Solr](/docs/assets/add-search-to-your-site-with-solr.jpg "Add a Custom Search to your Site with Solr")

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system and package repositories and install `wget`.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Java

1. Install Java 8 JDK:

    **Debian & Ubuntu**

    1. Add the Java 8 repository, download the GPG key, and install Java 8.

            echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list
            echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list
            apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886
            apt update
            apt install oracle-java8-installer

    2. On most systems, the `oracle-java8-set-default` package will also be downloaded and installed. To verify, run the following command and check for matching output. If your output does not match, continue to Step 3. Otherwise, Java 8 installation is complete:

            dpkg --list | grep oracle

       **Output:**

            ii  oracle-java8-installer        8u144-1~webupd8~0            all          Oracle Java(TM) Development Kit (JDK) 8
            ii  oracle-java8-set-default      8u144-1~webupd8~0            all          Set Oracle JDK 8 as default Java

    3. Install the `oracle-java8-set-default` package:

            apt install oracle-java8-set-default

   **Fedora & RHEL based**

        yum install java-1.8.0-openjdk.x86_64

    **Arch Linux**

        pacman -S jre8-openjdk

    **openSUSE**

        zypper in java-1_8_0-openjdk

2.  Verify the Java installation:

        java -version

    The output should be similar to:

        openjdk version "1.8.0_144"
        OpenJDK Runtime Environment (IcedTea 3.5.1) (suse-13.3-x86_64)
        OpenJDK 64-Bit Server VM (build 25.144-b01, mixed mode)

## Download and Install Apache Solr

Replace each instance of `6.6.1` in the examples below with the latest version from the official [Apache Solr website](https://lucene.apache.org/solr/mirrors-solr-latest-redir.html).

1.  Navigate to the `/opt` directory and download Solr:

        cd /opt
        wget http://apache.claz.org/lucene/solr/6.6.1/solr-6.6.1.tgz

2. Extract the Solr installation script from the downloaded archive:

        tar xzf solr-6.6.1.tgz solr-6.6.1/bin/install_solr_service.sh --strip-components=2

3. Execute the Solr installation script. Arch Linux users should skip to the Arch-specific steps below:

        bash ./install_solr_service.sh solr-6.6.1.tgz

    **Arch Linux**

    1. Download the installation script for Arch Linux:

            wget https://github.com/Darkstar90/solr-arch-install/blob/master/install_solr_service_arch.sh

    2. Execute the custom Arch Linux installation script:

            bash ./install_solr_service_arch.sh solr-6.6.1.tgz

## Create a Firewall Rule for Solr

Solr listens on port `8983` by default. Open the port to allow access to the web interface using your preferred firewall manager:

**FirewallD**

    sudo firewall-cmd --zone=public --add-port=8983/tcp --permanent
    sudo firewall-cmd --reload

**UFW**

    ufw allow 8983/tcp comment "Solr port"

**iptables**

    iptables -A INPUT -p tcp --dport 8983 -j ACCEPT -m comment --comment "Solr port"

{{< note >}}
Save your iptables rule using *iptables-persistent*, otherwise it will be lost on the next reboot.
{{< /note >}}

## Access the Solr Administration Page

Solr is managed from a web-facing administration page, which can be reached via your Linode's IP address or domain name on port `8983`.

In a web browser, enter your Linode's IP address or domain name, followed by port `8983`:

    198.51.100.0:8983/solr

## Secure the Solr Administration Page

Set up a password protected login page for the Solr admin page:

1. Navigate to `/opt/solr/server/etc` and edit the `webdefault.xml` file. Add the following to the end of the file, before `</web-app>`:

    {{< file-excerpt "/opt/solr/server/etc/webdefault.xml" aconf >}}
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

{{< /file-excerpt >}}


2. In the same directory, edit the `jetty.xml` file and add the following before `</Configure>` at the end:

    {{< file-excerpt "/opt/solr/server/etc/jetty.xml" aconf >}}
<Call name="addBean">
    <Arg>
        <New class="org.eclipse.jetty.security.HashLoginService">
            <Set name="name">Solr Admin Auth</Set>
            <Set name="config"><SystemProperty name="jetty.home" default="."/>/etc/realm.properties</Set>
            <Set name="refreshInterval">0</Set>
        </New>
    </Arg>
 </Call>

{{< /file-excerpt >}}


3. Create a `realm.properties` file in the current directory to add the user login information. Replace the username `admin` and `admin123` password with the user and secure password of your choice:

    {{< file "/opt/solr/server/etc/realm.properties" aconf >}}
admin: admin123,user

{{< /file >}}


      Here, `admin:` assigns a username "admin" with the password `admin123`. `user` attributes this new user to the "user" role-name set in `webdefault.xml`.

4. Restart the solr service:

        systemctl restart solr

5. You can also use this process to secure other web pages within Solr. For example, if you have two Solr search cores created, `core1` and `core2`, you can limit access to both by adding additional `<url-pattern>` lines to `webdefault.xml`:

        <url-pattern>/core1/*</url-pattern>
        <url-pattern>/core2/*</url-pattern>

## Where to Go From Here

With Solr installed on your Linode, you are now ready to create search indexes and add data, or integrate it with your web application or website. If you need help with this, the [Apache Solr Reference Guide](https://lucene.apache.org/solr/guide/6_6/) page on the Apache Solr website is a great place to start.
