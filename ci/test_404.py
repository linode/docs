import pytest

import logging
import scrapy
from scrapy import Item, Field
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy.crawler import CrawlerProcess

class Docs404Item(Item):
    referer = Field()
    status = Field()
    url = Field()

class Docs404Spider(CrawlSpider):

    def __init__(self, *args, **kwargs):
        loggers = ['scrapy.core.engine',
                   'scrapy.downloadermiddlewares.redirect',
                   'scrapy.spidermiddlewares.offsite',
                   'scrapy.middleware']
        for l in loggers:
            logger = logging.getLogger(l)
            logger.setLevel(logging.WARNING)
        super().__init__(*args, **kwargs)

#    Delay if server is returning lots of 500s
#    DOWNLOAD_DELAY=0.1
    name = 'docs404'
    allowed_domains = ['localhost' ]
    start_urls = ['http://localhost:1313/docs']
    handle_httpstatus_list = [404]

    rules = (
        Rule(LinkExtractor(allow=r'/docs/', deny=r'/docs/contribute'),
             callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        item = Docs404Item()

        if response.status == 404:
            item['referer'] = response.request.headers.get('Referer')
            item['status'] = response.status
            item['url'] = response.url
            return item


def test_404():
    import os
    process = CrawlerProcess({ 'USER_AGENT': 'docs404',
                               'FEED_URI': 'temp.csv',
                               'FEED_FORMAT': 'csv' })
    process.crawl(Docs404Spider)
    process.start()
    f = open('temp.csv')
    os.remove('temp.csv')
    assert sum([1 for line in f]) == 1,'404 response in HTML - see scraper logs'


