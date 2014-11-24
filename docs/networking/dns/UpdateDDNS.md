---
author:
    name: V Britt
    email: vince@thebrittons.net
contributor:
    name: V Britt
description: 'How to Automatically update DNS entries in the Linode Manager'
keywords: 'ddns'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, November 24, 2014
modified_by:
  name: alex Fornuto
published: ''
title: Register DDNS addresses in Linode DNS
---

Have you ever wanted to locate your home computer on the Internet but have a
Dynamic IP address from your ISP, then this is the guide for you.



Chances are if you are reading this guide then you know what you want to use it
for.  However with this functionally the types of things you would be able to
now accomplish include:

-   Establish a VPN connection to your home router

-   play online games with friends via direct connection

-   Push files from your Linode to your home computer.

The Possibilities are endless!



There are several ways you can accomplish this goal,  If you are a lazy admin
like me, I am going to assume you would like the easiest way possible.  As such
I am going to detail what I feel is the path of least resistance..



This document assumes that you already have your Linode correctly configured for
your Domain/account and that you have registered you DNS server with your
registrar.  If you do not yet have this done please reference [The Getting
started guide][3]



Procedure
---------

The procedure can be broken down in to 4 steps.

1.  Create the host record for your URL

2.  Get/Create an API Key to use

3.  Identify the resourceID for the host record you would like to update.

4.  Use the Task Scheduler on your computer to update the IP address record



### Create the Host record for your URL

1.  Log into your Linode​ DNS Manager and select the domain you wish to use.

2.  under A/AAA records in the lower right corner select "Add a new A record"

3.  Enter the following information

    1.  Hostname:  the URL you would like to use, example for home.domain.com
        enter home

    2.  IP Address: 192.168.100.100 (Doesn't matter we will change this later)

    3.  TTL: for most customers Default is just fine

    4.  Click Save Changes

Congratulations, you just created a DNS record!



### Create an API Key to use for your records

1.  Log in to you Linode Manager (https://manager.linode.com/linodes)

2.  in the upper Right Corner select "my profile"

3.  Enter your password to reauthenticate yourself to the server

4.  Note the new tool bar and click the "API Keys" option, click it

5.  Create a new key under the "Add an API Key" option.

    1.  While the label is optional, it is suggest that you give it a name that
        identifies it's purpose.  IE "DDNS".

    2.  Select an Expiration option that meets your needs (IE Never)

    3.  Click Create API Key

    [![](/docs/assets/apiGen.png)](/docs/assets/apiGen.png)

6.  Save your new Key to your computer as you will never be able to access it
    again.

![](/docs/assets/apikey.png)



### Identify the ResourceID of the record you would like to use.

For this example I will be using a fake resource home.ddnsexample.com with the
fake API Key "afsdarefasdf".  There are several pieces of data we need to
accomplish our objective namely DomainID and ResourceID

1.  Find the DomainID of the Resource you would like to use.  In our example
    that would be ddnsexample.com.  To find this information, via any browser
    enter the following

         https://api.linode.com/?api_key=afsdarefasdf&api_action=domain.list&api_responseFormat=human


    Depending on how many domains you are hosting you will get a list of
    information.  Look through them until you find the record for the desired
    Domain and capture the "DOMAINID", For our example "Domain" is
    "ddnsexample.com" and the DOMAINID is 615913

    ![](/docs/assets/ddnsexample.png)

2.  With the DOMAINID in hand you will be able to locate your resourceID for the
    URL you would like to use.  For our example home.ddnsexample.com.  Using
    your browser enter the following:


        https://api.linode.com/?api_key=afsdarefasdf&api_action=domain.resource.list&domainid=615913&api_responseFormat=human


    This will output a very similar table as before, however you need to locate
    the record for "Home".  In our Example below the RESOURCEID is 4391565

    ![](/docs/assets/home.png)

Congratulations you now have all information necessary to update your DNS record
from your home computer.



### Create Scheduled tasks to update your DNS Records.

While different Operating systems will require different methods the goal is the
same.  We need the computer to access a URL in order to register our IP address.
Theoretically this should only be required when the computer initially starts as
you IP address shouldn't change while in use.

Use the information you have gathered to construct you magic DNS Updating URL as
such:


    https://api.linode.com/?api_key=<yourKeyHere>&api_action=api_action=domain.resource.update&domainid=<yourDomainID>&resourceid=<YourResourceID>&target=[remote_addr]


Using the our home.ddnsexample.com results from above our URL would look like:

    https://api.linode.com/?api_key=afsdarefasdf&api_action=domain.resource.update&domainid=615913&resourceid=4391565&target=[remote_addr]




### Windows Task Scheduler

1.  Open Task Scheduler Start\\All Programs\\Accessories\\System Tools\\Task
    Scheduler

2.  Create a task

    ![](/docs/assets/createtask.png)

3.  Give the task a name (Update DNS Entry) and set to "Run whether user is
    logged on or not"

    ![](/docs/assets/createtask2.png)

4.  Click the "Change User or Group" to System

    ![](/docs/assets/system.png)

5.  Select the trigger tab and modify to your desire, I configure mine to run at
    startup and every 12 hours after that.

    ![](/docs/assets/trigger.png)

6.  For the action we will be using Powershell to execute the command to our URL
    and in turn registering the IP address to the DNS record we desire to use.
    Under "Add Arguments" you will enter:


        -ExecutionPolicy unrestricted -Command "(New-Object Net.WebClient).DownloadString('https://api.linode.com/?api_key=afsdarefasdf&api_action=domain.resource.update&domainid=615913&resourceid=4391565&target=[remote_addr]')"


    ![](/docs/assets/action.png)

7.  Lastly modify the settings tab to match your desire.  Mine look like:

    ![](/docs/assets/settings.png)



Congratulations, you are now complete.  You can run the task from within task
scheduler to test your work, you can also reboot your computer.  To test you can
use the same URL you used to gather the ResoureID of the URL.  In our example
that is:

    https://api.linode.com/?api_key=afsdarefasdf&api_action=domain.resource.list&domainid=615913&api_responseFormat=human

All this and more are possible with the extensive set of API controls available
to your Linode, for full documentation on the API [click here][1].







[1]: <https://www.linode.com/api>

[^2]: <https://www.linode.com/api>

[3]: <https://www.linode.com/docs/getting-started>
