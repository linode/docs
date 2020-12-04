---
slug: create-restic-repository-shortguide
author:
  name: Andy Heathershaw
  email: andy@andysh.uk
description: 'A shortguide that shows how to install Restic backup.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-24
modified_by:
  name: Andy Heathershaw
title: "Install Restic backup"
headless: true
show_on_rss_feed: false
---

{{< note >}}
[Create an Object Storage access key pair](/docs/platform/object-storage/how-to-use-object-storage/#generate-a-key-pair) if you have not done so already.
{{< /note >}}

1. Run the below command, replacing `your-key` with your access key, `your-secret` with your key's secret, and `your-bucket-name` with the name of your bucket:

        AWS_ACCESS_KEY_ID=your-key AWS_SECRET_ACCESS_KEY=your-secret restic -r s3:us-east-1.linodeobjects.com/your-bucket-name init

    {{< note >}}
The above command references the `us-east-1` cluster, which is located in the Newark, NJ region. If your bucket is located in a different cluster, replace `us-east-1` with the appropriate cluster name.

Example: for Frankfurt, DE, the command would be:

    AWS_ACCESS_KEY_ID=your-key AWS_SECRET_ACCESS_KEY=your-secret restic -r s3:eu-central-1.linodeobjects.com/your-bucket-name init
{{< /note >}}

    {{< caution >}}
Ensure the name of your bucket is correct. If the bucket does not exist, Restic will create it for you on the cluster you are connecting to.
{{< /caution >}}

2. You will be prompted to set a password to encrypt your repository's data. Enter your desired password twice, and you should see similar output to the below, confirming your repository has been created:

    {{< output >}}
enter password for new repository:
enter password again:
created restic repository c3ffbd1ea6 at s3:us-east-1.linodeobjects.com/restic-backups-example

Please note that knowledge of your password is required to access
the repository. Losing your password means that your data is
irrecoverably lost.
{{< /output >}}

    {{< caution >}}
Store this password securely and somewhere away from your Linode. Your backups will be inaccessible without it!
{{< /caution >}}

### Store the access key and secret

Your access key, secret key and password are required every time Restic communicates with your repository. To make it easier to work with your repository, create a shell script containing your credentials.

1. To keep it secure, create this script within the root user's home directory, and run all your Restic scripts as the root user.

        sudo nano /root/restic_params

    {{< file "/root/restic_params" >}}
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
{{< /file >}}

    {{< note >}}
Whenever you want to use Restic, import this file or include it in your user's logon script:

    source /root/restic_params
{{< /note >}}

1. Create a password file to hold your Restic password:

        sudo nano /root/restic_pw

    {{< file "/root/restic_pw" >}}
YourPasswordGoesHere
{{< /file >}}

    {{< note >}}
You can pass your password filename to Restic using the "-p" flag:

    restic -p /root/restic_pw ...
{{< /note >}}

1. Run the `chmod` command to restrict read access for the new files to the root user:

        sudo chmod 600 /root/restic_params /root/restic_pw