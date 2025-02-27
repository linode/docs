---
slug: comparing-cpus-gpus-and-vpus
title: "Comparing CPUs, GPUs, and VPUs"
description: "This guide discusses the hardware and architecture differences between CPUs, GPUs, and VPUs on Akamai Cloud."
authors: ["Maddie Presland"]
contributors: ["Maddie Presland","John Dutton"]
published: 2025-02-27
keywords: ['vpu','accelerated cpu','cpu','gpu','asic','video processing unit','application specific integrated circuit','graphic processing unit']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

As more users subscribe to on-demand media streaming and engage with live streaming outside of broadcast television, both a larger quantity of and specialized resources are needed to support performance-critical media transcoding and adaptive streaming functionalities.

Our set of Accelerated Compute Instances, featuring first-to-market NETINT Quadra T1U VPUs, adds to our media solutions that give media organizations a range of infrastructure options specifically optimized for media transcoding. Accelerated Compute Instances can help media providers optimize cloud spend and save on their media transcoding architectures. Compared to CPU-based transcoding, accelerated instances equipped with NETINT VPUs have reported 15-30x improved performance.

This guide walks through the technology behind VPUs and compares VPU architecture to traditional CPU and GPU cloud offerings.

## What is a VPU?

A video processing unit (VPU) is a type of application-specific integrated circuit (ASIC) that is specifically designed to optimize performance for digital media transcoding. Transcoding is the process of converting a media source into different file formats and resolutions to transmit the media’s data from one device (or origin) to another.

As the media technology landscape has evolved, so has the software, tools, and algorithms used to transcode more efficiently for various devices and across different network bandwidths. The size of the media technology market, the variety of different applications, and expanding use cases now require specialized data center hardware to accompany software and other media hardware.

### Key Terms

- **Codec**: A codec, such as AV1, HEVC or H.264, is a hardware- or software-based process that compresses and decompresses large amounts of data. Codecs are used in applications to play and create media files for users, as well as to send media files over a network. The term is a blend of the words coder and decoder, as well as compression and decompression. Higher bit rate = less compression = higher quality.

- **Media Encoding**: The process of converting media files (audio, video, images) from one format to another, involving compressing the media to reduce file size while maintaining quality.

- **Media Decoding**: The process of converting encoded media back to their original format by decompressing the source media.

- **Media Transcoding**: The more comprehensive process of converting media to different file types (including both encoding and decoding) combined with custom functions such as bitrate adjustment or changing codecs.

- **Over-the-Top (OTT) Providers**: Media service platforms (i.e. on-demand video streaming) offering their content directly to paid subscribers and viewers via the internet, bypassing cable and broadcast platforms.

## Architecture Overview: Comparing CPUs, GPUs, and VPUs

### Hardware Advancements

As technology evolves, operations that strain certain areas of existing underlying hardware result in manufacturers using different materials to add new functionality and tiers of performance based on what the hardware can withstand. Hardware design and production is driven by figuring out how to optimize the use of the hardware’s power source and the raw materials that make it up.

Advances in processor unit design and technology are generally defined by two primary components:

- Denser packing of circuit elements onto each chip (advancement in use of physical chip space)

- Expanding on the inherent capabilities of the microprocessors implemented on those chips (advancement of what the chips themselves can do as out of the box hardware)

### Architecture Components

Different raw materials and ratios of those materials are used to create circuits and other micro components of computer hardware to optimize for specific operations and functionalities. Each raw material (copper, silicon, nickel, etc.) serves a different purpose based on its natural properties and how that material responds to heat to create energy.

For example, GPUs will have a higher quantity of copper than an external SSD storage device for power delivery and heatsinks to rapidly heat and cool their densely packed arithmetic logic units (ALUs). ASICs like VPUs will have a higher quantity of gold than a standard CPU or GPU to enhance the reliability of the fixed-function circuits to maximize hardware performance and efficiency for its designated specialization.

The below diagram illustrates the quantity and ratio of different circuits and engines in a CPU vs. GPU vs. VPU. GPUs are designed to be extremely densely packed with ALUs for parallel processing, whereas VPUs have fixed-function circuits programmed to perform specific tasks very efficiently.

[DIAGRAM]

- **Control**: Synchronous (i.e. events happen in a specified order) digital circuit dedicated to interpreting processor instructions and managing execution of those instructions.

- **Arithmetic Logic Unit (ALU)**: Combinational (i.e. events and logic are applied “as needed”) digital circuit that responds to data input to perform complex logic.

- **Cache**: Local cache for low-latency data access.

- **Fixed Function Video Processing**: Circuits dedicated to performing specific, pre-defined tasks with hyper efficiency and low power consumption.

- **AI Engine**: Digital circuit dedicated to AI tasks by maximizing matrix and vector processing.

## VPU Use Cases

Transcoding workflows often use large amounts of CPU processing that may be critical for other areas of an application like request input and job delegation. The video processing hardware exclusive to Accelerated Compute Instances allow for more efficient transcoding at scale, including use cases such as:

- **Media**: Transcoding for live streaming, video on-demand, and media SaaS.

- **CCTV Video Surveillance**: Transcoding live video security monitoring for viewing across digital and IoT devices.

- **Gaming**: Transcoding for live user video and voice chat.

## Other Features and Benefits of VPUs

- **AVC/H.264 Baseline, Main, High, High 10 Encode/Decode**: H.264 is a one of the most widely used compression standards that works well on varying internet speeds, and integrated H.264 decoding capabilities being table stakes in consumer CPUs and GPUs. Accelerated instances with NETINT VPUs include H.264 as part of NETINT’s software development kit (SDK), so it’s installed and ready to go.

- **Native FFmpeg Integration**: FFmpeg is an open source, industry-standard video and audio processing software. Also included in VPUs SDK.

- **Native High Dynamic Range (HDR) Integration**: HDR streaming optimizes color contrast, brightness, and color accuracy for digital media streaming. Also included in VPUs SDK.

- **Low-cost egress**: Egress is a significant line item for media organizations’ cloud bills. Save up to 90% on egress costs with our industry-shattering egress cost of $0.005 (half a penny) per GB.

