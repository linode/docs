---
slug: how-to-automatically-backup-mongodb-databases-using-bash-scripting
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide, users will learn how to create a Bash script that creates a backup of all current MongoDB databases. The MongoDB backup will be in a .tar file format, and will be configured to be uploaded to a Linode object storage bucket. Then, users will learn how to configure a Cron job that automatically runs the backup script daily.'
og_description: 'In this guide, users will learn how to create a Bash script that creates a backup of all current MongoDB databases. The MongoDB backup will be in a .tar file format, and will be configured to be uploaded to a Linode object storage bucket. Then, users will learn how to configure a Cron job that automatically runs the backup script daily.'
keywords: ['bash','backup','mongodb','object storage','cron','linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-04
modified_by:
  name: Linode
title: "How to Automatically Backup Mongodb Databases Using Bash Scripting"
h1_title: "How to Automatically Backup Mongodb Databases Using Bash Scripting"
enable_h1: true
contributor:
  name: Jessie Mongeon
  link: https://www.linkedin.com/in/jessie-mongeon/
external_resources:
- '[MongoDB](https://www.mongodb.com/)'
- '[crontab](https://man7.org/linux/man-pages/man5/crontab.5.html)'
- '[nano](https://www.nano-editor.org/docs.php)'
---

MongoDB is a popular non-relationship database management system that stores keys and their values in a collection of documents rather than tables with fixed schemas. MongoDB supports a wide variety of options for horizontal scaling, making it an ideal tool for large enterprise production environments.

Backing up the data stored in a MongoDB database is an important step to maintain data integrity and disaster recovery plans. To assure this step is performed regularly, a simple Bash script can be created to backup MongoDB databases to an external source, such as a Linode Object Storage bucket. Then the Bash script can be configured to run daily using the Linux Cron job workflow.


## Before You Begin


1.  Learn about the fundamentals of Linode Object Storage by viewing the [Get Started with Object Storage](/docs/products/storage/object-storage/get-started/) documentation or by reviewing the available [Object Storage guides](/docs/products/storage/object-storage/guides/).

1.  Create a [Linode Object Storage bucket](/docs/products/storage/object-storage/guides/manage-buckets/). This bucket will be used to store your MongoDB backups.

1.  Create a pair of [Access Keys](/docs/products/storage/object-storage/guides/access-keys/) for your Linode Object Storage bucket.

1.  Install [MongoDB](/docs/guides/install-mongodb-on-ubuntu-16-04/) on your Linux system.

{{< note >}}
This guide is written using a non-root user account.
For any commands that require elevated privileges, `sudo` is prefixed at the start of the command syntax.
If you’re unfamiliar with the `sudo` command workflow, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Install Cyberduck CLI

In this guide, we'll use the [Cyberduck CLI](https://duck.sh/) for interacting with your Linode Object Storage bucket. Cyberduck CLI, also referred to as duck, is a command line interface tool that allows you to access and manage objects stored in your Linode bucket. We'll use duck for uploading our MongoDB backup files to our Linode bucket.

If you are using a Debian Linux distribution, install [duck](https://duck.sh/) with the following commands:

```
echo -e "deb https://s3.amazonaws.com/repo.deb.cyberduck.io stable main" | sudo tee /etc/apt/sources.list.d/cyberduck.list > /dev/null
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys FE7097963FEFBE72
sudo apt-get update
sudo apt-get install duck
```

If you are using a Red Hat Linux distribution, install [duck](https://duck.sh/) with the following commands:

```
echo -e "[duck-stable]\nname=duck-stable\nbaseurl=https://repo.cyberduck.io/stable/\$basearch/\nenabled=1\ngpgcheck=0" | sudo tee /etc/yum.repos.d/duck-stable.repo
sudo yum install duck
```

## Creating the Bash Script

Navigate into your user's home directory, or your desired working directory. This guide will use the `/home/linode-user` for example purposes. 
Create a new file called `backup_mongodb.sh` using the following command:

```
touch backup_mongodb.sh
```

Open this file in the nano text editor. For more information on Linux nano, check out this [documentation.](https://www.nano-editor.org/docs.php)

In the file, input the following lines of code:

{{< file "backup_mongodb.sh" sh >}}
#!/bin/bash


### Variables in this section will need to be edited to reflect your configuration.
###### Start of section

# Your Linux user's home directory
export HOME=/home/linode-user

# Your MongoDB's server hostname
HOST=localhost

# The MongoDB database to be backed up
DBNAME=LINODE_DATABASE

# Linode Object Storage bucket name. Replace this value with the name of your Linode bucket and it's associated region. This should be in the format {BUCKET_NAME}.{BUCKET_REGION}.linodeobjects.com
BUCKET=mongodb-backups.us-southeast-1.linodeobjects.com

# Linux user account
USER=linode-user

# Linode Bucket Access Key. You can use an environment variable to store your Linode Access Key, or you can store it in plain text in this script in the line below. Plain text is not recommended for production environments.
LINODE_ACCESS_KEY=$LINODEACCESSKEY

###### End of section

# Current time and date
TIME=`/bin/date +%d-%m-%Y-%T`

# Directory you'd like the MongoDB backup file to be saved to
DEST=/home/$USER/tmp

# Command to create a .tar file of the MongoDB backup files
TAR=$DEST/$TIME.tar

# Command to create the backup directory (-p to avoid warning if the directory already exists)
/bin/mkdir -p $DEST

# Echo for logging purposes
echo "Backing up $HOST/$DBNAME to Linode $BUCKET on $TIME";

# Command to run the mongodump command that dumps all data for the specified database to the backup directory
/usr/bin/mongodump -h $HOST -d $DBNAME -o $DEST

# Create the .tar file of backup directory
/bin/tar cvf $TAR -C $DEST .

# Upload the .tar to Linode
duck --username $LINODE_ACCESS_KEY --upload s3://$BUCKET/ $TAR

# Log the end of the script
echo "Backup of MongoDB databases to Linode bucket $BUCKET completed successfully."

{{< /file >}}

Refer to the comments in the code to learn what each line in the code does.


## Running the Bash Script

Before setting the script to run automatically, execute the script to configure your Linode bucket's access key pair. You will need to set the appropriate permissions for this script to be executed. For more information on Linux file permissions, review this guide on [Modifying File Permissions with chmod](/docs/guides/modify-file-permissions-with-chmod/)
 
Modify the script's permissions, then execute the script with the commands:

```
chmod 755 backup_mongodb.sh
./backup_mongodb.sh
```

Once you execute the script, enter your Linode Access keys as prompted, and choose the option to save them.

{{< note >}}
[duck](https://duck.sh/) will save your keys in a plain text file at `~.duck/credentials`. It is important to take appropriate measures to secure this file. Saving your keys in this file is necessary for them to be used when this script is run automatically.
{{< /note >}}


## Scheduling Backups as a Cron Job

Open the Cron task scheduler with the following command:

`crontab -e`

Select your preferred text editor from the menu.

Enter the following line in your Cron job file:

`0 9 * * * /path/to/backup_mongodb.sh`

Replace `/path/to/` with the full directory path to your `backup_mongodb.sh` file.

This Cron job is scheduled to run daily at 9:00 AM on your system's configured time zone. For more information on Cron job configuration parameters, review the guide [Using Cron to Schedule Tasks for Certain Times or Intervals](docs/guides/schedule-tasks-with-cron)
