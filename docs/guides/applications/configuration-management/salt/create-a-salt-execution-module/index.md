---
slug: create-a-salt-execution-module
description: 'This guide provides you with step-by-step instructions for creating a Salt execution module, which is a Python module that runs on a Salt minion. '
keywords: ['salt','execution module','saltstack']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-22
modified: 2019-01-02
modified_by:
  name: Linode
image: CreateaSaltExecutionModule.png
title: "Create a Salt Execution Module"
external_resources:
- '[Writing Execution Modules](https://docs.saltproject.io/en/latest/ref/modules/)'
- '[Execution of Salt Modules From Within States](https://docs.saltproject.io/en/latest/ref/states/all/salt.states.module.html#execution-of-salt-modules-from-within-states)'
aliases: ['/applications/configuration-management/create-a-salt-execution-module/','/applications/configuration-management/salt/create-a-salt-execution-module/']
tags: ["automation","salt"]
authors: ["Linode"]
---

A Salt *execution module* is a Python module that runs on a Salt minion. It perform tasks and returns data to the Salt master. In this tutorial you will create and install an execution module that will call the [US National Weather Service API](https://forecast-v3.weather.gov/documentation) and return the current temperature at a specified weather station. This example could easily be adapted to access any API.

## Before You Begin

If you haven't already, set up a Salt master and at least one Salt minion. You can follow the first few steps of our [Getting Started with Salt - Basic Installation and Setup](/docs/guides/getting-started-with-salt-basic-installation-and-setup/) guide.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Prepare Salt

The files created in the following steps will be located in the `/srv/salt` directory. If you have changed Salt's default [`file_roots`](https://docs.saltproject.io/en/latest/ref/configuration/master.html#std:conf_master-file_roots) configuration, use that directory location instead.

1.  Begin by creating the `/srv/salt` directory if it does not already exist. This is where you will place your top file and your Salt state file:

        mkdir /srv/salt

1.  Create a top file in `/srv/salt` which will be Salt's point of entry for our Salt configuration:
    {{< file "/srv/salt/top.sls" yaml >}}
base:
  '*':
    - weather
{{< /file >}}

1.  Create a state file named `weather.sls` and instruct Salt to make sure our minions have PIP installed, as well as the required Python library.

    {{< file "/srv/salt/weather.sls" yaml >}}
python-pip:
  pkg.installed

requests:
  pip.installed:
    - require:
      - pkg: python-pip
{{< /file>}}

1.  Apply these state changes:

        salt '*' state.apply

1.  Finally, create the `/srv/salt/_modules` directory which will contain our execution module:

        mkdir /srv/salt/_modules

## Create the Execution Module

1.  Create a file called `weather.py` in the `/srv/salt/_modules` directory, and add the following lines to set up Salt logging and import the requests module.

    {{< file "/srv/salt/_modules/weather.py" python >}}
import logging
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

log = logging.getLogger(__name__)

. . .
{{< /file >}}

1. Add the `__virtualname__` variable and the `__virtual__` function.

    {{< file "/srv/salt/_modules/weather.py" python>}}
. . .

__virtualname__ = 'weather'

def __virtual__():
    '''
    Only load weather if requests is available
    '''
    if HAS_REQUESTS:
        return __virtualname__
    else:
        return False, 'The weather module cannot be loaded: requests package unavailable.'

. . .
{{< /file >}}

    The `__virtual__` function either returns the module's virtual name and loads the module, or returns `False` with an error string and the module is not loaded. The `if HAS_REQUESTS` conditional is tied to the try/except block created in the previous step through the use of the `HAS_REQUESTS` variable.

1.  Add the public `get()` function and the private `_make_request()` function:

    {{< file "/srv/salt/_modules/weather.py" python >}}
. . .

def get(signs=None):
    '''
    Gets the Current Weather

    CLI Example::

        salt minion weather.get KPHL

    This module also accepts multiple values in a comma separated list::

        salt minion weather.get KPHL,KACY
    '''
    log.debug(signs)
    return_value = {}
    signs = signs.split(',')
    for sign in signs:
        return_value[sign] = _make_request(sign)
    return return_value

def _make_request(sign):
    '''
    The function that makes the request for weather data from the National Weather Service.
    '''
    request = requests.get('https://api.weather.gov/stations/{}/observations/current'.format(sign))
    conditions = {
        "description:": request.json()["properties"]["textDescription"],
        "temperature": round(request.json()["properties"]["temperature"]["value"], 1)
    }
    return conditions
{{< /file >}}

    There are two functions in this step. The `get()` function accepts one or more weather station call signs as a comma separated list. It calls `_make_request()` to make the HTTP request and returns a text description of the current weather and the temperature.

    It's important to note that by adding an underscore to the beginning of the `_make_request()` function it becomes a private function, which means it is not directly accessible through the Salt command line or a state file.

    The complete file looks like this:

    {{< file "/srv/salt/_modules/weather.py" python >}}
import logging
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

log = logging.getLogger(__name__)

__virtual_name__ = 'weather'

def __virtual__():
    '''
    Only load weather if requests is available
    '''
    if HAS_REQUESTS:
        return __virtual_name__
    else:
        return False, 'The weather module cannot be loaded: requests package unavailable.'


def get(signs=None):
    '''
    Gets the Current Weather

    CLI Example::

        salt minion weather.get KPHL

    This module also accepts multiple values in a comma seperated list::

        salt minion weather.get KPHL,KACY
    '''
    log.debug(signs)
    return_value = {}
    signs = signs.split(',')
    for sign in signs:
        return_value[sign] = _make_request(sign)
    return return_value

def _make_request(sign):
    '''
    The function that makes the request for weather data from the National Weather Service.
    '''
    request = requests.get('https://api.weather.gov/stations/{}/observations/current'.format(sign))
    conditions = {
        "description:": request.json()["properties"]["textDescription"],
        "temperature": round(request.json()["properties"]["temperature"]["value"], 1)
    }
    return conditions
{{< /file >}}

## Run the Execution Module

1.  To run the execution module, you need to first sync it to your minions. To do this, you can call a highstate with `state.apply`, which will also try to apply the state changes you specified earlier in the `weather.sls` state file. Since the `weather.sls` state was already applied in the [Preparing Salt](#preparing-salt) section, use the `saltutil.sync_modules` function:

        salt '*' saltutil.sync_modules

1.  Run the execution module on your Salt master:

        salt '*' weather.get KPHL

    You should see an output like the following:

    {{< output >}}
salt-minion:
----------
KPHL:
    ----------
    description::
        Cloudy
    temperature:
        17.2
{{< /output >}}

1.  Alternatively, you can run the Salt execution module locally on your Salt minion by entering the following:

        salt-call weather.get KVAY,KACY

    You should get an output like the following:

    {{< output >}}
local:
    ----------
    KACY:
        ----------
        description::
            Cloudy
        temperature:
            18.9
    KVAY:
        ----------
        description::
            Cloudy
        temperature:
            16.7
{{< /output >}}

You have now successfully created and installed a Salt execution module.
