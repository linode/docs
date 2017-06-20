---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'Information on submitting articles to Linode Guides & Tutorials, including benefits and procedures.'
keywords: 'writing,open source software,contribute linode docs, submissions,linode guides and tutorials,guides,tutorials'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['contribute/']
modified: Tuesday, December 20th, 2016
modified_by:
  name: Linode
published: 'Wednesday, May 19th, 2014'
title: Linode Writer's Guide
external_resources:
 - '[Linode Writer’s Formatting Guide](/docs/linode-writers-formatting-guide)'
 - '[GitHub Beginners Guide](/docs/github-guide)'
---
# Become a Linode Community Contributor!

Linode is looking for awesome technical writers and subject matter experts to contribute to our comprehensive selection of tutorials about Linux and cloud infrastructure. If you have technical knowledge and the ability to explain things clearly, our editors will help you copy edit and publish your guide to our rich knowledge base with over a million unique page views each month. You may make up to $400 depending on topic difficulty.
 
Simply choose a topic from the list below and submit a writing sample. If we accept your submission after a review, one of our editors will help you get started, and you’ll be on your way. 
 
## List of available topics

*  Install and configure SQLite on your server
*  Tuning MySQL on your server
*  Install and configure Redis on your server
*  Install and configure Apache Cassandra on Ubuntu
*  Enable SELinux on Ubuntu/Debian/CentOS
*  Using Hiera to accelerate Puppet
*  Install, set up and use Vagrant to manage VM lifecycles from the command line
*  Install, configure and use Oracle’s cross-platform virtualization app, Virtualbox
*  Backup your Postgresql database
*  Install and run Flask, Python’s web dev framework
*  Install, configure and run Laravel’s server manager, Forge
*  SaltStack
*  ShadowSocks

## Submit a writing sample

The quality of the writing sample is the primary way we evaluate Linode Community Contributor applications.
While you don’t have to be an experienced technical writer, you are the subject matter expert, and your guide should explain the steps and options clearly.

To be considered, submit your sample in one of the following ways:

1)  Submit the introduction and first two steps of the tutorial you selected from the list above.

2) Submit a technical article (e.g. blog post, tutorial) you’ve written in the past that demonstrates your abilities on a different topic. Please make sure your sample has a similar level of technical content and explanations as the tutorials found in Linode's Guides and Tutorials.

At this time we are only accepting articles written in English. Don’t worry if your language isn’t perfect, we’ll fix that up in the editing stage.

### Include the following information

*  Your full name
*  Your email (this is for us. It won't be shared or published.)
*  Topic / Document title
*  A link to other writing samples or work

### Send it to

Email your application to <contribute@linode.com>

# How to write a good Community Guide

Guides should instruct readers how to accomplish a task on, or relating to, a Linode or Linodes. When writing, think of both *what* the guide should accomplish and *why* the reader would want to use your guide. A guide should consist of about 90% instruction with 10% explanation.

Guides should be informational but friendly. Use the active voice whenever possible, and the pronouns *you* or *we* instead of *I*. Avoid unnecessary information. Brief, to-the-point explanations are preferred, but also consider the audience and the level of technical ability needed to complete each task. A beginner's topic usually will require more detailed explanations than one for an advanced user.

Use the [Linode writers' guide](docs/linode-writers-guide.md). While you're writing, make sure your content is:

*   Accurate. Your instructions should be straightforward and technically sound.
*   Formatted. Your style should use [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/) formatting and match the Linode Docs [style guide](docs/linode-writers-formatting-guide.md).
*   Original. Your content should be original material written for Linode. We will not accept submissions that have been copied from other sources.

# How to submit your article

Submit your article as a pull request or by email to <contribute@linode.com>. Articles should be sent as a plain text or PHP Markdown Extra file attachment. When submitting through GitHub, please create a new branch for your changes. If you are new to GitHub, see our [GitHub Beginners Guide](/docs/github-guide) which will walk you through the process.

Got images? Attach them as **.png** or **.jpg** files. If an image is greater than 650 pixels wide, please send both the original and a 650-pixel-wide version.

Submission checklist:

*   Article in **.txt** or **.md** format
*   Images
*   Your name, as you want it to appear on the site

Once you've submitted your article, here's what you can expect:

1.  You'll receive a brief response acknowledging your submission.
2.  We will do a technical review of your material. This will take a few days.
3.  We will do a copy review of the article. This will take a few days.
4.  You may receive questions or comments from us or a request for a resubmission with a few changes.
5.  We will let you know that your article has been chosen for publication and send you the final version we are planning to publish. You will have 36 hours to respond and approve our publication of the final version.
6.  If you respond positively (non-response will be taken as consent to publish), we will publish the article.

### General Tips to Consider

*   Use other Linode guides as building blocks.	For example, if your guide requires a system with a working LAMP stack, you can link to our [LAMP guides](/docs/websites/lamp) instead of duplicating that information in your own writing.
*   Link to your guide from your own website or social media posts. This actually improves the page rankings of your own site because of an SEO aspect called *link authority*.
*   Avoid 3rd-party PPAs and repositories.
*   Unless there is a major advantage, use distro repositories rather than compiling and installing from source code.
*   We generally decline guides on tweaking or performance tuning. For a guide of this theme to be considered, it must first designate a use scenario. The changes *must* show a measurable, reliably reproducible improvement between a control group and an experiment group, both operating in the given scenario.
*   Use proper capitalization for software. For example, nginx is the web server, NGINX Inc. is the company behind it, and Nginx would only be used to start a sentence, title or heading.

### Reasons Your Guide May Be Rejected

As much as we would like to support all writers, we can not accept every guide we receive. Here are some negatives you can eliminate in your own work to ensure a strong submission:

*   Not enough content, or lacking original content. For example, if the guide too closely resembles a current guide either by Linode or on another source.
*   Guide is a duplicate of your own content from your personal blog, wiki submissions or forum posts.
*   Topic is sufficiently documented in official wikis, manual pages, etc.
*   [Content](#content-guidelines) and [formatting](/docs/linode-writers-formatting-guide/) guidelines were clearly not followed.
*   We already have plenty of guides on the topic. Examples: LAMP & LEMP stacks, MySQL.
*   Inappropriate topic for the Linode Community.

## Contributed Guides

Here are some examples of exceptional community-contributed guides. The instructions in each are accurate, complete, original and thorough. Use these as guidelines for your own submission.

*  [Install Odoo 9 ERP on Ubuntu 14.04](/docs/websites/cms/install-odoo-9-erp-on-ubuntu-14-04) by Damaso Sanoja.
*  [How to Install and Configure GitLab on Ubuntu 14.04 (Trusty Tahr)](/docs/applications/development/how-to-install-and-configure-gitlab-on-ubuntu-14-04-trusty-tahr/) by Nashruddin Amin.
*  [Host a Terraria Server on Your Linode](https://www.linode.com/docs/applications/game-servers/host-a-terraria-server-on-your-linode) by Tyler Langlois.
*  [Install and Configure OSSEC on Debian 7](/docs/security/ossec-ids-debian-7) by Sunday Ogwu-Chinuwa.
*  [Turbocharge Your WordPress Search Using Solr](/docs/websites/cms/turbocharge-wordpress-search-with-solr) by Karthik Shiraly.

## Legal Information

COPYRIGHT OWNERSHIP. Writer agrees that the Work is being created by the writer for the Linode Guides & Tutorials repository and that each form of Work is being created by the writer as a “work made for hire” under the United States Copyright Act and, at all stages of development, the Work shall be and remain the sole and exclusive property of Linode. At Linode's sole, absolute and unfettered discretion, Linode may make any alterations to the Work.

CREDIT. Nothing contained in this Agreement shall be deeded to require Linode to use the Work, or any part thereof, in connection with Linode Guides & Tutorials or otherwise. Credit for the Work shall read, "Contributed by *writer's name*."

PAYMENT. Upon publication of a submission to the Linode Guides & Tutorials Repository, the writer will be paid the sum of USD $250.00 either in the form of a credit to their Linode account or as an electronic payment.
