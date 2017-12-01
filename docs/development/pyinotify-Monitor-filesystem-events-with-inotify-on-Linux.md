---
author:
  name: Md. Sabuj Sarker
  email: md.sabuj.sarker@gmail.com
description: 'This is a detailed guide on pyinotify. Pyinotify is a Python library for using Linux inotify. Linux inotify is a Linux kernel subsystem for monitoring file system changes'
keywords: 'inotify,pyinotify,file system change monitoring,python,linux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Saturday, November 11th, 2017'
modified: 'Saturday, November 11th, 2017'
modified_by:
  name: Md. Sabuj Sarker
title: 'pyinotify - Monitor filesystem events with inotify on Linux'
contributor:
  name: Md. Sabuj Sarker
  link: http://sabuj.me
external_resources:
- '[Github repository of pyinotify](https://github.com/seb-m/pyinotify)'
- '[Pyinotify wiki](http://github.com/seb-m/pyinotify/wiki)'
- '[Pyinotify API documentation](http://seb-m.github.com/pyinotify)'
- '[Inotify manpage](http://www.kernel.org/doc/man-pages/online/pages/man7/inotify.7.html)'
- '[Wikipedia article on inotify](https://en.wikipedia.org/wiki/Inotify)'
---

Real time file system monitoring is a big problem of various types of real life application development. In our program we can go over our file system, list every files and directories, cache their metadata and at some interval we can go over the file system over and over again and check the differences between what on the disk and what in the cache.

Working in the way described above is not efficient and may render our application unresponsive. It would be great if the kernel notified us of file system changes. That way we did not have to check each and every file and directory over and over again. In modern Linux kernels this is a built-in feature. We call this subsystem of kernel known as `inotify`. When writing our applications in Python we can use a Python library called `pyinotify` to interact with `inotify`. In this guide we will see how to work with `pyinotify` to get notified about different changes in the file system in details.



## Install Python 3

{{< section file="/shortguides/install_python_miniconda.md" >}}

## Install pyinotify

It is recommended to install pyinotify within a virtual environment. This guide will use Anaconda, but Virtualenv can also be used.

1.  Create a virtual environment in Anaconda:

        conda create -n myenv python=3

2.  Activate the new environment:

        source activate myenv

3.  Install pyinotify within the virtual environment:

        pip install pyinotify

## Understand Different Components of pyinotify
To monitor file system with `pyinotify` we need to to understand different components (classes, functions, methods along with other codes) of it to move forward. A file system notification system in `pyinotify` needs the following components:

1.  **Watch manager:**
    A watch manager is an instance of class `WatchManager` from pyinotify library.
2.  **Event processor:**
    An event processor is a subclass of `ProcessEvent`. In the subclass we need to create and override various methods for accepting and processing different file system events. We need to instantiate the subclass for interacting with the events.
3.  **Event notifier:**
    A notifier is an instance is of class `Notifier`. A notifier makes the match of the watch manager and the event processor. There are few variants of `Notifier` with different class names.
4.  **Watch:**
    A watch is an object that holds the path of files or directories that we are interested in receiving the events for, the type of file system events we are interested in and few other things. We do not need to create watches directly - they are created when we call `add_watch()` on the watch managers. Watches are instances of class `Watch`.
5.  **Event codes:**
    Event codes in pyinotify are the class attributes of EventsCodes. With the help of these codes we tell pyinotify about what event we want to monitor. These class variables can also be accessed from pyinotify module instead of directly referring to the class.
6.  **Event:**
    Events are instances of the `Event` class. These instances are passed to event processing methods. Event objects holds various information about the file system change event along with the file or directory path.

These are pretty much all the components that we need to interact with. There are few other components that pyinotify will interact with on our behalf. Along with these you may also take a look at the exceptions pyinotify throws.

## Creating a Watch Manager
Let's start our coding for pyinotify by creating a watch manager. Open the file `notify_me.py` with your preferred editor. On a server environment you can do this by using `vi`, `vim`, `emacs` or `nano` along with many other command line based editing programs.

{: .file}
notify_me.py
: ~~~ python
  import pyinotify
  watch_manager = pyinotify.WatchManager()
  ~~~

## Creating an Event Processor
As mentioned earlier, event processors are subclass of `ProcessEvent` class. But, subclassing is not the end of the story. We need to define various methods for handing events of different types. Every event processing method starts with `process_` and ends with an event code except for the default event processing method. All these methods receives an instance of `Event`. We can define the following methods:

-   **process_IN_CREATE(event):**
    This method is called when a new file or directory is created in the watched directory. You can get the directory name in which this event took place from `event.path`
-   **process_IN_OPEN(event):**
    This method is invoked when a file or directory is opened in a watched directory. For example, if you open a file in Python with the `open()` function and the directory the file is living in is being watched, this method will be invoked.

    {: .note}
    > Inexperienced programmers tend to think that directories are not opened - only files are opened. But, that is not true, files are also opened. For example, when your are invoking `listdir()` function from `os` module, it is actually opening the directory, listing the paths and closing it. We will see a proof of this statement in a later section.
-   **process_IN_ACCESS(event):**
    This method will be called when a file or directory is accessed. A very common file accessing operation is reading a file. From the perspective of python, an example of file accessing is invoking `read()` method on an open file object.
-   **process_IN_ATTRIB(event):**
    On file or directory metadata change, this method is called. For example, this method is called when the timestamp of a file or directory is changed.
-   **process_IN_CLOSE_NOWRITE(event):**
    When a non-writable file or directory is closed this method is invoked.
-   **process_IN_CLOSE_WRITE(event):**
    When a file is closed that was open in writing mode, this method is invoked. From Python's perspective, if you invoke `close()` on an open file that was open in write or update mode (in binary and text mode), this method is invoked.
-   **process_IN_DELETE(event):**
    This method is invoked when a file or directory is deleted from the watched directory.
-   **process_IN_DELETE_SELF(event):**
    This method is invoked when the directory or the file is being watched is deleted.
-   **process_IN_IGNORED(event):**
    This method is invoked when the watch is removed by calling `rm_watch()` or the file or directory is being watched is deleted or the file system on which the watched file or directory is living is unmounted.
-   **process_IN_MODIFY(event):**
    This method is invoked when a watched file is modified. For example, when you call `write()` method on an open file in Python.
-   **process_IN_MOVE_SELF(event):**
    This method is invoked when the watched file or directory is moved in another directory or file system. If the destination directory is not being monitored, it is not possible to know where the file or directory was moved to.
-   **process_IN_MOVED_FROM(event):**
    This method is invoked when a file or directory is moved to an watched directory. Remember that this method will only be invoked in the watched directory if the file or directory was in a directory that is also being watched.
-   **process_IN_MOVED_TO(event):**
    Like `process_IN_MOVED_FROM`, this method is invoked when a file or directory is moved to another watched directory.
-   **process_IN_Q_OVERFLOW(event):**
    The kernel has limitations on how many files or directories an application can monitor. This method is invoked when the limit is crossed - that is the event queue is overflowed. This method is defined in the `ProcessEvent` class. By default, it only reports warning messages. To provide a custom behavior to it, override this method in your subclass.
-   **process_IN_UNMOUNT(event):**
    This is invoked when the file system on which the watched file or directory is living is unmounted from the system.
-   **process_default(event):**
    This is the default event processing method. That means, if an appropriate method for an event type is not defined in the event processor subclass, this method is called. But remember that this method is not called for the event type `IN_Q_OVERFLOW` no matter whether the method is overridden or not. This method is defined in the `ProcessEvent` class that does nothing. Override it to provide custom behavior.

Enough theory! Now, let's get our hand dirty with coding. We will implement and override all the methods mentioned above. In our methods we are just going to write code to show the name of the method by which the event is being processed, the event name and the path name.

{: .note}
> `maskname` on the event object is the name of the event. It can be combination of more than one events. Event masks are combined by bitwise or '|' operator. Event codes are represented with event masks.

{: .file}
notify_me.py
: ~~~ python
  class EventProcessor(pyinotify.ProcessEvent):

      def process_IN_CREATE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_CREATE", event.pathname, event.maskname))

      def process_IN_OPEN(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_OPEN", event.pathname, event.maskname))

      def process_IN_ACCESS(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_ACCESS", event.pathname, event.maskname))

      def process_IN_ATTRIB(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_ATTRIB", event.pathname, event.maskname))

      def process_IN_CLOSE_NOWRITE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_CLOSE_NOWRITE", event.pathname, event.maskname))

      def process_IN_CLOSE_WRITE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_CLOSW_WRITE", event.pathname, event.maskname))

      def process_IN_DELETE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_DELETE", event.pathname, event.maskname))

      def process_IN_DELETE_SELF(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_DELETE_SELF", event.pathname, event.maskname))

      def process_IN_IGNORED(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_IGNORED", event.pathname, event.maskname))

      def process_IN_MODIFY(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MODIFY", event.pathname, event.maskname))

      def process_IN_MOVE_SELF(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MOVE_SELF", event.pathname, event.maskname))

      def process_IN_MOVED_FROM(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MOVED_FROM", event.pathname, event.maskname))

      def process_IN_MOVED_TO(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MOVED_TO", event.pathname, event.maskname))

      def process_IN_Q_OVERFLOW(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_Q_OVERFLOW", event.pathname, event.maskname))

      def process_IN_UNMOUNT(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_UNMOUNT", event.pathname, event.maskname))

      def process_default(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("default", event.pathname, event.maskname))

  ~~~

## Creating Event Notifier
An event notifier is created by instantiating the `Notifier` class with an instance of `WatchManager` as the first argument and a `ProcessEvent` subclass instance as the second argument. There are three other non-required keyword arguments that we are not going to use or discuss in this guide.

{: .file}
notify_me.py
: ~~~ python
  event_notifier = pyinotify.Notifier(watch_manager, EventProcessor())
  ~~~

## Adding Watch
By adding watch we mean to add files or directories to be watched for file system change events. Let's create a directory in the directory where `notify_me.py` is living. Let's name it `notification_dir`. We want to add this directory to our file system notification system for watching change events. We need to call `add_watch()` on our watch manager instance `watch_manager`.

{: .file}
notify_me.py
: ~~~ python
  import os
  watch_this = os.path.abspath("notification_dir")
  watch_manager.add_watch(watch_this, pyinotify.ALL_EVENTS)
  ~~~

## Starting to Watch
Adding a watch does not start watching the files or directories in the file system until we tell our event notifier to do so. Let's start monitoring our file system by calling `loop()` on the notifier.

{: .file}
notify_me.py
: ~~~ python
  event_notifier.loop()
  ~~~

## Putting the Pieces of the Puzzle Together
If we put different parts of our python code together, we get this:

{: .file}
notify_me.py
: ~~~ python
  import os
  import pyinotify
  watch_manager = pyinotify.WatchManager()


  class EventProcessor(pyinotify.ProcessEvent):

      def process_IN_CREATE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_CREATE", event.pathname, event.maskname))

      def process_IN_OPEN(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_OPEN", event.pathname, event.maskname))

      def process_IN_ACCESS(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_ACCESS", event.pathname, event.maskname))

      def process_IN_ATTRIB(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_ATTRIB", event.pathname, event.maskname))

      def process_IN_CLOSE_NOWRITE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_CLOSE_NOWRITE", event.pathname, event.maskname))

      def process_IN_CLOSE_WRITE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_CLOSW_WRITE", event.pathname, event.maskname))

      def process_IN_DELETE(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_DELETE", event.pathname, event.maskname))

      def process_IN_DELETE_SELF(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_DELETE_SELF", event.pathname, event.maskname))

      def process_IN_IGNORED(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_IGNORED", event.pathname, event.maskname))

      def process_IN_MODIFY(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MODIFY", event.pathname, event.maskname))

      def process_IN_MOVE_SELF(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MOVE_SELF", event.pathname, event.maskname))

      def process_IN_MOVED_FROM(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MOVED_FROM", event.pathname, event.maskname))

      def process_IN_MOVED_TO(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_MOVED_TO", event.pathname, event.maskname))

      def process_IN_Q_OVERFLOW(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_Q_OVERFLOW", event.pathname, event.maskname))

      def process_IN_UNMOUNT(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("IN_UNMOUNT", event.pathname, event.maskname))

      def process_default(self, event):
          print("Method name: process_%s()\nPath name: %s\nEvent Name: %s\n" % ("default", event.pathname, event.maskname))

  event_notifier = pyinotify.Notifier(watch_manager, EventProcessor())

  watch_this = os.path.abspath("notification_dir")
  watch_manager.add_watch(watch_this, pyinotify.ALL_EVENTS)
  event_notifier.loop()
  ~~~


## Making File System Changes and Watching Results
To see our file system notification python script in action run the following command:

    python3 notify_me.py

Now, open another terminal session to make some changes to the file system. Change the working directory of the command line to the directory where your `notify_me.py` file lives.

Run the following command:

    ls notification_dir

You will see output like below:

    Method name: process_IN_OPEN()
    Path name: /home/sabuj/Desktop/linode_pyinotify/notification_dir
    Event Name: IN_OPEN|IN_ISDIR

    Method name: process_IN_ACCESS()
    Path name: /home/sabuj/Desktop/linode_pyinotify/notification_dir
    Event Name: IN_ACCESS|IN_ISDIR

    Method name: process_IN_CLOSE_NOWRITE()
    Path name: /home/sabuj/Desktop/linode_pyinotify/notification_dir
    Event Name: IN_CLOSE_NOWRITE|IN_ISDIR


When we told our system to list directory with the help of `ls` command it threw three events. It told us that the `notification_dir` was opened, then accessed and then closed in non-writable mode.

{: .note}
> In a previous section it was said that not only files are opened but also directories are opened too. You can see the proof in the above output.

Now, change the current working directory of the terminal or command line to `notification_dir` with `cd` command:

    cd notification_dir


Try different other shell commands to fire other events and as a result invocation of different other methods. Below are few examples:

-   Creating a file:

        touch a_file.txt

-   Renaming a file:

        mv a_file.txt

-   Deleting a file:

        rm a_file.txt


## The Non-blocking Way
In the example shown in this guide, the call to `loop()` is blocking the current process. If we want our Python script to do  anything else, it will not be able to do that. But, a real life application does many thing at the same time. We have three other options to do the same in a non-blocking responsive fashion.

-   Notifier with a timeout:
    At the time of constructing the notifier we can use the `timeout` keyword argument to tell our notifier to get change notification at certain interval.

            event_notifier = pyinotify.Notifier(watch_manager, EventProcessor(), timeout=10)

    When using timeout, the application will not get file system change notification automatically. You need to explicitly call `event_notifier.process_events()` and `event_notifier.read_events()` at different times. Optionally you can call `event_notifier.check_events()` to check if there is any events waiting for being processed.

-   Using Thread:
    To make our application responsive, we can deploy our file system notifier in a different thread. But, it is not necessary to create thread explicitly. We can use `ThreadNotifier` class instead of `Notifier` and call `event_notifier.start()` to start event processing.

-   Using AsyncNotifier:
    If your Python application is using Python's asynchronous feature then you can use AsyncNotifier instead of Notifier.

        event_notifier = pyinotify.AsyncNotifier(watch_manager, EventProcessor())

    And then just call the `loop()` function of the `asyncore` module.

        import asyncore
        asyncore.loop()


## More Information
You might be interested in digging deeper and more getting information about `inotify` and `pyinotify`. Below are few links that may help you.
