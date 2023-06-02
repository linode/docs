---
slug: start-service-at-boot
description: The systemd daemon allows you to control Linux system services. This guide shows how to configure a custom systemd service and enable it to start at boot.
keywords: ["systemd","service","enable service","Linux system service"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-01
modified_by:
  name: Linode
published: 2018-05-01
title: Use systemd to Start a Linux Service at Boot
external_resources:
  - '[systemd – Wikipedia](https://en.wikipedia.org/wiki/Systemd)'
  - '[systemd man page](http://man7.org/linux/man-pages/man1/init.1.html)'
  - '[systemd Documentation](https://www.freedesktop.org/wiki/Software/systemd/)'
tags: ["linux"]
aliases: ['/quick-answers/linux/start-service-at-boot/']
authors: ["Linode"]
---

## What is systemd?

systemd is a Linux system tool initially developed by the Red Hat Linux team. It includes many features, including a bootstrapping system used to start and manage system processes. It is currently the default initialization system on most Linux distributions. Many commonly used software tools, such as SSH and Apache, ship with a systemd service.

It is simple to create a custom systemd service that will run any script or process you choose. Although there are several ways to run a script or start a process when your Linode boots, a custom systemd service makes it easy to start, stop, or restart your script, as well as configure it to start automatically on boot. systemd offers the advantage of using a standardized interface that is consistent across all [Linux distributions that support it](https://en.wikipedia.org/wiki/Systemd#Adoption).

## Create a Custom systemd Service

1.  Create a script or executable that the service will manage. This guide uses a simple Bash script as an example:

    {{< file "test_service.sh" bash >}}
DATE=`date '+%Y-%m-%d %H:%M:%S'`
echo "Example service started at ${DATE}" | systemd-cat -p info

while :
do
echo "Looping...";
sleep 30;
done
{{< /file >}}

    This script will log the time at which it is initialized, then loop infinitely to keep the service running.

2.  Copy the script to `/usr/bin` and make it executable:

        sudo cp test_service.sh /usr/bin/test_service.sh
        sudo chmod +x /usr/bin/test_service.sh

3.  Create a **Unit file** to define a systemd service:

    {{< file "/lib/systemd/system/myservice.service" conf >}}
[Unit]
Description=Example systemd service.

[Service]
Type=simple
ExecStart=/bin/bash /usr/bin/test_service.sh

[Install]
WantedBy=multi-user.target
{{< /file >}}

    This defines a simple service. The critical part is the `ExecStart` directive, which specifies the command that will be run to start the service.

4.  Copy the unit file to `/etc/systemd/system` and give it permissions:

        sudo cp myservice.service /etc/systemd/system/myservice.service
        sudo chmod 644 /etc/systemd/system/myservice.service

    For more information about the unit file and its available configuration options, see the [systemd documentation](https://www.freedesktop.org/wiki/Software/systemd/).

## Start and Enable the Service

1.  Once you have a unit file, you are ready to test the service:

        sudo systemctl start myservice


2.  Check the status of the service:

        sudo systemctl status myservice

    If the service is running correctly, the output should resemble the following:

    {{< output >}}
● myservice.service - Example systemd service.
   Loaded: loaded (/lib/systemd/system/myservice.service; enabled; vendor preset: enabled)
   Active: active (running) since Tue 2018-05-01 18:17:14 UTC; 4s ago
 Main PID: 16266 (bash)
    Tasks: 2
   Memory: 748.0K
      CPU: 4ms
   CGroup: /system.slice/myservice.service
           ├─16266 /bin/bash /usr/bin/test_service.sh
           └─16270 sleep 30

May 01 18:17:14 localhost systemd[1]: Started Example systemd service..
May 01 18:17:14 localhost cat[16269]: Example service started at 2018-05-01 18:17:14
May 01 18:17:14 localhost bash[16266]: Looping...
{{< /output >}}

3.  The service can be stopped or restarted using standard systemd commands:

        sudo systemctl stop myservice
        sudo systemctl restart myservice

4.  Finally, use the `enable` command to ensure that the service starts whenever the system boots:

        sudo systemctl enable myservice

    {{< output >}}
Created symlink from /etc/systemd/system/multi-user.target.wants/myservice.service to /lib/systemd/system/myservice.service.
{{< /output >}}

5.  Reboot your Linode from the Linode Manager and check the status of the service:

        sudo systemctl status myservice

    You should see that the service logged its start time immediately after booting:

    {{< output >}}
● myservice.service - Example systemd service.
   Loaded: loaded (/usr/lib/systemd/system/myservice.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2018-05-02 15:03:07 UTC; 48s ago
 Main PID: 2973 (bash)
   CGroup: /system.slice/myservice.service
           ├─2973 /bin/bash /usr/bin/test_service.sh
           └─3371 sleep 30

May 02 15:03:07 localhost systemd[1]: Started Example systemd service..
May 02 15:03:07 localhost systemd[1]: Starting Example systemd service....
May 02 15:03:07 localhost bash[2973]: Looping...
May 02 15:03:37 localhost bash[2973]: Looping...
{{< /output >}}

For more information about using `systemctl` commands, see the [systemctl guide](/docs/guides/introduction-to-systemctl).


## Troubleshooting

- "Example service started at ..." line does not appear in the output of the status command. The `systemd-cat` output is not reliable because of a race condition. As a workaround update the `test_service.sh` file as follows:
{{< file "test_service.sh" bash >}}
info=/tmp/myservice-systemd-cat-pipe-info
mkfifo "$info"
trap "exec 3>&-; rm $info" EXIT
systemd-cat -p info < "$info" &
exec 3>"$info"

DATE=`date '+%Y-%m-%d %H:%M:%S'`
echo "Example service started at ${DATE}" > "$info"

while :
do
echo "Looping...";
sleep 30;
done
{{< /file >}}  
