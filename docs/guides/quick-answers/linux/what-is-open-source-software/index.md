---
slug: what-is-open-source-software
description: 'What is open source software and how does it work? We answer these questions, note the advantages and disadvantages of open source software, plus examples.'
keywords: ['what is open source software','open source software','keywords','open source software definition']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-19
modified_by:
  name: Linode
title: "What is Open Source Software?"
title_meta: "Open Source Software Definition and Examples"
authors: ["Jack Wallen"]
---

Every application you use starts as an idea. No matter the platform it’s installed on or its purpose, every piece of software begins in the planning phase. That idea is then turned into a project and at its heart is the source code, which is written by either a single software engineer or a team. The source code is then compiled into a functioning application that you run on your desktop computer or server.

Without software, the world wouldn't function nearly as efficiently or effectively. If a consumer names their most-used applications, it’s likely to be a combination of Chrome, Safari, Firefox, Thunderbird, Office365, Google Workspace, Photoshop, or Final Cut Pro. Ask a business owner and the answer is similar, depending on the size of the operation. When a business grows in scale, the answer encompasses Docker, Kubernetes, or several developer IDEs and frameworks.

Whether a user knows which of the applications are open-source and which are closed source, is more challenging to determine. Knowledgeable users may answer Firefox, Thunderbird, Docker, and Kubernetes, as all open-source. Chrome, Safari, Office365, Google Workspace, Photoshop, and Final Cut Pro are all closed source.

## Open Source vs Closed Software

The differences between open-source and closed source software are significant. Fundamentally, the definition of open-source software is that the code used to create a piece of software is available to download along with the app itself, although it's much more than that.
With open-source software, you can download the source code, you can alter it, and redistribute it as long as you credit the original creator. Here’s a good example of an open source path:

- Find an application you like, and install it.
- Find there are ways to improve the tool.
- Download the source, make your additions/changes and recompile it.
- Use the new tool and decide everyone should be able to use it.
- Upload the software and the code to a public repository and distribute it with an open-source license.
- Other people use, improve, and distribute your app.

You cannot do that with closed source software. The licenses do not allow it, and you do not have access to the source code. With closed source software, the code is protected and never released to the public. The only time a company might release code for a closed source project is if another company buys into their effort, or a portion of their code is made available so third-party companies can create software that interacts or connects to the original project.
Part of the beauty of open-source software is that it's not just about making code available: it's building a community of developers and users who understand that software greatly benefits when new projects can spring from those already in existence.

Open-source software was invented in 1983, when Richard Stallman, a programmer at MIT, believed that all software should be accessible to all programmers, so the code could be modified as needed. Stallman began releasing software under a new licensing model he created, called the GNU Public License (GPL). Five years later, the [Open Source Initiative](https://opensource.org/) was formed to promote and protect open-source software and the communities surrounding the effort.

[Google Chrome](https://www.google.com/chrome/) is an example of a widely used software tool and a closed source application. You can download and install Chrome, but you cannot access the source code to either view it or change it. [Chromium](https://www.chromium.org/), on the other hand, is not only an open-source project, but it's the project Chrome is based on. You can install it, use it, and download the source code from the [official GitHub repository](https://github.com/chromium/chromium).

## How Does Open Source Software Work?

Open-source and closed-source applications are created the same way. They start out as an idea. Once the project moves from the idea phase to the programming phase, the developer, or team of developers, stores the source code in a repository. A repository, also called a *repo*, is a storage location that houses the code for an application. Along with the code, a repository also contains items like a table of contents, a README file, and a license. These repositories make it efficient for teams to collaborate on an open-source project.

One of the most popular source code repositories is [GitHub](https://github.com/), where developers create private (only accessible by the development team) and public repositories (accessible by the general public). In some instances, a project begins as a private repository, until the team has a working application, at which point it changes to a public repository, so people can view and download the source. Other times, a project exists in a public repository from day one. This way the public can watch the project as it evolves and jump in to help, if the option is available.

With open-source code repositories, developers usually include instructions on how to build and use the software. During the early stages of development the software might not be ready for the masses. When this is the case, the software is typically only installable via source code. Generally speaking, there are numerous ways to install a piece of software. The most widespread method of installing software is via an installable binary. You download a file, double-click on it, and the software install wizard opens. Another method is installing software from the source. This is more challenging and requires you to have certain dependencies installed on your computer. Installing software from the source is typically done via the command line. Some open-source projects start with the only installation option being via source code. Eventually, if a project is to be used by the masses, an installable binary is made available. Closed-source applications are only made available with the installable binary.

Like closed-source software, open-source software is available for every platform on the market (Linux, macOS, Windows, Android, and iOS). Even though you might use a piece of closed-source software, it’s likely that software either includes some open-source code, or it depends on other open-source code or projects to function. A good example of this is Microsoft's Office365 which is a proprietary office suite. One tool used in Office365 is the open-source Fluid Framework, a platform for real-time collaboration.  Another example is the Android mobile operating system, which uses an open-source kernel and several other open-source applications, but adds on the closed-source Google Play Services, which allows users to install Android apps from the Google Play Store.

The Android example is very telling. There are a few companies that have set out to create fully open-source Android alternatives (such as [/e/](https://doc.e.foundation/)). These alternatives make use of all the Android open-source code, but cannot use the closed-source bits such as the aforementioned Google Play Services. Because of this, anyone that wants to use such a phone has to do so without the Google integration, since you can't install the likes of Google Drive or Google Docs from anywhere but the Google Play Store. Most smartphone users prefer simplicity and seamless integration, versus a purely open-source platform. Even though you might be using a proprietary tool, it probably depends on open-source software.

Finally, open-source software is protected by a license. There are over 200 different open-source licenses, but the most popular are:

- [MIT License](https://en.wikipedia.org/wiki/MIT_License)
- [Apache License](https://www.apache.org/licenses/LICENSE-2.0)
- [GNU General Public License (GPL)](https://www.gnu.org/licenses/gpl-3.0.en.html)
- [Common Development and Distribution License](https://en.wikipedia.org/wiki/Common_Development_and_Distribution_License)

The majority of open-source software you run into is probably distributed under the GPL.

## Should You Use Open-Source Software?

One very simple way to answer the question is this: Enterprise businesses and mid-market SMBs depend on open-source software. Without open-source, technologies and services such as containers, the cloud, Android, Chromebooks, smart thermostats and appliances, autonomous vehicles, Facebook, Twitter, Instagram, Netflix, Hulu, and Amazon, wouln't exist.

If open-source fuels the success of Fortune 500 companies around the world, it's suitable for mid-market businesses, SMBs, and consumers.

One of the biggest advantages of using open-source software is that it's usually free. Also, many open-source projects have been vetted by numerous developers, so it's often more secure than proprietary solutions.

## Open-Source Software Examples

Linux is the largest open-source project in existence. Linux is an open-source kernel that powers a number of open-source operating systems, such as [Ubuntu](https://ubuntu.com/), [Fedora](https://getfedora.org/), [Linux Mint](https://linuxmint.com/), [elementary OS](https://elementary.io/), [openSUSE](https://www.opensuse.org/), [Pop!_OS](https://system76.com/pop), [EndeavorOS](https://endeavouros.com/), [Manjaro](https://manjaro.org/), [Debian](https://www.debian.org/), [Zorin](https://zorin.com/os/), [KDE Neon](https://neon.kde.org/), [Deepin](https://www.deepin.org/en/), [AlmaLinux](https://almalinux.org/), and [Rocky Linux](https://rockylinux.org/). These operating systems are free to download and install on as many computers as you need and come with plenty of open-source software to help you work. If you don't find the software you need, most of those operating systems include an app store where you can find thousands of open-source applications to install. You can install many open-source tools on your proprietary OS. Here is a list of sample open-source software titles:

| Title | Purpose | Platforms |
| :-------------:|:-------------:| :-------------:|
| [LibreOffice](https://www.libreoffice.org/) | office suite | Linux, macOS, Windows |
| [GIMP](https://www.gimp.org/) | image editor | Linux, macOS, Windows |
| [Firefox](https://www.mozilla.org/en-US/firefox/new/) | web browser | Linux, macOS, Windows |
| [Brave](https://brave.com/) | web browser | Linux, macOS, Windows |
| [Thunderbird](https://www.thunderbird.net/) | email client | Linux, macOS, Windows |
| [Audacity](https://www.audacityteam.org/) | digital audio editor | Linux, macOS, Windows |
| [Clementine](https://www.clementine-player.org/) | music player | Linux |
| [VLC Media Player](https://www.videolan.org/) | multi-media player | Linux, macOS, Windows |
| [WordPress](https://wordpress.org/download/) | blogging platform | Linux, macOS, Windows |
| [Shotcut](https://shotcut.org/) | video editor | Linux, macOS, Windows |
| [BitWarden](https://bitwarden.com/) | password manager | Linux, macOS, Windows |
| [BRL-CAD](https://bitwarden.com/) | CAD software | Linux, macOS, Windows |
| [Inkscape](https://inkscape.org/) | vector drawing program | Linux, macOS, Windows |
| [Dia](https://inkscape.org/) | diagrams and flow charts | Linux, macOS, Windows |
| [Scribus](https://www.scribus.net/) | desktop publishing | Linux, macOS, Windows |
| [Blender](https://www.blender.org/) | 3D Graphics | Linux, macOS, Windows |
| [Krita](https://krita.org/en/) | digital drawing | Linux, macOS, Windows |
| [Bluefish](https://bluefish.openoffice.nl/) | website creation | Linux, macOS, Windows |
| [ClamAV](https://www.clamav.net/) | antivirus | Linux, macOS, Windows |
| [VeraCrypt](https://www.veracrypt.fr/code/VeraCrypt/) | file encryption | Linux, macOS, Windows |
| [AutoHotKey](https://www.autohotkey.com/) | repetitive task automation | Windows |
| [VirtualBox](https://www.bleachbit.org/) | operating system virtualization | Linux, macOS, Windows |
| [BleachBit](https://www.bleachbit.org/) | system cleaner | Linux, macOS, Windows |
| [NGINX](https://www.nginx.com/) | web server | Linux, macOS, Windows |
| [MariaDB](https://mariadb.org/) | relational database | Linux, macOS, Windows |
| [Python](https://www.python.org/) | programming language | Linux, macOS, Windows |
| [PHP](https://www.php.net/) | programming language | Linux, macOS, Windows |

## Conclusion

Open-source software is an integral piece of almost everything you do electronically—from refrigerators, cars, phones, televisions, smart speakers, home hubs, lighting, digital display boards, kiosks, banks, and the cloud, open-source is probably powering it. Although you might not be using open-source software directly on your computer, you are using it via the accounts and services you depend on daily.

For more information on open-source solutions, start with [our documentation library](https://www.linode.com/docs), where there is plenty of information on open-source software.



