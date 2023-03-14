---
slug: how-to-scrape-a-website-with-beautiful-soup
description: "Learn how to set up te Beautiful Soup Python library to collect data over an extended period of time and export the results to a spreadsheet."
keywords: ['beautiful soup', 'python', 'scraping', 'tinydb', 'data']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-02-01
modified_by:
  name: Linode
published: 2017-12-12
title: "Scrape a Website with Beautiful Soup"
title_meta: "How to Scrape a Website with Beautiful Soup"
dedicated_cpu_link: true
aliases: ['/applications/big-data/how-to-scrape-a-website-with-beautiful-soup/']
authors: ["Luis Cortés"]
---

![How to Scrape a Website with BeautifulSoup](beautifulsoup-title-graphic.jpg "How to Scrape a Website with BeautifulSoup")

## What is Beautiful Soup?

[Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) is a Python library that parses HTML or XML documents into a tree structure that makes it easy to find and extract data. It is often used for scraping data from websites.

Beautiful Soup features a simple, Pythonic interface and automatic encoding conversion to make it easy to work with website data.

Web pages are structured documents, and Beautiful Soup gives you the tools to walk through that complex structure and extract bits of that information. In this guide, you will write a Python script that will scrape Craigslist for motorcycle prices. The script will be set up to run at regular intervals using a cron job, and the resulting data will be exported to an Excel spreadsheet for trend analysis. You can easily adapt these steps to other websites or search queries by substituting different URLs and adjusting the script accordingly.

## Install Beautiful Soup

### Install Python

{{< content "install_python_miniconda" >}}

### Install Beautiful Soup and Dependencies

1. Update your system:

        sudo apt update && sudo apt upgrade

2. Install the latest version of Beautiful Soup using pip:

        pip install beautifulsoup4

3. Install dependencies:

        pip install tinydb urllib3 xlsxwriter lxml

## Build a Web Scraper

### Required Modules

The `BeautifulSoup` class from `bs4` will handle the parsing of the web pages. The `datetime` module provides for the manipulation of dates. `Tinydb` provides an API for a NoSQL database and the `urllib3` module is used for making http requests. Finally, the `xlsxwriter` API is used to create an excel spreadsheet.

Open `craigslist.py` in a text editor and add the necessary import statements:

{{< file "craigslist.py" python >}}
from bs4 import BeautifulSoup
import datetime
from tinydb import TinyDB, Query
import urllib3
import xlsxwriter
{{< /file >}}

### Add Global Variables

After the import statements, add global variables and configuration options:

{{< file "craigslist.py" python >}}
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

url = 'https://elpaso.craigslist.org/search/mcy?sort=date'
total_added = 0
{{< /file >}}

`url` stores the URL of the webpage to be scraped, and `total_added` will be used to keep track of the total number of results added to the database. The `urllib3.disable_warnings()` function ignores any SSL certificate warnings.

### Retrieve the Webpage

The `make_soup` function makes a GET request to the target url and converts the resulting HTML into a BeautifulSoup object:

{{< file "craigslist.py" python >}}
def make_soup(url):
    http = urllib3.PoolManager()
    r = http.request("GET", url)
    return BeautifulSoup(r.data,'lxml')
{{< /file >}}

The `urllib3` library has excellent exception handling; if `make_soup` throws any errors, check the
[urllib3 docs](https://urllib3.readthedocs.io/en/latest/) for detailed information.

Beautiful Soup has different parsers available which are more or less strict about how the webpage is structured. The *lxml* parser is sufficient for the example script in this guide, but depending on your needs you may need to check the other options described in the [official documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/).

### Process the Soup Object

An object of class `BeautifulSoup` is organized in a tree structure. In order to access the data you are interested in, you will have to be familiar with how the data is organized in the original HTML document. Go to the initial website in a browser, right click and select **View page source** (or **Inspect**, depending on your browser) to review the structure of the data that you would like to scrape:

{{< file "https://elpaso.craigslist.org/search/mcy?sort=date" html >}}
<li class="result-row" data-pid="6370204467">
  <a href="https://elpaso.craigslist.org/mcy/d/ducati-diavel-dark/6370204467.html" class="result-image gallery" data-ids="1:01010_8u6vKIPXEsM,1:00y0y_4pg3Rxry2Lj,1:00F0F_2mAXBoBiuTS">
    <span class="result-price">$12791</span>
  </a>
  <p class="result-info">
    <span class="icon icon-star" role="button">
    <span class="screen-reader-text">favorite this post</span>
    </span>
    <time class="result-date" datetime="2017-11-01 19:38" title="Wed 01 Nov 07:38:13 PM">Nov  1</time>
    <a href="https://elpaso.craigslist.org/mcy/d/ducati-diavel-dark/6370204467.html" data-id="6370204467" class="result-title hdrlnk">Ducati Diavel | Dark</a>
    <span class="result-meta">
            <span class="result-price">$12791</span>
            <span class="result-tags">
            pic
            <span class="maptag" data-pid="6370204467">map</span>
            </span>
            <span class="banish icon icon-trash" role="button">
            <span class="screen-reader-text">hide this posting</span>
            </span>
    <span class="unbanish icon icon-trash red" role="button" aria-hidden="true"></span>
    <a href="#" class="restore-link">
            <span class="restore-narrow-text">restore</span>
            <span class="restore-wide-text">restore this posting</span>
    </a>
    </span>
  </p>
</li>
{{< /file >}}

1.  Select the web page snippets by selecting just the **li** html tags and further narrow down the choices by selecting only those **li** tags that have a class of **result-row**. The **results** variable contains all the web page snippets that match this criteria:

        results = soup.find_all("li", class_="result-row")

2.  Attempt to create a record according to the structure of the target snippet. If the structure doesn't match, then Python will throw an exception which will cause it to skip this record and snippet:

    {{< file "craigslist.py" python >}}
rec = {
'pid': result['data-pid'],
'date': result.p.time['datetime'],
'cost': clean_money(result.a.span.string.strip()),
'webpage': result.a['href'],
'pic': clean_pic(result.a['data-ids']),
'descr': result.p.a.string.strip(),
'createdt': datetime.datetime.now().isoformat()
}
{{< /file >}}

3.  Use Beautiful Soup's array notation to access attributes of an HTML element:

        'pid': result['data-pid']

4.  Other data attributes may be nested deeper in the HTML structure, and can be accessed using a combination of dot and array notation. For example, the date a result was posted is stored in `datetime`, which is a data attribute of the `time` element, which is a child of a `p` tag that is a child of `result`. To access this value use the following format:

        'date': result.p.time['datetime']

5.  Sometimes the information needed is the tag content (in between the start and end tags). To access the tag content BeautifulSoup provides the `string` method:

        <span class="result-price">$12791</span>

    can be accessed with:

        'cost': clean_money(result.a.span.string.strip())

    The value here is further processed by using the Python `strip()` function, as well as a custom function `clean_money` that removes the dollar sign.

6.  Most items for sale on Craigslist include pictures of the item. The custom function `clean_pic` is used to assign the first picture's URL to **pic**:

        'pic': clean_pic(result.a['data-ids'])

7.  Metadata can be added to the record. For example, you can add a field to track when a particular record was created:

        'createdt': datetime.datetime.now().isoformat()

8.  Use the Query object to check if a record already exists in the database before inserting it. This avoids creating duplicate records.

      {{< file "craigslist.py" python >}}
Result = Query()
s1 = db.search(Result.pid == rec["pid"])

if not s1:
    total_added += 1
    print ("Adding ... ", total_added)
    db.insert(rec)
{{< /file >}}

### Error Handling

Two types of errors are important to handle. These are not errors in the script, but instead are errors in the structure of the snippet that cause Beautiful Soup's API to throw an error.

An `AttributeError` will be thrown when the dot notation doesn't find a sibling tag to the current HTML tag. For example, if a particular snippet does not have the anchor tag, then the **cost** key will throw an error, because it transverses and therefore requires the anchor tag.

The other error is a `KeyError`. It will be thrown if a required HTML tag attribute is missing. For example, if there is no **data-pid** attribute in a snippet, the **pid** key will throw an error.

If either of these errors occurs when parsing a result, that result will be skipped to ensure that a malformed snippet isn't inserted into the database:

{{< file "craigslist.py" python >}}
except (AttributeError, KeyError) as ex:
    pass
{{< /file >}}

### Cleaning Functions

These are two short custom functions to clean up the snippet data. The `clean_money` function strips any dollar signs from its input:

{{< file "craigslist.py" python >}}
def clean_money(amt):
    return int(amt.replace("$",""))
{{< /file >}}

The `clean_pic` function generates a URL for accessing the first image in each search result:

{{< file "craigslist.py" python >}}
def clean_pic(ids):
    idlist = ids.split(",")
    first = idlist[0]
    code = first.replace("1:","")
    return "https://images.craigslist.org/%s_300x300.jpg" % code
{{< /file >}}

The function extracts and cleans the id of the first image, then adds it to the base URL.

### Write Data to an Excel Spreadsheet

The `make_excel` function takes the data in the database and writes it to an Excel spreadsheet.

1.  Add spreadsheet variables:

    {{< file "craigslist.py" python >}}
Headlines = ["Pid", "Date", "Cost", "Webpage", "Pic", "Desc", "Created Date"]
row = 0
{{< /file >}}

    The **Headlines** variable is a list of titles for the columns in the spreadsheet. The **row** variable tracks the current spreadsheet
row.

2.  Use `xlsxwriter` to open a workbook and add a worksheet to receive the data.

    {{< file "craigslist.py" python >}}
workbook = xlsxwriter.Workbook('motorcycle.xlsx')
worksheet = workbook.add_worksheet()
{{< /file >}}

3.  Prepare the worksheet:

    {{< file "craigslist.py" python >}}
worksheet.set_column(0,0, 15) # pid
worksheet.set_column(1,1, 20) # date
worksheet.set_column(2,2, 7)  # cost
worksheet.set_column(3,3, 10)  # webpage
worksheet.set_column(4,4, 7)  # picture
worksheet.set_column(5,5, 60)  # Description
worksheet.set_column(6,6, 30)  # created date
{{< /file >}}

    The first 2 items are always the same in the `set_column` method. That is because it is setting the attributes of a section of columns from the first indicated column to the next. The last value is the width of the column in characters.

4.  Write the column headers to the worksheet:

    {{< file "craigslist.py" python >}}
for col, title in enumerate(Headlines):
    worksheet.write(row, col, title)
{{< /file >}}

5.  Write the records to the database:

    {{< file "craigslist.py" python >}}
for item in db.all():
    row += 1
    worksheet.write(row, 0, item['pid'] )
    worksheet.write(row, 1, item['date'] )
    worksheet.write(row, 2, item['cost'] )
    worksheet.write_url(row, 3, item['webpage'], string='Web Page')
    worksheet.write_url(row, 4, item['pic'], string="Picture" )
    worksheet.write(row, 5, item['descr'] )
    worksheet.write(row, 6, item['createdt'] )
{{< /file >}}

    Most of the fields in each row can be written using `worksheet.write`; `worksheet.write_url` is used for the listing and image URLs. This makes the resulting links clickable in the final spreadsheet.

6.  Close the Excel workbook:

    {{< file "craigslist.py" python >}}
    workbook.close()
{{< /file >}}

### Main Routine

The main routine will iterate through every page of search results and run the **soup_process** function on each page. It also keeps track of the total number of database entries added in the global variable **total_added**, which is updated in the **soup_process** function and displayed once the scrape is complete. Finally, it creates a TinyDB database `db.json` and stores the parsed data; when the scrape is complete, the database is passed to the **make_excel** function to be written to a spreadsheet.

{{< file "craigslist.py" python >}}
def main(url):
    total_added = 0
    db = TinyDB("db.json")

    while url:
        print ("Web Page: ", url)
        soup = soup_process(url, db)
        nextlink = soup.find("link", rel="next")

        url = False
        if (nextlink):
            url = nextlink['href']

    print ("Added ",total_added)

    make_excel(db)
{{< /file >}}

A sample run might look like the following. Notice that each page has the index embedded in the URL. This is how Craigslist knows where the next page of data starts:

    $ python3 craigslist.py
    Web Page:  https://elpaso.craigslist.org/search/mcy?sort=date
    Adding ...  1
    Adding ...  2
    Adding ...  3
    Web Page:  https://elpaso.craigslist.org/search/mcy?s=120&sort=date
    Web Page:  https://elpaso.craigslist.org/search/mcy?s=240&sort=date
    Web Page:  https://elpaso.craigslist.org/search/mcy?s=360&sort=date
    Web Page:  https://elpaso.craigslist.org/search/mcy?s=480&sort=date
    Web Page:  https://elpaso.craigslist.org/search/mcy?s=600&sort=date
    Added  3

## Set up Cron to Scrape Automatically

This section will set up a cron task to run the scraping script automatically at regular intervals. The data

1. Log in to your machine as a normal user:

        ssh normaluser@<Linode Public IP>

2. Make sure the complete `craigslist.py` script is in the home directory:

    {{< file "craigslist.py" python >}}
from bs4 import BeautifulSoup
import datetime
from tinydb import TinyDB, Query
import urllib3
import xlsxwriter

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

url = 'https://elpaso.craigslist.org/search/mcy?sort=date'
total_added = 0

def make_soup(url):
    http = urllib3.PoolManager()
    r = http.request("GET", url)
    return BeautifulSoup(r.data,'lxml')

def main(url):
    global total_added
    db = TinyDB("db.json")

    while url:
        print ("Web Page: ", url)
        soup = soup_process(url, db)
        nextlink = soup.find("link", rel="next")

        url = False
        if (nextlink):
            url = nextlink['href']

    print ("Added ",total_added)

    make_excel(db)

def soup_process(url, db):
    global total_added

    soup = make_soup(url)
    results = soup.find_all("li", class_="result-row")

    for result in results:
        try:
            rec = {
                'pid': result['data-pid'],
                'date': result.p.time['datetime'],
                'cost': clean_money(result.a.span.string.strip()),
                'webpage': result.a['href'],
                'pic': clean_pic(result.a['data-ids']),
                'descr': result.p.a.string.strip(),
                'createdt': datetime.datetime.now().isoformat()
            }

            Result = Query()
            s1 = db.search(Result.pid == rec["pid"])

            if not s1:
                total_added += 1
                print ("Adding ... ", total_added)
                db.insert(rec)

        except (AttributeError, KeyError) as ex:
            pass

    return soup

def clean_money(amt):
    return int(amt.replace("$",""))

def clean_pic(ids):
    idlist = ids.split(",")
    first = idlist[0]
    code = first.replace("1:","")
    return "https://images.craigslist.org/%s_300x300.jpg" % code

def make_excel(db):
    Headlines = ["Pid", "Date", "Cost", "Webpage", "Pic", "Desc", "Created Date"]
    row = 0

    workbook = xlsxwriter.Workbook('motorcycle.xlsx')
    worksheet = workbook.add_worksheet()

    worksheet.set_column(0,0, 15) # pid
    worksheet.set_column(1,1, 20) # date
    worksheet.set_column(2,2, 7)  # cost
    worksheet.set_column(3,3, 10)  # webpage
    worksheet.set_column(4,4, 7)  # picture
    worksheet.set_column(5,5, 60)  # Description
    worksheet.set_column(6,6, 30)  # created date

    for col, title in enumerate(Headlines):
        worksheet.write(row, col, title)

    for item in db.all():
        row += 1
        worksheet.write(row, 0, item['pid'] )
        worksheet.write(row, 1, item['date'] )
        worksheet.write(row, 2, item['cost'] )
        worksheet.write_url(row, 3, item['webpage'], string='Web Page')
        worksheet.write_url(row, 4, item['pic'], string="Picture" )
        worksheet.write(row, 5, item['descr'] )
        worksheet.write(row, 6, item['createdt'] )

    workbook.close()

main(url)
{{< /file >}}

3. Add a cron tab entry as the user:

        crontab -e

This sample entry will run the python program every day at 6:30 am.

    30 6 * * * /usr/bin/python3 /home/normaluser/craigslist.py

The python program will write the `motorcycle.xlsx` spreadsheet in `/home/normaluser/`.

## Retrieve the Excel Report

**On Linux**

Use scp to copy `motorcycle.xlsx` from the remote machine that is running your python program to this machine:

    scp normaluser@<Linode Public IP>:/home/normaluser/motorcycle.xlsx .

**On Windows**

Use Firefox's built-in sftp capabilities. Type the following URL in the address bar and it will request a password. Choose the spreadsheet from the directory listing that appears.

    sftp://normaluser@<Linode Public IP>/home/normaluser
