---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'Our guide to hosting a website on your Linode.'
keywords: 'linode guide,hosting a website,website,linode quickstart guide'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, December 18, 2014
modified_by:
  name: Joseph Dooley
published: 'Thursday, December 18, 2014'
title: Install or Upgrade Node.js
external_resources:
 - '[NodeSchool](http://nodeschool.io/)'
 - '[Node Version Manager](https://github.com/creationix/nvm)'
 - '[npm](https://www.npmjs.com/)'
---

Node.js is a Javascript platform designed for backend, server-side management and applications. Node.js can work along side, or replace, other server-side tools, such as Apache, Nginx, or PHP.

##Install Node.js
To Install, use the Node.js version manager, NVM.

1.  Install NVM:

        curl https://raw.githubusercontent.com/creationix/nvm/v0.20.0/install.sh | bash

2.  Close and reopen your terminal.  

3.  Install the latest version of Node.js 10:

        nvm install 0.10

4.  Ensure proper installation:

        node -h
        
##Upgrade Node.js

1.  Use the Node.js package manager to clean the Node.js cache:

        npm cache clean -f

2.  Deactivate the existing Node.js version:

        nvm deactivate

3.  Install the latest version of Node.js 10:

        nvm install 0.10

4.  Check for the updated version:

        node -v

