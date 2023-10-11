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

[MainConcept 2GO P2 AVC Ultra Transcoder](https://www.mainconcept.com/mc2go) is a containerized file based transcoder into professional Panasonic camera formats like P2 AVC-Intra, P2 AVC LongG and AVC-intra RP2027.v1 and AAC High Efficiency v2 formats into an MP4 container.

## Deploying a Marketplace App 

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MainConcept 2GO P2 AVC Ultra Transcoder should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS, Debian 11
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for MainConcept 2GO P2 AVC Ultra Transcoder.

### MainConcept 2GO P2 AVC Ultra Transcoder Options

- **API Port** : Sets the port for the HTTP REST API endpoint. Defaults to 8080

{{< content "marketplace-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

### Example MC2GO HTTP endpoints
The REST API does not require authentication. The functions use the following syntax:
http://[container-ip-addess]:[port]/rest/[api-version]/[function]/[parameters]
The "api-version" part in the URL only contains the major version, and with a leading "v". For 
MainConcept 2GO v2.0 the API version is "v1". If you choose to use a custom domain, please replace instances of `ip-address` with the domain you entered.

1. Get service name:
GET http://[ip-addess]:[port]/rest/v1/service

2. Get transcoding jobs:
GET http://[ip-addess]:[port]/rest/v1/jobs

3. Get details on a specific job:
GET http://[ip-addess]:[port]/rest/v1/jobs/{JobID}

4. Start transcoding job:
POST http://[ip-addess]:[port]/rest/v1/jobs

, with body

{
  "INPUT": "ftp://10.144.41.202:2121/test.mp4",
  "OUTPUT": "ftp://10.144.41.202:2121/test/p2_avcintra.mxf",
  "PRESETNAME": "P2_AVCIntra_100",
  "KEEP_CONTENT": "TRUE",
  "VERBOSITY": "DEFAULT"
}

Please visit [MainConcept official documentation](https://www.mainconcept.com/mc2go) for more information. 

{{< content "marketplace-update-note-shortguide">}}