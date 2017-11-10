---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Clojure Deployment with Immutant and WildFly on Ubuntu 14.04'
keywords: ["clojure", "luminus", "leiningen", "immutant", "jvm", "wildfly", "jboss", "oracle jdk 8"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/development/clojure-deployment-with-immutant-and-wildfly-on-ubuntu-14-04/']
modified: 2015-12-21
modified_by:
  name: Sergey Pariev
published: 2016-02-18
title: 'Clojure Deployment with Immutant and WildFly on Ubuntu 14.04'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
  - '[Installing Leiningen](http://leiningen.org/#install)'
  - '[Installing Oracle JDK 8](https://launchpad.net/~webupd8team/+archive/java)'
  - '[Luminus Framework](http://www.luminusweb.net/docs)'
  - '[Immutant 2](http://immutant.org/documentation/current/apidoc/)'
  - '[Script to install JBoss Wildfly 10.x as service in Linux](https://gist.github.com/sukharevd/6087988)'

---

Clojure is a general-purpose programming language with an emphasis on functional programming. It is a dialect of the Lisp programming language running on the Java Virtual Machine (JVM). While Clojure allows you to write elegant and concise code, its ability to make use of the existing JVM infrastructure, such as libraries, tools and application servers, makes it also a very practical choice.

This guide will show how to deploy a Clojure application to WildFly - the popular open-source Java application server developed by RedHat. To simplify the deployment process, a suite of libraries called *Immutant* will be used.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

In this guide `example.com` will be used as a domain name, and `linode-user` as a name of non-root user. Substitute your own FQDN and username accordingly.
{{< /note >}}

## Install Oracle JDK 8

1.  Add Oracle Java 8 Installer PPA repository to the system:

        sudo add-apt-repository ppa:webupd8team/java

2.  Update package list and install Oracle JDK 8:

        sudo apt-get update
        sudo apt-get install oracle-java8-installer

    You will be asked twice on screen to agree with "Oracle Binary Code License Agreement for the Java SE Platform Products and JavaFX." Press **Ok** button to agree the first time, and **Yes** button the second time.

3.  Make Oracle Java default:

        sudo apt-get install oracle-java8-set-default

4.  Check installation by running:

        java -version

    Output should resemble the following:

        java version "1.8.0_66"
        Java(TM) SE Runtime Environment (build 1.8.0_66-b17)
        Java HotSpot(TM) 64-Bit Server VM (build 25.66-b17, mixed mode)


{{< note >}}
If you are not comfortable with using 3rd-party PPA, please use instructions for manual installation of Oracle Java 8 from [Java Development with WildFly on CentOS 7](/docs/applications/development/java-development-wildfly-centos-7) guide.
{{< /note >}}

## Install Leiningen

1. *Leiningen* is a Clojure project-build tool. Install it system-wide:

        sudo wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein -O /usr/local/bin/lein
        sudo chmod a+x /usr/local/bin/lein

2.  To check that installation has been successful, run:

        lein -v

    Leiningen will update itself and then will output the version info, which should look similar to the following:

        Leiningen 2.5.3 on Java 1.8.0_66 Java HotSpot(TM) 64-Bit Server VM

## Create Sample Application

Now, you will create a sample Clojure web application based on *Luminus* framework.

1.  In your home directory run:

        lein new luminus clj-app

    This will create new web application using the Luminus framework application template. It will use `immutant` as a web server, which is the default option.

2.  To check that everything went smoothly, run the newly created application in development mode:

        cd clj-app
        lein run

    Now, open http://192.51.100.1:3000/ in your browser (be sure to replace `192.51.100.1` with your Linode's public IP), and you will see the sample application main page.

    ![Luminus application main page](/docs/assets/clj-luminus-main-page.png)

    {{< note >}}
Make sure port 3000 is open in firewall for this to work.
{{< /note >}}

3.  Stop the development server by pressing **Ctrl-C** in console.

## Install JBoss WildFly Application Server

1.  Download and unpack the application server archive into `/opt/wildfly` directory:

        export VERSION=9.0.2.Final # Current stable version at the time of writing
        cd /opt
        sudo wget http://download.jboss.org/wildfly/$VERSION/wildfly-$VERSION.tar.gz
        sudo tar xvzf wildfly-$VERSION.tar.gz
        sudo mv wildfly-$VERSION wildfly #Get rid of version suffix
        sudo rm wildfly-$VERSION.tar.gz

2.  Create a `wildfly` user and make him the owner of `/opt/wildfly`:

        sudo adduser --system --group --no-create-home --home /opt/wildfly --disabled-login wildfly
        sudo chown wildfly -R /opt/wildfly

3.  Copy the WildFly init script to `/etc/init.d/` and make `wildfly` service start on boot:

        sudo cp /opt/wildfly/bin/init.d/wildfly-init-debian.sh /etc/init.d/wildfly
        sudo update-rc.d wildfly defaults

4.  Start the WildFly service with:

        sudo service wildfly start

5.  Allow `linode-user` to copy war file into `/opt/wildfly/standalone/deployments`, which is needed for deployment:

    *   Add `linode-user` to `wildfly` group:

            sudo usermod linode-user -a -G wildfly

    *   Run `newgrp wildfly` as `linode-user` to log in into the new group without logging out:

            newgrp wildfly

    *   Make sure `/opt/wildfly/standalone/deployments` belongs to a `wildfly` group and is writable by the group:

            sudo chown wildfly.wildfly /opt/wildfly/standalone/deployments/
            sudo chmod g+w /opt/wildfly/standalone/deployments

## Proxy WildFly with Nginx

1.  Install packages for nginx:

        sudo apt-get install nginx

2.  Create file `/etc/nginx/sites-available/wildfly` with the following content:

    {{< file "/etc/nginx/sites-available/wildfly" aconf >}}
upstream http_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name example.com;

    location = /favicon.ico { access_log off; log_not_found off; }


    location / {
        proxy_pass http://http_backend;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;

        access_log /var/log/nginx/wildfly.access.log;
        error_log /var/log/nginx/wildfly.error.log;
    }
}

{{< /file >}}


    Do not forget to substitute `example.com` with your Linode domain name or public IP address.

2.  Enable your newly created `wildfly` site and remove the `default` site to avoid conflicts:

        sudo ln -s /etc/nginx/sites-available/wildfly /etc/nginx/sites-enabled
        sudo rm /etc/nginx/sites-enabled/default

3.  Restart nginx for changes to take effect:

        sudo service nginx restart

## Deploy Sample Application with Immutant

To deploy Clojure application with WildFly you will need to install the Immutant leiningen plugin and configure it for the deployment.

1.  Open `project.clj` file in `clj-app` directory and add `[lein-immutant "2.1.0"]` to the `:plugins` section of configuration:

    {{< file-excerpt "/home/linode-user/clj-app/project.clj" clj >}}
:plugins [[lein-environ "1.0.1"]
          [lein-immutant "2.1.0"]]

{{< /file-excerpt >}}


2.  In `project.clj` and after `:plugins`, add a new `:immutant` section with the following content :

    {{< file-excerpt "/home/linode-user/clj-app/project.clj" clj >}}
:immutant {
    :war {
        :name "ROOT"
        :destination "/opt/wildfly/standalone/deployments"
        :context-path "/"
    }
}

{{< /file-excerpt >}}


    This sets three parameters for Immutant installation:

    1. The destination folder for the WAR file
    2. The context path
    3. The WAR file name, which should be ROOT when the context path is `/`.

3.  Switch to the `clj-app` directory and deploy the application with:

        cd ~/clj-app
        lein immutant war

At this point, you should be able to open your Linode's domain or IP address in a browser and see the sample application's main page.
