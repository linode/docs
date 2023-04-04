---
slug: monitoring-salt-minions-with-beacons
description: 'This guide shows how to monitor Salt minions with beacons. Set up alerts for different system resources to notify you over a messaging service like Slack.'
keywords: ['salt','saltstack','minion','minions','beacon','beacons','reactor','reactors','monitor','configuration drift','slack']
tags: ["monitoring","automation","salt"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-19
modified: 2019-01-02
modified_by:
  name: Linode
image: MonitoringSaltMinionswithBeacons.png
title: "Monitoring Salt Minions with Beacons"
external_resources:
- '[Salt Beacons Documentation](https://docs.saltproject.io/en/latest/topics/beacons/)'
- '[Salt Beacon Modules](https://docs.saltproject.io/en/latest/ref/beacons/all/index.html)'
- '[Salt Reactors Documentation](https://docs.saltproject.io/en/latest/topics/reactor/)'
aliases: ['/applications/configuration-management/monitoring-salt-minions-with-beacons/','/applications/configuration-management/salt/monitoring-salt-minions-with-beacons/']
authors: ["Linode"]
---

Every action performed by Salt, such as applying a highstate or restarting a minion, generates an event. *Beacons* emit events for non-salt processes, such as system state changes or file changes. This guide will use Salt beacons to notify the Salt master of changes to minions, and Salt *reactors* to react to those changes.

## Before You Begin

If you don't already have a Salt master and minion, follow the first steps in our [Getting Started with Salt - Basic Installation and Setup](/docs/guides/getting-started-with-salt-basic-installation-and-setup/) guide.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Example 1: Preventing Configuration Drift

Configuration drift occurs when there are untracked changes to a system configuration file. Salt can help prevent configuration drift by ensuring that a file is immediately reverted to a safe state upon change. In order to do this, we first have to let Salt manage the file. This section will use an NGINX configuration file as an example, but you can choose any file.

### Manage Your File

1.  On your Salt master, create a directory for your managed files in `/srv/salt/files`:

        mkdir /srv/salt/files

1.  On your Salt master, place your `nginx.conf`, or whichever file you would like to manage, in the `/srv/salt/files` folder.

1.  On your Salt master, create a state file to manage the NGINX configuration file:

    {{< file "/srv/salt/nginx_conf.sls" yaml >}}
/etc/nginx/nginx.conf:
  file.managed:
    - source:
      - salt://files/nginx.conf
    - makedirs: True
{{< /file >}}

    There are two file paths in this `.sls` file. The first file path is the path to your managed file on your minion. The second, under `source` and prefixed with `salt://`, points to the file path on your master. `salt://` is a convenience file path that maps to `/srv/salt`.

1.  On your Salt master, create a top file if it does not already exist and add your `nginx_conf.sls`:

    {{< file "/srv/salt/top.sls" yaml >}}
base:
  '*':
    - nginx_conf
{{< /file >}}

1.  Apply a highstate from your Salt master to run the `nginx_conf.sls` state on your minions.

        salt '*' state.apply

### Create a Beacon

1.  In order to be notified when a file changes, you will need the Python `pyinotify` package. Create a Salt state that will handle installing the `pyinotify` package on your minions:

    {{< file "/srv/salt/packages.sls" >}}
python-pip:
  pkg.installed

pyinotify:
  pip.installed:
    - require:
      - pkg: python-pip
        {{</ file >}}

    {{< note respectIndent=false >}}
The inotify beacon only works on OSes that have inotify kernel support. Currently this excludes FreeBSD, macOS, and Windows.
{{< /note >}}

1.  On the Salt master create a `minion.d` directory to store the beacon configuration file:

        mkdir /srv/salt/files/minion.d


1.  Now create a beacon that will emit an event every time the `nginx.conf` file changes on your minion. Create the `/etc/salt/minion.d/beacons.conf` file and add the following lines:

    {{< file "/etc/salt/minion.d/beacons.conf" yaml >}}
beacons:
  inotify:
    - files:
        /etc/nginx/nginx.conf:
          mask:
            - modify
    - disable_during_state_run: True
{{< /file >}}

1.  To apply this beacon to your minions, create a new `file.managed` Salt state:

    {{< file "/srv/salt/beacons.sls" >}}
/etc/salt/minion.d/beacons.conf:
  file.managed:
    - source:
      - salt://files/minion.d/beacons.conf
    - makedirs: True
    {{</ file >}}

1.  Add the new `packages` and `beacons` states to your Salt master's top file:

    {{< file "/srv/salt/top.sls" yaml >}}
base:
  '*':
    - nginx_conf
    - packages
    - beacons
{{< /file >}}

1.  Apply a highstate from your Salt master to implement these changes on your minions:

        salt '*' state.apply

1.  Open another shell to your Salt master and start the Salt event runner. You will use this to monitor for file change events from your beacon.

        salt-run state.event pretty=True

1.  On your Salt minion, make a change to your `nginx.conf` file, and then check out your Salt event runner shell. You should see an event like the following:

    {{< output >}}
salt/beacon/salt-minion/inotify//etc/nginx/nginx.conf	{
    "_stamp": "2018-10-10T13:53:47.163499",
    "change": "IN_MODIFY",
    "id": "salt-minion",
    "path": "/etc/nginx/nginx.conf"
}
{{< /output >}}

    Note that the first line is the name of the event, and it includes your Salt minion name and the path to your managed file. We will use this event name in the next section.

1.  To revert the `nginx.conf` file to it's initial state, you can apply a highstate from your Salt master.

        salt '*' state.apply nginx_conf

    Open your managed file on your Salt minion and notice that the change has been reverted. We will automate this last step in the next section.

### Create a Reactor

1.  On your Salt master, create the `/srv/reactor` directory:

        mkdir /srv/reactor

2.  Then create a reactor state file in the `/srv/reactor` directory and include the following:

    {{< file "/srv/reactor/nginx_conf_reactor.sls" yaml >}}
/etc/nginx/nginx.conf:
  local.state.apply:
    - tgt: {{ data['id'] }}
    - arg:
      - nginx_conf
{{< /file >}}

    The file path in the first line is simply the name of the reactor, and can be whatever you choose. The `tgt`, or target, is the Salt minion that will receive the highstate. In this case, the information passed to the reactor from the beacon event is used to programmatically choose the right Salt minion ID. This information is available as the `data` dictionary. The `arg`, or argument, is the name of the Salt state file that was created to manage the `nginx.conf` file.

1.  On your Salt master, create a `reactor.conf` file and include the new reactor state file:

    {{< file "/etc/salt/master.d/reactor.conf" yaml >}}
reactor:
  - 'salt/beacon/*/inotify//etc/nginx/nginx.conf':
    - /srv/reactor/nginx_conf_reactor.sls
{{< /file >}}

    This `reactor.conf` file is essentially a list of event names matched to reactor state files. In this example we've used a glob (*) in the event name instead of specifying a specific minion ID, (which means that any change to a `nginx.conf`on any minion will trigger the reactor), but you might find a specific minion ID better suits your needs.

4.  Restart the `salt-master` service to apply the `reactor.conf` file:

        systemctl restart salt-master

5.  On your Salt minion, make a change to the `nginx.conf` file. Then check out your event runner shell and you should see a number of events. Then, check your `nginx.conf` file. The changes you made should have automatically been reverted.

Congratulations, you now know how to manage configuration drift with Salt. All future updates to `nginx.conf` should be made on the Salt master and applied using `state.apply`.

## Example 2: Monitoring Minion Memory Usage with Slack

Salt comes with a number of system monitoring beacons. In this example we will monitor a minion's memory usage and send a Slack notification when the memory usage has passed a certain threshold. For this section you will need to create a Slack bot, obtain an OAuth token, and configure the bot to be able to send Slack messages on your behalf.

### Configure Your Slack App

1.  [Create a Slack app](https://api.slack.com/apps?new_app=1).

1.  From the Slack app settings page, navigate to OAuth & Permissions.

1.  Copy down the OAuth Access Token.

1.  Under Scopes, select **Send Messages As &lt; your app name &gt;**.

### Create a Beacon

1.  On your Salt master, open or create the `/srv/salt/files/minion.d/beacons.conf` file and add the following lines. If you already have a `beacons.conf` file from the previous example, leave out the `beacons:` line, but ensure that rest of the configuration is indented two spaces:

    {{< file "/srv/salt/files/minion.d/beacons.conf" yaml >}}
beacons:
  memusage:
    beacon.present:
      - percent: 15%
      - interval: 15
{{< /file >}}

    In this example we've left the memory usage percentage low to ensure the beacon event will fire, and the event interval set to 15 seconds. In a production environment you should change these to more sane values.

1. Apply a highstate from your Salt master to add the beacon to your minions:

        salt '*' state.apply

1.  If you haven't already, open another shell into your Salt master and start the event runner:

        salt-run state.event pretty=True

1.  After a few seconds, assuming you've set the memory percentage low enough, you should see an event like the following:

    {{< output >}}
salt/beacon/salt-minion/memusage/	{
    "_stamp": "2018-10-10T15:48:53.165368",
    "id": "salt-minion",
    "memusage": 20.7
}
{{< /output >}}

    Note that the first line is the name of the event, and contains the minion name. We will use this event name in the next section.

### Create a Reactor

1.  On your Salt master, create the `/srv/reactor` directory if you have not already done so:

        mkdir /srv/reactor

1.  Then create a reactor state file and add the following lines, making sure to change the `channel`, `api_key`, and `from_name` keys to reflect your desired values. The `api_key` is the OAuth token you copied down in step 3 of the [Configure Your Slack App](#configure-your-slack-app) section:

    {{< file "/srv/reactor/memusage.sls" yaml >}}
Send memusage to Slack:
  local.slack.post_message:
    - tgt: {{ data['id'] }}
    - kwarg:
        channel: "#general"
        api_key: "xoxp-451607817121-453578458246..."
        message: "{{ data['id'] }} has hit a memory usage threshold: {{ data['memusage'] }}%."
        from_name: "Memusage Bot"
{{< /file >}}

    We're using the `data` dictionary provided to the reactor from the memusage event to populate the minion ID and the memory usage.

1.  Open or create the `reactor.conf` file. If you already have a `reactor.conf` file from the previous example, leave out the `reactor:` line, but ensure that rest of the configuration is indented two spaces:

    {{< file "/etc/salt/master.d/reactor.conf" yaml >}}
reactor:
  - 'salt/beacon/*/memusage/':
    - '/srv/reactor/memusage.sls'
{{< /file >}}

    In this example we've used a glob (*) in the event name instead of specifying a specific minion ID, (which means that any memusage event will trigger the reactor), but you might find a specific minion ID better suits your needs.

1.  Restart `salt-master` to apply the `reactor.conf`:

        systemctl restart salt-master

1.  In your event-runner shell, after a few seconds, you should see an event like the following:

    {{< output >}}
salt/job/20181010161053393111/ret/salt-minion	{
    "_stamp": "2018-10-10T16:10:53.571956",
    "cmd": "_return",
    "fun": "slack.post_message",
    "fun_args": [
        {
            "api_key": "xoxp-451607817121-453578458246-452348335312-2328ce145e5c0c724c3a8bc2afafee17",
            "channel": "#general",
            "from_name": "Memusage Bot",
            "message": "salt-minion has hit a memory usage threshold: 20.7."
        }
    ],
    "id": "salt-minion",
    "jid": "20181010161053393111",
    "retcode": 0,
    "return": true,
    "success": true
}
{{< /output >}}

1.  Open Slack and you should see that your app has notified the room.

Congratulations, you now know how to monitor your Salt minion's memory usage with Slack integration. Salt can also monitor CPU load, disk usage, and a number of other things. Refer to the More Information section below for additional resources.
