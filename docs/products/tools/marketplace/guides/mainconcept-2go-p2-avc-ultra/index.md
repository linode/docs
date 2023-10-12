---
title: "Deploy MainConcept 2GO P2 AVC Ultra Transcoder through the Linode Marketplace"
description: "Deploy MainConcept 2GO P2 AVC Ultra Transcoder, an enterprise ready AVC Ultra Transcoder, on a Linode Compute Instance.'"
keywords: ['transcoder','encoder','video']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-09-14
modified_by:
  name: Linode
authors: ["Linode"]
---

[MainConcept 2GO P2 AVC Ultra Transcoder](https://www.mainconcept.com/mc2go) is a containerized, file-based transcoder that converts media files into professional Panasonic camera formats such as P2 AVC-Intra, P2 AVC LongG and AVC-intra RP2027.v1 and AAC High Efficiency v2 formats. This deployment installs Docker, the MainConcept 2GO package, and a REST API that can be communicated with over HTTP using JSON.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MainConcept 2GO P2 AVC Ultra Transcoder should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS, Debian 11
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared CPU Compute Instance for MainConcept 2GO P2 AVC Ultra Transcoder.

### MainConcept 2GO P2 AVC Ultra Transcoder Options

- **API Port** : Sets the port for the HTTP REST API endpoint. Defaults to port 8080.

{{< content "marketplace-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

Once all packages have been installed, MainConcept 2GO P2 AVC Ultra Transcoder is ready to receive API requests. Note that the REST API does not require authentication. API functions use the following syntax:

```command
http://CONTAINER_IP_ADDRESS:PORT/rest/API_VERSION/FUNCTION/PARAMETERS
```

In the URL above, `API_VERSION` only contains the major version, and should be formatted using a leading "v". For example, the API version for MainConcept 2GO v2.0 is "v1". Additionally, if you choose to use a custom domain, replace instances of `IP_ADDRESS` with the domain you entered. See example functions below:

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

For additional usage information and formatting guidelines, please see the official documentation for MainConcept 2GO P2 AVC Ultra Transcoder by navigating to [MainConcept's 2GO page](https://www.mainconcept.com/mc2go), scrolling to **Broadcast** products, and selecting **P2 AVC Ultra Transcoder**.

{{< content "marketplace-update-note-shortguide">}}