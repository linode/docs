# Setup A Mumble Server On Debian

Mumble is an open source VoIP client that is designed for gamers.  Mumble requires use of a server for all of the clients to connect to and this guide shows how to install and configure the Mumble server (also called Murmur) on Debian 8.

This guide requires nothing to be done on the system beforehand.

All commands are ran as root in this guide.  If you are not root, you can use sudo for this.  Just prepend sudo to all the commands.

## Install and Simple Setup

1. Since murmur is in the official Debian repositories, we can just use apt-get to install it.  Be careful though, the package is `mumble-server` and not `murmur`.

```
apt-get install mumble-server
```

2. After you install it, you can use `dpkg-reconfigure` to do the initial setup.

The first question it will ask is if you want the server to run at boot.  This is the same as using the command `systemctl enable mumble-server`.

[IMAGE]

If you want murmur to have a highter priority over other applications on the server, you can answer yes here.

[IMAGE]

Now it will ask you to set a SuperUser password.  Murmur has a SuperUser account that you can change the settings for the server in Mumble on the client.  Set it to whatever you want.

[IMAGE]

You now have a working mumble server.  Now it's time to configure it.

## More Configuration

If you need more configuration, such as port numbers and maximum users, murmur has a settings file at `/etc/mumble-server.ini`.  Here's a list of settings that are included.  There are more settings than listed and are further explained in the settings file.

- **autobanAttempts** - How many times someone can fail to connect to the server within the timeframe.
- **autobanTimeframe** - This is the timeframe for the previous setting.
- **autobanTime** - The amount of time that the ban lasts.
- **logfile** - Location of the log file, if you want it in a different place.
- **welcometext** - The text that shows in the text chat log when you log in.
- **port** - The port you wish to bind to and have your users connect to.
- **serverpassword** - A password that users will have to use to log in.  This is not the same as the SuperUser password and should be different.
- **bandwidth** - The maximum bandwith (in bits per second) each user can use.
- **users** - The maximum users that can connect to the server at once.

Once you are done setting the settings in that file, save it and restart murmur.

For Debian 8:

```
systemctl restart mumble-server
```

For Debian 7 or earlier:

```
service mumble-server restart
```

## Extra Information

If you wish to disable the server starting at boot, you can use your init system to disable it.

For Debian 8

```
systemctl disable mumble-server
```

For Debian 7 or earlier:

```
service mumble-server disable
```

For more information on mumble and murmur, you can visit the [Mumble Wiki](http://wiki.mumble.info/wiki/Main_Page).
