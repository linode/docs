---
slug: monitor-filesystem-events-with-pyinotify
description: 'Pyinotify is a Python library for using inotify, a Linux kernel subsystem for monitoring file system changes.'
keywords: ["inotify","pyinotify","monitoring","python","async"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-07
modified: 2018-09-20
modified_by:
  name: Md. Sabuj Sarker
title: 'Monitor Filesystem Events with Pyinotify'
external_resources:
- '[Pyinotify on Github](https://github.com/seb-m/pyinotify)'
- '[Pyinotify API documentation](http://seb-m.github.com/pyinotify)'
- '[Inotify manpage](http://www.kernel.org/doc/man-pages/online/pages/man7/inotify.7.html)'
audiences: ["intermediate"]
languages: ["python"]
aliases: ['/development/monitor-filesystem-events-with-pyinotify/','/development/python/monitor-filesystem-events-with-pyinotify/']
tags: ["python"]
authors: ["Md. Sabuj Sarker"]
---

![banner_image](Monitor_Filesystem_Events_with_Pyinotify_smg.jpg)

File system monitoring through `inotify` can be interfaced through Python using `pyinotify`. This guide will demonstrate how to use a Python script to monitor a directory then explore practical uses by incorporating async modules or running additional threads.

## Install Python 3

{{< content "install_python_miniconda" >}}

## Install Pyinotify

Installing pyinotify within a virtual environment is highly recommended. This guide will use Miniconda, but `virtualenv` can also be used.

1.  Create a virtual environment in Anaconda:

        conda create -n myenv python=3

2.  Activate the new environment:

        source activate myenv

3.  Install pyinotify within the virtual environment:

        pip install pyinotify

## Set Up Filesystem Tracking

### Create an Event Processor

Similar to events in inotify, the Python implementation will be through an `EventProcessor` object with method names containing "process_" that is appended before the event name. For example, `IN_CREATE` in pyinotify though the `EventProcessor` will be `process_IN_CREATE`. The table below lists the inotify events used in this guide. In depth descriptions can be found in the [man pages of inotify](http://man7.org/linux/man-pages/man7/inotify.7.html).

| Inotify Events      | Description                                                              |
| ------------------- |:------------------------------------------------------------------------ |
| IN_CREATE           | File/directory created in watched directory                              |
| IN_OPEN             | File/directory opened in watched directory                               |
| IN_ACCESS           | File accessed                                                            |
| IN_ATTRIB           | Attributes of file/directory changed (e.g. permissions, timestamp, etc.) |
| IN_CLOSE_NOWRITE    | Non-writable file/directory closed                                       |
| IN_DELETE           | File/directory deleted from watched directory                            |
| IN_DELETE_SELF      | File/directory being watched deleted                                     |
| IN_IGNORED          | File/directory no longer watched, deleted, or unmounted filesystem       |
| IN_MODIFY           | File/directory modified                                                  |
| IN_MOVE_SELF        | File/directory moved. Must monitor destination to know destination path  |
| IN_MOVED_FROM       | File/directory moved from one watched directory to another               |
| IN_MOVED_TO         | Similar to `IN_MOVED_FROM` except for outgoing file/directory            |
| IN_Q_OVERFLOW       | Event queue overflowed                                                   |
| IN_UNMOUNT          | Filesystem of watched file/directory unmounted from system               |

Below is the full script used in this guide. The `EventProcessor` class contain methods that print out the monitored file or directory will along with the corresponding `inotify` event. This guide will breakdown the code into smaller bits.

{{< file "notify_me.py" python >}}
import os
import pyinotify


class EventProcessor(pyinotify.ProcessEvent):
    _methods = ["IN_CREATE",
                "IN_OPEN",
                "IN_ACCESS",
                "IN_ATTRIB",
                "IN_CLOSE_NOWRITE",
                "IN_CLOSE_WRITE",
                "IN_DELETE",
                "IN_DELETE_SELF",
                "IN_IGNORED",
                "IN_MODIFY",
                "IN_MOVE_SELF",
                "IN_MOVED_FROM",
                "IN_MOVED_TO",
                "IN_Q_OVERFLOW",
                "IN_UNMOUNT",
                "default"]

def process_generator(cls, method):
    def _method_name(self, event):
        print("Method name: process_{}()\n"
               "Path name: {}\n"
               "Event Name: {}\n".format(method, event.pathname, event.maskname))
    _method_name.__name__ = "process_{}".format(method)
    setattr(cls, _method_name.__name__, _method_name)

for method in EventProcessor._methods:
    process_generator(EventProcessor, method)

watch_manager = pyinotify.WatchManager()
event_notifier = pyinotify.Notifier(watch_manager, EventProcessor())

watch_this = os.path.abspath("notification_dir")
watch_manager.add_watch(watch_this, pyinotify.ALL_EVENTS)
event_notifier.loop()
{{< /file >}}

### Create a Watch Manager

Create `notify_me.py` in a text editor.

{{< file "~/notify_me.py" python >}}
import pyinotify

watch_manager = pyinotify.WatchManager()
{{< /file >}}

### Create an Event Notifier

Instantiate the `Notifier` class with an instance of `WatchManager` as the first argument and a `ProcessEvent` subclass instance as the second argument.

{{< file "notify_me.py" python >}}
event_notifier = pyinotify.Notifier(watch_manager, EventProcessor())
{{< /file >}}

### Add a Watch

1.  A watch is a file or directory to be monitored by `pyinotify`. Create a sample directory called `notification_dir` in your home directory:

      mkdir ~/notification_dir

2.  Add this directory to our file system notification system. Call `add_watch()` on the watch manager instance `watch_manager`.

    {{< file "notify_me.py" python >}}
import os

watch_this = os.path.abspath("notification_dir")
watch_manager.add_watch(watch_this, pyinotify.ALL_EVENTS)
{{< /file >}}

## Start the Watch

By looping the `Notifier` object, the directory can be monitored continuously. This loop method takes [additional parameters](http://seb.dbzteam.org/pyinotify/pyinotify.Notifier-class.html#loop), callback and daemonize, which calls a function after each iteration and daemonizes the thread respectively.

{{< file "notify_me.py" python >}}
event_notifier.loop()
{{< /file >}}

## Test Notification Script

Run the completed script and trigger the notifications.

1.  Run the script:

        python notify_me.py

2.  Open another terminal session and use `ls` to view the contents of the `notification_dir` folder:

        ls notification_dir

    This should trigger the pyinotify script in the original terminal session, and display the following output:

        Method name: process_IN_OPEN()
        Path name: /home/linode/linode_pyinotify/notification_dir
        Event Name: IN_OPEN|IN_ISDIR

        Method name: process_IN_ACCESS()
        Path name: /home/linode/linode_pyinotify/notification_dir
        Event Name: IN_ACCESS|IN_ISDIR

        Method name: process_IN_CLOSE_NOWRITE()
        Path name: /home/linode/linode_pyinotify/notification_dir
        Event Name: IN_CLOSE_NOWRITE|IN_ISDIR


    This output shows that the `ls` command involves three filesystem events. The `notification_dir` was opened, accessed, and then closed in non-writable mode.

    {{< note respectIndent=false >}}
Observe that not only files are opened but also directories are opened too.
{{< /note >}}

3.  Change the current working directory to `notification_dir` with `cd`:

        cd notification_dir

4.  Use different shell commands to manipulate files within the watched directory to fire other events:

        touch test_file.txt
        mv test_file.txt test_file2.txt
        rm test_file.txt

    Observe the output in the terminal as commands are executed in the monitored directory.

## Non-Blocking Loop

The call to `loop()` is blocking the current process in this example. Anything after the loop will not be executed because monitoring is expected to happen continuously. There are three options to workaround this problem:

 -  **Notifier with a timeout**

    When constructing the notifier, the `timeout` argument tells the `Notifier` to get notifications at certain intervals.

        event_notifier = pyinotify.Notifier(watch_manager, EventProcessor(), timeout=10)

    When using timeout, the application will not get file system change notification automatically. You need to explicitly call `event_notifier.process_events()` and `event_notifier.read_events()` at different times. Optionally call `event_notifier.check_events()` to check if there are any events waiting for processing.

 -  **ThreadedNotifier**

    We can deploy our file system notifier in a different thread. It is not necessary to create a new thread explicitly. Use the `ThreadedNotifier` class instead of `Notifier` and call `event_notifier.start()` to start event processing:

    {{< file "notify_me.py" python >}}
event_notifier = pyinotify.ThreadedNotifier(watch_manager, EventProcessor())

watch_this = os.path.abspath("notification_dir")
watch_manager.add_watch(watch_this, pyinotify.ALL_EVENTS)
event_notifier.start()
{{< /file >}}

 -  **AsyncNotifier**

    If using Python's [asynchronous feature](https://docs.python.org/3/library/asyncio.html), AsyncNotifier can be used in place of Notifier.

        event_notifier = pyinotify.AsyncNotifier(watch_manager, EventProcessor())

    Then call the `loop()` function of the `asyncore` module.

        import asyncore
        asyncore.loop()

The limitations of `inotify` also apply when using `pyinotify`. For example, recursive directories are not monitored; another instance of `inotify` must be running to track subdirectories. Although Python provides a convenient interface to `inotify`, this also results in reduced performance compared to the C implementation of `inotify`.
