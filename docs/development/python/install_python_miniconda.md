---
author:
  name: Jared Kobos
  email: sfoo@linode.com
description: 'Shortguide for installing Python 3 with Miniconda'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["python 3", "miniconda", "continuum"]
modified: 2017-01-08
modified_by:
  name: Sam Foo
title: "How to install Python 3 with Miniconda"
published: 2018-01-09
shortguide: true
show_on_rss_feed: false
---
<!-- Installation instructions for Python 3. -->

1.  Download and install Miniconda:

        curl -OL https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
        bash Miniconda3-latest-Linux-x86_64.sh

2.  You will be prompted several times during the installation process. Review the terms and conditions and select "yes" for each prompt.


3.  Check your Python version:

        python --version
