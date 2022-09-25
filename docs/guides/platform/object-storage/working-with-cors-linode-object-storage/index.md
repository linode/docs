---
slug: working-with-cors-linode-object-storage
author:
  name: Linode Community
  email: docs@linode.com
description: "Linode Object Storage provides efficient S3-compatible storage. Cross-origin resource sharing policies can make accessing storage across domains more difficult. But you can learn everything you need to make it easier in this tutorial on CORS and Linode Object Storage."
og_description: "Linode Object Storage provides efficient S3-compatible storage. Cross-origin resource sharing policies can make accessing storage across domains more difficult. But you can learn everything you need to make it easier in this tutorial on CORS and Linode Object Storage."
keywords: ['enable cors s3','allow cors s3 bucket','cors policy']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-25
modified_by:
  name: Nathaniel Stickman
title: "Working with CORS Policies on Linode Object Storage"
h1_title: "Working with CORS Policies on Linode Object Storage"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[AWS Documentation - Amazon Simple Storage Service: Using Cross-origin Resource Sharing (CORS)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)'
- '[AWS Documentation - Amazon Simple Storage Service: Troubleshooting CORS](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors-troubleshooting.html)'
- '[DreamHost Knowledge Base: Configuring (CORS) on a DreamObjects Bucket](https://help.dreamhost.com/hc/en-us/articles/216201557-How-to-setup-Cross-Origin-Resource-Sharing-CORS-on-DreamObjects)'
---

Access Key: MFMGAD3V2OXA9LDLUR3Z
Secret Key: xWuJtJ0WmI1zqmtcQlohysem2AjJ6ZHDDM6skD19

[Linode Object Storage](/docs/products/storage/object-storage/) offers globally-available and efficient S3 storage.

Often, you want to take advantage of your object storage on your applications and other domains. But this can leave you dealing with cross-origin resource sharing (CORS).

This tutorial aims to cover the tools and approaches you need to effectively review and manage CORS policies for your Linode Object Storage instance.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## CORS and S3 Storage — What you Need to Know

Linode Object Storage is an S3, which stands for *simple storage service*. With S3, data gets stored as objects in "buckets." This gives S3s a flat approach to storage, in contrast to the hierarchical and logistically more completed storage methods like traditional file systems. Stored objects also tend to come with rich metadata.

Cross-origin resource sharing (CORS) defines how clients and servers from different domains may share resources. Generally, CORS policies restrict access to resources to requests from the same domain. But by managing your CORS policies you can open up services to requests from specified origin domains or from any domains whatsoever.

An S3 like Linode Object Storage can provide excellent storage for applications. To do so, you want to keep your data as secure as possible while also allowing your applications the access they need.

This is where managing CORS policies on your object storage service becomes imperative. Often applications, and other tools, need to access stored resources from particular domains. Implementing specific CORS policies controls what kinds of requests, and responses, each origin domain can receive.

## Working with CORS Policies on Linode Object Storage

To manage policies on your Linode Object Storage, you can use the **s3cmd** tool. Follow along with our guide [Using S3cmd with Object Storage](/docs/products/storage/object-storage/guides/s3cmd) to:

1. Install s3cmd on your system. The installation takes place on the system from which you intend to manage your S3 instance.

1. Configure s3cmd for your Linode Object Storage instance. This includes indicating the instance's access key, endpoint, etc.

You can verify your connection to your object storage with the command to list your buckets. This example lists the one bucket used for this tutorial, `example-cors-bucket`:

    s3cmd ls

{{< output >}}
2022-09-24 16:13  s3://example-cors-bucket
{{< /output >}}

Once you have s3cmd set up for your S3 instance, use it to follow along with the upcoming sections of this tutorial. These show you how to review and deploy CORS policies.

## Reviewing CORS Policies for Linode Object Storage

You can get the current CORS policies for your S3 bucket using s3cmd. Using the outputted bucket designation from the `ls` command above, the `s3cmd info` command general information about the bucket, including its policies:

    s3cmd info s3://example-cors-bucket

{{< output >}}
s3://example-cors-bucket/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    none
   CORS:      <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><CORSRule><AllowedMethod>GET</AllowedMethod><AllowedMethod>PUT</AllowedMethod><AllowedMethod>DELETE</AllowedMethod><AllowedMethod>HEAD</AllowedMethod><AllowedMethod>POST</AllowedMethod><AllowedOrigin>*</AllowedOrigin><AllowedHeader>*</AllowedHeader></CORSRule></CORSConfiguration>
   ACL:       31ffbc26-d6ed-4bc3-8a14-ad78fe8f95b6: FULL_CONTROL
{{< /output >}}

Already this bucket has a CORS policy in place. This is because it was set up with the **CORS Enabled** setting using the Linode Cloud Manager web interface.

## Deploying CORS Policies on Linode Object Storage

As you can see above, the Linode Cloud Manager can set up a general CORS policy for your bucket. But if you need more fine-grained control, you need to deploy policies through a tool like s3cmd.

Creating CORS policies follows a similar methodology to the one outlined in our [Define Access and Permissions using Bucket Policies](/docs/products/storage/object-storage/guides/bucket-policies/) tutorial.

### Configuring Policies

The overall structure for CORS policies on S3 looks like the following. While policies on your object storage instance can generally be set with JSON or XML, CORS policies need to be in an XML format:

{{< file "cors_policies.xml" xml >}}
<CORSConfiguration>
  <CORSRule>
    <AllowedHeader>*</AllowedHeader>

    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>

    <AllowedOrigin>*</AllowedOrigin>

    <ExposeHeader>*</ExposeHeader>

    <MaxAgeSeconds>3000</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
{{< /file >}}

To break this structure down:

- The policy introduces a list of one or more `<CORSRule>` elements which each contain policy details.

- Policies tend to have some combination of the five types of elements shown in the example above.

    The `<AllowedHeader>`, `<AllowedMethod>`, and `<AllowedOrigin>` elements are almost always present. Further, there may be multiple of these elements within a `<CORSRule>`.

    The other two elements, `<ExposeHeader>` and `<MaxAgeSeconds>`, are optional. There can be multiple `<ExposeHeader>` elements, but only one `<MaxAgeSeconds>`.

- `<AllowedHeader>` lets you specify allowed request headers to which the given policy applies. You can find a list of commonly used request headers in AWS's [Common Request Headers](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTCommonRequestHeaders.html) documentation.

- `<AllowedMethod>` lets you specify request methods that the given policy applies to. The full range of supported HTTP request methods is shown in the example above.

- `<AllowedOrigin>` lets you specify request origins for the policy. These are the addresses from which cross-origin requests can be made.

- `<ExposeHeader>` can specify which response headers the policy allows to be exposed. You can find a list of commonly used response headers in AWS's [Common Response Headers](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTCommonResponseHeaders.html) documentation.

- `<MaxAgeSeconds>` can specify the amount of time, in seconds, that browsers are allowed to cache the response to the preflight options request. Having this cache allows the browser to repeat the original requests without having to send another preflight request. 

#### Example CORS Policies

To give more concrete ideas of how you can work with CORS policies, take a look through this series of example policy configurations.

- A public access read-only policy. This lets any origin, with any request headers, make `GET` and `HEAD` requests to the bucket. The policy does not expose custom response headers, however.

    {{< file "cors_policies.xml" xml >}}
<CORSConfiguration>
  <CORSRule>
    <AllowedHeader>*</AllowedHeader>

    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>

    <AllowedOrigin>*</AllowedOrigin>
  </CORSRule>
</CORSConfiguration>
    {{< /file >}}

- A set of policies for fine control over requests from `example.com`. The `<AllowedOrigin>` elements specify the range of possible `example.com` addresses. The two policies distinguish the kinds of headers allowed based on the kinds of request methods.

    {{< file "cors_policies.xml" xml >}}
<CORSConfiguration>
  <CORSRule>
    <AllowedHeader>Authorization</AllowedHeader>

    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>

    <AllowedOrigin>http://example.com</AllowedOrigin>
    <AllowedOrigin>http://*.example.com</AllowedOrigin>
    <AllowedOrigin>https://example.com</AllowedOrigin>
    <AllowedOrigin>https://*.example.com</AllowedOrigin>

    <ExposeHeader>Access-Control-Allow-Origin</ExposeHeader>

    <MaxAgeSeconds>3000</MaxAgeSeconds>
  </CORSRule>
  <CORSRule>
    <AllowedHeader>Authorization</AllowedHeader>
    <AllowedHeader>Origin</AllowedHeader>
    <AllowedHeader>Content-*</AllowedHeader>

    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>

    <AllowedOrigin>http://example.com</AllowedOrigin>
    <AllowedOrigin>http://*.example.com</AllowedOrigin>
    <AllowedOrigin>https://example.com</AllowedOrigin>
    <AllowedOrigin>https://*.example.com</AllowedOrigin>

    <ExposeHeader>ETag</ExposeHeader>

    <MaxAgeSeconds>3000</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
    {{< /file >}}

### Deploying Policies

The next step is to actually deploy your CORS policies. Once you do, your S3 bucket starts using those policies to determine what origins to allow and what request and response information to permit them.

Follow these steps to put your CORS policies into practice on your S3 instance.

1. Enter your CORS policy into a XML file. This example uses a file named `cors_policies.xml` and containing the second example policy XML above.

1. Use s3cmd's `setcors` commands to deploy the CORS policies to the bucket. This command takes first the policy file and then the bucket identifier. This example uses the bucket identifier shown further above:

        s3cmd setcors cors_policies.xml s3://example-cors-bucket

1. You can then verify the new CORS policies using the `info` command as shown earlier in this tutorial:

        s3cmd info s3://example-cors-bucket

    {{< output >}}
s3://example-cors-bucket/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    none
   CORS:      <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><CORSRule><AllowedMethod>GET</AllowedMethod><AllowedMethod>HEAD</AllowedMethod><AllowedOrigin>http://*.example.com</AllowedOrigin><AllowedOrigin>http://example.com</AllowedOrigin><AllowedOrigin>https://*.example.com</AllowedOrigin><AllowedOrigin>https://example.com</AllowedOrigin><AllowedHeader>Authorization</AllowedHeader><MaxAgeSeconds>3000</MaxAgeSeconds><ExposeHeader>Access-Control-Allow-Origin</ExposeHeader></CORSRule><CORSRule><AllowedMethod>PUT</AllowedMethod><AllowedMethod>DELETE</AllowedMethod><AllowedMethod>POST</AllowedMethod><AllowedOrigin>http://*.example.com</AllowedOrigin><AllowedOrigin>http://example.com</AllowedOrigin><AllowedOrigin>https://*.example.com</AllowedOrigin><AllowedOrigin>https://example.com</AllowedOrigin><AllowedHeader>Authorization</AllowedHeader><AllowedHeader>Content-*</AllowedHeader><AllowedHeader>Origin</AllowedHeader><MaxAgeSeconds>3000</MaxAgeSeconds><ExposeHeader>ETag</ExposeHeader></CORSRule></CORSConfiguration>
   ACL:       31ffbc26-d6ed-4bc3-8a14-ad78fe8f95b6: FULL_CONTROL
    {{< /output >}}

## Troubleshooting Common CORS Errors

Having CORS-related issues on Linode Object Storage? Take these steps to help narrow down the issue and figure out the kind of policy change you need to resolve it.

1. Review your instance's CORS policies using s3cmd:

        s3cmd info s3://example-cors-bucket

    This can give you a concrete reference for what policies are in place and the specific details of them, like header and origin information.

1. Review the request and response data. This can give you insights on any possible inconsistencies between existing CORS policies and the actual requests and responses.

    You can use a tool like cURL for this. First, use s3cmd to create a signed URL to an object on your storage instance. This example command creates the URL for an `example.txt` object and makes the URL last 300 seconds:

        s3cmd signurl s3://example-cors-bucket/example.txt +300

    Now you can, until the URL expires, use a cURL command like this one:

        curl -v "http://example-cors-bucket.us-southeast-1.linodeobjects.com/index.md?AWSAccessKeyId=example-access-key&Expires=1664121793&Signature=example-signature"

    The `-v` option gives you verbose results, which renders more details to help you dissect any request and response issues.

1. Compare the results of the cURL request to the CORS policy on your instance.

## Conclusion

This covers the tools and approaches you need to start managing CORS for your Linode Object Storage. Once you have these, addressing CORS issues on your S3 instance is a matter of reviewing and adjusting policies against desired origins and request types.

Keep improving your resources for managing your S3 through our collection of [object storage guides](https://www.linode.com/docs/products/storage/object-storage/guides/). These cover a range of topics to help you with both S3 generally and Linode Object Storage in particular.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.

