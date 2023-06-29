---
slug: python-3-9-new-features
description: 'This guide highlights and showcases examples of three improved features - merge dictionaries, time zone implementation, and type annotations - of Python 3.9.'
keywords: ['python']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-25
modified_by:
  name: Linode
title: "Python 3.9: Merge Dictionaries, Time Zone Support, and Type Annotations"
title_meta: "Python 3.9: An Overview of New Features"
external_resources:
- '[Python release 3.9.5 Changelog](https://www.python.org/)'
- '[Flask](https://flask.palletsprojects.com/en/1.0.x/)'
authors: ["John Mueller"]
---

## Python 3.9: New Features

Python 3.9.5 is the latest major release and contains several new features. Most of these new features focus on making existing features of the language easier to implement. The following sections describe some of the more stellar features, but you can be sure that there are plenty of others.

### Python Merge Dictionaries: Making Them Easier

Dictionaries are one of the essentials of Python, so anything that can make using them easier is welcome. In traditional Python, you could merge two dictionaries using code like this:

{{< output  >}}
>>> List1 = {0: "Orange", 1 : "Blue", 2 : "Green"}
>>> List2 = {0: "Red", 3 : "Gray", 4 : "Purple"}
>>> Merged = List1.copy()
>>> for key, value in List2.items():
...     Merged[key] = value
...
>>> Merged
{0: 'Red', 1: 'Blue', 2: 'Green', 3: 'Gray', 4: 'Purple'}

{{< /output >}}

This code works, but it's a bit hard to read. Something simpler would be nice. An alternative that still leaves the original lists intact looks like this:

{{< output >}}
>>> Merged = List1.copy()
>>> Merged.update(List2)
>>> Merged
{0: 'Red', 1: 'Blue', 2: 'Green', 3: 'Gray', 4: 'Purple'}
{{< /output >}}

However, it's still cumbersome. Python 3.8 comes to the rescue with the walrus operator (:=). The following line of code does everything, but it's still hard to read:

{{< output >}}
>>> (Merged := List1.copy()).update(List2)
>>> Merged
{0: 'Red', 1: 'Blue', 2: 'Green', 3: 'Gray', 4: 'Purple'}
{{< /output >}}

Python 3.9 adds two new features: union (|) and in-place union (|=). A union simply combines two dictionaries like this:

{{< output >}}
>>> Merged = List1 | List2
>>> Merged
{0: 'Red', 1: 'Blue', 2: 'Green', 3: 'Gray', 4: 'Purple'}
{{< /output >}}

This code is a lot easier to read than any of the predecessors, but accomplishes the same thing. You use the in-place union when you want to update an existing list with new entries like this:

{{< output >}}
>>> List1 |= List2
>>> List1
{0: 'Red', 1: 'Blue', 2: 'Green', 3: 'Gray', 4: 'Purple'}
{{< /output >}}

In this case, you do modify List1, but the process is simple. Unlike other methods, the union also preserves type when working with something like a default dictionary. Consequently, this code shows that creating a union of two default dictionaries works fine:

{{< output >}}
>>> from collections import defaultdict
>>> List1 = defaultdict(lambda : "", {0: "Orange", 1 : "Blue", 2 : "Green"})
>>> List2 = defaultdict(lambda : "", {0: "Red", 3 : "Gray", 4 : "Purple"})
>>> Merged = List1 | List2
>>> Merged
defaultdict(<function <lambda> at 0x000000790EC0DF70>, {0: 'Red', 1: 'Blue', 2: 'Green', 3: 'Gray', 4: 'Purple'})
{{< /output >}}

Preserving the data type means that `Merged` continues to perform the same as the two original lists; it knows how to handle missing values. A final extra that comes with the new in-place union is the ability to add non-dictionary items to dictionaries like this:

{{< output >}}
>>> List1 = {0: "Orange", 1 : "Blue", 2 : "Green"}
>>> List1 |= [(3, "Black")]
>>> List1
{0: 'Orange', 1: 'Blue', 2: 'Green', 3: 'Black'}
{{< /output >}}

In this case, the list containing the tuple is added to the dictionary. Of course, the tuple must be in the correct form. If you tried to add something like `List1 |= [(4, "Black", True)]`, you'd receive the `ValueError: dictionary update sequence element #0 has length 3; 2 is required` error message. This same new functionality exists for the following types:

- `UserDict`
- `ChainMap`
- `OrderedDict`
- `Defaultdict`
- `WeakKeyDictionary`
- `WeakValueDictionary`
- `_Environ`
- `MappingProxyType`

## Time Zones in Python Made Easier

Python 3.9 doesn't really provide full time zone support out of the package but it does introduce real time zone support. To install the required support, you type `python -m pip install tzdata` and press `Enter` at the command prompt or terminal window. Now you're ready to work with timezones. For example, if you want to know the current time in another country, you can always request it using code like this:

{{< output >}}
>>> from datetime import datetime
>>> from zoneinfo import ZoneInfo
>>> datetime.now(tz=ZoneInfo("Europe/Paris"))
datetime.datetime(2021, 6, 23, 17, 3, 52, 95558, tzinfo=zoneinfo.ZoneInfo(key='Europe/Paris'))
{{< /output >}}

The time zone features also work with formatted output as shown here:

{{< output >}}
>>> datetime.strftime(datetime.now(tz=ZoneInfo("Europe/Paris")),"%H:%M:%S")
'21:56:04'
{{< /output >}}

If you want to work with a specific time, the technique is slightly different. You use `tzinfo` in place of `tz`. For example, you can create a specific time like this:

{{< output >}}
>>> thisTime = datetime(2021, 5, 9, 3, 30, tzinfo=ZoneInfo("Europe/Paris"))
>>> thisTime.astimezone(ZoneInfo("America/Chicago"))
datetime.datetime(2021, 5, 8, 20, 30, tzinfo=zoneinfo.ZoneInfo(key='America/Chicago'))
{{< /output >}}

The first line creates a new `datetime`, `thisTime`, which uses the Paris time zone. The second line converts the `thisTime` time zone into the Chicago time zone. You can see that 3:30 am on May 9th in Paris is equivalent to 8:30 pm on May 8th in Chicago.

To find out if a particular time zone is available, use the example code below. It shows how to obtain a list of time zones:

{{< output >}}
>>> zoneinfo.available_timezones()
{'Indian/Kerguelen', 'America/Jujuy', 'Australia/Canberra', 'America/Atka', 'Ame
rica/Fort_Nelson', 'America/St_Thomas', 'Australia/Lord_Howe', 'Asia/Phnom_Penh'
...
st', 'Africa/Maseru', 'America/Scoresbysund', 'America/Port-au-Prince', 'Europe/
Paris', 'America/Santiago', 'Asia/Manila', 'US/East-Indiana', 'Asia/Kabul', 'Asi
a/Srednekolymsk'}
{{< /output >}}

The number of time zones varies as the face of the world changes. You can get a total using `len(zoneinfo.available_timezones())`. The output is currently 594 different time zones.

When working with dates and times, you might want to output the correct time zone name. To do this, you use the `tzname()` function with a date as shown here:

{{< output >}}
>>> ZoneInfo("America/Chicago").tzname(datetime.now())
'CDT'
{{< /output >}}

## Python Type Annotations

Annotations originally appeared in Python 3.0 as a means for adding metadata to functions. At the time, and even so now, the metadata was somewhat arbitrary in nature. As Python has matured, the annotations are currently used mostly for type hints. Consequently, Python 3.9 makes it considerably easier to add this sort of annotation to your code. Here is an example of creating type hints:

{{< output >}}
>>> from typing import Annotated
>>> def MyHello(
...      name: Annotated[str, "Person's Name"],
...      greeting: Annotated[str, "What to Say"]
...      ) -> Annotated[str, "Complete Greeting"]:
...          return greeting + " " + name
...
{{< /output >}}

The function now provides type hinting so that it's a lot easier to use. You can also access the information using `__annotations__` like this:

{{< output >}}
>>> MyHello.__annotations__
{'name': typing.Annotated[str, "Person's Name"], 'greeting': typing.Annotated[str, 'What to Say'], 'return': typing.Annotated[str, 'Complete Greeting']}
{{< /output >}}

A little more readable form of annotations comes from the `get_type_hints()` function shown here:

{{< output >}}
>>> from typing import get_type_hints
>>> get_type_hints(MyHello)
{'name': <class 'str'>, 'greeting': <class 'str'>, 'return': <class 'str'>}
{{< /output >}}

## An Updated Python Parser

You may notice that Python may seem a little perkier. The older versions of Python used a left-to-right, leftmost derivation, [LL(1) parser](https://en.wikipedia.org/wiki/LL_parser), that parsed your code one character at a time. An advantage of this particular kind of parser is that it's extremely easy to implement. The disadvantage is that parsing certain kinds of code requires backtracking and hacks. The new [Parsing Expression Grammar (PEG)](https://en.wikipedia.org/wiki/LL_parser) parser is considerably more powerful and avoids using backtracking or hacks. The details of this particular change are rather technical, but the fact is that using a PEG parser makes Python better and faster by removing certain limitations.

Fortunately, during this transition period, Python 3.9 ships with both parsers. If you choose to use the old parser, you can always do so using the `-X oldparser` command line switch. The one good reason to use the old parser is that it requires less memory. The advantages of using a PEG parser mean that you have access to all the language's new additions. For example, one of the additions slated for Python 3.10 is Structural Pattern Matching, as described in [PEP 622](https://www.python.org/dev/peps/pep-0622/).

## A Caveat to Consider

If you want to work with the new Python 3.9.56 features now, [download a copy of Python](https://www.python.org/downloads/) and use it on your local machine. In looking at [Google Colab](https://colab.research.google.com/), it currently runs 3.7.10 by default. The notebook setup on [Kaggle](https://www.kaggle.com/) relies on version 3.7.9. Installing Python 3.9 using [Conda](https://docs.conda.io/en/latest/) in [Jupyter Notebook](https://jupyter.org/) requires a few extra steps; although, you can find help in some [message threads](https://stackoverflow.com/questions/63216201/how-to-install-python3-9-with-conda). You might find that these solutions don’t work because they generate a missing or corrupt `api-ms-win-core-path-l1-1-0.dll files` error. The latest version that Jupyter Notebook currently works with natively is 3.8.8. In short, Python 3.9 is new, so some tools you use may not have support for it yet.

## Conclusion

This brief overview of some of the Python 3.9.5 features should give you good reason to upgrade. The only thing that holds some people back is that it doesn't work well with some programming environments.

A key factor to consider as you move forward with Python is whether a particular update is crucial to your project, which means knowing when the updates become available. Fortunately, it’s easy to find a [schedule for updates](https://www.python.org/dev/peps/pep-0596/#release-schedule) and determine the [focus of the update](https://docs.python.org/3/whatsnew/3.9.html) so you know whether the update warrants further investigation. You also need to know whether the packages you use for your applications are compatible with your version of Python. For example, [Scikit-learn](https://scikit-learn.org/stable/install.html) currently uses Python versions 3.6 through 3.8. If you install Python 3.9, you might find that some of your packages no longer work.

