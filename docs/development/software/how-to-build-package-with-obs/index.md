---
author:
  name: Linode Community
  email: kwaku@tutanota.com
description: 'This guide shows how to build packages with Open Build Service using the web client and osc command-line tool.'
og_description: 'This guide shows how to build packages with Open Build Service using the web client and osc command-line tool.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: 'How to Build RPM Packages with Open Build Service'
h1_title: 'Building RPM Packages with Open Build Service'
contributor:
  name: Michael Aboagye
  link: https://twitter.com/kwaku_mikey
---


## Introduction

Assuming you are a systems developer. You have developed a tool written in C language to track and log all active processes to a log file. If you want to make this tool available for Linux distributions such as `OpenSuse_Leap 15.1`, you can make use of [Open Build Service](https://openbuildservice.org/) to package your tool and allow system administrators to install it via rpm package manager.

**Open Build Service** supports a variety of package formats such as `RPM package format` used by Red Hat, OpenSUSE and Fedora, `DEB package format` used by Debian, Ubuntu and other debian-based platforms, as well as `Arch package format` for Arch Linux.

It also provides [build recipe formats](https://openbuildservice.org/help/manuals/obs-user-guide/cha.obs.package_formats.html#id-1.5.5.2.5) for the above mentioned packages. For instance there is a *Spec format* for RPM packages only, and *dsc format* for DEB packages only.

It has a command line tool known as `osc`. It is written in python and works just like `git`. You can use this tool to upload archived source files to Open Build Service and query build results on your computer.

Open Build Service is an open-source project managed by OpenSUSE and a community of open source developers. You need an [OpenSUSE account](https://www.microfocus.com/selfreg/jsp/createOpenSuseAccount.jsp?login=Sign+up) to use Open Build Service to create a package.


### Advantages of Open Build Service

There are several ways available for software developers or System administrators to create software packages and distribute it to various platforms. Open Build Service makes it easier for package development because of the following reasons:

* It is open source. It is free for everyone to use.

* Supports various package formats.

* osc command line tool can be installed on all major Linux distributions.

* You can build packages via the command line tool and the web client.



## In this Guide

You will learn how to:

* Install `osc` command line tool.

* Create an OpenSUSE account

* Configure osc with your OBS instance credentials

* Create a hello world program in python

* Create `.spec` file for a python program

* Archive source files of a python program

* Use the web client tool to build rpm packages for OpenSuse_Leap_15

* Download source files with wget from Python Package Index

* Generate .spec file with py2pack

* Use osc command line tool to build rpm packages for OpenSuse_Leap_15


## Before You Begin

To run the examples in this guide, you need to install the `osc` command line tool and create an OpenSUSE account if you don't have one.

If you do not know how to install and set up `osc`, check how to do so in the installation section of this guide.

{{< note >}}
This guide is written for both root users and non-root users. So you can choose to run commands as a root user or non-root user. For a non-root user, prepend `sudo` to all commands.
{{< /note >}}

{{< note >}}
In this guide we refer to Open Build Service as **OBS**. Anytime we make mention of OBS, we are referring to Open Build Service.
{{< /note >}}



## Install osc and py2pack command line tool

In this section we will install OBS command line tool known as `osc` and `py2pack`.

On the terminal, type the following command to refresh or update repositories on OpenSuse_Leap_15:

    zypper   ref

The command `zypper ref` updates or refreshes repositories.

Run the following commands to install `osc` and `py2pack` via `zypper` package manager.

    zypper in osc

    zypper in py2pack

You can type the following command to verify whether you have installed it correctly.

    osc --help

    py2pack --help

Now that you have installed *osc* and *py2pack* tool on your workstation, it's time to create an OpenSUSE account.


## Create OpenSUSE service account:

Before you can create packages with OBS, you need to create an OpenSUSE account.

Locate your web browser and navigate to [OBS](https://build.opensuse.org/) below to create an account.

Click on the **signup button** to create an [OpenSUSE](https://www.microfocus.com/selfreg/jsp/createOpenSuseAccount.jsp?target=http://www.opensuse.org) account.

{{< note >}}
You don't need to be an OpenSUSE developer to set up OpenSUSE account.
{{< /note >}}

Fill the form presented to you and login with your registered `username` and `password`.

You have successfully set up an OpenSUSE account to create packages using Open Build Service.



## Configure osc with your OBS credentials

In this section you will configure the `osc` command line tool with your OBS instance username and password. It is necessary to configure osc with your username and password because you will make use of it to upload files to OBS public instance and build packages on your computer.

Use the same `username` and `password` you used for your OpenSUSE account registration.

On the terminal, execute the following command to prompt `osc` to ask you to set up a username and password for your OBS project:

    osc

There are several methods `osc` offers to store users' password. Pick any of the methods based on your preference to save your password.

{{< note >}}
If you are good at remembering password, you can choose method 4.
{{< /note >}}

If you selected method 4, osc will always prompt you for the password you used for osc configuration each time you execute `osc` command to work on packages.


## Build rpm package using OBS web client

In this section, you will make use of OBS web client to build rpm package for a simple `hello world` python program.

You will need a `.spec` file and archived source file to create rpm package using OBS web client. OBS make
use of *.spec* file to build packages for OpenSuse, Fedora and Red Hat because it contains build process instructions.


###  Create a Simple Hello World Python Program

Use the `touch` command to create a file as shown below:

    `touch program.py`

Afterwards edit the `program.py` file with the vim editor:

    `vim program.py`

Then copy and paste the following content inside the `program.py` file:

{{< file "program.py" python >}}
    #!/usr/bin/env python
    print("Hello World")
{{< /file >}}

Press the **escape** button. Then save and close the `program.py` file using the `:wq` command.


### Create a .spec File

In this section, we will create a `.spec` file for our python program.

A `spec` file is usually made up of rpm macros or commands and a metadata describing package name and version, license, the name of the
source file and a brief summary of the program or software.

Use the command below to create and edit the `program.spec` file for our python program.

    `vim program.spec`

Inside the `program.spec` file, copy and paste the following content


{{< file "program.spec" spec >}}
    Name:           program
    Version:        0.1.1
    Release:        1%{?dist}
    Summary:        a simple `hello world` python program

    License:        GPLv3+
    URL:            https://www.example.com/%{name}
    Source0:        https://www.example.com/%{name}/releases/%{name}-%{version}.tar.gz

    BuildRequires:  python
    Requires:       python
    Requires:       bash

    BuildArch:      noarch
{{< /file >}}


These directives defines basic information about the python program.


* The `Name` directive defines the name of the python program.

* The `version` directive defines the version number or type of the python program.

* The `release` directive

* The `summary` directive gives a brief description of the software.

* The `License` directive defines the software license associated with the source code. `GPLv3` simply
stands for **GNU General Public License version 3**.

* For the `url` directive, it contains URL link to the software page.

* The `Source` directive provides the URL link to the software source code.

* `BuildRequires` directive make mention of dependencies needed during build-time.

*  The `Requires` directive specifies required dependencies during runtime.

{{< note >}}
   Build-Time refers to the process during which a program's source code is converted into an executable
program whilst Run-Time refers to when the program is running.
{{< /note >}}

*  `BuildArch` directive specifies the type of architecture. `noarch` means no specific architecture specified.


Beneath the `BuildArch` directive, copy and paste the following the content into the `program.spec` file.

{{< file "program.spec" spec >}}
    %description
    A simple hello world python program for the beginners.

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
      - Demo python package
{{< /file >}}


In the `%description` section, provide a detailed information about the program than the one
provided by `Summary` directive.

In the `%prep` section, the source code is prepared by expanding the archived source code and so on.

In the `%build` section, OBS builds the python program.

In the `%install` section, OBS installs the python program inside the `buildroot` directory. `buildroot` is a chroot
base directory.

{{< note >}}
In Linux, `chroot` is an operation that locks the user or a process in their own directory without been able to access files outside
their directory.
{{< /note >}}

In the `%files` section, there is a list of files provided by RPM and these files will live on the system even after installation.
It also informs OBS of the license type via the `%license` macro.

Finally the `%changelog` section will contain information or logs related to package changes.


### Create an archived file for the source code

Use the `tar` command to create an archived file for the source code of the python program as shown below:

    tar -zvcf program.tar.gz  program.py

Finally you can move on to create rpm package for the python program using the following:

*  Log into OBS account with your registered username and password.

*  Go to your home project

*  Click on the **subproject** link to create a subproject. You can name it **Test** project.

*  Briefly describe the **Test** subproject inside the **description box**.

*  Click on the **create package** link to create rpm package for the python program.

*  Assign a name to it, and briefly describe the purpose of this package.

*  Upload `program.spec` file and `program.tar.gz` file by clicking on the **add files** link.

*  Specify the distribution platform to install the package on via the `build targets` link.

OBS then proceeds to build the rpm package for the python program. You can download the rpm package afterwards.


## Build rpm packages using osc

In this section, you will makes use of `osc` tool to build OpenSUSE rpm package for a python module from the terminal.


### Download Pytricia source files from Python Index

`wget` tool is available on every Unix platform. Use it download source files for `pytricia` module from [Python Package Index](https://pypi.org/project/pytricia/#files)

    wget https://files.pythonhosted.org/packages/12/28/0019f3d14d442d967ec7b4808951232519c8ba1a7574998a178cc82ac76e/pytricia-1.0.1.tar.gz


### Generate .spec file for Pytricia Module with py2pack

You can create a `.spec` file manually or generate it automatically with `py2pack` command:

    py2pack generate pytricia -f pytricia.spec

`py2pack` tool generates `.spec` files using [Jinja2](https://jinja.palletsprojects.com/en/2.11.x/) templates. Sometimes you have to make slight changes to the generated `spec` file such as including additional `BuildRequires` directives.

You can view the content of `pytricia.spec` file using the command below:

    cat pytricia.spec


### Configure your Build Target from the Terminal

Type the following command on the terminal to edit your build target.

    osc meta prj --edit home:mickwaku

The command above will show a XML structure like the one below

{{< note >}}
 Build targets are defined as project-wide and every package in a project is built for a specific build target such `openSUSE_Leap_15.2`.
In other words, every package in a specific project is built for a build target selected or defined for that project.
{{< /note >}}

Replace the following values with your own. You can add more build targets by making use of the
`repository` element.


    <project name="home:mickwaku">
      <title>IP address</title>
      <description>description of the project</description
      <person userid="mickwaku" role="maintainer"/>
    <repository name="openSUSE_Leap_15.2">
      <path project="openSUSE:Leap:15.2" repository="standard"/>
      <arch>x86_64</arch>
    </repository>
    </project>


Below are the definition of the following elements above:

*  project name: this is the project name

*  title: Title of home project

*  description: description of the project

*  person: defines owners' username via `userid`

*  repository: defines the build target for the package via `name`

*  arch: specifies the type of architecture such as `x86_64`


Press the *escape* button. Save and exit `vim` editor via `:wq` command. If the above XML configuration is valid, osc will save and show
this output

    Sending meta data...
    Done.

Next use the `osc checkout` command to checkout your home project. This command creates a local
working directory `home:mickwaku` inside your current directory.

    osc checkout home:mickwaku

Then change into the local working directory as shown below and create a new package `pytricia`:

    cd home:mickwaku

    osc mkpac pytricia

Afterwards change into the package directory `pytricia` with the `cd` command

    cd pytricia

Assuming you have already downloaded the archived source files for the python program and created `pytricia.spec` file, use the command below to upload these files to the `pytricia` directory.

    osc add pytricia.tar.gz pytricia.spec

{{< note >}}
If the files `pytricia.tar.gz` and `pytricia.spec` are not within the `package` directory, move them into the `package` directory using `mv` command.
{{< /note >}}

Then build the package for `OpenSuse Leap 15.2` with the architecture `x86_64` using the command below. This
command builds the package locally on your computer.

    osc build --local-package openSUSE_Leap_15.2 x86_64 *.spec

You can also make use of the command below to build packages locally on your computer. The `osc build` command
builds packages on your computer based on the information you provided in the XML file.

    osc build

Finally use the command `osc commit`to commit the files to your package to your home project on OBS.

    osc commit

The package is built on your computer and can be accessed at `/var/tmp/build-root/openSUSE_Leap_15.2-x86_64/home/abuild/rpmbuild/RPMS/x86_64/` if the build process completed without any errors.

