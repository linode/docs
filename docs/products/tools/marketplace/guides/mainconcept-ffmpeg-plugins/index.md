---
title: "Deploy MainConcept FFMPEG Plugins through the Linode Marketplace"
description: "Deploy MainConcept FFMPEG Plugins, an enterprise ready set of FFMPEG tools, on a Linode Compute Instance.'"
keywords: ['ffmpeg','encoding','video']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-09-14
modified_by:
  name: Linode
authors: ["Linode"]
---

[MainConcept FFmpeg Plugins](https://www.mainconcept.com/ffmpeg) provide specific media encoding tools for compute-intensive transcoding workloads. The MainConcept FFMPEG Plugins are focused on proprietary solutions such as hybrid GPU support and xHE-AAC audio format. Use cases include both VOD and live production workflows.

Plugins included with this deployment:
- [Hybrid HEVC Encoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20Hybrid%20HEVC%20Encoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [HEVC Decoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20HEVC%20Decoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [AVC Broadcast Encoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20AVC%20Broadcast%20Encoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [AVC Decoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20AVC%20Decoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [VVC Encoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20VVC%20Encoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [MPEG-H Encoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20MPEG-H%20Encoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [xHE-AAC Encoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20xHE-AAC%20Encoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [MPEG-2 TS Broadcast Delivery](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20MPEG-2%20TS%20Broadcast%20Delivery%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)
- [MPEG-2 Production Format Encoder](https://www.mainconcept.com/hubfs/PDFs/User%20Guides/MainConcept%20MPEG-2%20Encoder%20Plug-In%20for%20FFmpeg%20User%20Guide.pdf)

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MainConcept FFMPEG Plugins should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 11
- **Recommended plan:** At minimum, we recommend a 2GB Shared CPU Compute Instance for MainConcept FFmpeg Plugins.

### MainConcept FFmpeg Plugins Options

{{< content "marketplace-limited-user-fields-shortguide">}}

## Getting Started after Deployment

### Logging In

Once all packages have finished installing, you can login to your instance to access MainConcept's FFmpeg installation and plugins.

1. Using the **limited sudo user** you created during deployment, login to your instance via SSH. Replace `LIMITED_USER` with your sudo user and `192.0.2.1` with the address of your Compute Instance:
    ```command
    ssh LIMITED_USER@192.0.2.1
    ```
1. Navigate to the `mainconcept` directory and view the installed packages:
    ```command
    cd /opt/mainconcept/
    ls
    ```
1. You should see the following:
    ```output
    ffmpeg-omx  omx  sdk
    ```

### Command Examples

Below are some example commands using `ffmpeg`:

- AVC/H.264 video encoding from YUV:

    ```command
    ffmpeg -r 25.000000 -pix_fmt yuv420p -s 1920x1080 -i "1920x1080p_25p_YV12.yuv" -vf scale=1280:720 -b:v 3500k -c:v omx_enc_avc -omx_core libomxil_core.so -omx_name OMX.MainConcept.enc_avc.video -omx_param "preset=main:perf_level=10:acc_type=sw:[AVC Settings]:bit_rate_mode=0:bit_rate=100000:time_scale=20000000:num_units_in_tick=1000000" "1920x1080p_25p_YV12_ffmpeg.mp4"
    ```

- HEVC/H.265 video and xHE-AAC audio transcoding from encoded media file:

    ```command
    ffmpeg -i input.mp4 -c:v omx_enc_hevc -c:a omx_enc_xheaac -b:v 1000k -b:a 32000 -profile:a 28 -omx_name:v OMX.MainConcept.enc_hevc.video -omx_param:v "force_omx_param=1:preset=main:acc_type=sw" -omx_name:a OMX.MainConcept.enc_xheaac.audio -omx_core libomxil_core.so output.mp4
    ```

## Next Steps

For more information on using MainConcept FFmpeg plugins, including command line formatting, see MainConcept's official documentation and user guides:

- [MainConcept's official documentation on FFmpeg Plugins](https://www.mainconcept.com/ffmpeg)

{{< content "marketplace-update-note-shortguide">}}