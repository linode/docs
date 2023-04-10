---
slug: use-scrapy-to-extract-data-from-html-tags
description: 'Scrapy is a Python framework for creating web scraping applications. This guide provides you with instructions for using it to scrape the web.'
keywords: ["Scrapy", "Python", "crawling", "spider", "web scraping"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-04
modified: 2017-12-04
modified_by:
  name: Linode
title: 'Use Scrapy to Extract Data From HTML Tags'
external_resources:
- '[Scrapy Project page](https://scrapy.org/)'
- '[Official Scrapy Documentation](https://doc.scrapy.org/en/latest/index.html)'
audiences: ["intermediate"]
concentrations: ["Scripting, Automation, and Build Tools"]
languages: ["python"]
tags: ["python"]
aliases: ['/development/python/use-scrapy-to-extract-data-from-html-tags/']
authors: ["Florent Houbart"]
---

![Use Scrapy to Extract Data from HTML Tags](Use-Scrapy-to-Extract-Data-From-HTML-Tags-smg.jpg)

Scrapy is a Python framework for creating web scraping applications. It provides a programming interface to crawl the web by identifying new links, and extracts structured data from the downloaded content.

This guide will provide you with instructions to build a spider which recursively checks all `<a>` tags of a website and tracks broken links. This guide is written for Python version 3.4 or above, and with Scrapy version 1.4. It will not work on a Python 2 environment.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

    {{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install a Python 3 Environment

On most systems, including Debian 9 and CentOS 7, the default Python version is 2.7, and the `pip` installer need to be installed manually.

### On Debian 9 System

1.  Debian 9 is shipped is both Python 3.5 and 2.7, but 2.7 is the default. Change it with:

        update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1
        update-alternatives --install /usr/bin/python python /usr/bin/python3.5 2

2.  Check you are using a Python 3 version:

        python --version

3. Install `pip`, the Python package installer:

        sudo apt install python3-pip

### On CentOS 7 System

1. On a CentOS system, install Python, PIP and some dependencies from EPEL repositories:

        sudo yum install epel-release
        sudo yum install python34 python34-pip gcc python34-devel

2.  Replace the symbolic link `/usr/bin/python` that link by default to a Python 2 installation to the newly installed Python 3:

        sudo rm -f /usr/bin/python
        sudo ln -s /usr/bin/python3 /usr/bin/python

3.  Check you use the proper version with:

        python --version

## Install Scrapy

### System-wide Installation (Not recommended)

System-wide installation is the easiest method, but may conflict with other Python scripts that require different library versions. Use this method only if your system is dedicated to Scrapy:

    sudo pip3 install scrapy

### Install Scrapy Inside a Virtual Environment

This is the recommended installation method. Scrapy will be installed in a `virtualenv` environment to prevent any conflicts with system wide library.

1. On a CentOS system, `virtualenv` for Python 3 is installed with Python. However, on a Debian 9 it require a few more steps:

        sudo apt install python3-venv
        sudo pip3 install wheel

2.  Create your virtual environment:

        python -m venv ~/scrapyenv

3.  Activate your virtual environment:

        source ~/scrapyenv/bin/activate

    Your shell prompt will then change to indicate which environment you are using.

4.  Install Scrapy in the virtual environment. Note that you don't need `sudo` anymore, the library will be installed only in your newly created virtual environment:

        pip3 install scrapy

## Create Scrapy Project

All the following commands are done inside the virtual environment. If you restart your session, don't forget to reactivate `scrapyenv`.

1.  Create a directory to hold your Scrapy project:

        mkdir ~/scrapy
        cd ~/scrapy
        scrapy startproject linkChecker

2.  Go to your new Scrapy project and create a spider. This guide uses a starting URL for scraping `http://www.example.com`. Adjust it to the web site you want to scrape.

        cd linkChecker
        scrapy genspider link_checker www.example.com

    This will create a file `~/scrapy/linkChecker/linkChecker/spiders/link_checker.py` with a base spider.

    {{< note respectIndent=false >}}
All path and commands in the below section are relative to the new scrapy project directory `~/scrapy/linkChecker`.
{{< /note >}}

## Run Your Spider

1.  Start your spider with:

        `scrapy crawl`

    The Spider registers itself in Scrapy with its name that is defined in the `name` attribute of your Spider class.

2.  Start the `link_checker` Spider:

        cd ~/scrapy/linkChecker
        scrapy crawl link_checker

    The newly created spider does nothing more than downloads the page `www.example.com`. We will now create the crawling logic.

## Use the Scrapy Shell

Scrapy provides two easy ways for extracting content from HTML:

-  The `response.css()` method get tags with a CSS selector. To retrieve all links in a `btn` CSS class:

        response.css("a.btn::attr(href)")

-  The `response.xpath()` method gets tags from a XPath query. To retrieve the URLs of all images that are inside a link, use:

        response.xpath("//a/img/@src")

You can try your selectors with the interactive Scrapy shell:

1.  Run the Scrapy shell on your web page:

        scrapy shell "http://www.example.com"

2.  Test some selectors until you get what you want:

        response.xpath("//a/@href").extract()

For more information about Selectors, refer to the [Scrapy selector documentation](https://doc.scrapy.org/en/latest/topics/selectors.html).

## Write the Crawling Logic

The Spider parses the downloaded pages with the `parse(self,response)` method. This method returns an *iterable* of new URLs that will be added to the downloading queue for future crawling and parsing.

1.  Edit your `linkChecker/spiders/link_checker.py` file to extract all the `<a>` tags and get the `href` link text. Return the link URL with the `yield` keyword to add it to the download queue:

    {{< file "linkChecker/spiders/link_checker.py" py >}}
import scrapy

class LinkCheckerSpider(scrapy.Spider):
    name = 'link_checker'
    allowed_domains = ['www.example.com']
    start_urls = ['http://www.example.com/']

    def parse(self, response):
        """ Main function that parses downloaded pages """
        # Print what the spider is doing
        print(response.url)
        # Get all the <a> tags
        a_selectors = response.xpath("//a")
        # Loop on each tag
        for selector in a_selectors:
            # Extract the link text
            text = selector.xpath("text()").extract_first()
            # Extract the link href
            link = selector.xpath("@href").extract_first()
            # Create a new Request object
            request = response.follow(link, callback=self.parse)
            # Return it thanks to a generator
            yield request
{{< /file >}}

2.  Run your updated Spider:

        scrapy crawl link_checker

    You will then see the Spider going through all the links. It won't go out of the *www.example.com* domain because of the `allowed_domains` attribute. Depending of the size of the site, this may take some time. Stop the process with `Ctrl+C`.

### Add Request Meta Information

The Spider will traverse links in queue recursively. When parsing a downloaded page, it does not have any information about the previously parsed pages such as which page was linking the new one. To pass more information to the `parse` method, Scrapy provides a `Request.meta()` method that attaches some key/value pairs to the request. They are available in the response object in the `parse()` method.

The meta information is used for two purposes:

- To make the `parse` method aware of data coming from the page that triggered the request: the URL of the page (`from_url`), and the text of the link (`from_text`)

- To compute the level of recursion in the `parse` method so the maximum depth of the crawling can be limited.

1.  Starting with the previous spider, add an attribute to store the maximum depth (`maxdepth`) and update the `parse` function to the following:

    {{< file "linkChecker/spiders/link_checker.py" py >}}

# Add a maxdepth attribute
maxdepth = 2

def parse(self, response):
    # Set default meta information for first page
    from_url = ''
    from_text = ''
    depth = 0;
    # Extract the meta information from the response, if any
    if 'from' in response.meta:
        from_url = response.meta['from']
    if 'text' in response.meta:
        from_text = response.meta['text']
    if 'depth' in response.meta:
        depth = response.meta['depth']

    # Update the print logic to show what page contain a link to the
    # current page, and what was the text of the link
    print(depth, reponse.url, '<-', from_url, from_text, sep=' ')
    # Browse a tags only if maximum depth has not be reached
    if depth < self.maxdepth:
        a_selectors = response.xpath("//a")
        for selector in a_selectors:
            text = selector.xpath("text()").extract_first()
            link = selector.xpath("@href").extract_first()
            request = response.follow(link, callback=self.parse)
            # Meta information: URL of the current page
            request.meta['from'] = response.url
            # Meta information: text of the link
            request.meta['text'] = text
            # Meta information: depth of the link
            request.meta['depth'] = depth + 1
            yield request
{{< /file >}}

2.  Run the updated spider:

        scrapy crawl link_checker

    Your spider will no longer go deeper than 2 pages and will stop by itself when all the pages are downloaded. The output will show what page linked to the downloaded page and what was the text of link.

### Set Handled HTTP Status

By default Scrapy parses only successful HTTP requests; all errors are excluded from parsing. To collect the broken links, the 404 responses must be parsed as well. Create two arrays, `valid_url` and `invalid_url`, that will store the valid and the broken links respectively.

1.  Set the list of HTTP error status that are parsed in the `handle_httpstatus_list` spider attribute:

        handle_httpstatus_list = [404]

2.  Update the parsing logic to check for HTTP status and populate the good array. The spider now looks like:

    {{< file "linkChecker/spiders/link_checker.py" py >}}
class LinkCheckerSpider(scrapy.Spider):
    name = "link_checker"
    allowed_domains = ['www.example.com']
    # Set the HTTP error codes that should be handled
    handle_httpstatus_list = [404]
    # Initialize array for valid/invalid links
    valid_url, invalid_url = [], []
    maxdepth = 2

    def parse(self, response):
        from_url = ''
        from_text = ''
        depth = 0;
        if 'from' in response.meta: from_url = response.meta['from']
        if 'text' in response.meta: from_text = response.meta['text']
        if 'depth' in response.meta: depth = response.met['depth']

        # 404 error, populate the broken links array
        if response.status == 404:
            self.invalid_url.append({'url': response.url,
                                     'from': from_url,
                                     'text': from_text})
        else:
            # Populate the working links array
            self.valid_url.append({'url': response.url,
                                   'from': from_url,
                                   'text': from_text})
            if depth < self.maxdepth:
                a_selectors = response.xpath("//a")
                for selector in a_selectors:
                    text = selector.xpath("text()").extract_first()
                    link = selector.xpath("@href").extract_first()
                    request = response.follow(link, callback=self.parse)
                    request.meta['from'] = response.url;
                    request.meta['text'] = text
                    yield request
{{< /file >}}

3.  Run your updated spider:

        scrapy crawl link_checker

    This should print nothing more than before. The two arrays are populated but never printed to console. A spider has to dump them at the end of the crawling with signal handlers.

### Set Signal Handlers

Scrapy lets you add some handlers at various points in the scraping process. Signal handlers are set with the `crawler.signals.connect()` method and the `crawler` object being available in the `from_crawler()` method of the `Spider` class.

To add a handler at the end of the scraping process to print information about broken links, overwrite the `from_crawler` method to register a handler for the `signals.spider_closed` signal:

{{< file "linkChecker/spiders/link_checker.py" py >}}
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
    print('There are', len(self.valid_url), 'working links and',
          len(self.invalid_url), 'broken links.', sep=' ')
    # If any, print all the broken links
    if len(self.invalid_url) > 0:
        print("Broken links are:")
        for invalid in self.invalid_url:
            print(invalid)
{{< /file >}}

See [Scrapy Signals documentation](https://doc.scrapy.org/en/latest/topics/signals.html) for a full list of available Signals.

Run the Spider again, and you will see the detail of the broken links before the Scrapy statistics.

### Get Start URL from Command Line

The starting URL is hardcoded in the source code of your spider. It will be far better if we could set it when starting the spider, without changing the code. The `scrapy crawl` command line allow passing parameters from the command line that is passed through the `__init__()` class constructor.

1.  Add a `__init__()` method to our spider with a `url` parameter:

    {{< file "linkChecker/spiders/link_checker.py" py >}}
# Add a custom constructor with the url parameter
def __init__(self, url='http://www.example.com', *args, **kwargs):
    # Don't forget to call parent constructor
    super(LinkCheckerSpider, self).__init__(*args, **kwargs)
    # Set the start_urls to be the one given in url parameters
    self.start_urls = [url]
{{< /file >}}

2.  Spider arguments are passed with the `-a` command line flag:

        scrapy crawl linkChecker -a url="http://another_example.com"

## Edit your Project Settings

Default Scrapy settings of your spider are defined in `settings.py` file. Set the maximum download size to 3 MB to prevent Scrapy from downloading big files like video or binaries.

Edit `~/scrapy/linkChecker/linkChecker/settings.py` and add the following line:

{{< file "linkChecker/settings.py" py >}}
DOWNLOAD_MAXSIZE = 3000000
{{< /file >}}

## Remove Domain Limitation

Our spider has an attribute called `allowed_domains` to prevent downloading unwanted URLs. Without this attribute, the spider may attempt to traverse the entire web and never complete its task.

If a link in the *www.example.com* domain to an external domain is broken, it will be undetected because the spider will not crawl it. Delete the `allowed_domains` attribute to add a custom logic that will download an external domain page, but not recursively browse its links.

1.  Add to package for URL and regex management:

    {{< highlight py >}}
import re
from urllib.parse import urlparse
{{< /highlight >}}

2.  Add a `domain = ''` attribute that will hold the main domain. It starts uninitialized and is set at the first download be the actual URL. The actual URL may be different than the starting URL in case of HTTP redirect.

3.  Remove the `allowed_domains` attribute

4.  Initialize the `domain` attribute in the `parse` method:

    {{< highlight py >}}
if len(self.domain) == 0:
    parsed_uri = urlparse(response.url)
    self.domain = parsed_uri.netloc
{{< /highlight >}}

5.  Update the expression to add domain check in addition to depth check for new URLs:

    {{< highlight py >}}
parsed_uri = urlparse(response.url)

# Apply previous logic to new links
if parsed_uri.netloc == self.domain and depth < self.maxdepth:
{{< /highlight >}}

See the full spider in the next section where this code is integrated inside the previous additions.

## Final Version of the Spider

Here is the fully functional spider. A few hacks have been added to get the domain of the response and prevent recursive browsing of other domains links. Otherwise, your spider will attempt to parse the whole web!

{{< file "linkChecker/spiders/link_checker.py" py >}}
import re
from urllib.parse import urlparse

import scrapy
from scrapy import signals


class LinkCheckerSpider(scrapy.Spider):
    name = 'link_checker'
    # Set the HTTP error codes that should be handled
    handle_httpstatus_list = [404]
    valid_url = []
    invalid_url = []
    # Set the maximum depth
    maxdepth = 2;
    domain = ''

    def __init__(self, url='http://www.example.com', *args, **kwargs):
        super(LinkCheckerSpider, self).__init__(*args, **kwargs)
        self.start_urls = [url]

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(LinkCheckerSpider, cls).from_crawler(crawler, *args, **kwargs)
        # Register the spider_closed handler on spider_closed signal
        crawler.signals.connect(spider.spider_closed, signals.spider_closed)
        return spider

    def spider_closed(self):
        """ Handler for spider_closed signal."""
        print('----------')
        print('There are', len(self.valid_url), 'working links and',
              len(self.invalid_url), 'broken links.', sep=' ')
        if len(self.invalid_url) > 0:
            print('Broken links are:')
            for invalid in self.invalid_url:
                print(invalid)
        print('----------')

    def parse(self, response):
        """ Main method that parse downloaded pages. """
        # Set defaults for the first page that won't have any meta information
        from_url = ''
        from_text = ''
        depth = 0;
        # Extract the meta information from the response, if any
        if 'from' in response.meta: from_url = response.meta['from']
        if 'text' in response.meta: from_text = response.meta['text']
        if 'depth' in response.meta: depth = response.meta['depth']

        # If first response, update domain (to manage redirect cases)
        if len(self.domain) == 0:
            parsed_uri = urlparse(response.url)
            self.domain = parsed_uri.netloc

        # 404 error, populate the broken links array
        if response.status == 404:
            self.invalid_url.append({'url': response.url,
                                     'from': from_url,
                                     'text': from_text})
        else:
            # Populate the working links array
            self.valid_url.append({'url': response.url,
                                   'from': from_url,
                                   'text': from_text})
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
                    text = selector.xpath('text()').extract_first()
                    # Extract the link href
                    link = selector.xpath('@href').extract_first()
                    # Create a new Request object
                    request = response.follow(link, callback=self.parse)
                    request.meta['from'] = response.url;
                    request.meta['text'] = text
                    # Return it thanks to a generator
                    yield request

{{< /file >}}

## Monitor a Running Spider

Scrapy provides a telnet interface on port 6023 to monitor a running spider. The telnet session is a Python shell where you can execute methods on the exposed Scrapy object.

1.  Run your spider in the background:

        scrapy crawl link_checker -a url="http://www.linode.com" > 404.txt &

2.  Connect to the telnet interface:

        telnet localhost 6023

3.  Print a report of the Scrapy engine status:

        est()

4.  Pause your scraping

        engine.pause()

5.  Resume your scraping:

        engine.unpause()

6.  Stop your scraping;

        engine.stop()
