---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'This guide will show how to track and visualize data from an Internet of Things device using Thingsboard.'
og_description: 'This guide shows how to install the Thingsboard open source dashboard for Internet of Things devices. A Raspberry Pi is used to demonstrate sending data to the cloud dashboard.'
keywords: ["iot", "raspberry pi", "internet of things", "dashboard"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-01-05
modified: 2017-01-05
modified_by:
  name: Linode
title: 'Analyze IoT Data with Thingsboard'
external_resources:
  - '[Getting Started – Thingsboard](https://thingsboard.io/docs/getting-started-guides/helloworld)'
  - '[Thingsboard Github Repo](https://github.com/thingsboard/thingsboard)'
---

[Thingsboard](https://thingsboard.io/) is an open source platform for tracking and visualizing data from Internet of Things devices. Data from any number of devices can be sent to a cloud server, where it can be viewed or shared through a highly customizable dashboard.

This guide will show how to install Thingsboard on a Linode and use a Raspberry Pi to send simple telemetry data to a cloud dashboard.

{{< note >}}
This guide will use a Raspberry Pi 3 with a Sense Hat. You can substitute any device capable of sending telemetry data, or use `curl` to experiment with Thingsboard without using any external devices.
{{< /note >}}

## Install Thingsboard

### Install Java

Thingsboard runs on Java 8, and the Oracle JDK is recommended.

{{< section file="/shortguides/java/install-java-jdk.md" >}}

### Set Up PostgreSQL

1.  Install PostgreSQL:

        sudo apt install postgresql postgresql-contrib

2.  Create a database and database user for Thingsboard:

        sudo -u postgres createdb thingsboard
        sudo -u postgres createuser thingsboard

3.  Set a password for the `thingsboard` user and grant access to the database:

        sudo -u postgres psql thingsboard
        ALTER USER thingsboard WITH PASSWORD 'thingsboard';
        GRANT ALL PRIVILEGES ON DATABASE thingsboard TO thingsboard;
        \q

### Install Thingsboard

1.  Download the installation package. Check the [releases](https://github.com/thingsboard/thingsboard/releases) page and replace the version numbers in the following command with the version tagged **Latest release**:

        wget https://github.com/thingsboard/thingsboard/releases/download/v1.3.1/thingsboard-1.3.1.deb

2.  Install Thingsboard:

        sudo dpkg -i thingsboard-1.3.1.deb


3.  Open `/etc/thingsboard/conf/thingsboard.yml` in a text editor and comment out the `HSQLDB DAO Configuration` section:

    {{< file-excerpt "/etc/thingsboard/conf/thingsboard.yml" >}}
# HSQLDB DAO Configuration
#spring:
#  data:
#    jpa:
#      repositories:
#        enabled: "true"
#  jpa:
#    hibernate:
#      ddl-auto: "validate"
#    database-platform: "org.hibernate.dialect.HSQLDialect"
#  datasource:
#    driverClassName: "${SPRING_DRIVER_CLASS_NAME:org.hsqldb.jdbc.JDBCDriver}"
#    url: "${SPRING_DATASOURCE_URL:jdbc:hsqldb:file:${SQL_DATA_FOLDER:/tmp}/thingsboardDb;sql.enforce_size=false}"
#    username: "${SPRING_DATASOURCE_USERNAME:sa}"
#    password: "${SPRING_DATASOURCE_PASSWORD:}"
{{< /file-excerpt >}}

4.  In the same section, uncomment the PostgreSQL configuration block. Replace `postgres` in the username and password fields with the username and password of your `thingsboard` user:

    {{< file-excerpt >}}
# PostgreSQL DAO Configuration
spring:
  data:
    jpa:
      repositories:
        enabled: "true"
  jpa:
    hibernate:
      ddl-auto: "validate"
    database-platform: "org.hibernate.dialect.PostgreSQLDialect"
  datasource:
    driverClassName: "${SPRING_DRIVER_CLASS_NAME:org.postgresql.Driver}"
    url: "${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/thingsboard}"
    username: "${SPRING_DATASOURCE_USERNAME:postgres}"
    password: "${SPRING_DATASOURCE_PASSWORD:postgres}"
{{< /file-excerpt >}}

5.  Run the installation script:

        sudo /usr/share/thingsboard/bin/install/install.sh --loadDemo

6.  Start the Thingsboard service:

        sudo systemctl enable thingsboard
        sudo systemctl start thingsboard

## NGINX Reverse Proxy

By default, Thingsboard listens on `localhost:8080`. For security purposes, it is better to serve the dashboard through a reverse proxy. This guide will use NGINX, but Apache can also be used.

1.  Install NGINX:

        sudo apt install nginx

2.  Open `/etc/nginx/sites-enabled/default` in a text editor and edit it as follows. Replace `example.com` with the public IP address or FQDN of your Linode.

    {{< file "/etc/ngins/sites-enabled/default" aconf >}}
server {
    listen 80;
    listen [::]:80;

    server_name example.com;

    location / {
        # try_files $uri $uri/ =404;
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
{{< /file >}}

3.  Restart NGINX:

        sudo systemctl restart nginx

## Set Up Thingsboard Device

1.  Navigate to your Linode's IP address in a web browser. You should see the Thingsboard login page:

    ![Thingsboard Login](/docs/assets/thingsboard/login.png)

    The demo account is `tenant@thingsboard.org` and the password is `tenant`.

2.  From the main menu, click on the **Devices** icon, then click the **+** icon in the lower right to add a new device.

3.  Choose a name for your device. Set the **Device type** to **PI**.

3.  After the device is added, click on its icon in the **Devices** menu. Click on **COPY ACCESS TOKEN** to copy the API key for this device (used below).

## Configure Raspberry Pi

{{< note >}}
The following steps assume that you have terminal access to a Raspberry Pi, and that the Sense HAT and its libraries are already configured. For more information on getting started with the Sense HAT, see the Raspberry Pi [official documentation](https://projects.raspberrypi.org/en/projects/getting-started-with-the-sense-hat).
{{< /note >}}

### Basic Python Script

1.  Using a text editor, create `thingsboard.py` in a directory of your choice. Add the following content, using the API key copied to your clipboard in the previous section:

    {{< file "thingsboard.py" >}}
#!/usr/bin/env python

import json
import requests
from sense_hat import SenseHat
from time import sleep

# Constants

API_KEY          = "<Thingsboard API Key>"
THINGSBOARD_HOST = "<Linode Public IP Address>"

thingsboard_url  = "http://{0}/api/v1/{1}/telemetry".format(THINGSBOARD_HOST, API_KEY)

sense = SenseHat()


data = {}

while True:
    data['temperature'] = sense.get_temperature()
    data['pressure']    = sense.get_pressure()
    data['humidity']    = sense.get_humidity()

    #r = requests.post(thingsboard_url, data=json.dumps(data))
    print(str(data))
    sleep(5)
{{< /file >}}

3.  Test the script by running it from the command line:

        python thingsboard.py

    Basic telemetry should be printed to the console every five seconds:

    {{< output >}}
{'pressure': 1020.10400390625, 'temperature': 31.81730842590332, 'humidity': 19.72637939453125}
{'pressure': 1020.166259765625, 'temperature': 31.871795654296875, 'humidity': 20.247455596923828}
{'pressure': 1020.119140625, 'temperature': 31.908119201660156, 'humidity': 19.18065643310547}
{'pressure': 1020.11669921875, 'temperature': 31.908119201660156, 'humidity': 20.279142379760742}
{'pressure': 1020.045166015625, 'temperature': 31.92628288269043, 'humidity': 20.177040100097656}
{{< /output >}}

4.  If the script is working correctly,
