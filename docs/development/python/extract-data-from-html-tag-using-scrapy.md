---
author:
  name: Florent Houbart
  email: docs@linode.com
description: 'A linode guide for scraping the web with Python Scrapy'
keywords: ["Scrapy", "Python", "crawling", "spider", "web scraping"]
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

![ADD PICTURE HERE](/docs/assets/scrapy/scrapy-logo.png)

Scrapy is a Python framework for creating web scraping applications. It provides a programming interface to crawl the web by identifying new links while browsing the web and extracts structured data from the downloaded content.

This guide will provide you with step by step instructions to build a spider that recursively check all `<a>` tags of a website and track broken links.

{{< note >}}
This guide is written for Python version 3.4 or above, and with Scrapy version 1.4. It will NOT work on a Python 2 environment.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt update && sudo apt upgrade -y

    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
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

1. On a Centos system, install Python, PIP and some dependencies from EPEL repositories:

        sudo yum install epel-release
        sudo yum install python34 python34-pip gcc python34-devel

2.  Replace the symbolic link `/usr/bin/python` that link by default to a Python 2 installation to the newly installed Python 3:

        sudo rm -f /usr/bin/python
        sudo ln -s /usr/bin/python3 /usr/bin/python

3.  Check you use the proper version with:

        python --version

## Install Scrapy

### System Wide Installation (Not recommended)

System wide installation is easiest but may conflict with other Python scripts that require different versions of libraries. Use this methode only if your system is dedicated to Scrapy:

    sudo pip3 install Scrapy

### Install Scrapy Inside a Virtual Environment

This is the recommanded installation method. Scrapy will be installed in a `virtualenv` environment to prevent any conflicts with system wide library.

1. On a CentOS system, `virtualenv` for Python 3 is installed with Python. However, on a Debian 9 it require a few more steps:

        sudo apt install python3-venv
        sudo pip3 install wheel

2.  Create your virtual environment:

        python -m venv ~/scrapyenv

3.  Activate your virtual environment:

        source ~/scrapyenv/bin/activate

    Your shell prompt will change to indicate which environment you are using

4.  Install Scrapy in the virtuel environment. Note that you don't need `sudo` anymore, the library will be installed only in your newly created virtual environment:

        pip3 install scrapy

    {{< note >}}
All the following commands are done inside the virtual environment. If you restart your session, don't forget to reactivate `scrapyenv`.
{{< /note >}}

## Create Scrapy Project

1.  Create a directory to hold your Scrapy project:

        mkdir ~/scrapy
        cd ~/scrapy
        scrapy startproject linkChecker

2.  Go to your new Scrapy project and create a spider:

        cd linkChecker
        scrapy genspider link_checker www.example.com

    This will create a file `~/scrapy/linkChecker/linkChecker/spiders/link_checker.py` with a base spider.

    {{< note >}}
All path and commands in the below section are relative to the new scrapy project directory `~/scrapy/linkChecker`.
{{< /note >}}

## Run Your Spider

Start your spider with the `scrapy crawl` command line. The Spider registers itself in Scrapy with its name that is defined in the `name` attribute of your Spider class.

Start the `link_checker` Spider:

    cd ~/scrapy/linkChecker
    scrapy crawl link_checker

The newly created Spider do nothing more that downloading the `www.example.com` page. We will now create the crawling logic.

{{< note >}}
This guide uses a starting url for scraping `http://www.example.com`. Adjust it to the web site you want to scrape.
{{< /note >}}

## Use the Scrapy Shell

Scrapy provides two easy ways for extracting content from html:

-  The `response.css()` method get tags with a CSS selector. To get all links with css class `btn`:

        response.css("a.btn::attr(href)")

-  The `response.xpath()` method gets tags from a XPath query. To get all urls of all images that are inside a link, use:

        response.xpath("//a/img/@src")

You can try your selectors with the interactive Scrapy Shell:

1.  Run the Scrapy Shell on your web page:

        scrapy shell "http://www.example.com"

2.  Test some selectors until you get what you want:

        response.xpath("//a/@href").extract()

For more information about Selectors, refer to the [Scrapy Selector documentation](https://doc.scrapy.org/en/latest/topics/selectors.html).

## Write the Crawling Logic

The Spider parses the downloaded pages with the `parse(self,response)` method. This method returns an *iterable* of new urls that will be added to the downloading queue for futur crawling and parsing.

1.  Edit your `linkChecker/spiders/link_checker.py` file to extract all the `<a>` tags and get the `href` link text. Return the link url with the `yield` keyword to add it to the download queue:

    {{< file-excerpt "linkChecker/spiders/link_checker.py" py >}}
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
{{< /file-excerpt >}}

2.  Run your updated Spider:

        scrapy crawl link_checker

    You will see the Spider going through all the links. It won't go out of the *www.example.com* domain because of the `allowed_domains` attributes. Depending of the size of the site, this may take some time. Stop the process with `Ctrl-C`.

### Add Request Meta Information

The Spider will traverse links in queue recursively. When parsing a downloaded page, it does not have any information about the previously parsed pages such as which page was linking the the new one. To pass more information to the `parse` method, Scrapy provide a `Request.meta()` method that attachs some key/value pairs to the request. They are available in the response object in the `parse()` method.

The meta information is used for two purposes:

- To make the `parse` method aware of some data coming from the page that triggered the request: the url of the page (`from_url`), and the text of the link (`from_text`)

- To compute the level of recursion in the `parse` method so that we can limit the maximum depth of the crawling

1.  Starting to the previous Spider, add an attribute to store the maximum depth (`maxdepth`) and update the `parse` function to be the following:

    {{< file-excerpt "linkChecker/spiders/link_checker.py" py >}}
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
{{< /file-excerpt >}}

2.  Run the updated Spider:

        scrapy crawl link_checker

    Your Spider will no longer go deeper than 2 pages and will stop by itself when all the pages are downloaded. Output will show what page linked to the downloaded page and what was the text of link.

### Set Handled HTTP Status

By default Scrapy parses only successful HTTP requests. All errors are excluded from parsing. To collect the broken links, the 404 responses must be parsed as well. Create two arrays, `valid_url` and `invalid_url`, that will store the valid and the broken links respectively.

1.  Set the list of HTTP error status that are parsed in the `handle_httpstatus_list` Spider attribute:

        handle_httpstatus_list = [404]

2.  Update the parsing logic to check for HTTP status and populate the good array. The Spider now looks like:

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
{{< /file-excerpt >}}

3.  Run your updated Spider:

        scrapy crawl link_checker

    This should prints nothing more than before. The two arrays are populated but never printed to console. A Spider has to dump them at the end of the crawling with signal handlers.

### Set Signal Handlers

Scrapy let us add some handlers at various points in the scraping process. Signal handlers are set with the `crawler.signals.connect()` method and the `crawler` object being available in the `from_crawler()` method of the `Spider` class.

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
    print('There are', len(self.valid_url), 'working links and',
          len(self.invalid_url), 'broken links.', sep=' ')
    # If any, print all the broken links
    if len(self.invalid_url) > 0:
        print("Broken links are:")
        for invalid in self.invalid_url:
            print(invalid)
{{< /file-excerpt >}}

See [Scrapy Signals documentation](https://doc.scrapy.org/en/latest/topics/signals.html) for a full list of available Signals.

Run the Spider again, and you will see the detail of the broken links before the Scrapy statistics.

### Get Start URL from Command Line

The starting url is hardcoded in the source code of your Spider. It will be far better if we could set it when starting the Spider, without changing the code. The `scrapy crawl` command line allow passing parameters from the command line that is passed through the `__init__()` class contructor.

1.  Add a `__init__()` method to our Spider with a `url` parameter:

    {{< file-excerpt "linkChecker/spiders/link_checker.py" py >}}
# Add a custom constructor with the url parameter
def __init__(self, url='http://www.example.com', *args, **kwargs):
    # Don't forget to call parent constructor
    super(LinkCheckerSpider, self).__init__(*args, **kwargs)
    # Set the start_urls to be the one given in url parameters
    self.start_urls = [url]
{{< /file-excerpt >}}

2.  Spider arguments are passed with the `-a` command line flag:

        scrapy crawl linkChecker -a url="http://another_example.com"

## Edit your Project Settings

Default Scrapy settings of your Spider are defined in `settings.py` file. Set the maximum download size to 3Mb to prevent Scrapy from downloading big files like video or binaries.

Edit `~/scrapy/linkChecker/linkChecker/settings.py` and add the following line:

{{< file-excerpt "linkChecker/settings.py" py >}}
DOWNLOAD_MAXSIZE = 3000000
{{< /file-excerpt >}}

## Remove Domain Limitation

Our Spider has an attribute called `allowed_domains` to prevent downloading unwanted URLs. Without this attribute, the Spider spider may attempt to traverse the entire web and never complete its task.

If a link in the *www.example.com* domain to an external domain is broken, it will be undetected because the Spider will not crawl it. Delete the `allowed_domains` attribute to add a custom logic that will download an external domain page, but not recursively browse its links.

1.  Add to package for url and regex management:

    {{< highlight py >}}
import re
from urllib.parse import urlparse
{{< /highlight >}}

2.  Add a `domain = ''` attribute that will hold the main domain. It starts uninitialized and is set at the first download be the actual url. Actual url may be differents than starting url in case of HTTP redirect.

3.  Remove the `allowed_domains` attribute

4.  Initialize the `domain` attribute in the `parse` method:

    {{< highlight py >}}
if len(self.domain) == 0:
    parsed_uri = urlparse(response.url)
    self.domain = parsed_uri.netloc
{{< /highlight >}}

5.  Update the expression to allow yielding new URLs from links to add domain check in addition to depth check:

    {{< highlight py >}}
parsed_uri = urlparse(response.url)
# Yield new links with previous logic
if parsed_uri.netloc == self.domain and depth < self.maxdepth:
{{< /highlight >}}

See the full Spider in the next section where this code is integrated inside the previous one.

## Final version of the Spider

Here is the fully functional Spider. A few hacks has been added to get the domain of the response and prevent recursive browsing of other domains links. Otherwise, your Spider will attempt to parse the whole web!

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

Scrapy provides a telnet interface on port 6023 to monitor a running Spider. The telnet session is a Python shell where you can execute methods on the exposed scrapy object.

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

