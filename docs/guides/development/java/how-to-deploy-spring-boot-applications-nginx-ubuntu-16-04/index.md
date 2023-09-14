---
slug: how-to-deploy-spring-boot-applications-nginx-ubuntu-16-04
description: 'This guide shows you how to quickly create a Spring Boot application embedded on a Tomcat server using the command line interface on your Linode.'
og_description: "This guide shows you how to quickly create a Spring Boot application embedded on a Tomcat server using the command line interface on your Linode."
keywords: ["spring", "tomcat", "maven", "Java", "gradle"]
tags: ["web applications","java","nginx","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-07
modified_by:
  name: Linode
published: 2018-03-07
title: Deploy Spring Boot Applications with an NGINX Reverse Proxy
title_meta: How to Deploy Spring Boot Applications on NGINX on Ubuntu 16.04
external_resources:
- '[Spring Boot](https://projects.spring.io/spring-boot/)'
- '[SDKMAN!](http://sdkman.io/)'
- '[Gradle](https://gradle.org/)'
audiences: ["intermediate"]
concentrations: ["Web Applications"]
languages: ["java"]
relations:
    platform:
        key: spring-boot-nginx
        keywords:
            - distribution: Ubuntu 16.04
aliases: ['/development/java/how-to-deploy-spring-boot-applications-nginx-ubuntu-16-04/']
authors: ["Sam Foo"]
---

![How to Deploy Spring Boot Applications on NGINX on Ubuntu 16.04](deploy-spring-boot-nginx-reverse-proxy.jpg "How to Deploy Spring Boot Applications on NGINX on Ubuntu 16.04")

## What is Spring Boot?

[Spring Boot](https://projects.spring.io/spring-boot/) enables quick development of the [Spring Framework](https://projects.spring.io/spring-framework/) by taking care of default configurations and allowing Java developers to focus on rapid prototyping. This guide shows how to create a simple Spring Boot application which is then exposed through an NGINX reverse proxy.

## Before You Begin

You will need a Linode with both Java 8 and NGINX. If these are already installed on your Linode, skip to the next section.

### Install Java JDK 8

1.  Install `software-properties-common`:

        sudo apt install software-properties-common

2.  Add the Oracle PPA repository:

        sudo apt-add-repository ppa:webupd8team/java

3.  Update your system:

        sudo apt update

4.  Install the Oracle JDK. To install the Java 9 JDK, change `java8` to `java9` in the command:

        sudo apt install oracle-java8-installer

5.  Check your Java version:

        java -version

### Install NGINX

{{< content "install-nginx-ubuntu-ppa" >}}

## Install Spring Boot CLI
The Spring Boot CLI makes creating a scaffold for a project much easier. [SDKMAN!](http://sdkman.io/) is a tool that simplifies installation of the Spring CLI and build tools such as Gradle or Maven. Using the Spring Boot CLI, a new project can be created directly from the command line.

1.  Install dependencies for SDKMAN!:

        sudo apt install unzip zip

2.  Install SDKMAN!:

        curl -s https://get.sdkman.io | bash

3.  Follow the instructions printed on the console:

        source "/home/username/.sdkman/bin/sdkman-init.sh"

    Verify SDKMAN! is installed:

        sdk help

4.  Install Spring CLI:

        sdk install springboot

    Verify the installation:

        spring version

5.  Install Gradle:

        sdk install gradle 4.5.1

    {{< output>}}
Downloading: gradle 4.5.1

In progress...

######################################################################## 100.0%

Installing: gradle 4.5.1
Done installing!
{{< /output >}}

## Build a jar File
There are many build tools available. The Spring Boot CLI uses Maven by default but this guide will use Gradle instead. See [this comparison](https://gradle.org/maven-vs-gradle/) for a discussion about the differences between Maven and Gradle.

1.  Create a new project with the Spring Boot CLI. This creates a new directory called `hello-world` with a project scaffold.

        spring init --build=gradle --dependencies=web --name=hello hello-world

    {{< note respectIndent=false >}}
To see a full list of possible parameters for the Spring Boot CLI, run:

    spring init --list
{{< /note >}}

2.  Navigate into the project directory. This example creates an endpoint to return "Hello world" in a Spring application. Add two additional imports and a new class for this mapping.

    {{< file "~/hello-world/src/main/java/com/example/helloworld/HelloApplication.java" >}}
package com.example.helloworld;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
public class HelloApplication {

        public static void main(String[] args) {
                SpringApplication.run(HelloApplication.class, args);
        }
}

@RestController
class Hello {

    @RequestMapping("/")
    String index() {
        return "Hello world";
    }
}
{{< /file >}}

3.  Build the application. This creates a new directory called `build` in the project.

        ./gradlew build

4.  Run the application embedded with the Tomcat Server. The application will run on a Tomcat servlet on `localhost:8080`. Press `Ctrl+C` to stop.

        java -jar build/libs/hello-world-0.0.1-SNAPSHOT.jar

5.  The application can run in-place without building a jar file first.

        gradle bootRun

6.  Test that the application is running correctly on `localhost`:

        curl localhost:8080

    {{< output >}}
Hello world
{{< /output >}}

7.  Stop the Tomcat server with `CTRL+C`.

## Create an Init Script

1.  Set the Spring Boot application as a service to start on reboot:

    {{< file "/etc/systemd/system/helloworld.service" >}}
[Unit]
Description=Spring Boot HelloWorld
After=syslog.target
After=network.target[Service]
User=username
Type=simple

[Service]
ExecStart=/usr/bin/java -jar /home/linode/hello-world/build/libs/hello-world-0.0.1-SNAPSHOT.jar
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=helloworld

[Install]
WantedBy=multi-user.target
{{< /file >}}

2.  Start the service:

        sudo systemctl start helloworld

3.  Check the status is active:

        sudo systemctl status helloworld

## Reverse Proxy
Now that the Spring application is running as a service, an NGINX proxy allows opening the application to an unprivileged port and setting up SSL.

1.  Create an NGINX configuration for the reverse proxy:

    {{< file "/etc/nginx/conf.d/helloworld.conf" >}}
server {
        listen 80;
        listen [::]:80;

        server_name example.com;

        location / {
             proxy_pass http://localhost:8080/;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
             proxy_set_header X-Forwarded-Port $server_port;
        }
}
{{< /file >}}

2.  Test the configuration to make sure there are no errors:

        sudo nginx -t

3.  If there are no errors, restart NGINX so the changes take effect:

        sudo systemctl restart nginx

4.  The application is now accessible through the browser. Navigate to the public IP address of the Linode and the "Hello world" message should appear.
