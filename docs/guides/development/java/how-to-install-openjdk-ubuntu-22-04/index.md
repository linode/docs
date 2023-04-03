---
slug: how-to-install-openjdk-ubuntu-22-04
description: 'This guide explains how to install and test the Open Java Development Kit (OpenJDK) version of the Java Runtime Environment (JRE) on Ubuntu 22.04.'
keywords: ['Java', 'OpenJDK', 'OpenJDK Ubuntu', 'How to install OpenJDK']
tags: ['ubuntu', 'java']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-20
modified_by:
  name: Linode
title: "How to Install OpenJDK on Ubuntu 22.04"
title_meta: "Installing OpenJDK on Ubuntu 22.04"
external_resources:
- '[OpenJDK website](https://openjdk.java.net/)'
- '[OpenJDK Development Guide](https://openjdk.java.net/guide/)'
- '[Java development site](https://dev.java/)'
- '[OpenJDK GA Release Archive](https://jdk.java.net/archive/)'
authors: ["Jeff Novotny"]
---

[OpenJDK](https://openjdk.java.net/) is a free, open-source, production-ready implementation of Java based on Oracle's commercial version of Java. This guide explains how to download and install OpenJDK on Ubuntu 22.04. It also demonstrates how to configure OpenJDK and write a short test script to validate the installation.

## What is OpenJDK?

OpenJDK is a free open-source version of the *Java Platform, Standard Edition* (Java SE). Java is a popular and versatile object-oriented programming language that is frequently used for business applications. Java is class-based and is regarded as fast, reliable, and secure.

OpenJDK is an alternative to the official Oracle Java implementation, which has a more restrictive license. OpenJDK is offered under the *GNU General Public License* (GPL) 2.0 license. With the exception of the licensing details, OpenJDK and Java SE are almost the same.

There are two main components to OpenJDK, the *Java Developer Kit* (JDK) and the *Java Runtime Environment* (JRE). The JDK package includes the JRE, but the JRE can be downloaded as a stand-alone application.

- **JDK**: The JDK is primarily used by Java developers. The JDK includes the Javac compiler for compiling Java programs into bytecode. It also contains a development kit consisting of developer tools and a debugger. The JDK is necessary to create stand-alone Java executables. Some Java-dependent applications require the JDK because they convert Java Server pages into Java servlets and must compile them first.
- **JRE**: The JRE executes Java code and compiled Java bytecode. It bundles the *Java Virtual Machine* (JVM) together with the *Java Class Library* (JCL) and other files. The JRE interprets Java bytecode into lower-level code. It can also run Java files, but cannot convert these files into programs. The JRE is much less efficient at running Java files than applications because it must compile the source code first. Users who only want to run Java programs only require the JRE. The JDK is not necessary in this case.

The most widely-used *Long-term support* (LTS) branches of OpenJDK are release 11 and release 17. Release 11 is still supported for several years, but users should consider upgrading to a newer branch. The remaining branches have all reached the end-of-life stage.

For more information about OpenJDK, see the [OpenJDK website](https://openjdk.java.net/).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install OpenJDK

The different releases of OpenJDK can be installed using `apt`. Most developers currently use either Release 11 or Release 17 of the Java platform. These are both LTE releases, while release 18 is the current release. These instructions are designed for Ubuntu 22.04 users but are very similar for Ubuntu 20.04.

{{< note >}}
To install a release of OpenJDK that is not available through `apt`, download the appropriate `tar.gz` file from [The OpenJDK archive](https://jdk.java.net/archive/).
{{< /note >}}

1.  Ensure the `apt` libraries are updated.

    ```command
    sudo apt update && sudo apt upgrade -y
    ```

1.  Confirm whether Java is already installed.

    ```command
    java -version
    ```

    {{< output >}}
Command 'java' not found
    {{< /output >}}

1.  Install the preferred release of OpenJDK using `apt`. Answer `y` when Ubuntu asks whether to proceed with the installation. The following command demonstrates how to install the full JDK platform of OpenJDK release 17. To install only the JRE component, see the following instruction.

    {{< note >}}
To install release 11 of OpenJDK, use the command `sudo apt-get install openjdk-11-jdk`. Use `sudo apt-get install openjdk-18-jdk` to install release 18. To see all available editions of OpenJDK, search the `apt` libraries using the `apt-cache search openjdk` command.
    {{< /note >}}

    ```command
    sudo apt-get install openjdk-17-jdk
    ```

1.  **(Optional)** To install only the JRE component of OpenJDK, use the following command. To install a release other than OpenJDK release 17, change `17` to the appropriate release number.

    ```command
    sudo apt-get install openjdk-17-jre
    ```

1.  Confirm the correct release of Java has been installed.

    ```command
    java -version
    ```

    ```output
    openjdk version "17.0.3" 2022-04-19
    OpenJDK Runtime Environment (build 17.0.3+7-Ubuntu-0ubuntu0.22.04.1)
    OpenJDK 64-Bit Server VM (build 17.0.3+7-Ubuntu-0ubuntu0.22.04.1, mixed mode, sharing)
    ```

1.  If the full JDK platform is installed, confirm the release of the Java compiler.

     ```command
     javac -version
     ```

    ```output
    javac 17.0.3
    ```

## Set the Environment Variables for Java

Although Java is already installed, further configuration is required. Setting a few environment variables makes OpenJDK easier to use and allows other applications to find it. To set the Java environment variables, follow the steps below:

1.  Edit the `.bashrc` file in your home directory and add the following definitions to the end of the file. Save the file after making the changes.

    {{< note >}}
To set these values for all system users, add the following changes to `/etc/environment` instead.
    {{< /note >}}

    ```output
    vi ~/.bashrc
    ```

    ```file {title="~/.bashrc"}
    ...
    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
    export PATH=$PATH:$JAVA_HOME/bin
    ```

1.  Source the `.bashrc` file to apply the changes.

    ```command
    source ~/.bashrc
    ```

1.  Echo `JAVA_HOME` and `PATH` to verify they are set correctly. The `$JAVA_HOME` value should be similar to `/usr/lib/jvm/java-17-openjdk-amd64`, depending on the release. This value should also be appended to the end of the `$PATH` variable.

    ```command
    echo $JAVA_HOME
    echo $PATH
    ```

## Test the OpenJDK Installation

The best way to test the installation is to write a simple Java application. Run the application to confirm the JRE is working correctly. If the full JDK is also installed, try compiling the application as well.

### Run a Java Application Using the OpenJDK JRE

The JRE cannot compile an application, but it can run Java code. To verify the JRE is working, write and run a short Java program.

1.  Create a sample `HelloWorld` program using a text editor. Inside a file labeled `HelloWorld.java`, create a `HelloWorld` class. The `Main` routine for the class should print `Hello World from Java!` to the console. The file should resemble the following code sample:

    ```file {title="HelloWorld.java"}
    public class HelloWorld {
        public static void main(String[] args) {
            System.out.println("Hello World from Java!");
        }
    }
    ```

1.  In the same directory, use the OpenJDK JRE to run `HelloWorld.java`.

    ```command
    java HelloWorld.java
    ```

1.  Verify the console output to ensure the installation was successful. The `Hello World from Java!` text should appear. Because JRE must first compile the program into bytecode, there might be a short delay before the program starts running.

    ```output
    Hello World from Java!
    ```

### Compile a Java Application Using the JDK

The JDK is a full development environment. It can compile Java code into Java bytecode for faster execution. This process creates a stand-alone Java class file that can be shared with others. To compile the `HelloWorld.java` test application, follow the steps below:

1.  From the directory containing the source code, use the `javac` compiler to compile the file.

    ```command
    javac HelloWorld.java
    ```

1.  Confirm a `HelloWorld.class` file now exists in the same directory.

    ```command
    ls -l HelloWorld.class
    ```

    ```output
    -rw-rw-r-- 1 userid userid 436 May 31 08:33 HelloWorld.class
    ```

1.  Run the compiled `HelloWorld` class file using the OpenJDK JRE. The output `Hello World from Java!` should appear.

    {{< note >}}
In the previous section, the JRE ran the source file `HelloWorld.java`. This time it is running the compiled class file `HelloWorld`.
    {{< /note >}}

    ```command
    java HelloWorld
    ```

    ```output
    Hello World from Java!
    ```

## A Summary of How to Install and Test OpenJDK on Ubuntu 22.04

OpenJDK is a free open-source implementation of Oracle Java, licensed under GPL version 2. OpenJDK includes a JDK for compiling Java code and a JRE for running Java programs. The JDK includes the JRE, but the JRE can be downloaded separately.

OpenJDK for Ubuntu 22.04 can be installed using `apt`. After downloading the program, it is necessary to set a few environment variables to ensure smooth operation. Write a short test script to validate the OpenJDK installation. Try executing the script on the JRE and compiling it using the JDK. For more information on using OpenJDK, consult the [OpenJDK Development Guide](https://openjdk.java.net/guide/).
