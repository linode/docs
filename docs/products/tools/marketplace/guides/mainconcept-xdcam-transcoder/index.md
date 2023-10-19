---
title: "Deploy MainConcept XDCAM Transcoder through the Linode Marketplace"
description: "Deploy MainConcept XDCAM Transcoder, an enterprise ready XDCAM Transcoder, on a Linode Compute Instance.'"
keywords: ['transcoder','encoder','video']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-09-14
modified_by:
  name: Linode
authors: ["Linode"]
---

The [MainConcept XDCAM Transcoder](https://www.mainconcept.com/transcoders) from the Pro Camera Transcoders for Sony & Panasonic product line is an optimized Docker container for file-based transcoding to professional Sony camera formats like XDCAM HD, XDCAM EX, XDCAM IMX and DVCAM (XDCAM DV). It supports a wide range of input formats. The ready-to-use product can be controlled via command line, REST API or container management tools without programming skills required.  

The XDCAM Transcoder includes the popular MainConcept codecs, pre-packaged as a single optimized containerized application for fast and flexible deployment to any workflow as a service or direct Linode server instance. 

This version of the XDCAM Transcoder is a free demo version that shows how MainConcept Codecs and related libraries work and perform in a cloud environment. It adds a watermark to the processed video and mutes audio from time to time. If you are interested in deploying the full version of the XDCAM Transcoder, please contact [sales@mainconcept.com](mailto:sales@mainconcept.com).

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MainConcept XDCAM Transcoder should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Ubuntu 22.04 LTS, Debian 11
- **Recommended plan:** We recommend a 16GB Dedicated CPU or Shared Compute Instance for MainConcept XDCAM Transcoder.

### MainConcept XDCAM Transcoder Options

- **API Port** : Sets the port for the HTTP REST API endpoint. Defaults to port 8080.

{{< content "marketplace-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

Once all packages have been installed, MainConcept XDCAM Transcoder is ready to receive API requests. The REST API does not require authentication. API functions use the following syntax:

```command
http://CONTAINER_IP_ADDRESS:PORT/rest/API_VERSION/FUNCTION/PARAMETERS
```

In the URL above, `API_VERSION` only contains the major version, and should be formatted using a leading "v". For example, the API version for MainConcept XDCAM Transcoder v2.0 is "v1". Additionally, if you choose to use a custom domain, replace instances of `IP_ADDRESS` with the domain you entered. See example functions below:

- Get service name: `GET http://IP_ADDRESS:PORT/rest/v1/service`

- Get transcoding jobs: `GET http://IP_ADDRESS:PORT/rest/v1/jobs`

- Get details on a specific job: `GET http://IP_ADDRESS:PORT/rest/v1/jobs/JOB_ID`

- Start transcoding job: `POST http://IP_ADDRESS:PORT/rest/v1/jobs`

Below is an example of a **job description file** body formatted in JSON:

```file
{
  "INPUT": "ftp://10.144.41.202:2121/test.mp4",
  "OUTPUT": "ftp://10.144.41.202:2121/test/xdcam_hd.mxf",
  "PRESETNAME": "XDCAM_HD_422_1920x1080_cbr_50mbit",
  "KEEP_CONTENT": "TRUE",
  "VERBOSITY": "DEFAULT"
}
```

Parameters for various options can be configured by editing the `properties.txt` file.

## Next Steps

For additional usage information and formatting guidelines, please see the official documentation for MainConcept XDCAM Transcoder by navigating to [MainConcept's Transcoders page](https://www.mainconcept.com/transcoders), and selecting **XDCAM Transcoder**. For support regarding the tool or software itself, use the information in the sidebar to contact their support or search the [MainConcept community forum](https://forum.mainconcept.com/).

{{< content "marketplace-update-note-shortguide">}}