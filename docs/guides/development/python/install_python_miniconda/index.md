---
slug: install_python_miniconda
description: 'Shortguide for installing Python 3 with Miniconda'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["python 3", "miniconda", "continuum"]
modified: 2017-01-08
modified_by:
  name: Sam Foo
title: "Install Python 3 with Miniconda"
published: 2018-01-09
headless: true
show_on_rss_feed: false
tags: ["python"]
aliases: ['/development/python/install_python_miniconda/']
authors: ["Jared Kobos"]
---
<!-- Installation instructions for Python 3. -->

1.  Download and install Miniconda:

        curl -OL https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
        bash Miniconda3-latest-Linux-x86_64.sh

2.  You will be prompted several times during the installation process. Review the terms and conditions and select "yes" for each prompt.

3.  Restart your shell session for the changes to your PATH to take effect.


4.  Check your Python version:

        python --version
