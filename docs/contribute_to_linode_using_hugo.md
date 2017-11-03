---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Guidelines for freelance writers, demonstrating how to install Hugo and use it to generate and edit a Linode guide.'
keywords: ['contribute','hugo','freelancer','bounty']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-3
modified: 2017-11-3
modified_by:
  name: Linode
title: "Contribute to Linode Docs with Hugo"
external_resources:
- '[Hugo project](http://gohugo.io)'
- '[Linode Docs repo](https://www.github.com/linode/docs)'
---

## Contribute to Linode

This guide describes how to write and submit a guide for the Linode docs. If you have not already been accepted to submit a guide on a topic, please visit our [Contribute](http://www.linode.com/contribute) page to choose a topic and submit a writing sample. When you have received an email notifying you that your topic has been accepted, you are ready to follow the steps in this guide.


## Clone the Docs Repo

All of our guides are stored in the [github.com/linode/docs](https://github.com/linode/docs) repository. You will need to clone this repository to your local computer:

1.  Install Git:

        sudo apt install git
        git config --global user.email "your.email@example.com"
        git config --global user.name  "Your Name"

2.  Clone `github.com/linode/docs`:

        git clone https://github.com/linode/docs

3.  Navigate to the new directory:

        cd docs

## Install Hugo

The Linode documentation site is built using [Hugo](http://gohugo.io), a static site generator. In order to preview your guide before submission, you will need to install Hugo on your local computer.


1.  On OSX, the easiest way to install Hugo is by using [Homebrew](https://brew.sh/):

        brew install hugo

2.  For other platforms, go to the [Hugo releases](https://github.com/gohugoio/hugo/releases) page and download the most up to date binary for your platform.

        curl -o hugo_0.30.2_Linux-64bit.deb /usr/local/bin/hugo

{{< caution >}}
We recommend using Hugo version >=0.30. Earlier versions will not render our documentation correctly.
{{< /caution >}}

## Generate a New Guide

You can use a Hugo [archetype](https://gohugo.io/content-management/archetypes/) to simplify the process of creating a new guide. This section will guide you through the process of creating a new guide for installing Nginx on Debian.

1. Create a new branch for your guide:

        git checkout -b nginx-on-debian

2. From the root of the `docs` repo, run the following command. Specify the location and title of your guide; the example Nginx guide should be located in `web-servers/nginx`:

        hugo new web-servers/nginx/how-to-install-nginx-on-debian.md --kind content

3. Start the Hugo server:

        hugo server

4. In a web browser, navigate to the location of your new guide. The example Nginx guide will be located at `http://localhost:1313/docs/web-servers/nginx/how-to-install-nginx-on-debian`.

## Write and Submit

The Hugo development server has hot reloading enabled, so you will be able to view changes to your guide as you write them. Please see our [Linode Writer's Formatting guide](/docs/linode-writers-formatting-guide/) and our [Linode Style guide](/docs/doesnt/exist/yet) for more information.

{{< note >}}
If your guide requires any images, these will go in the `content/assets` folder. Please create a new directory for your guide and place all of the images there.
{{< /note >}}

<!--
1.  When you have finished your guide, you can use our scripts to do a quick check:

      python docs/scripts/tests.py how-to-install-nginx-on-debian.md

--->

2.  Commit your changes to your local branch:

        git add how-to-install-nginx-on-debian.md
        git commit -m "Initial draft of guide"

3.  Push to our repo:

        git push origin nginx-on-debian

4.  Go to `https://github.com/linode/docs` and open a pull request.



Your guide is now submitted. Thank you for contributing to Linode! Our content team will review your guide and contact you if any changes are needed. If you have any questions, please feel free to email us at [docs@linode.com](mailto:docs@linode.com).
