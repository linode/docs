---
author:
  name: Linode
  email: docs@linode.com
description: Backing Up Your Linode
keywords: ["backup", "backups", "rsync", "cron", "getting started", "tutorial"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2013-04-04
modified_by:
  name: Linode
published: 2013-04-04
title: Backing Up Your Data
external_resources:
 - '[rsync Man Page](http://linux.die.net/man/1/rsync)'
 - '[WebGnuru''s rsync Tutorial](http://webgnuru.com/linux/rsync_incremental.php)'
---

Now that you've set up your Linode and uploaded content, you'll want to start backing up your data so you don't lose your work. The data stored on your Linode can become corrupted or inaccessible for any number of reasons - accidental deletions, misconfigurations, hacking, or even software updates that don't play nicely with the rest of your configuration. Having a recent backup on hand will turn a major headache into "Oops. Undo."

## Assessing Your Needs

Everyone should have at least one backup on hand. Backups, however, are not necessarily one-size-fits-all. Before you jump into making your first backup (or creating a recurring backup schedule), take a minute to consider what you need to back up and how you want to do it.

### What to Back Up

Think about the things on your Linode that would be difficult or impossible to replace if they were lost. You might want to create a list. Here are some common examples of data that should be backed up:

-   **CMS websites**: Database-driven websites, such as websites made with WordPress, Drupal, or Magento, use a database to store content. Make sure you include a database dump in your backup.
-   **HTML websites**: If you have fairly standard HTML websites, you can probably just back up your public directory.
-   **Email**: If you use your Linode as a mail server, you should back up your raw email files.
-   **Media**: Make sure you back up your images, videos, and audio files.
-   **Customer data**: Customer data from sales and financial transactions are often stored in a database, so you'll want to include a database dump in your backup.
-   **Custom backend**: If your Linode is highly customized (or even if it just took you a long time to set up), think about backing up your entire Linode from the root level, or at least your software configuration settings, in addition to your public-facing content.

Have your list? Now find where those files are on your server, and write down the specific file paths and databases that you want to back up. If you're not sure how much is enough, be safe and copy everything.

The type of backup that you make is important, too, because its format affects what you can do with it later. You should think about the circumstances under which you will be making the restoration, so that you make the right kind of backup. There are two basic types of backups:

-   **File-system backup**: Copying all or part of your file system, along with its structure and permissions, is good for HTML files, software configuration files, email (more or less), and media. If you later restore the copied file system to a Linode, it should work the way it did before. A full-server snapshot backup is a complete file-system backup that preserves your entire server from a specific point in time. If you back up the files without preserving their permissions, you'll at least have the content, but it may take a lot longer to get the restoration working.
-   **Database dump**: File-system backups are not always the best choice for database backups. A full-server snapshot will of course also restore your databases, but raw database files are fairly useless in a partial backup context. Running a MySQL dump or something similar is better: you will get a human-readable file full of MySQL commands, which you can import to any other MySQL server.

Decide whether you need a file-system backup, a database dump, or both. If you need both, the database dump can be made first, and then the dump file saved as part of a file-system backup.

### When to Back Up

The next consideration is how often you need to back up your data. This decision should be based on how often the content on your server changes, and how critical it is that you capture those changes. Here are some common backup intervals:

-   **Online store**: At least daily
-   **Blog or news site**: As often as you update it
-   **Development server**: As often as you make changes
-   **Game server**: At least daily
-   **Static site**: Every six months, or before and after making significant changes
-   **Email server**: At least daily

Your requirements should help you decide whether you can use a manual backup tool, or whether you need to automate the process.

### Where to Store Backups

Next, think about where you want to store your backups. Here are some of the most popular storage locations:

-   **Same server**: This is the easiest place to store your backups, but if your server gets hacked at the root level or accidentally erased, your backups will disappear too.
-   **Different server**: You can store your backups on a different Linode, or a non-Linode server. This is the most secure option. You can use a Linode in a different data center if you're really paranoid.
-   **Personal device**: You can back up to your desktop computer or a portable hard drive. However, your home office is probably not as secure as a professional data center, and your hardware is probably not as hardy.

You should also think about how many backups your storage platform can hold. Most people will want to save *at least* two backups (an older, reliable one and a recent one), and possibly every backup. The more the better, until you run out of disk space.

### Backup Rotation

Finally, you should decide how long to keep your old backups and how many to store at once. While one backup is better than none, most people will want *at least two.* Why? An older backup is more reliable, and a newer backup has your recent changes. For example, if you replace your backup every day, and don't keep any of your old ones, you would be out of luck if you discovered that your website had been hacked a week ago. The safest option is to store backups as frequently as possible without overwriting them. Just make sure that you don't run out of space on your backup machine! Backup types that include compression and other efficiencies make it easier to store multiple backups.

## Finding the Right Backup Utility

Now that you've learned about the importance of backing up your data, you'll need to select one or more backup utilities. This section can help you decide on a tool. At this point, you should have a good idea of the following:

-   What files and databases you want to back up
-   When you need to make new backups
-   Where you want to store your backups
-   How many old backups you want to keep on file

We'll evaluate seven different backup utilities to see how they meet these criteria.

### Linode's Backup Service

[Linode's Backup Service](http://www.linode.com/backups/) is a hassle-free backup service for your Linode. You can administer everything through the Linode Manager. This is a safe and easy-to-use option.

-   **What**: Full-server file system backup.
-   **When**: Snapshots are automatically created daily.
-   **Where**: The files are stored in our secure data centers.
-   **Rotation**: Backups are rotated automatically so you'll always have a daily, weekly, and bi-weekly backup. You can also store one snapshot of your choice indefinitely.

To configure Linode's Backup Service for your Linode, follow [these instructions](/docs/backup-service).

### Linode's Disks

You can use the Linode Manager to [duplicate your Linode's disk](/docs/disk-images-config-profiles). This is not a backup utility *per se*, but it is a quick and easy way to create a full snapshot of your Linode. Once you've duplicated the disk, you can boot it or clone it to a different Linode.

-   **What**: Full-server file system backup.
-   **When**: Duplicate disks are created manually. You have to shut down your server to make a new disk.
-   **Where**: The disk is stored on your Linode.
-   **Rotation**: Manual. The number of backups you can store at once depends on how small you make the disks.

See [this article](/docs/disk-images-config-profiles) to learn more about disks.

### Rsync

Rsync is a free file copying utility that we highly recommend. It's a great backup tool for several reasons:

-   Simple configuration. Many advanced options are also available.
-   Easy automation. Rsync commands can be set as cron jobs.
-   Efficient. Rsync only updates the files that have changed, which saves time and disk space.

You need a basic level of comfort with the command line to make the initial backups and to restore your files.

-   **What**: You set the file path for this file-system backup.
-   **When**: The basic command is manual, but you can set it to run automatically with cron. Later, you'll learn how to set up automatic daily backups with rsync.
-   **Where**: You set the destination. You can back up to a different folder on your server, a different Linux server, or your home computer. As long as you can establish an SSH connection between the two machines and they're both capable of running rsync, you can store your backups anywhere.
-   **Rotation**: Basic rotation is manual. However, with the right options, you can store all of your old backups in a minimal amount of space. This will be covered later.

Because this is such a versatile tool, we'll be presenting three brief tutorials to configure backups with rsync at the end of this guide. You can also read more about rsync [here](/docs/linux-tools/utilities/rsync).

### MySQL Backups

The data stored in your database can change quickly. Running a MySQL dump is arguably the best way to back it up. If you create a snapshot or perform another type of backup that just copies your files, your raw database files will be preserved and should be restored properly in the context of a full-server snapshot restoration, but this may not be what you need.

-   **What**: MySQL databases and tables.
-   **When**: The basic command is manual, but you can set it to run automatically with cron.
-   **Where**: The backup file is saved on your server or downloaded to your home computer by default. You can move the file somewhere else if you want it stored in a different location.
-   **Rotation**: Basic rotation is manual.

To make human-readable backups of your databases that can be imported to a new database server, [follow these instructions](/docs/databases/mysql/backup-options).

### Tar

Tar can copy and compress the files on your Linode into a small backup file. This has several advantages: It saves space on your backup machine, it reduces the amount of transfer used if you're saving your backup to a remote location, and it makes it easier to manipulate the backup since you're dealing with just one file. On the other hand, you'll have to uncompress your backup file to make it usable for restoration. You can't just browse through it looking for one folder.

-   **What**: You set the file path for this file-system backup.
-   **When**: The basic command is manual, but you can set it to run automatically with cron.
-   **Where**: By default, the archive file is created on the server itself. If you want to move it somewhere else, you'll have to set that up manually.
-   **Rotation**: Basic rotation is manual. The compressed nature of the backup makes it easier to store multiple copies.

Here's a basic example tar command:

    tar pczvf my_backup_file.tar.gz /path/to/source/content

Explanation of flags:

-   p or --preserve-permissions: Preserves permissions
-   c or --create: Creates a new archive
-   z or --gzip: Compresses the archive with gzip
-   v or --verbose: Shows which files were processed
-   f or --file=ARCHIVE: Tells us that the next argument is the name for the new archive file

For a more detailed discussion of tar and more examples, see [Archiving and Compressing files with GNU Tar and GNU Zip](/docs/tools-reference/tools/archiving-and-compressing-files-with-gnu-tar-and-gnu-zip).

### Unison

Unison is a file synchronization tool. It can be used to replicate a file system and later merge changes between the two systems. If you keep the two systems synchronized, this is a great way to keep your backup up to date, but keep in mind that if you got hacked a month ago, and have synched since then, your backup will be hacked too. If you don't keep the systems synchronized, this functions as a snapshot-style backup system.

-   **What**: You set the file path for this file-system backup.
-   **When**: The basic command is manual.
-   **Where**: You can back up to a different server running Unison, or a different disk on your Linode.
-   **Rotation**: Only one backup is stored. It will be from the date you last synched the servers.

For more information, see [Synchronize Files with Unison](/docs/linux-tools/unison) and the [Unison Manual](http://www.cis.upenn.edu/~bcpierce/unison/download/releases/stable/unison-manual.html).

### Rdiff-backup

Rdiff-backup is a utility designed to make incremental backups. As their [website](http://rdiff-backup.nongnu.org) states, "the idea is to combine the best features of a mirror and an incremental backup." You end up with a replicated version of your file system, with the ability to go back to older files as well.

-   **What**: You set the file path for this file-system backup.
-   **When**: The basic command is manual, but you can set it up to run automatically with cron.
-   **Where** : You set the destination. You can back up to a different folder on your server, a different Linux server, or your home computer.
-   **Rotation**: Both old and new files are kept.

For information, see [Using Rdiff-backup with SSHFS](/docs/linux-tools/rdiff-backup).

## Making a Manual Backup

Now that you've learned about the backup utilities, it's time to use one. We'll use rsync throughout this guide, but you can use any utility to back up the server. This section explains how to perform a one-time manual backup with rsync.

-   **What**: You set the file path for this file-system backup.
-   **When**: This is a one-time backup.
-   **Where**: The files will get stored on the machine from which you are running the command, so make sure you're logged into the server or computer where you want to store your backups.
-   **Rotation**: This tutorial does not include any automatic rotation.

Throughout this guide, we will refer to the Linode you want to back up as your *production\_server*. We will refer to the server or computer where you are storing your backups as the *backup\_server* or *personal\_computer*. The examples given are for a *production\_server* running Ubuntu 12.04 LTS and several types of *backup\_servers* and *personal\_computers*.

Here's how to make a manual backup of your Linode:

1.  Install rsync on your Linode and *backup\_server* by entering the following command:

        sudo apt-get install rsync

2.  Run the rsync command from your *backup\_server* or *personal\_computer*:

        rsync -ahvz user@production_server:/path/to/source/content /path/to/local/backup/storage/

    {{< note >}}
For a deeper explanation of the rsync command's options and arguments, and to learn how to customize the command, please see the [Understanding the Rsync Command](#understanding-the-rsync-command) section of this guide.
{{< /note >}}

3.  Type your SSH password for the *production\_server* when prompted. You will be able to see your files listed as they are copied. At the end, you should see a confirmation message like this:

        sent 100 bytes  received 2.76K bytes  1.90K bytes/sec
        total size is 20.73K  speedup is 7.26

That's it! You can double-check the folder you designated as your local storage folder to make sure everything copied over correctly. In the next sections, we'll discuss how to automate your backups.

## Setting Up Automatic Backups to a Linux Server

In this section, you'll use rsync to automate daily snapshot-style backups and store them in separate date-stamped folders. You will need only slightly more disk space for the backups than you use on the production server, because you'll be storing identical files as hard links rather than separate files. (If you have large files that change frequently, you will need more space.)

This process is ideal for individuals who want to automatically store backups of their Linode on another Linux server. This is the easiest and most secure option. It also works for backing up to a Linux *personal\_computer*, as long as your computer is turned on when the backup is initiated.

-   **What**: You set the file path for this file-system backup.
-   **When**: This is an automatic daily backup.
-   **Where**: The files will get stored on the machine from which you are running the command, so make sure you're logged into the server or computer where you want to store your backups. This tutorial is designed to make backups on a remote Linux server.
-   **Rotation**: All your old backups are saved. Disk space is economized by using hard links to identical files.

Here's how to set up automatic backups of your Linode to a Linux server:

1.  Install rsync on both servers by entering the following command:

        sudo apt-get install rsync

2.  On your *backup\_server*, generate a passwordless SSH key by entering the following command. Press Return when prompted to enter a password - *do not enter a password*.

        ssh-keygen

3.  From your *backup\_server*, copy the public key to your *production\_server* by entering the following commands, one by one:

        scp ~/.ssh/id_rsa.pub user@production_server:~/.ssh/uploaded_key.pub
        ssh user@production_server 'echo `cat ~/.ssh/uploaded_key.pub` >> ~/.ssh/authorized_keys'

4.  Try connecting to your *production\_server* from your *backup\_server* by entering the following command:

        ssh user@production_server 'ls -al'

5.  Create a directory to store your backups on your *backup\_server* by entering the following command:

        mkdir ~/backups/

6.  Try creating a manual backup and storing it in `~/backups/public_orig/`. This is the backup against which all future backups will be checked. From your *backup\_server*, enter the following command:

        rsync -ahvz user@production_server:~/public ~/backups/public_orig/

    You should see a bunch of folders whizzing by and a confirmation message similar to the one shown below:

        sent 100 bytes  received 2.76K bytes  1.90K bytes/sec
        total size is 20.73K  speedup is 7.26

7.  Now you need to build the command for automatic scheduled backups. We've created the example command below, but you can modify it for your needs. Run the following command manually from your *backup\_server* to make sure you don't get any errors:

        rsync -ahvz --delete --link-dest=~/backups/public_orig user@production_server:~/public ~/backups/public_$(date -I)

    {{< note >}}
For an explanation of the rsync command's options and arguments, and to learn how to customize the command, please see the [Understanding the Rsync Command](#understanding-the-rsync-command) section of this guide.
{{< /note >}}

8.  The output should be similar to the output that was generated in Step 6. Feel free to `ls` your `~/backups/` folder to make sure everything was created.
9.  Add the command to cron so it gets executed automatically every day. Open the cron file on your *backup\_server* for editing by entering the following command:

        crontab -e

    {{< note >}}
If this is your first time running the command, select your favorite text editor.
{{< /note >}}

10. Copy and past the following line to the bottom of the file. This is the same line from Step 7 with some cron frequency information added at the beginning. Use this and cron will automatically trigger rsync to back up your server every day at 3 AM.

        0   3   *   *   *   rsync -ahvz --delete --link-dest=~/backups/public_orig user@production_server:~/public ~/backups/public_$(date -I)

    {{< note >}}
For more information about cron, and to learn how to create a custom schedule for your rsync command, see [Schedule Tasks with Cron](/docs/linux-tools/utilities/cron).
{{< /note >}}

Congratulations! You have now configured daily automatic snapshot-style backups. If something goes wrong with your server, you'll be able to restore from a backup at any time.

## Setting Up Automatic Backups to a Desktop Computer

Now that you've learned how to back up your Linode to another Linux server, it's time to learn how to back up to your desktop computer. There are several reasons why you may want to do this. It's a cheaper option, for one thing. Rather than pay for two virtual servers, you can keep everything on your home computer. It's also useful for individuals who need to set up development environments on their desktop computers.

-   **What**: You set the file path for this file-system backup.
-   **When**: This is an automatic daily backup.
-   **Where**: The files are stored on the machine running the command, so make sure you're logged into the computer you want to use to store your backups. This section is designed to make backups to your desktop machine.
-   **Rotation**: All of the old backups are saved. Disk space is saved by using hard links to identical files.

Verify that rsync is installed on your desktop computer. Linux users can execute `sudo apt-get install rsync` or `sudo yum install rsync` to install rsync. Mac OS X already has rsync installed by default. Windows users should see [this article for more details](http://www.rsync.net/resources/howto/windows_rsync.html) .

### Linux

Linux users should follow the instructions presented in the previous Setting Up Automatic Backups to a Linux Server\_ section of this guide.

### Mac OS X

OS X users can also follow the instructions presented in the previous Setting Up Automatic Backups to a Linux Server\_ section of this guide. The only difference is that you do not have to install rsync, and you have to change the use of the `date` variable slightly. Your final rsync command in Step 7 should look like this:

    rsync -ahvz --delete --link-dest=~/backups/public_orig user@production_server:~/public ~/backups/public_$(date +%Y-%m-%d)

Your final crontab entry in Step 9 should look like this:

    0      3       *       *       *       rsync -ahvz --delete --link-dest=~/backups/public_orig user@production_server:~/public ~/backups/public_$(date +\%Y-\%m-\%d)

 {{< note >}}
If you run into a permissions error with cron but not when you run the command manually, you might have a password on your SSH key which doesn't normally pop up because you have it stored in the Mac OS X keychain. You might want to set up a new OS X user with a passwordless key for the purpose of this cron job.
{{< /note >}}

### Windows

Windows is a bit different. You'll need to install a lot of tools that are available by default on other systems. Also, keep in mind that Windows doesn't have the same type of file ownership and permissions as Linux, so you'll have to do some extra work to restore permissions and ownership when you restore one of your backups. Rsync.net has a [great walkthrough](http://www.rsync.net/resources/howto/windows_rsync.html) that shows you how to install cwRsync for Windows, and explains how to set up a scheduled task for automatic backups.

Here's how to set up automatic backups of your Linode to a Windows desktop computer:

1.  Install cwRsync. You can [get the latest free version here](https://www.itefix.no/i2/docs/cwrsync-free-edition) (grab the top one, not the server version).
2.  It's important that the SSH key runs as the same user as cwRsync, so first we'll go to that directory. In the Windows command prompt, navigate to the folder where you installed cwRsync. For example:

        cd C:\Program Files (x86)\cwRsync\bin

3.  Generate an SSH key for your computer.

        ssh-keygen

4.  You will have to specify a valid file path to where you want to save the key. The default won't work. You can use something like this for the path (make sure all of the directories already exist):

        C:\Users\user\.ssh\id_rsa

5.  When prompted for a passphrase, just press Return. You should see the private and public keys created in the directory you specified.
6.  Now you need to upload your public key to the server. You can use your preferred file uploading method, but in this example, we'll use PSCP, which is another program in the PuTTY family that lets you use scp. [Download it now](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).
7.  Next you'll add both PSCP and cwRsync to your Path environment variable, so they can be used directly from the command prompt from any location. These instructions are for Windows 7 and 8.

    1.  From your Start menu, open the **Control Panel**.
    2.  Choose **System and Security**.
    3.  Choose **System**.
    4.  Choose **Advanced system settings** from the left sidebar.
    5.  Go to the **Advanced** tab.
    6.  Click the **Environment Variables...** button.
    7.  Under **System variables**, scroll down until you find the **Path** variable. Highlight it and click **Edit...**.
    8.  Do NOT delete what is currently there. You just want to add to it.
    9.  Add the paths to pscp.exe and cwRsync's bin directory. Separate paths with semicolons. Example paths to add:

            C:\Program Files (x86)\PuTTY;C:\Program Files (x86)\cwRsync\bin;

    10. Click **OK** until you're back to the Control Panel.
    11. Restart your command prompt if you have it open.

8.  Now we can use PSCP to upload the key. In your Windows command prompt, run the following command:

        pscp -scp C:\Users\user\.ssh\id_rsa.pub user@production_server:/home/user/.ssh/uploaded_key.pub

9.  On your *production\_server*, run this command to append your new key to the authorized\_keys file:

        echo `cat ~/.ssh/uploaded_key.pub` >> ~/.ssh/authorized_keys

10. Create a directory on your Windows machine where you will store your backups.

        mkdir %HOMEPATH%\backups

11. We will create one backup manually, stored in `C:\Users\user\backups\public_orig\`. This is the backup against which all future backups will be checked. From your Windows machine, run:

        rsync -hrtvz --chmod u+rwx user@production_server:~/public /cygdrive/c/Users/user/backups/public_orig/

Note that we are using Linux-style paths even for Windows: `C:\Users\user\backups\public_orig\` becomes `/cygdrive/c/Users/user/backups/public_orig/`.

This time, you will have to enter your *production\_server's* password. We'll fix that in a moment. You should see a bunch of folders whizzing by and a confirmation message like this:

    sent 100 bytes  received 2.76K bytes  1.90K bytes/sec
    total size is 20.73K  speedup is 7.26

You can `dir` the contents of `%HOMEPATH\backups\public_orig\` to verify that everything copied over correctly.

12. Next you'll add the final version of the command to your `cwrsync.cmd` file. You'll also run it once manually to make sure everything is working before we add the automation.
    1.  From the Start menu, under All Programs, open the cwRsync folder.
    2.  Right-click **1.Batch example** and choose **Run as administrator**.
    3.  This will open up the `cwrsync.cmd` file for editing.
    4.  Do NOT delete any of the default contents.
    5.  At the bottom, add this line:

            rsync -hrtvz --chmod u+rwx --delete --link-dest=/cygdrive/c/Users/user/backups/public_orig user@production_server:~/public /cygdrive/c/Users/user/backups/public_%DATE:~10,4%-%DATE:~4,2%-%DATE:7,2%

        {{< note >}}
For a deeper explanation of the rsync command's options and arguments, and to learn how to customize the command, please see the [Understanding the Rsync Command](#understanding-the-rsync-command) section of this guide.
{{< /note >}}

    6.  Save the file.
    7.  Run the file with the following line for your command prompt:

            "C:\Program Files (x86)\cwRsync\cwrsync.cmd"

        This will create today's backup and create the correct environment for a passwordless SSH key connection.

        You should see output similar to the output from Step 11.

13. Finally, we will add `cwrsync.cmd` as a daily task in Task Scheduler.
    1.  From the Start menu, go to \> All Programs \> Accessories \> System Tools \> Task Scheduler.
    2.  Click **Create Basic Task...**. The Task Wizard will pop up.
    3.  Fill in a name and description; "rsync backups," for example.
    4.  Choose **Daily** from the radio button list.
    5.  Set a start date (today) and time (when your server won't be busy, like 3 am, or a time when your computer will be on). It should recur every day.
    6.  Choose **Start a program**.
    7.  In the **Program/script** field, enter:

            "C:\Program Files (x86)\cwRsync\cwrsync.cmd"

    8.  Click **Finish**.

Keep in mind that these backups use your allotted transfer, so running them very frequently could result in overage charges.

Congratulations! You have now configured daily automatic snapshot-style backups. If something goes wrong with your server, you'll be able to choose a restoration from any day from here on forward.

## Restoring Your Rsync Backup

If you followed the instructions listed in one of the sections above, your Linode is automatically being backed up to another server or a desktop computer. But what if something happens to your Linode, or you just want to restore your backup files to another computer? You'll use rsync to restore from a backup.

Here's how to restore files from an rsync backup:

1.  Navigate to your backups directory on your *backup\_server* or desktop.
2.  Locate the folder with the right date.
3.  Choose whether you want to restore the entire backup (`public/` in our example) or just specific files.
4.  Upload your chosen files to the *production\_server* with scp, SFTP, rsync, etc.
5.  *Windows only:* Restore the correct Linux ownership and file permissions.

Congratulations! You have successfully restored your Rsync backup to your Linode.

## Maintaining Your Backups

Once you create an automated backup schedule, your backups will virtually take care of themselves. But there are some steps you can take to avoid surprises and keep your backups in good shape. Here are some of our favorite tips.

-   Backups to a remote server or desktop (via rsync or some other tool) count against your monthly transfer, so keep an eye on your usage to avoid overage charges.
-   To set a different email notification address for a cron job, add this to your cron file above the list of jobs:

        MAILTO="user@example.com"

-   To disable email notifications for your cron jobs, add this instead:

        MAILTO=""

-   Make sure your backup server doesn't run out of disk space. You may need to delete old backups occasionally. If you're using the rsync backup presented in this article, the server will fill up faster if you have large files that change frequently. You can automate backup deletion if desired.
-   If you're using the automatic rsync backup presented here, you may want to update your `--link-dest` folder in the cron command to a newer backup folder if you've made a lot of changes since your original backup. This will save time and disk space.

## Understanding the Rsync Command

It's great to have a powerful rsync command, but the half-dozen options can be pretty confusing if you're a beginner. If you need to customize the command, or if you're running into errors, it helps to have a deeper understanding of all the components. This section is here to help.

Here's our basic rsync command from the manual backup tutorial:

    rsync -ahvz user@production_server:/path/to/source/content /path/to/local/backup/storage/

And here's the even more complicated one-liner for the automatic archived backups:

    0   3   *   *   *   rsync -ahvz --delete --link-dest=~/backups/public_orig user@production_server:~/public ~/backups/public_$(date -I)

I'm going to break down the first command and explain each section. The second command has all the same sections, plus some new ones, which I will cover at the end.

### rsync

For a basic overview of rsync, [check out the manual page](http://linux.die.net/man/1/rsync). Here's the basic rsync command:

    rsync

Using `rsync` tells your shell to use the rsync utility. Everything including and after `rsync` is part of the rsync command. At its most basic, rsync takes this form:

    rsync copyfrom copyto

The thing you want to back up is `copyfrom`, and `copyto` is the place you want to store the backup. `Copyfrom` and `copyto` are arguments of the rsync command and are required. So an rsync command with basic `copyfrom` and `copyto` arguments would look like this:

    rsync user@production_server:~/public ~/backups/mybackup

    |---| |-----------------------------| |----------------|
      ^                 ^                          ^
      |                 |                          |
    rsync           copyfrom                    copyto

Rsync can also run with extra options, which get sandwiched in like this:

    rsync --options copyfrom copyto

### -ahvz

Here are some popular options for rsync:

    -ahvz

These are four rsync options that have all been smushed together. You could also list them out like this:

    -a -h -v -z

Here's what they do:

-   -a or --archive: Preserves our file permissions and ownership, copies recursively, etc.
-   -h or --human-readable: Number outputs are human readable
-   -v or --verbose: Displays more output
-   -z or --compress: Compress file data during transfer

You can add or remove any of the rsync options as you see fit. For example, if you don't care about seeing all the output, you could just run:

    -ahz

When creating backups, the essential option is `-a` or `--archive`.

### Source Location

The `copyfrom` location is the path to what you want to back up on your *production\_server*. This is where you should put the file path to your content on the server.

    user@production_server:~/public
    |--------------------| |------|
              ^                ^
              |                |
         SSH login           path

Since we're trying to copy from a remote server (the *production\_server*), we need to provide the SSH login credentials first. Then we use a colon (`:`), and then an absolute file path to the folder we want to back up.

In this example, we're backing up the `~/public` directory, which is where your websites should be located if you used the [Hosting a Website](/docs/hosting-website) guide. `~` is a shortcut for `/home/user/`. The trailing `/` is omitted from the final directory because we want to include the `public` folder itself in the backup, not just its contents.

If you want to do a full-server backup from root, you should use `/*` as your path. You should also exclude some folders from the backup so you don't get a lot of warnings and errors every time you run it. /dev, /proc, /sys, /tmp, and /run do not contain permanent data, and /mnt is the mount point for other file systems. To make an exclusion, add the `--exclude` option at the very end of the rsync command, after everything else.

    --exclude={/dev/*,/proc/*,/sys/*,/tmp/*,/run/*,/mnt/*}

You will also need to use either `root` or a sudo-capable user for the backup, if you are backing up from `/*` or another high-level directory. `root` is easier but less secure. If you use a sudo user, you will need to either disable the need for the password when rsync is used, or send the password to the server. The [crashingdaily blog](https://crashingdaily.wordpress.com/2007/06/29/rsync-and-sudo-over-ssh/) has a good discussion of this.

### Target Location

The `copyto` location is the path to where you want to store your backup on your *backup\_server*.

    ~/backups/mybackup

In the command for automatic backups, we also add a date variable to the file path:

    ~/backups/public_$(date -I)
                     |--------| <- date variable
    |-------------------------|
                 ^
                 |
               path

This is the local file path on the *backup\_server* to where you want to store the backups. Again, `~` is a shortcut for `/home/user/`. The variable `$(date -I)` uses the built-in `date` function to add today's date to the end of the file path. This makes sure a new folder is created for each backup, and also makes individual backups easy to find.

That's it for the basic rsync command for making manual backups. Next we'll look at the extra components in the longer automatic backup command.

### Cron

The first part of the final one-liner is the cron part.

    0       3           *           *       *        Command

    ^       ^           ^           ^       ^           ^
    |       |           |           |       |           |

    Minute Hour     Day of Month  Month  Weekday   Shell command

This tells cron when to run the command. You can specify either a specific number or `*`, which means "every." Use the 24-hour clock for hours. So, the example above has the command running on the first minute of the third hour of every day (3 am). Anything you add after the fifth number or asterisk is considered the actual command, which will be run just as if you had typed it in your shell. You can [read more about cron here](http://www.cyberciti.biz/faq/how-do-i-add-jobs-to-cron-under-linux-or-unix-oses/).

For testing purposes, you can set it to run at `* * * * *`, but don't leave it that way because you'll be making a new backup every minute. Running backups like this may use your allotted transfer, so running a new one every minute could result in overage charges.

### --delete

`--delete` is another rsync option.

    --delete

With `--delete`, if a file was removed from your `copyfrom` location, it will not be included in your most recent `copyto` backup, even if it was in earlier backups. It will NOT remove the file from earlier backups. This helps keep your backups easy to navigate.

### --link-dest

This is the option that makes our archive of old rsync backups so efficient:

    --link-dest=~/backups/public_orig

`--link-dest` is another rsync option and very important to our incremental backups plan. This is what lets us use different folder names for different backups. It also lets us store multiple full backups without using the full amount of disk space.

`--link-dest` has its own required argument, which I'll call `comparison_backup_folder`. So, in its most basic form, `--link-dest` looks like this:

    --link-dest=comparison_backup_folder

The `comparison_backup_folder` should be a valid directory path to an existing backup on the *backup\_server*. This directory serves two purposes. It provides a comparison point for the new backups, so files that stay the same are not copied over again, and it is the original source of the files from which the hard links are made in new backups. However, because hard links are awesome, it's okay if you eventually delete this directory! The files won't be deleted until every hard link to them is deleted. (You would have to specify a new directory for `--link-dest`, though.)

You can change the `comparison_backup_folder` whenever you want. The more similar it is to your production environment, the more efficient rsync will be.

The trailing `/` is omitted to match the `copyto` path.

### Different Server Locations

This guide specifies a remote *production\_server* and a local *backup\_server*. However, rsync works equally well with a local *production\_server* and a remote *backup\_server*, with local backups to a different folder on the same device, or with two remote servers. Any remote server requires an SSH login before the file path.

In technical terms, running the rsync command from the backup server is a "pulled" backup, while running it from the production server is a "pushed" backup.

Local folders don't need an SSH login, while remote folders need the SSH login and a colon (`:`) before the file path. More valid rsync command examples:

    rsync   copyfrom                copyto

    rsync   /local1                 /local2/
    rsync   /local                  user@remote:/remote/
    rsync   user@remote:/remote     /local/
    rsync   user@remote1:/remote    user@remote2:/remote/

All servers involved must have rsync installed, and any remote server must be running an SSH server as well.
