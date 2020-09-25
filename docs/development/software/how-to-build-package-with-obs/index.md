---
author:
  name: Linode Community
  email: kwaku@tutanota.com
description: 'This guide shows how to build packages with Open Build Service using the web client and osc command line tool.'
og_description: 'This guide shows how to build packages with Open Build Service using the web client and osc command line tool.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ['rpm packages in linux', 'rpm package install', 'open build service tutorial', 'osc command line tool']
tags: ['python', 'linux']
modified: 2020-09-24
modified_by:
  name: Linode
published: 2020-09-24
title: 'How to Build RPM Packages with Open Build Service on OpenSUSE 15.1'
h1_title: 'Building RPM Packages with Open Build Service on OpenSUSE 15.1'
contributor:
  name: Michael Aboagye
  link: https://twitter.com/kwaku_mikey
---

## Introduction

[Open Build Service](https://openbuildservice.org/) supports a variety of package formats such as *RPM package format* used by Red Hat, OpenSUSE, and Fedora, *DEB package format* used by Debian, Ubuntu and other debian-based platforms, as well as *Arch package format* for Arch Linux. It also provides [build recipe formats](https://openbuildservice.org/help/manuals/obs-user-guide/cha.obs.package_formats.html#id-1.5.5.2.5) for the aforementioned packages. For example, there is a *spec format* for RPM packages, and a *dsc format* for DEB packages.

Let's assume you are a systems developer and you have developed a tool written in the C language to track and log all active processes to a log file. If you want to make this tool available for Linux distributions, such as *OpenSuse_Leap 15.1*, you can make use of Open Build Service to package your tool and allow system administrators to install it via RPM package manager.

Open Build Service has a command line tool called `osc`. It is written in Python and works similarly to `git`. You can use this tool to upload archived source files to Open Build Service and query build results on your computer.

Open Build Service is an open-source project managed by OpenSUSE and a community of open source developers. You need an [OpenSUSE account](https://www.microfocus.com/selfreg/jsp/createOpenSuseAccount.jsp?login=Sign+up) to use Open Build Service to create a package.


### Advantages of Open Build Service

There are several ways for software developers or System administrators to create and distribute software packages to various platforms. Open Build Service makes package development easier in following ways:

* It is open source and free for everyone to use.

* It supports multiple package formats.

* The osc command line tool can be installed on all major Linux distributions.

* You can build packages via the command line tool and the web client.

## In this Guide

You learn how to:

* [Install `osc` command line tool](#install-osc-and-py2pack-command-line-tools).

* [Create an OpenSUSE account](#create-an-opensuse-service-account).

* [Configure osc with your OBS instance credentials](#configure-osc-with-your-obs-credentials).

* [Build an RPM package using OBS web client](#build-an-rpm-package-using-obs-web-client)

* [Build RPM packages using osc](#build-rpm-packages-using-osc)

## Before You Begin

- This guide assumes you are running OpenSUSE 15.1 either on a Linode or as your local machine. If you need help creating a Linode with OpenSUSE, see our [Getting Started](https://www.linode.com/docs/getting-started/) and [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guides.

- To run the examples in this guide, you need to [install the `osc` command line tool](#install-osc-and-py2pack-command-line-tools) and [create an OpenSUSE account](#create-an-opensuse-service-account) if you don't have one.

{{< note >}}
This guide is written for either root or non-root users. If you choose to run commands as a non-root user, prepend `sudo` to all commands.
{{< /note >}}

{{< note >}}
For the remainder of this guide, Open Build Service is referred to as **OBS**.
{{< /note >}}

## Install osc and py2pack command line tools

Install OBS command line tools known as `osc` and `py2pack`.

1.  In the terminal, use the following command to refresh or update repositories:

        zypper ref

1.  Run the following commands to install `osc` and `py2pack` via the `zypper` package manager.

        zypper in osc
        zypper in python3-py2pack

1.  Use the following commands to verify whether you have installed each package correctly.

        osc --help
        py2pack --help

## Create an OpenSUSE service account

Before you can create packages with OBS, you need to create an OpenSUSE account.

1.  In your web browser and navigate to [OBS](https://build.opensuse.org/) to create an account.

1.  Click on the **signup button** to create an [OpenSUSE](https://idp-portal.suse.com/univention/self-service/#page=createaccount) account.

    {{< note >}}
You don't need to be an OpenSUSE developer to set up OpenSUSE account.
{{< /note >}}

1.  Fill out the form and verify your account through email, but then return to the [OBS page](https://build.opensuse.org/) to login with your registered `username` and `password`. **Note:** The Univention portal does not allow you to create a profile or continue with your account, you must return to the OBS page.

## Configure osc with your OBS credentials

You need to configure osc with your OBS username and password so you can upload files to your OBS public instance and build packages on your computer.

1.  In the terminal, execute the following command to prompt `osc` to ask you to set up a username and password for your OBS project. Use the same `username` and `password` you used for your OpenSUSE account registration.

        osc

1.  There are several methods `osc` offers to store users' password. In this tutorial, choose method 4. With method 4, osc prompts you for the password each time you execute an `osc` command to work on packages.

    {{< output >}}
1) fail Keyring (Backend provided by python-keyring)
2) Config file credentials manager (Store the credentials in the config file (plain text))
3) Obfuscated Config file credentials manager (Store the credentials in the config file (obfuscated))
4) Transient password store (Do not store the password and always ask for the password)
{{</ output >}}

## Build an RPM package using OBS web client

The following section demonstrates how to use the OBS web client to build an RPM package for a simple `hello world` python program using a `.spec` file and an archived source file. OBS uses the `.spec` file to build packages for OpenSuse, Fedora, and Red Hat because it contains build process instructions.

### Create a Simple "Hello World" Python Program

1.  Use the `touch` command to create a file called `program.py`:

        touch program.py

1.  Afterwards, edit the `program.py` file with the vim editor:

        vim program.py

1.  Then copy and paste the following content inside the `program.py` file:

{{< file "program.py" python >}}
    #!/usr/bin/env python
    print("Hello World")
{{< /file >}}

1.  Press the **escape** button. Then save and close the `program.py` file using the `:wq` command.

### Create a .spec File

A `.spec` file usually contains RPM macros or commands, and metadata describing the package name, version, license, the name of the source file, and a brief summary of the program or software.

1.  Use the following command to create and edit the `program.spec` file for our python program.

        vim program.spec

1.  Inside the `program.spec` file, copy and paste the following content:

    {{< file "program.spec" spec >}}
    Name:           program
    Version:        0.1.1
    Release:        1%{?dist}
    Summary:        a simple `hello world` Python program

    License:        GPLv3+
    URL:            https://www.example.com/%{name}
    Source0:        https://www.example.com/%{name}/releases/%{name}-%{version}.tar.gz

    BuildRequires:  python
    Requires:       python
    Requires:       bash

    BuildArch:      noarch
{{< /file >}}

    These directives defines basic information about the Python program.

    - The `Name` directive defines the name of the Python program.

    - The `Version` directive defines the version number or type of the Python program.

    - The `Release` directive indicates the release number.

    - The `Summary` directive gives a brief description of the software.

    - The `License` directive defines the software license associated with the source code. `GPLv3` simply
stands for **GNU General Public License version 3**.

    - The `URL` directive contains URL link to the software page.

    - The `Source` directive provides the URL link to the software source code.

    - `BuildRequires` directive make mention of dependencies needed during build-time.

    -  The `Requires` directive specifies required dependencies during runtime.

    {{< note >}}
   `Build-time` refers to the process during which a program's source code is converted into an executable program, whilst `runtime` refers to when the program is running.
{{< /note >}}

    -  `BuildArch` directive specifies the type of architecture. `noarch` means no specific architecture specified.

1.  Beneath the `BuildArch` directive, copy and paste the following the content into the `program.spec` file.

    {{< file "program.spec" spec >}}
    %description
    A simple hello world Python program for the beginners.

    %prep
    %setup -q

    %build

    python -m compileall %{name}.py

    %install

    mkdir -p %{buildroot}/%{_bindir}
    mkdir -p %{buildroot}/usr/lib/%{name}

    cat > %{buildroot}/%{_bindir}/%{name} <<-EOF
    #!/bin/bash
    /usr/bin/python /usr/lib/%{name}/%{name}.pyc
    EOF

    chmod 0755 %{buildroot}/%{_bindir}/%{name}

    install -m 0644 %{name}.py* %{buildroot}/usr/lib/%{name}/

    %files
    %license LICENSE
    %dir /usr/lib/%{name}/
    %{_bindir}/%{name}
    /usr/lib/%{name}/%{name}.py*

    %changelog
    * Wed April 10 2020 Linode <Linode.org> - 0.1.1-1
      - Demo Python package
{{< /file >}}

    - In the `%description` section, provide detailed information about the program other than the one
provided by `Summary` directive.

    - In the `%prep` section, the source code is prepared by expanding the archived source code.

    - In the `%build` section, OBS builds the Python program.

    - In the `%install` section, OBS installs the Python program inside the `buildroot` directory. `buildroot` is a chroot base directory.

    {{< note >}}
In Linux, `chroot` is an operation that locks the user or a process in their own directory without been able to access files outside their directory.
{{< /note >}}

    - In the `%files` section, there is a list of files provided by RPM and these files live on the system even after installation. It also informs OBS of the license type via the `%license` macro.

    - The `%changelog` section contains information or logs related to package changes.

### Create an archived file for the source code

1.  Use the `tar` command to create an archived file for the source code of the Python program:

        tar -zvcf program.tar.gz  program.py

### Download your files (optional)

If you are running OpenSUSE on a Linode, you first need to copy your files to a local machine before you can upload them to the OBS site.

1.  In the terminal on your local machine use `scp` to copy the files from your Linode to your machine:

        scp your_linode_username@your_linode_ip:/path/to/your/file.txt /path/to/your/local/directory/

    Replace all fields with the appropriate values for both the `program.spec` and `program.tar.gz` files.

### Upload your files to OBS

OBS organizes packages into projects. You have a main *Home Project*, this will have a name `home:Username`. In your Home Project, you create a *Subproject* for this program. The structure looks like this in the interface: `home:UserName:subproject_name/package_name`.

Create an RPM package for the Python program using the following steps.

1.  Log into OBS account with your registered username and password.

1.  Click the **Home Project** link by your profile name.

1.  Click on the **Subprojects** tab. Then click on the **Create Subproject** link to create a subproject.

1.  Give the Subproject a name, title, and description. Click the **Accept** button to continue to the Subproject Overview screen for this new Subproject you created.

1.  In the Packages panel, click on the **Create Package** link to create RPM package for the Python program.

1.  Assign a name, title, and briefly describe the purpose of this package. Then click the **Create** button to continue to the Package Overview screen.

1.  In the Source Files panel, click the **Add File** link. Upload the `program.spec` and `program.tar.gz` files using the upload screen.

1.  In the **Build Results** panel, click the **build targets** link. Select the distributions you wish to install the package to on this screen. As each distribution is checked, they are built.

1.  Click the **Overview** tab to view the **Build Results** panel. Here you can see that OBS has proceeded to build the RPM package for the Python program for each selection you made on the build target screen. If there was a problem with the build, an information icon informs you with the reason why. Usually this is due to an error in your `.spec` file.

1.  You can download the RPM package by clicking on the **Repositories** tab.

## Build RPM packages using osc

In this section, you use the `osc` tool to build an OpenSUSE RPM package for a Python module from the terminal.

### Download Pytricia source files from Python Index

1.  The `wget` tool is available on every Unix platform. Use it download source files for `pytricia` module from [Python Package Index](https://pypi.org/project/pytricia/#files)

        wget https://files.pythonhosted.org/packages/12/28/0019f3d14d442d967ec7b4808951232519c8ba1a7574998a178cc82ac76e/pytricia-1.0.1.tar.gz


### Generate .spec file for Pytricia Module with py2pack

The `py2pack` tool generates `.spec` files using [Jinja2](https://jinja.palletsprojects.com/en/2.11.x/) templates. Sometimes you have to make slight changes to the generated `.spec` file such as including additional `BuildRequires` directives.

1.  You can create a `.spec` file manually or generate it automatically with `py2pack` command:

        py2pack generate pytricia -f pytricia.spec

1.  You can view the content of `pytricia.spec` file using the following command:

        cat pytricia.spec

### Configure your Build Target from the Terminal

1.  Type the following command in the terminal to edit your build target:

        osc meta prj --edit home:username

The command above shows a XML structure like the one below.

{{< note >}}
Build targets are defined as project-wide and every package in a project is built for a specific build target such `openSUSE_Leap_15.2`. In other words, every package in a specific project is built for a build target selected or defined for that project.
{{< /note >}}

1.  Replace the following values with your own. You can add more build targets by making use of the
`repository` element.

{{< file >}}
    <project name="home:username">
      <title>IP address</title>
      <description>description of the project</description>
      <person userid="username" role="maintainer"/>
    <repository name="openSUSE_Leap_15.2">
      <path project="openSUSE:Leap:15.2" repository="standard"/>
      <arch>x86_64</arch>
    </repository>
    </project>
{{</ file >}}

Below are the definitions of the following elements above:

*  project name: This is the project name.

*  title: Title of home project.

*  description: The description of the project.

*  person: This defines the owners' username via `userid`.

*  repository: This defines the build target for the package via `name`.

*  arch: This specifies the type of architecture such as `x86_64`.

1.  Press the **escape** button. Then type `:wq` to save and exit the `vim` editor. If the above XML configuration is valid, osc saves and shows the following output:

    {{< output >}}
    Sending meta data...
    Done.
{{</ output >}}

1.  Next, use the `osc checkout` command to checkout your home project. This command creates a local
working directory `home:username` inside your current directory.

        osc checkout home:username

1.  Then change into the local working directory and create a new package `pytricia`:

        cd home:username
        osc mkpac pytricia

1.  Change into the package directory `pytricia` with the `cd` command:

        cd pytricia

1.  Assuming you have already downloaded the archived source files for the Python program and created the `pytricia.spec` file, upload these files to the `pytricia` directory with the following command:

        osc add pytricia.tar.gz pytricia.spec

    {{< note >}}
If the files `pytricia.tar.gz` and `pytricia.spec` are not within the `package` directory, move them into the `package` directory using `mv` command.
{{< /note >}}

1.  Then build the package for `OpenSuse Leap 15.2` with the architecture `x86_64` using the following command. This command builds the package locally on your computer.

        osc build --local-package openSUSE_Leap_15.2 x86_64 *.spec

1.  Alternatively, you can use the `osc build` command without options and arguments to build the package locally on your computer. The `osc build` command uses the information you provided in the XML file for the build.

        osc build

1.  Finally use the command `osc commit` to commit the files in your package to your home project on OBS.

        osc commit

    If the build process completed without any errors, the package is built on your computer and can be accessed at `/var/tmp/build-root/openSUSE_Leap_15.2-x86_64/home/abuild/rpmbuild/RPMS/x86_64/`.
