---
title: "Deploy MainConcept P2 AVC-ULTRA Transcoder through the Linode Marketplace"
description: "Deploy MainConcept P2 AVC-ULTRA Transcoder, an enterprise ready tool to create Panasonic AVC-ULTRA camera formats on a Linode Compute Instance."
keywords: ['transcoder','encoder','video','panasonic','p2 avc-ultra','p2 avc-intra','p2 avc longg','avc-intra rp2027','rest api']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-09-14
modified_by:
  name: Linode
authors: ["Linode"]
---

The [MainConcept P2 AVC-ULTRA Transcoder](https://www.mainconcept.com/transcoders) from the Pro Camera Transcoders for Sony & Panasonic product line is an optimized Docker container for file-based transcoding to professional Panasonic camera formats such as P2 AVC-Intra, P2 AVC LongG, and AVC-Intra RP2027. MainConcept P2 AVC-ULTRA Transcoder supports a wide range of input formats, and is ready-to-use out of the box. It can be controlled via command line, REST API, or various container management tools.

The P2 AVC-ULTRA Transcoder includes MainConcept's codecs, pre-packaged as a single, optimized containerized application for fast and flexible deployment to any workflow as a service or direct Compute Instance.

This version of the P2 AVC-ULTRA Transcoder is a free version that demonstrates how MainConcept codecs and related libraries work and perform in a cloud environment. It adds a watermark to processed video and intermittently mutes audio. If you wish to deploy the full version of the P2 AVC-ULTRA Transcoder, please visit the [MainConcept on Linode](https://www.mainconcept.com/akamai-linode) website.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MainConcept P2 AVC-ULTRA Transcoder should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Ubuntu 22.04 LTS, Debian 11
- **Recommended plan:** We recommend a 16GB Dedicated CPU or Shared CPU Compute Instance for MainConcept P2 AVC-ULTRA Transcoder.

### MainConcept P2 AVC-ULTRA Transcoder Options

- **API Port** : Sets the port for the HTTP REST API endpoint. Defaults to port 8080.

{{< content "marketplace-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

Once all packages have been installed, MainConcept P2 AVC-ULTRA Transcoder is ready to receive API requests. Note that the REST API does not require authentication. API functions use the following syntax:

```command
http://CONTAINER_IP_ADDRESS:PORT/rest/API_VERSION/FUNCTION/PARAMETERS
```

In the URL above, `API_VERSION` only contains the major version, and should be formatted using a leading "v". For example, the API version for MainConcept P2 AVC-ULTRA Transcoder v2.0 is "v1". Additionally, if you choose to use a custom domain, replace instances of `IP_ADDRESS` with the domain you entered. See example functions below:

- Get service name: `GET http://IP_ADDRESS:PORT/rest/v1/service`

- Get transcoding jobs: `GET http://IP_ADDRESS:PORT/rest/v1/jobs`

- Get details on a specific job: `GET http://IP_ADDRESS:PORT/rest/v1/jobs/JOB_ID`

- Start transcoding job: `POST http://IP_ADDRESS:PORT/rest/v1/jobs`

Below is an example of a **job description file** body formatted in JSON:

```file
{
  "INPUT": "ftp://10.144.41.202:2121/test.mp4",
  "OUTPUT": "ftp://10.144.41.202:2121/test/p2_avcintra.mxf",
  "PRESETNAME": "P2_AVCIntra_100",
  "KEEP_CONTENT": "TRUE",
  "VERBOSITY": "DEFAULT"
}
```

Parameters for various options can be configured by editing the `properties.txt` file.

## Next Steps

For additional usage information and formatting guidelines, please see the official documentation for MainConcept P2 AVC-ULTRA Transcoder by navigating to [MainConcept's Transcoders page](https://www.mainconcept.com/transcoders), and selecting **P2 AVC-ULTRA Transcoder**. For support regarding the tool or software itself, use the information in the sidebar to contact MainConcept's support or search the [MainConcept community forum](https://forum.mainconcept.com/).

{{< content "marketplace-update-note-shortguide">}}