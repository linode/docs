---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Create a Salt execution module.'
keywords: ['salt','create','execution module','module','saltstack']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-05
modified: 2018-10-05
modified_by:
  name: Linode
title: "Create a Salt Execution Module"
external_resources:
- '[Writing Execution Modules](https://docs.saltstack.com/en/latest/ref/modules/)'
- '[Execution of Salt Modules From Within States](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.module.html#execution-of-salt-modules-from-within-states)'
---

This guide will cover the creation and installation of a Salt *execution module*. Salt execution modules are Python modules that run on a Salt minion. They perform tasks and return data to the Salt master.  In this tutorial you will create an execution module that will call the [US National Weather Service API](https://forecast-v3.weather.gov/documentation) and return the current temperature at a specified weather station. This example could easily be adopted to access any API.

## Before You Begin

If you haven't already, set up a Salt master and at least one Salt minion. You can follow the first few steps of our [Getting Started with Salt - Basic Installation and Setup](https://www.linode.com/docs/applications/configuration-management/getting-started-with-salt-basic-installation-and-setup/) guide.

## Preparing Salt

The following steps deal with the `/srv/salt` folder. If you have changed Salt's default [`file_roots`](https://docs.saltstack.com/en/latest/ref/configuration/master.html#std:conf_master-file_roots), use that location instead.

1.  Begin by creating the `/srv/salt` folder if it does not already exist. This is where we will place our top file and our salt state file:

        mkdir /srv/salt

2.  Create a top file in `/srv/salt` that will be Salt's point of entry for our Salt configuration:
    {{< file "/srv/salt/top.sls" yaml >}}
base:
  '*':
    - weather
{{< /file >}}

3.  Create a state file named `weather.sls` and instruct Salt to make sure our minions have PIP installed, as well as the requests Python library.

    {{< file "/srv/salt/weather.sls" yaml >}}
python-pip:
  pkg.installed

requests:
  pip.installed:
    - require:
      - pkg: python-pip
{{< /file>}}

4.  Apply these state changes:

        salt '*' state.apply

5.  Finally, create the `/srv/salt/_modules` directory. This will house our execution module:

        mkdir /srv/salt/_modules

## Creating the Execution Module

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

2. Add the `__virtualname__` variable and the `__virtual__` function.

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

    The `__virtual__` function either returns the module name, or returns `False` with an error string and the module is not loaded. Here we've tied this decision to the try/except block we created in the previous step through the use of the `HAS_REQUESTS` variable.

1.  Add the public and private functions:

    {{< file "/srv/salt/_modules/weather.py" python >}}
. . .

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

    There are two functions in this step. The function `get` is passed in one or more weather station call signs in a comma seprated list. It then calls `_make_request` to make the HTTP request and return a text description of the current weather and the temperature. It's important to note that by adding an underscore to the beginning of the `_make_request` functions we make it private, which mean it is not directly accessible through the Salt command line or a state file.

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

## Running the Execution Module

1.  We need to get the execution module onto our minions in order for it to run. To do this, we can apply a highstate with `state.apply`, which will also try to apply the state changes we specified earlier in our `weather.sls`. Or, because we already did that, we could use the `saltutil.sync_modules` function:

        salt '*' saltutil.sync_modules

2.  Run the execution module on your Salt master:

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

1.  Alternatively you can run the Salt execution module locally on your Salt minion by entering the following:

        salt-call -l debug --local weather.get KVAY,KACY

    You should get an output like the following:

    {{< output >}}
[DEBUG   ] Reading configuration from /etc/salt/minion
[DEBUG   ] Including configuration from '/etc/salt/minion.d/_schedule.conf'
[DEBUG   ] Reading configuration from /etc/salt/minion.d/_schedule.conf
[DEBUG   ] Using cached minion ID from /etc/salt/minion_id: salt-minion
[DEBUG   ] Configuration file path: /etc/salt/minion
[DEBUG   ] Grains refresh requested. Refreshing grains.
[DEBUG   ] Reading configuration from /etc/salt/minion
[DEBUG   ] Including configuration from '/etc/salt/minion.d/_schedule.conf'
[DEBUG   ] Reading configuration from /etc/salt/minion.d/_schedule.conf
[DEBUG   ] Please install 'virt-what' to improve results of the 'virtual' grain.
[DEBUG   ] Determining pillar cache
[DEBUG   ] LazyLoaded jinja.render
[DEBUG   ] LazyLoaded yaml.render
[DEBUG   ] LazyLoaded jinja.render
[DEBUG   ] LazyLoaded yaml.render
[DEBUG   ] LazyLoaded weather.get
[DEBUG   ] KVAY,KACY
[DEBUG   ] Starting new HTTPS connection (1): api.weather.gov
[DEBUG   ] https://api.weather.gov:443 "GET /stations/KVAY/observations/current HTTP/1.1" 200 1054
[DEBUG   ] Starting new HTTPS connection (1): api.weather.gov
[DEBUG   ] https://api.weather.gov:443 "GET /stations/KACY/observations/current HTTP/1.1" 200 1050
[DEBUG   ] LazyLoaded nested.output
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

Congratulations, you've successfully created and installed a Salt execution module.