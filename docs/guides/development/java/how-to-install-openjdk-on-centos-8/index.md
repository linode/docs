---
slug: how-to-install-openjdk-on-centos-8
description: 'This guide will show you how to install the free and open-source Open Java Development Kit (OpenJDK) version of the Java Runtime Environment (JRE) on CentOS 8.'
keywords: ["java", "openjdk", "jdk", "11", "CentOS", "8"]
tags: ["java","centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-03-25
modified_by:
  name: Linode
published: 2020-03-25
title: Installing Java Development Kit 11 on CentOS 8
title_meta: How To Install Java Development Kit 11 on CentOS 8
image: Installing_Java_Development_Kit_11_on_CentOS8_1200x631.png
audiences: ["beginner"]
languages: ["java"]
relations:
    platform:
        key: install-openjdk
        keywords:
            - distribution: Ubuntu 16.04
aliases: ['/development/java/how-to-install-openjdk-on-centos-8/']
authors: ["Rajakavitha Kodhandapani"]
---

[Java](https://www.oracle.com/java/index.html) is one of the world's most popular programming languages. Software written in Java can be compiled and run on any system, making Java a versatile platform that can be used to create anything from software to basic web applications. This guide will show you how to install the Open Java Development Kit (OpenJDK) 11 on CentOS 8.

OpenJDK is the free and open-source implementation of the Oracle Java Standard Edition (Java SE) Development Kit. OpenJDK and Java SE are equivalent JDKs that include a Java runtime environment (JRE) and tools for developing and compiling Java applications.

While there are many available versions of OpenJDK, version 11 is the latest Long-Term-Support (LTS) release as of the time of this guide's publication. For this reason, OpenJDK 11 is the recommended version for developing production applications.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for connecting to your Linode with SSH and setting your Linode's hostname and timezone.

1.  Complete the sections of our guide on [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services. This guide will use `sudo` commands wherever possible, which should be run by a limited, non-root user on your Linode.

1.  Ensure your system is up-to-date:

        sudo yum update

## Install OpenJDK

1.  Install the OpenJDK 11 development kit, which includes OpenJRE 11:

        sudo yum install java-11-openjdk-devel

    Alternatively, if you simply want to run Java applications that you have already downloaded, you can choose to only install OpenJRE 11:

        sudo yum install java-11-openjdk

    {{< note respectIndent=false >}}
While you can run Java applications directly with the JRE, your applications will be compiled every time they are executed. This is generally slower than running applications that have already been compiled into Java bytecode, and may not be suitable if you plan to execute applications many times.
{{< /note >}}

1.  Check the version of the JRE to verify that it has been properly installed:

        java -version

    As of the time of this publication, this command should return:

    {{< output >}}
openjdk version "11.0.7" 2020-04-14 LTS
OpenJDK Runtime Environment 18.9 (build 11.0.7+10-LTS)
OpenJDK 64-Bit Server VM 18.9 (build 11.0.7+10-LTS, mixed mode, sharing)
{{< /output >}}

1.  If you have chosen to install the full OpenJDK development kit, check the version of the compiler as well:

        javac -version

    As of the time of this publication, this command should return:

    {{< output >}}
javac 11.0.7
{{< /output >}}

## Set Environment Variables

This section will instruct you on how to set the `JAVA_HOME` and `PATH` environment variables to help ensure that your Java applications will run without issue.

1.  Open the `~/.bashrc` startup file using the text editor of your choice and add the following definitions at the end of the file:

    {{< file "~/.bashrc" sh>}}
# [...]
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export PATH=$PATH:$JAVA_HOME/bin
{{< /file >}}

    {{< note respectIndent=false >}}
If you are using a shell other than Bash, such as [Zsh](https://github.com/ohmyzsh/ohmyzsh), you may need to add these lines in a different startup file instead. In the case of Zsh, this would be the `~/.zshrc` file.
{{< /note >}}

1.  Save the changes and exit your text editor.

1.  Reload the `~/.bashrc` file:

        source ~/.bashrc

1.  Verify that the JAVA_HOME and PATH variables were set correctly:

        echo $JAVA_HOME
        echo $PATH

    The `JAVA_HOME` variable should be set to the directory that contains your OpenJDK installation, and the `PATH` variable should include the directory that contains the OpenJDK binary files.

## Test the Java Installation (Optional)

To test your Java installation, write a sample `HelloWorld` Java application and run it with the JRE.

1.  Open a text editor and add the following lines in a file labeled `HelloWorld.java` to create a simple function that prints "Hello Java World!":

    {{< file "HelloWorld.java" java >}}
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello Java World!");
    }
}
{{< /file >}}

1.  Run the application using the JRE:

        java HelloWorld.java

    If the installation has been successful, the output will be:

    {{< output >}}
Hello Java World!
{{< /output >}}

If you have installed the full OpenJDK development kit, you can compile your application into a bytecode class file prior to running it for faster execution time.

1.  Compile the application you have written:

        javac HelloWorld.java

1.  Confirm that the `HelloWorld.class` file was written to your current directory:

        ls -l HelloWorld.class

1.  Run the compiled `HelloWorld` function using the JRE:

        java HelloWorld

    The output should again be:

    {{< output >}}
Hello Java World!
{{< /output >}}
