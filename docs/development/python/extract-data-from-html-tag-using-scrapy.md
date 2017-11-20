---
author:
  name: Florent Houbart
  email: docs@linode.com
description: 'A linode guide for scraping the web with Python Scrapy'
keywords: ["Scrapy", "python", "crawling", "spider"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-20
modified: 2017-11-20
modified_by:
  name: Linode
title: 'Extra Data From HTML Tags Using Scrapy'
contributor:
  name: Florent Houbart
external_resources:
- '[Scrapy Project page](https://scrapy.org/)'
- '[Official Scrapy Documentation](https://doc.scrapy.org/en/latest/index.html)'
---


Scrapy is a Python framework for creating web scraping application. It provides a python programming interface to crawl the web by identifying new links while browsing the web, and some helpers to extract structured data from the downloaded content.

![ADD PICTURE HERE](/docs/assets/scrapy/scrapy-logo.png)

This guide will provide you with step by step instructions to build a spider that recursively check all `<a>` tags of a website and track broken links.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt update && sudo apt upgrade

    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Scrapy

You can install Scrapy many different ways. Scrapy advise using a python virtual environment to prevent conflicts with system wide libraries.

### System Wide Installation (Not recommended)

System wide installation is easiest but may conflict with other Python scripts that require different versions of libraries. Use this methode only if your system is dedicated to Scrapy:

1.  On a Debian 9 system, Scrapy is available through the aptitude package manager as `python-scrapy`. However, the recommended installation is through `pip`:

        sudo apt install python-pip
        sudo pip install Scrapy

2.  On a Centos system, install Python PIP and some dependencies from EPEL repositories before installing Scrapy with `pip`:

        sudo yum install epel-release
        sudo yum install python-pip
        sudo yum install gcc
        sudo yum install python-devel
        sudo pip install Scrapy

### Install Scrapy Inside a Virtual Environment

This is the recommanded installation method. Scrapy will be installed in a `virtualenv` environment to prevent any conflicts with system wide library.

1.  Install python `virtualenv`:

        sudo pip install virtualenv

2.  Create your virtual environment:

        virtualenv ~/scrapyenv

3.  Activate your virtual environment:

        source ~/scrapyenv/bin/activate

    Your shell prompt will change to indicate which environment you are using

4.  Install Scrapy in the virtuel environment. Note that you don't need `sudo` anymore, the library will be installed only in your newly created virtual environment:

        pip install scrapy

    {{< note >}}
All the following commands in this guide are done inside the `virtualenv`. If you close and repoen your session, don't forget to run step 4 to activate the `virtualenv`.
{{< /note >}}

## Create Scrapy Project

1.  Create a directory to hold your scrapy projects, and create the project with following commands:

        mkdir ~/scrapy
        cd ~/scrapy
        scrapy startproject linkChecker

2.  Go to your new scrapy project and create a custom spider

        cd linkChecker
        scrapy genspider link_checker www.example.com

    This will create a file `~/scrapy/linkChecker/linkChecker/spiders/link_checker.py` with a base spider.

    {{< note >}}
All path and commands in the below section are relative to the new scrapy project directory `~/scrapy/linkChecker`.
{{< /note >}}

## Run Your Spider

You start your spider with the `scrapy crawl` command line. The Spider register itself in Scrapy with its name, that you define in the `name` attribute of your Spider class.

To start the `link_checker` Spider, run the following command:

    cd ~/scrapy/linkChecker
    scrapy crawl link_checker

The newly created Spider do nothing more that downloading the `www.example.com` page. We will now create the crawling logic.

{{< note >}}
This guide uses a start url for scraping of `http://www.example.com`. Adjust it to the web site you want to scrap.
{{< /note >}}

## Use the Scrapy Shell

Scrapy provide two easy way for extracting content from the html:

-  The `response.css()` method get tags with a CSS selector. For example, to get all links with css class `btn` use the following line:

        response.css("a.btn::attr(href)")

-  The `response.xpath()` method gets tags from a XPath query. To get all urls of all images that are inside a link, use:

        response.xpath("//a/img/@src")

You can try your selectors with the interactive Scrapy Shell:

1.  Run the Scrapy Shell on your web page (adjust the url):

        scrapy shell "http://www.example.com"

2.  Test some selectors until you get what you want:

        response.xpath("//a/@href").extract()

For more information about Selector, have a look to [Scrapy Selector documentation](https://doc.scrapy.org/en/latest/topics/selectors.html).

## Write the Crawling Logic

Ths Spider parse the downloaded page with the `parse(self,response)` method. This method returns an *iterable* of new url that will be added to the downloading queue for futur crawling and parsing.

1.  Edit your `linkChecker/spiders/link_checker.py` file to extract all the `<a>` tags and get the `href` attribute and link text. Return the link url with the `yield` keyword to add it to the download queue:

    {{< file-excerpt "linkChecker/spiders/link_checker.py" py >}}
import scrapy

class LinkCheckerSpider(scrapy.Spider):
    name = 'link_checker'
    allowed_domains = ['www.example.com']
    start_urls = ['http://www.example.com/']

    def parse(self, response):
        # Print what the spider is doing
        print "%s" % response.url
        # Get all the <a> tags
        a_selectors = response.xpath("//a")
        # Loop on each tag
        for selector in a_selectors:
            # Extract the link text
            text = selector.xpath("text()").extract_first()
            # Extract the link href
            link = selector.xpath("@href").extract_first()
            # Create a new Request object
            request = response.follow(link,callback=self.parse)
            # Return it thanks to a generator
            yield request
{{< /file-excerpt >}}

2.  Run your updated Spider:

        scrapy crawl link_checker

    You will see the Spider going through all the link and downloading page. It won't go out of the *www.example.com* domain because of the `allowed_domains` attributes. Depending of the size of the site you're crawling, it may be very long. Stop it with `Ctrl-C` when you think it's enough.

### Add Request Meta Information

The Spider now parse all the link recursively. But when parsing a downloaded page, it don't have any information about the previously parsed pages, like which page was linking the the new one. To pass more information to the `parse` method, Scrapy provide a `Request.meta()` method that attachs some key/value pairs to the request. They are available in the response object in the `parse()` method.

We will use meta information for two purposes:

- To make the `parse` method aware of some data coming from the page that triggered the request: the url of the page (`fromUrl`), and the text of the link (`fromText`)

- To compute the level of recursion in the `parse` method so that we can limit the maximum depth of the crawling

1.  Starting to the previous Spider, add an attribute to store the maximum depth (`maxdepth`) and update the `parse` function to be the following:

    {{< file-excerpt "linkChecker/spiders/link_checker.py" py >}}
# Add a maxdepth attribute
maxdepth = 2

def parse(self,response):
    # Set defaults value for the first page that won't have any meta information
    fromUrl = ''
    fromText = ''
    depth = 0;
    # Extract the meta information from the response, if any
    if 'from' in response.meta: fromUrl = response.meta['from']
    if 'text' in response.meta: fromText = response.meta['text']
    if 'depth' in response.meta: depth = response.meta['depth']

    # Update the print logic to show what page contain a link to the
    # current page, and what was the text of the link
    print "%i %s <- %s (%s)" % (depth, reponse.url, fromUrl, fromText)
    # Browse a tags only if maximum depth has not be reached
    if depth < self.maxdepth:
        a_selectors = response.xpath("//a")
        for selector in a_selectors:
            text = selector.xpath("text()").extract_first()
            link = selector.xpath("@href").extract_first()
            request = response.follow(link,callback=self.parse)
            # Meta information: URL of the current page
            request.meta['from'] = response.url
            # Meta information: text of the link
            request.meta['text'] = text
            # Meta information: depth of the link
            request.meta['depth'] = depth+1
            yield request
{{< /file-excerpt >}}

2.  Run the updated Spider:

        scrapy crawl link_checker

    Your Spider will now no longer go deeper than 2 pages, and will stop by itself when all the pages are downloaded. Output will show what page linked to the downloaded page and what was the text of link.

### Set Handled HTTP Status

By default Scrapy parse only succeeded HTTP request. All errors are excluded from parsing. As we want to get the broken links, we need to parse the 404 errors as well. We will create two array attributes, `valid_url` and `invalid_url` that will respectively store the valid links and the broken links.

1.  Set the list of HTTP error status that are parsed in the `handle_httpstatus_list` Spider attribute:

        handle_httpstatus_list = [404]

2.  Update the parsing logic to check for HTTP status and populate the good array. The Spider now looks like:

    {{< file "linkChecker/spiders/link_checker.py" py >}}
class LinkCheckerSpider(scrapy.Spider):
    name = "link_checker"
    allowed_domains = ['www.example.com']
    # Set the HTTP error codes that should be handled
    handle_httpstatus_list = [404]
    # Initialize array for valid links
    valid_url = []
    # Initialize array for broken links
    invalid_url = []
    maxdepth = 2;

    def parse(self,response):
        fromUrl = ''
        fromText = ''
        depth = 0;
        if 'from' in response.meta: fromUrl = response.meta['from']
        if 'text' in response.meta: fromText = response.meta['text']
        if 'depth' in response.meta: depth = response.meta['depth']

        # 404 error, populate the broken links array
        if response.status == 404:
            self.invalid_url.append({"url":response.url,"from":fromUrl,"text":fromText})
        else:
            # Populate the working links array
            self.valid_url.append({"url":response.url,"from":fromUrl,"text":fromText})
            if depth < self.maxdepth:
                a_selectors = response.xpath("//a")
                for selector in a_selectors:
                    text = selector.xpath("text()").extract_first()
                    link = selector.xpath("@href").extract_first()
                    request = response.follow(link,callback=self.parse)
                    request.meta['from'] = response.url;
                    request.meta['text'] = text
                    yield request
{{< /file-excerpt >}}

3.  Run your updated Spider:

        scrapy crawl link_checker

    Well, it prints nothing more than before... We indeed interally populate the two arrays, but we never print them. We need to tell the Spider to dump them at the end of the crawling, that's what we can do with *signal handlers*.

### Set Signal Handlers

Scrapy let us add some handlers at given points in the scraping process, like when the Spider starts processing, ends processing, gets errors, ... Signal handlers are set with the `crawler.signals.connect()` method, the `crawler` object being available in the `from_crawler()` method of the `Spider` class.

To add a handler at the end of the Scraping process to print information about broken links, overwrite the `from_crawler` method to register a handler for the `signals.spider_closed` signal:

{{< file-excerpt "linkChecker/spiders/link_checker.py" py >}}
# Overwrite the from_crawler method
@classmethod
def from_crawler(cls, crawler, *args, **kwargs):
    # call the parent method to keep things working
    spider = super(LinkCheckerSpider, cls).from_crawler(crawler, *args, **kwargs)
    # Register the spider_closed handler on spider_closed signal
    crawler.signals.connect(spider.spider_closed, signals.spider_closed)
    return spider

# This method is the actual handler
def spider_closed(self):
    # Print some pretty message about what has been crawled
    print 'There are %i working links and %i broken links.' % (len(self.valid_url),len(self.invalid_url))
    # If any, print all the broken links
    if len(self.invalid_url) > 0:
        print "Broken links are:"
        for invalid in self.invalid_url:
            print invalid
{{< /file-excerpt >}}

See [Scrapy Signals documentation](https://doc.scrapy.org/en/latest/topics/signals.html) for a full list of available Signals.

You can now run the Spider again, and you will see the detail of the broken links, just before Scarpy statistics.

### Get Start URL from Command Line

Start url is hardcoded in the source code of your Spider, it will be far better if we could set it when starting the Spider, without changing the code. The `scrapy crawl` command line allow passing parameters from the command line, that can be accessed in the `__init__()` class contructor.

1.  Add a `__init__()` method to our Spider with a `url` parameter:

    {{< file-excerpt "linkChecker/spiders/link_checker.py" py >}}
# Add a custom constructor with the url parameter
def __init__(self, url='http://www.example.com', *args, **kwargs):
    # Don't forget to call parent constructor
    super(LinkCheckerSpider,self).__init__(*args,**kwargs)
    # Set the start_urls to be the one given in url parameters
    self.start_urls = [ url ]
{{< /file-excerpt >}}

2.  Spider arguments are passed with the `-a` command line flag:

        scrapy crawl linkChecker -a url="http://another_example.com"

## Edit your Project Settings

Default Scrapy settings of your Spider are defined in `settings.py` file in your scrapy project directory. We will set the maximum download size to 3Mb to prevent Scrapy from downloading big files like video or binaries.

Edit `~/scrapy/linkChecker/linkChecker/settings.py` and add the following line:

{{< file-excerpt "linkChecker/settings.py" py >}}
DOWNLOAD_MAXSIZE = 3000000
{{< /file-excerpt >}}

## Remove Domain Limitation

Our Spider has an attribute called `allowed_domains` that prevent it to download page from whatever domain. If you delete this attribute, you let your Spider running on the whole web, and crawling may be very very long...

But if a link in the *www.exemple.com* domain to an external domain is broken, we won't detect it because the Spider won't even try to download it. We will delete the `allowed_domains` attribute to add a custom logic that will download an external domain page, but not recursively browse its links.

1.  Add to package for url and regex management:

    {{< highlight py >}}
import re
from urlparse import urlparse
{{< /highlight >}}

2.  Add a `domain = ''` attribute that will hold the main domain. It starts uninitialized and is set at the first download be the actual url. Actual url may be differents than starting url in case of HTTP redirect.

3.  Remove the `allowed_domains` attribute

4.  Initialize the `domain` attribute in the `parse` method:

    {{< highlight py >}}
if len(self.domain) == 0:
    parsed_uri = urlparse(response.url)
    self.domain = parsed_uri.netloc
{{< /highlight >}}

5.  Update the expression that allow yielding new urls from links to add domain check in addition to depth check:

    {{< highlight py >}}
parsed_uri = urlparse(response.url)
if parsed_uri.netloc == self.domain and depth < self.maxdepth:
    # Yield new links with previous logic
{{< /highlight >}}

You can see the full Spider in the next section where this code is integrated inside the previous one.

## Final version of the Spider

Here is the fully functionnal Spider. A few hacks has been added to get the domain of the response and prevent recursive browsing of other domains links. Otherwise, your Spider is likely to parse the whole web!

{{< file "linkChecker/spiders/link_checker.py" py >}}
import scrapy
from scrapy import signals
import re
from urlparse import urlparse

class LinkCheckerSpider(scrapy.Spider):
    name = "link_checker"
    # Set the HTTP error codes that should be handled
    handle_httpstatus_list = [404]
    valid_url = []
    invalid_url = []
    # Set the maximum depth
    maxdepth = 2;
    domain = ''

    def __init__(self, url='http://www.example.com', *args, **kwargs):
        super(LinkCheckerSpider,self).__init__(*args,**kwargs)
        self.start_urls = [ url ]

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(LinkCheckerSpider, cls).from_crawler(crawler, *args, **kwargs)
        # Register the spider_closed handler on spider_closed signal
        crawler.signals.connect(spider.spider_closed, signals.spider_closed)
        return spider

    # Handler for spider_closed signal.
    def spider_closed(self):
        print 'There are %i working links and %i broken links.' % (len(self.valid_url),len(self.invalid_url))
        if len(self.invalid_url) > 0:
            print "Broken links are:"
            for invalid in self.invalid_url:
                print invalid

    # Main method that parse downloaded pages
    def parse(self,response):

        # Set defaults value for the first page that won't have any meta information
        fromUrl = ''
        fromText = ''
        depth = 0;
        # Extract the meta information from the response, if any
        if 'from' in response.meta: fromUrl = response.meta['from']
        if 'text' in response.meta: fromText = response.meta['text']
        if 'depth' in response.meta: depth = response.meta['depth']

        # If first response, update domain (to manage redirect cases)
        if len(self.domain) == 0:
            parsed_uri = urlparse(response.url)
            self.domain = parsed_uri.netloc

        # 404 error, populate the broken links array
        if response.status == 404:
            self.invalid_url.append({"url":response.url,"from":fromUrl,"text":fromText})
        else:
            # Populate the working links array
            self.valid_url.append({"url":response.url,"from":fromUrl,"text":fromText})
            # Extract domain of current page
            parsed_uri = urlparse(response.url)
            # Parse new links only:
            #   - if current page is not an extra domain
            #   - and depth is below maximum depth
            if parsed_uri.netloc == self.domain and depth < self.maxdepth:
                # Get all the <a> tags
                a_selectors = response.xpath("//a")
                # Loop on each tag
                for selector in a_selectors:
                    # Extract the link text
                    text = selector.xpath("text()").extract_first()
                    # Extract the link href
                    link = selector.xpath("@href").extract_first()
                    # Create a new Request object
                    request = response.follow(link,callback=self.parse)
                    request.meta['from'] = response.url;
                    request.meta['text'] = text
                    # Return it thanks to a generator
                    yield request
{{< /file >}}

## Monitor your running spider

A Scrapy Spider journey can be very long, especially if there are lot of url to scan. Scrapy provide a telnet interface on port 6023 to monitor in realtime a running Spider. The telnet session is a python shell where you can do whatever you want with the exposed scrapy object.

1.  Run your Spider in background

        scrapy crawl link_checker -a url="http://www.linode.com" > 404.txt &

2.  Connect to the telnet interface:

        telnet localhost 6023

3.  Print a report of the Scrapy Engine Status:

        est()

4.  Pause your scraping

        engine.pause()

5.  Resume your scraping:

        engine.unpause()

6.  Stop your scraping;

        engine.stop()
