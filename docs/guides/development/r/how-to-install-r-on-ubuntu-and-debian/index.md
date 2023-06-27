---
slug: how-to-install-r-on-ubuntu-and-debian
description: 'R is a programming language commonly used for statistical analysis and data visualization. Learn how to install the base R package on your Linode.'
keywords: ['R', 'statistics', 'R Foundation', 'data visualization']
tags: ["statistics", "ubuntu", "debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-01-29
modified_by:
  name: Linode
published: 2018-01-29
title: 'How to install R on Ubuntu and Debian'
audiences: ["beginner"]
concentrations: ["Scientific Computing and Big Data"]
languages: ["r"]
aliases: ['/development/r/how-to-install-r-on-ubuntu-and-debian/']
authors: ["Sam Foo"]
---

![How to install R on Ubuntu and Debian](install-r-ubuntu-debian-title.jpg "How to install R on Ubuntu and Debian title graphic")

## What is R?

[R is a programming language](https://www.r-project.org/about.html) used for statistical analysis in addition to data visualization. The language is highly extensible through the [Comprehensive R Archive Network(CRAN)](https://cran.r-project.org/), which hosts more than 10,000 R packages for producing publication quality figures, specialized computational tools, and more.

Although R can be installed through the default Debian or Ubuntu repository, the method outlined in this guide will ensure that you install the most up-to-date stable release.

## Install R on Ubuntu 16.04 and Debian 9

{{< content "install_r_ubuntu" >}}

## Download Packages from CRAN

1.  Open the R interpreter:

        R

2.  The interpreter will open with some information about the version. Enter `install.packages("ggplot2")`:

    {{< output >}}
R version 3.4.3 (2017-11-30) -- "Kite-Eating Tree"
Copyright (C) 2017 The R Foundation for Statistical Computing
Platform: x86_64-pc-linux-gnu (64-bit)

R is free software and comes with ABSOLUTELY NO WARRANTY.
You are welcome to redistribute it under certain conditions.
Type 'license()' or 'licence()' for distribution details.

  Natural language support but running in an English locale

R is a collaborative project with many contributors.
Type 'contributors()' for more information and
'citation()' on how to cite R or R packages in publications.

Type 'demo()' for some demos, 'help()' for on-line help, or
'help.start()' for an HTML browser interface to help.
Type 'q()' to quit R.

> install.packages("ggplot2")
{{< /output >}}

3.  A list of available mirrors should appear. Pick the closest location to maximize transfer speeds:

    {{< output >}}
--- Please select a CRAN mirror for use in this session ---
HTTPS CRAN mirror

 1: 0-Cloud [https]                   2: Algeria [https]
 3: Australia (Canberra) [https]      4: Australia (Melbourne 1) [https]
 5: Australia (Melbourne 2) [https]   6: Australia (Perth) [https]
 7: Austria [https]                   8: Belgium (Ghent) [https]
 9: Brazil (PR) [https]              10: Brazil (RJ) [https]
11: Brazil (SP 1) [https]            12: Brazil (SP 2) [https]
13: Bulgaria [https]                 14: Canada (MB) [https]
15: Chile 1 [https]                  16: Chile 2 [https]
17: China (Beijing) [https]          18: China (Hefei) [https]
19: China (Guangzhou) [https]        20: China (Lanzhou) [https]
21: China (Shanghai) [https]         22: Colombia (Cali) [https]
23: Czech Republic [https]           24: Denmark [https]
25: East Asia [https]                26: Ecuador (Cuenca) [https]
27: Estonia [https]                  28: France (Lyon 1) [https]
29: France (Lyon 2) [https]          30: France (Marseille) [https]
31: France (Montpellier) [https]     32: France (Paris 2) [https]
33: Germany (Göttingen) [https]      34: Germany (Münster) [https]
35: Greece [https]                   36: Iceland [https]
37: India [https]                    38: Indonesia (Jakarta) [https]
39: Ireland [https]                  40: Italy (Padua) [https]
41: Japan (Tokyo) [https]            42: Japan (Yonezawa) [https]
43: Malaysia [https]                 44: Mexico (Mexico City) [https]
45: New Zealand [https]              46: Norway [https]
47: Philippines [https]              48: Serbia [https]
49: Singapore (Singapore 1) [https]  50: Spain (A Coruña) [https]
51: Spain (Madrid) [https]           52: Sweden [https]
53: Switzerland [https]              54: Taiwan (Chungli) [https]
55: Turkey (Denizli) [https]         56: Turkey (Mersin) [https]
57: UK (Bristol) [https]             58: UK (Cambridge) [https]
59: UK (London 1) [https]            60: USA (CA 1) [https]
61: USA (IA) [https]                 62: USA (IN) [https]
63: USA (KS) [https]                 64: USA (MI 1) [https]
65: USA (NY) [https]                 66: USA (OR) [https]
67: USA (TN) [https]                 68: USA (TX 1) [https]
69: Vietnam [https]                  70: (HTTP mirrors)


Selection:
{{< /output >}}

4.  When quitting the interpreter, you will be prompted to save the workspace image. If you choose yes, this will save all the user defined objects for the next session:

    {{< output >}}
> q()
Save workspace image? [y/n/c]:
{{< /output >}}

## RStudio IDE Desktop

The R interpreter lacks features such as a debugger which may be needed for larger projects. RStudio is an IDE that comes with many tools for development right out of the box.

1.  Download RStudio as a Debian package:

        wget https://download1.rstudio.org/rstudio-xenial-1.1.414-amd64.deb

2.  Install the package:

        sudo dpkg -i rstudio-xenial-1.1.414-amd64.deb

    {{< note respectIndent=false >}}
If there are missing dependencies, those can be installed with the following command:

    sudo apt install -f
{{< /note >}}
