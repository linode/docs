---
slug: install-and-use-ffmpeg-on-linux
author:
  name: Jeff Novotny
description: 'This guide will show you how to install FFmpeg, a utility that can transcode audio and video, cut and crop video, and integrates with Python.'
og_description: 'This guide will show you how to install FFmpeg, a utility that can transcode audio and video, cut and crop video, and integrates with Python.'
keywords: ['FFmpeg python','FFmpeg concat','FFmpeg trim video','FFmpeg crop','FFmpeg cut','FFmpeg mkv to mp4']
tags: ['linux', 'python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
image: HowtoInstallandUseFFmpegonLinux.jpg
modified_by:
  name: Linode
title: "Install and Use FFmpeg on Linux"
h1_title: "How to Install and Use FFmpeg on Linux"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: https://github.com/JeffreyNovotny
external_resources:
- '[FFMpeg](http://ffmpeg.org/)'
- '[FFmpeg-Python GitHub page](https://github.com/kkroening/ffmpeg-python)'
- '[FFmpeg-Python examples page](https://github.com/kkroening/ffmpeg-python/tree/master/examples)'
---

[*FFMpeg*](http://ffmpeg.org/) is a free and open-source utility that is used for video and audio processing. It assists with the editing, reformatting, and conversion of audio, video, and multimedia files. FFmpeg contains a suite of libraries and programs that can be embedded into other media applications or function as a stand-alone command-line utility. This guide provides a brief introduction to FFmpeg. It also explains how to install FFmpeg and how to use FFmpeg to edit media files.

## What is FFmpeg

The name FFmpeg is derived from the phrase "fast forward" and the name of the *Moving Picture Experts Group* (MPEG) video standards group. FFmpeg is used for technically demanding operations on media files such as format conversion, encoding, resizing, concatenation, and compression. The application is mainly geared towards industry professionals and software developers. The FFmpeg libraries power many common media-based applications, including YouTube, iTunes, and the video player VLC.

The inherent complexity of FFmpeg and its extensive number of options means it is not always easy for beginners to use. FFmpeg also lacks native input and output mechanisms for audio and video. It does not include a GUI, but some third-party products integrate with it. FFmpeg can be downloaded as an official version or through Linux packages, but it can also be compiled directly from the source code. It is most typically used on Linux or macOS platforms.

FFmpeg operates as a command-line application, so it can be fully incorporated into automated processes. The FFmpeg suite of utilities includes the core `ffmpeg` tool, the media player `ffplay`, and `ffprobe`, which displays media information. `ffprobe` can also inspect files and individual frames. One of the most useful FFmpeg components is `libavcodec`, a codec, multiplexer, and demultiplexer library. This library can handle a wide variety of media formats, including relatively uncommon or older ones. It also supports all common platforms and streaming protocols.

Some of the most popular FFmpeg features are as follows:

- Format transcoding, which converts a file from one format to another, such as `.mp3`to `.wav`.
- File compression
- Basic editing operations, such as trimming or concatenation
- Video scaling
- Adding visual effects or subtitles
- Frame filtering
- Frame extraction
- Standards compliance

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install FFmpeg

The following steps illustrate how to install FFmpeg version 4.2 from the default package. This version is suitable for most users. These installation instructions are geared towards Ubuntu users.

1. Update the available Linux packages.

        sudo apt update
1. Install the `ffmpeg` package.

        sudo apt install ffmpeg
    {{< output >}}
ffmpeg version 4.2.4-1ubuntu0.1 Copyright (c) 2000-2020 the FFmpeg developers
built with gcc 9 (Ubuntu 9.3.0-10ubuntu2)
    {{< /output >}}
1. To verify the FFmpeg version, use the following command:

        ffmpeg -version

{{< note >}}
FFmpeg can also be compiled from the source code. This approach is recommended for advanced users who might want to modify or tinker with FFmpeg. For instructions on how to compile FFmpeg from source, consult the [official FFmpeg Compilation Guide](https://trac.ffmpeg.org/wiki/CompilationGuide).
{{< /note >}}

## FFmpeg Options

Certain FFmpeg options are used in many different contexts, so it helps to be familiar with them. Some of these options are appended to the main `ffmpeg` command to display the available alternatives, for instance, all of the codec files. Others are used when editing the files. A full list of the options is available in the [ffmpeg Documentation](http://ffmpeg.org/ffmpeg.html).

### Generic FFmpeg Options

The following FFmpeg options are used to display information. To use these options, specify the `ffmpeg` command and the option, for example, `ffmpeg -devices`. For information on the various options, see section 5.2 of the [ffmpeg Documentation](http://ffmpeg.org/ffmpeg.html#Generic-options).

Below is a list of the most commonly used generic options.

- `-h/-help`: Displays the help information.
- `-demuxers`: Displays the demultiplexer options.
- `-muxers`: Displays all the available multiplexers.
- `-devices`: Displays the supported devices.
- `-codecs`: Lists all the codec options (media bit-stream formats) inside `libavcodec`.
- `-decoders`: Lists all decoders.
- `-encoders`: Lists the available encoders.
- `-filters`: Displays all the filter options contained in `libavfilter`.

### FFmpeg Command Options

The following FFmpeg options are typically used with the various tools to specify parameters to the command. A full list of options can be found in section 5.4 of the [FFmpeg Documentation](https://ffmpeg.org/ffmpeg.html#Main-options).

The list below contains some of the main options.

- `-i`: Supplies the URL or file location of the input file.
- `-c`: Specifies the type of codec to use.
- `-ss`: Indicates the starting input position of the file. FFmpeg "seek scans" as accurately as possible to this position.
- `-t`: Indicates the duration to read from the input file or write to the output file.
- `-target`: Is used to specify the target file type.
- `-filter`: Specifies a filter to apply to the stream.

### FFmpeg Stream Specifiers

Most of the FFmpeg options can be used in conjunction with stream specifiers. A stream specifier designates the streams to which the option should be applied. An `a` indicates an audio stream, while a `v` denotes a video stream. A zero-based stream index can also be specified. If there is no stream specifier, then the option is applied to all streams.

To use a stream specifier, append it to the option, separating it with a colon. For example, to apply the `ac3` codec to the second audio stream, the stream specifier would be `-codec:a:1 ac3`. However, `-codec:a ac3` applies the codec to all audio streams.

For detailed information on stream specifiers, consult the [FFmpeg Documentation](https://ffmpeg.org/ffmpeg.html#Stream-specifiers-1).

## How to Use FFmpeg to Display File Information

To display technical details about a file, use the `ffmpeg -i` command along with the file name. The `-hide_banner` option strips out any details about the FFmpeg application and libraries, and only displays the file information.

{{< note >}}
Sample files in various formats are available from the [File Samples Archive](https://filesamples.com/categories/video). These short clips are very useful for trying out the various FFmpeg capabilities.
{{< /note >}}

    ffmpeg -i filename.mov -hide_banner

Running the command should return a similar output:

{{< output >}}
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'filename.mov':
  Metadata:
    major_brand     : qt
    minor_version   : 537199360
    compatible_brands: qt
    creation_time   : 2015-08-05T14:58:54.000000Z
  Duration: 00:01:36.65, start: 0.000000, bitrate: 7909 kb/s
    Stream #0:0(eng): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(tv, bt709), 1280x720, 7905 kb/s, 59.94 fps, 59.94 tbr, 5994 tbn, 11988 tbc (default)
    Metadata:
      creation_time   : 2015-08-05T14:58:54.000000Z
      handler_name    : Apple Video Media Handler
      encoder         : H.264
{{< /output >}}

## How to Concatenate a File with FFmpeg

FFmpeg provides a mechanism to concatenate, or join, several media files into one file. All input files must have the same format and use the same codec. For example, all files might be of type `mp4`.

1. Create a `join.txt` file containing the full path of all the files to join. Each file must be preceded by the keyword `file` and listed on a separate line. Do not add any empty lines between the entries.

    {{< file "join.txt" aconf >}}
file dir/file1.mov
file dir/file2.mov
    {{< /file >}}
1. Use the `concat` filter to join the files. Specify the `join.txt` file as the input file. The following command appends `file2.mov` to the end of `file1.mov` and saves the resulting file as `concatenate.mov`.

        ffmpeg -f concat -i join.txt -c copy concatenate.mov

    Your output should resemble the following:

    {{< output >}}
Input #0, concat, from 'join.txt':
  Duration: N/A, start: 0.000000, bitrate: 1428 kb/s
    Stream #0:0(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 126 kb/s
    Metadata:
      creation_time   : 2008-05-01T21:39:25.000000Z
      handler_name    : Apple Sound Media Handler
    Stream #0:1(eng): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(tv, bt709), 1280x720, 1302 kb/s, 29.97 fps, 29.97 tbr, 5994 tbn, 11988 tbc
    Metadata:
      creation_time   : 2008-05-01T21:39:25.000000Z
      handler_name    : Apple Video Media Handler
      encoder         : H.264
Output #0, mov, to 'concatenate.mov':
  Metadata:
    encoder         : Lavf58.29.100
    Stream #0:0(eng): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(tv, bt709), 1280x720, q=2-31, 1302 kb/s, 29.97 fps, 29.97 tbr, 11988 tbn, 5994 tbc
    Metadata:
      creation_time   : 2008-05-01T21:39:25.000000Z
      handler_name    : Apple Video Media Handler
      encoder         : H.264
    Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 126 kb/s
    Metadata:
      creation_time   : 2008-05-01T21:39:25.000000Z
      handler_name    : Apple Sound Media Handler
Stream mapping:
  Stream #0:1 -> #0:0 (copy)
  Stream #0:0 -> #0:1 (copy)
Press [q] to stop, [?] for help
[mov,mp4,m4a,3gp,3g2,mj2 @ 0x55d49ab13bc0] Auto-inserting h264_mp4toannexb bitstream filter
frame= 8116 fps=0.0 q=-1.0 Lsize=   77968kB time=00:04:30.75 bitrate=2359.0kbits/s speed=1.22e+03x
video:73433kB audio:4180kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.458374%
    {{< /output >}}
1. Verify the file information for `concatenate.mov` and ensure the file is in the correct format and has the expected length.

        ffmpeg -i concatenate.mov  -hide_banner

    The output provides the following information:

    {{< output >}}
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'concatenate.mov':
  Metadata:
    major_brand     : qt
    minor_version   : 512
    compatible_brands: qt
    encoder         : Lavf58.29.100
  Duration: 00:04:30.79, start: 0.000000, bitrate: 2358 kb/s
    Stream #0:0(eng): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(tv, bt709), 1280x720, 2223 kb/s, 29.97 fps, 29.97 tbr, 11988 tbn, 23976 tbc (default)
    Metadata:
      handler_name    : Apple Video Media Handler
      encoder         : H.264
    Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 126 kb/s (default)
    Metadata:
      handler_name    : Apple Sound Media Handler
    {{< /output >}}

## How to Trim or Cut a Video with FFmpeg

It is possible to cut a smaller segment from a larger media file. The trimmed out section can either be saved as a new file or replace the old one. Use the `-ss` variable to specify a starting point in hours, minutes, and seconds. It is possible to define the duration of the clip by using the `-t` option. However, the ending point can also be indicated with the `-to` option followed by the timestamp of the ending point.

In the following example, the part to trim out begins at `00:01:30` and has a duration of `60` seconds. It is saved to `trim.mov`.

    ffmpeg -i file1.mov -ss 00:01:30 -t 60 -c copy trim.mov

Your output should resemble the following:

{{< output >}}
...
Output #0, mov, to 'trim.mov':
...
frame= 1797 fps=0.0 q=-1.0 Lsize=   23617kB time=00:00:59.98 bitrate=3225.1kbits/s speed=1.32e+03x
video:22612kB audio:939kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.279974%
{{< /output >}}

## How to Crop a Video with FFmpeg

FFmpeg provides a method for cropping videos. When using the `crop` filter, add the stream specifier `v` to indicate that only the video component should be edited. The dimensions and offset of the crop must be in the format `crop=w:h:x:y`. The `w` and `h` are the width and height, in pixels, of the section to crop out. Indicate the offset of the crop using `x` and `y` coordinates of the upper left corner.

{{< note >}}
The crop filter can negatively affect video quality.
{{< /note >}}

    ffmpeg -i file1.mov -filter:v "crop=640:480:150:100" crop.mov

After running the command, you should see a similar output:

{{< output >}}
...
        Output #0, mov, to 'crop.mov':
  Metadata:
    major_brand     : qt
    minor_version   : 512
    compatible_brands: qt
    encoder         : Lavf58.29.100
    Stream #0:0(eng): Video: h264 (libx264) (avc1 / 0x31637661), yuv420p, 640x480, q=-1--1, 29.97 fps, 11988 tbn, 29.97 tbc (default)
...
{{< /output >}}

## How to Convert Files with FFmpeg

As long as the input and output formats are supported, it is straightforward to convert between one format and another. Specify the name of the input file, the name of the output file, and the extension that corresponds to the new format. FFmpeg determines the correct format based on the extension. Here are a couple of examples to illustrate this process.

### .mkv to .mp4 Format

To convert from a `.mkv` format to `.mp4`, specify the original file as the input file. Then, specify the name of the new file with the `.mp4` extension. This allows for the correct conversion detection formula. The name of the output file does not have to match the name of the input file.

    ffmpeg -i file1.mkv convert.mp4

After running the command, your out resembles the following:

   {{< output >}}
Output #0, mp4, to 'convert.mp4':
  Metadata:
    COMPATIBLE_BRANDS: isomavc1
    MAJOR_BRAND     : isom
    MINOR_VERSION   : 1
    encoder         : Lavf58.29.100
    Stream #0:0: Video: h264 (libx264) (avc1 / 0x31637661), yuv420p, 960x400 [SAR 1:1 DAR 12:5], q=-1--1, 23.98 fps, 24k tbn, 23.98 tbc (default)
    Metadata:
      HANDLER_NAME    : GPAC ISO Video Handler
      DURATION        : 00:00:46.550000000
      encoder         : Lavc58.54.100 libx264
    Side data:
      cpb: bitrate max/min/avg: 0/0/0 buffer size: 0 vbv_delay: -1
    Stream #0:1: Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 128 kb/s (default)
    Metadata:
      HANDLER_NAME    : GPAC ISO Audio Handler
      DURATION        : 00:00:46.616000000
      encoder         : Lavc58.54.100 aac
frame= 1116 fps= 53 q=-1.0 Lsize=   16058kB time=00:00:46.63 bitrate=2820.7kbits/s speed= 2.2x
video:15326kB audio:701kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.192612%
    {{< /output >}}

### .mov to mp4 Format

To convert from a `.mov` format to `.mp4`, repeat the process, but use the `.mov` file as input. The output file is specified with an `mp4` extension. FFmpeg auto-detects the format of each file.

    ffmpeg -i file1.mov convert2.mp4

## How to Use FFmpeg with Python

FFmpeg functionality can be integrated with the Python programming language. This allows common media processing tasks to be handled in software. The FFmpeg-Python package contains an FFmpeg wrapper that supports the most common filters, devices, and codec types.

This approach allows a finer level of control over the media translation process. For example, a developer could write a program to concatenate every other ten-second segment into a new file. For more information on FFmpeg-Python, see the [FFmpeg-Python GitHub page](https://github.com/kkroening/ffmpeg-python).

To install FFmpeg-Python, follow the instructions below:

1. If Python is not already installed, install it using `apt`.

        sudo apt install python3-dev python3-pip
1. Use `pip` to install the `ffmpeg-python` package.

        pip install ffmpeg-python
1. To use FFmpeg-Python in an existing Python project, import the package using the `import ffmpeg` directive.

{{< note >}}
The FFmpeg-Python developers have some code fragments on their GitHub page to help new developers get started. The [FFmpeg-Python examples page](https://github.com/kkroening/ffmpeg-python/tree/master/examples) has several useful routines, including complete `.py` sample files.
{{< /note >}}
