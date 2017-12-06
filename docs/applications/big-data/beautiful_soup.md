---
author:
  name: Luis Cortés
  email: docs@linode.com
description: 'This guide shows you how to use the Beautiful Soup with a database for the purose of collecting information from craigslist over an extended period of time and create an excel spreadsheet with the accumulated data.'
keywords: 'beautiful soup, python, scraping, tinydb'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, Nov 13, 2017
modified_by:
  name: Luis Cortés
published: 'Wednesday, October 4, 2017'
title: 'Website Scraping with BeautifulSoup and TinyDB to Excel Spreadsheet'

---

## What is Beautiful Soup?

It is a python library that allows one to scrap a website's pages for bits of information.
It may seem minimalist, but fun as a starting point for beginners.

Web pages, no matter how they present information, are structured documents, and Beautiful Soup
gives us the tools to walk through that complex structure as well as
extract bits of that information.

## Before You Begin

1. This guide will use `sudo` wherever possible.
Complete the sections of our
[Securing Your Server](/docs/security/securing-your-server)
to create a standard user account, harden SSH access,
and remove unnecessary network services.

2. Create a standard user account called normaluser.

## The Target Scenario

Create a program called craigslist.py to parse
craiglist.org website for "motorcycle prices by 
owner in El Paso, TX."  This criteria is a random
choice that can be easily changed by simply changing
the URL.

The program will be run repeatedly in order to capture
new "for sale" items when they become available. Thereby
capturing continuous data for an extended period of time.
So that trend information can be analyzed at a later date.

In order to provide easy analysis, an Excel spreadsheet 
is generated with all the accumulated data of our criteria.

### Install Package Dependencies (Copied, but not modified ... )

1. Log into your scraping machine.  Then make sure your Fedora 26 OS is up to date:

        sudo dnf update -y
        sudo dnf upgrade -y

2. Install the latests version of Beautiful Soup into python3 by using pip3.

        sudo pip3 install beautifulsoup4

3. Install the python modules tinydb, urllib3, xlsxwriter

        sudo pip3 install tinydb
        sudo pip3 install urllib3
        sudo pip3 install xlsxwriter


4. Also, the python program will require the 'lxml' parser
it is necessary to install an external dependency python
module that Beautiful Soup will use:

        sudo pip3 install lxml


## Program Explaination

### Required Modules

The python script must have access to the appropriate libraries.  Import
from bs4 the class BeautifulSoup that will handle the parsing of the
web pages.  The datetime module provides for the manipulation of dates.
Tinydb provides API for "nosql" style database. Module urllib3 will retrieve
the webpage handling cumbersome nuanices. Finally, xlsxwriter API creates a
excel spreadsheet.

```python
from bs4 import BeautifulSoup
import datetime 
from tinydb import TinyDB, Query
import urllib3
import xlsxwriter
```

### Globals

Before the definition of global variables and to disable warning about SSL
certs not being checked, one needs to add the urllib3.disable_warnings line.

Two global variables are defined.  One is the URL that is being used as the
start page of the craigslist website.  The other just tracks how many web
pages the program traverses seeking the complete data set.

```python
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

url = 'https://elpaso.craigslist.org/search/mcy?sort=date'
adding = 0
```

#### Coming up with the Initial URL

1. Start at the home page of craigslist of a interesting city.

        http://elpaso.craigslist.org

2. Click on an item that is data worthy like Motorcycles under "For Sale" category. The url in the address bar of your browser should look something like this:

        https://elpaso.craigslist.org/i/motorcycles

3. Let's say that direct sales are of interest.  So click on "BY-OWNER ONLY". The url should update to this:

        https://elpaso.craigslist.org/search/mcy

4. Optional, but nice to have is the data organized by date. So click on the "newest" button, and then click again and the url will change once more to this:

        https://elpaso.craigslist.org/search/mcy?sort=date

5. This is the final form of the url that we will use as our initial webpage for the program.  This is what is assigned to the 'url' global variable.

### Retrieving the webpage

The **make_soup** routine is in charge of using the urllib3
API to grab the webpage and convert it to a BeautifulSoup
object.  The module urllib does a lot in its library, so if there is an error in this routine
then urllib probably has a way to handle it, look at these
[urllib3 docs for help](https://urllib3.readthedocs.io/en/latest/).

Also, BeautifulSoup does have different parsers available which are more or less strict about how the webpage is structured. The 'lxml' parser worked for craigslist.org, but there are more [available according to beautiful soup docs](https://www.crummy.com/software/BeautifulSoup/bs4/doc/).

```python
def make_soup(url):
    http = urllib3.PoolManager()
    r = http.request("GET", url)
    return BeautifulSoup(r.data,'lxml')
```

### Main Routine

The main routine pulls in the global variable **adding**, which is
updated in the **soup_process** routine, but will be displayed as an
final step. Open the database file "db.json" and create a TinyDB
object.  Process the initial URL, find the URL of the next page
of data.  If that next page of data is found, loop and process
that web page. If there is no next page of data then it will
fall out of the loop and print the number of new entries added and
create or recreate the excel file.

```python
def main(url):
    global adding
    db = TinyDB("db.json")

    while url:
        print ("Web Page: ", url)
        soup = soup_process(url, db)
        nextlink = soup.find("link", rel="next")

        url = False
        if (nextlink):
            url = nextlink['href']

    print ("Added ",adding)

    make_excel(db)
```

A Sample run might look like the following. Each page's URL has the index embedded in the URL, see the 120, 240, 360, etc.  This is how
craigslist knows where the next page of data starts.


<pre>
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
</pre>

### Processing the 'soup'

The key here is the source code for the website in question. 
Different websites organize their pages differently, and craigslist
has a very organized approach.  This is wonderful from a scrapping 
standpoint.  Go to the initial website in a browser, right click and select "view page source" ,and with a little detective work, this pattern in the web page code can be found.

```html
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
```

One can use a simple statement to target just the 
web page snippets by selecting just the **li** html tags and 
further narrow down the choices by selecting only those 
**li** tags that have a class of **result-row**. The **results** variable contains
all the web page snippets that match this criteria:

    results = soup.find_all("li", class_="result-row")

Next, the program will attempt to create a record
according to the structure of the target snippet.
If the structure doesn't match, then python will
throw an exception which will cause it to skip
this record and snippet.

```python
        rec = {
        'pid': result['data-pid'],
        'date': result.p.time['datetime'],
        'cost': clean_money(result.a.span.string.strip()),
        'webpage': result.a['href'],
        'pic': clean_pic(result.a['data-ids']),
        'descr': result.p.a.string.strip(),
        'createdt': datetime.datetime.now().isoformat()
        }
```

Focusing on the interesting cases of the **rec** dictionary.

A **result** contains one **li** tag snippet of the webpage.
Each **li** tag may contain interesting attributes like
**class** and **data-pid**. To access the value of
the attribute **data-pid**, use the array notation provided
by Beautiful Soup like so:

        'pid': result['data-pid'],


The goal being placing the "date posted" value in the **date** key of the record.

Notice the **li** tag has a **p** tag as a sibling.  The **p** tag has
a **time** tag as its sibling.  Finally, the **time** tag has
an attribute of **datetime** which is the posted time.  To access
the sibling tags, dot notation can be used in conjunction with the
array notation for the **datetime** attribute like so:


        'date': result.p.time['datetime'],

Sometimes the information needed is really in between the start tag and end tag and is otherwise known as the tag content. To access the tag content BeautifulSoup provides the **string** method.  additionally, to remove pre/post white space the **strip** method can be used.

        <span class="result-price">$12791</span>

The value can be further processed by using a custom routine called **clean_money** that removes the dollar sign.

        'cost': clean_money(result.a.span.string.strip()),

Notice that on the craigslist website, one can actually
scroll through several user pictures of the item for sale.

The custom routine **clean_pic** can be used to assign
the first picture's URL to **pic**.

        'pic': clean_pic(result.a['data-ids']),

Finally, meta data can be added to the record.  For example,
the time when a particular record was created can be inserted
into the record itself. Hence the last field is not in the
snippet at all.

        'createdt': datetime.datetime.now().isoformat()

Assuming a **rec** has been successfully created, use the Query object
to check if it already exists in the database.
Only when the **rec** doesnt exist in the database is it inserted into the database.

```python
            Result = Query()
            s1 = db.search(Result.pid == rec["pid"])

            if not s1:
                adding += 1
                print ("Adding ... ", adding)
                db.insert(rec)
```

Two types of Errors are important to handle. These will not
be errors in code, but actually errors in the structure
of the snippet that cause Beautful Soup's API to throw an error.

The AttributeError will be thrown when
the dot notation doesn't find a *sibling tag to
the current html tag*.
For example, if a particular snippet does not have
the anchor tag, then the **cost** key will throw
an error, because it transverses and therefore
requires the anchor tag.

The other error is the KeyError. It will be thrown
if a *required html tag attribute* is missing.  So if we don't
have a **data-pid** attribute in our snippet, the
**pid** key will throw an error.

The **pass** statement is a "do nothing" statement.
So a malformed snippet that throws either error
doesn't insert a record into the database.

```python
        except (AttributeError, KeyError) as ex:
            pass
```

### Cleaning Routines

These are tiny custom routines to clean up the snippet data.
In example, the **clean_money** routine looks into the **amt**
string and checks for a dollar sign.  If it finds one, it
replaces it with nothing.  Then it returns the altered string.

```python
def clean_money(amt):
    return int(amt.replace("$",""))
```

The second cleaning routine does a little more. We can step
through each line to watch the string transform into the URL
of the first picture.

```python
def clean_pic(ids):
    idlist = ids.split(",")
    first = idlist[0]
    code = first.replace("1:","")
    return "https://images.craigslist.org/%s_300x300.jpg" % code
```

The first line uses **ids.split** to take the string of ids:

        "1:01010_8u6vKIPXEsM,1:00y0y_4pg3Rxry2Lj,1:00F0F_2mAXBoBiuTS" 

and split it into python's internal list structure:

        ["1:01010_8u6vKIPXEsM", "1:00y0y_4pg3Rxry2Lj", "1:00F0F_2mAXBoBiuTS"]

Then **first** is assigned the first string item in our python list:

        "1:01010_8u6vKIPXEsM"

following, **code** is assigned the an alter version string with the text "1:" removed:

        "01010_8u6vKIPXEsM"

Finally, the value of **code** is inserted into a specially
crafted craigslist URL that points to the first image:

        https://images.craigslist.org/01010_8u6vKIPXEsM_300x300.jpg


### Creating the Excel Spreadsheet

The last routine is **make_excel** which takes the data
in the database as items, each item represents a created record.

The **Headlines** variable is just a list of the
titles for the columns in the spreadsheet.
The **row** variable tracks the current spreadsheet
row.

```python
    Headlines = ["Pid", "Date", "Cost", "Webpage", "Pic", "Desc", "Created Date"]
    row = 0
```

The program creates a workbook object by giving it the
filename of the spreadsheet.  The worksheet is used for
writing to the cells of the current worksheet. 

```python
    workbook = xlsxwriter.Workbook('motorcycle.xlsx')
    worksheet = workbook.add_worksheet()
```

The first 2 items are always the same in the
**set_column** method. That is because it is
setting the attributes of a section of columns
from the first indicated column to the next.
The last value is the width of the column in characters.

The # means the succeeding text is a programming comment
and not part of code, but the comments help to document
that column's title.

```python
    worksheet.set_column(0,0, 15) # pid
    worksheet.set_column(1,1, 20) # date
    worksheet.set_column(2,2, 7)  # cost
    worksheet.set_column(3,3, 10)  # webpage
    worksheet.set_column(4,4, 7)  # picture
    worksheet.set_column(5,5, 60)  # Description
    worksheet.set_column(6,6, 30)  # created date
```

Next the *for* statement steps through the
**Headlines** variable and writes each title
to the first row.

At the same time, advancing the column by using
**col** which contains the index where it found title
because the **enumerate** routine not only retrieves
each title, but the index of that title too.

```python
    for col, title in enumerate(Headlines):
        worksheet.write(row, col, title)
```
The next goal is to display all our records
in the database.

Using another *for* statement, the program writes each **item** of our
database to the spreadsheet. Advancing the row to ensure
an empty row in the spreadsheet. Then writing at this row, in the
appropriate column, the item's key's value.

There are 2 special exemptions, the URL fields.
To be able to click on them on the
spreadsheet and jump to the webpage or see
the image in our browser, use **worksheet.write_url**.

```python
    for item in db.all():
        row += 1
        worksheet.write(row, 0, item['pid'] )
        worksheet.write(row, 1, item['date'] )
        worksheet.write(row, 2, item['cost'] )
        worksheet.write_url(row, 3, item['webpage'], string='Web Page')
        worksheet.write_url(row, 4, item['pic'], string="Picture" )
        worksheet.write(row, 5, item['descr'] )
        worksheet.write(row, 6, item['createdt'] )
```

Finally, close the Excel workbook which flushes
all the data to the spreadsheet file and closes it.

```python
    workbook.close()
```

## Cron Setup

1. Log in to your machine as a normal user.  Assuming a normal user
account was at some point created called **normaluser** with a suitable
password:

        ssh normaluser@machineIP

2. copy the complete program to the home directory:

        wget ( get the python program file from linode assets )

3. Add a cron tab entry as the user:

        crontab -e

This sample entry will run the python program every day at 6:30 am.

<pre>
30 6 * * * /usr/bin/python3 /home/normaluser/craigslist.py
</pre>

After it is run, as long as crontab was run as normaluser, the 
python program will drop the motorcycle.xlsx in the home directory 
of normaluser.  Also, the database that accumulates data from 
consecutive runs will also be placed on the home directory.

## Getting the Excel Report

1.  Assuming a Linux box, the following command
can be used to drop the motorcycle.xlsx to this machine from
the remote machine that continually is running your python program.

        scp normaluser@machineIP:/home/normaluser/motorcycle.xlsx .

2.  Assuming a Windows machine, use firefox browser
and its sftp capabilities.  Type in the following URL in the address bar in firefox and it will request a password. Afterwhich,
a directory listing of the home directory will be
displayed.  Just click on the motorcycle.xlsx to view it.

        sftp://normaluser@machineIP/home/normaluser
