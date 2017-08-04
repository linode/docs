---
author:
    name: Sam Foo 
    email: docs@linode.com
description: 'How to access a Jupyter notebook remotely and securely through an Apache reverse proxy'
keywords: 'storm,analytics,big data,zookeeper'
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
published: 'Friday August 4th, 2017'
modified: Friday August 4th, 2017
modified_by:
    name: Sam Foo
title: 'Running a Jupyter Notebook Server Behind an Apache Reverse Proxy'
external_resources:
 - '[Jupyter Notebook Documentation](https://jupyter-notebook.readthedocs.io/en/stable/)'
 - '[Anaconda Documentation](https://docs.continuum.io/)'
---

Jupyter Notebook is an interactive enhanced shell that can be run in the web browser that is popular among data scientists. The Notebook supports inline rendering of figures, exporting to a variety of formats, and LaTeX for mathematical notation. This guide aims to setup a Jupyter Notebook server on a Linode to allow access to your computation needs remotely.

## Before You Begin

You will need:

 - [A Linode you can connect to via SSH](/docs/getting-started)
 - [Anaconda](https://www.continuum.io/what-is-anaconda)

## Install Jupyter Notebook 

Anaconda is a package manager with built in support for virtual environments that also comes with installation of Jupyter notebooks. This is the recommended method of installation from the documentation.

1.  SSH into your Linode and install the latest version of Anaconda. The example below downloads the version of Anaconda with Python 3.6, but Python 2.7 is also available:

        wget https://repo.continuum.io/archive/Anaconda3-4.4.0-Linux-x86_64.sh

2.  Run the downloaded installation script using this command:

        bash ~/Anaconda3-4.4.0-Linux-x86_64.sh

3.  Follow the prompts in the terminal, accept the license usage terms, and allow the installer create a PATH in `.bashrc`.

4.  Reload the new `.bashrc` changes with:

        exec bash

## Setting Up Apache Reverse Proxy

1.  Install Apache:

        sudo apt install apache2

2.  Generate a new configuration file. This will create a `~/.jupyter` directory:

        jupyter notebook --generate-config

   {: .file-excerpt }
   /.jupyter/jupyter-notebook-config.py
   :   ~~~ conf
       c.NotebookApp.base_url = '/jupyter'
       c.NotebookApp.open_browser = False
       ~~~

3.  Configure the Apache file:






