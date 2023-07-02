---
slug: create-restic-repository-shortguide
description: 'A shortguide that shows how to install Restic backup.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-24
modified_by:
  name: Andy Heathershaw
title: "Install Restic backup"
headless: true
show_on_rss_feed: false
authors: ["Andy Heathershaw"]
---

{{< note >}}
[Create an Object Storage access key pair](/docs/platform/object-storage/how-to-use-object-storage/#generate-a-key-pair) if you have not done so already. Should you choose to restrict the access key's permissions, it will require "Read/Write" permission to the bucket you will use to store your Restic repository.
{{< /note >}}

1. Configure Restic to use your Object Storage access key pair and to use the bucket you created in the [Before You Begin](#before-you-begin) section of this guide. Replace `your-key`, `your-secret`, and `us-east-1.linodeobjects.com/your-bucket-name` with your own values.

        AWS_ACCESS_KEY_ID=your-key AWS_SECRET_ACCESS_KEY=your-secret restic -r s3:us-east-1.linodeobjects.com/your-bucket-name init

    {{< note respectIndent=false >}}
The above command references the `us-east-1` cluster, which is located in the Newark, NJ cluster region. If your bucket is located in a different cluster region, replace `us-east-1` with the appropriate cluster name.

For example, for the Frankfurt, DE cluster region the command is:

    AWS_ACCESS_KEY_ID=your-key AWS_SECRET_ACCESS_KEY=your-secret restic -r s3:eu-central-1.linodeobjects.com/your-bucket-name init
{{< /note >}}

    {{< note type="alert" respectIndent=false >}}
Ensure the name of your bucket is correct. If the bucket does not exist, Restic creates a new bucket for you in the cluster region you designate.
{{< /note >}}

2. Following the prompt, set a password to encrypt your repository's data. Enter your desired password twice, and you will see a similar output confirming that your repository has been created:

    {{< output >}}
enter password for new repository:
enter password again:
created restic repository c3ffbd1ea6 at s3:us-east-1.linodeobjects.com/restic-backups-example

Please note that knowledge of your password is required to access
the repository. Losing your password means that your data is
irrecoverably lost.
{{< /output >}}

    {{< note type="alert" respectIndent=false >}}
Store this password securely and somewhere other than your Linode. Your backups are inaccessible without the password.
{{< /note >}}

### Store the access key and secret

Your access key, secret key, and password are required every time Restic communicates with your repository. To make it easier to work with your repository, create a shell script containing your credentials.

{{< note respectIndent=false >}}
The examples in this section use the Nano text editor. Refer to the [Nano Text Editor Commands](/docs/guides/use-nano-text-editor-commands/) guide if you're not familiar with Nano.
{{< /note >}}

1. To keep your credentials secure, using a text editor, create the example script in the root user's home directory, and run all your Restic scripts as the root user. The example uses the Nano text editor.

        sudo nano /root/restic_params

    Copy and paste the example file's content and replace `your-key`, and `your-secret` with your own Object Storage account's access key credentials.

    {{< file "/root/restic_params" >}}
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
{{< /file >}}

    {{< note respectIndent=false >}}
Whenever you want to use Restic, import this file using the command below or include it in your user's login script:

    source /root/restic_params
{{< /note >}}

1. Create a password file to hold your Restic password:

        sudo nano /root/restic_pw

    Enter your Restic password and save the file.

    {{< file "/root/restic_pw" >}}
YourPasswordGoesHere
{{< /file >}}

    {{< note respectIndent=false >}}
You can pass your password filename to Restic using the `-p` flag:

    restic -p /root/restic_pw ...
{{< /note >}}