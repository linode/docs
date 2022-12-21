---
slug: installing-and-using-hyperfine-on-linux
author:
  name: Nathaniel Stickman
description: "Learn how to use hyperfine for benchmarking command-line tools on your Linux system."
keywords: ['hyperfine linux','install hyperfine','benchmarking linux']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-22
modified_by:
  name: Nathaniel Stickman
title: "Install and Use hyperfine on Linux"
h1_title: "How to Install and Use hyperfine on Linux"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

hyperfine is a Linux tool used to benchmark command-line commands. It includes features to test the performance of individual commands, side by side. hyperfine stands out from similar tools by giving you fine-tuned control over the benchmarking process and advanced features for more effective testing.

In this guide, you learn what hyperfine is and how it compares to other tools. Then, you learn how to install hyperfine and how to start using it to benchmark Linux commands on your system.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is hyperfine?

hyperfine is a benchmarking tool for the command line that helps you compare the performance of your system's commands. With `hyperfine`, it becomes easy to see how different command-line tools, scripts, and command arguments affect system performance.

The default `time` command is used to compare command run times. For instance, you could compare `curl` and `wget` with the `time` command as shown below:

    time curl https://github.com/

{{< output >}}
[...]

real 0m0.078s
user 0m0.022s
sys 0m0.000s
{{< /output >}}

    time wget https://github.com/

{{< output >}}
[...]

real 0m0.093s
user 0m0.009s
sys 0m0.001s
{{< /output >}}

With the `time` command, it is difficult to compare results over multiple runs, especially when you are working with multiple commands as well.

In this case, hyperfine helps with features designed specifically for benchmarking. Its results tend not only to be more readable, but it also gives you fine-tuned control of how the benchmarking is performed. The list below includes a few of the features that make hyperfine exceptional for benchmarking:

- By default, hyperfine performs multiple runs with each command, and it gives you options to control the number of runs.
- hyperfine intelligently detects statistical outliers, making it easy to notice when other processes are affecting your benchmarking runs.
- hyperfine can provide warm-up runs and other controls for when system caching is a factor.
- You can export hyperfine's benchmarking results in a variety of formats for external use.

### hyperfine vs. bench

hyperfine was inspired by [bench](https://github.com/Gabriel439/bench), a similar tool for benchmarking commands. Both tools allow you to benchmark commands and provide readable and exportable results. However, hyperfine provides more rigorous benchmarking features and a higher degree of control of the benchmarking process. Several of hyperfine's performance features — such as, detection of outliers and provision of warm-up runs — are absent in bench. On the other hand, bench prioritizes simple usability and more visually engaging output. bench can, for instance, create HTML output complete with graphs of several commands' performance during benchmarking runs.

## How to Install hyperfine

Use the DNF package manager to install hyperfine on **Fedora**:

    sudo dnf install hyperfine

On **Debian**, **Ubuntu**, **AlmaLinux**, and **CentOS**, use the steps below to install hyperfine.

1. Install `gcc`.

    - On **Debian** and **Ubuntu**, use the following command:

          sudo apt install build-essential

    - On **AlmaLinux** and **CentOS** (8 or later), use the following command:

          sudo dnf install gcc

1. Install [Rust](https://www.rust-lang.org/). This method uses the Rust package manager, Cargo, which is included when you install Rust.

        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

    When prompted, select `1` for the default installation path.

1. Either restart your shell session (exiting and logging back in) or run the following command:

        source $HOME/.cargo/env

1. Install hyperfine via the Cargo package manager:

        cargo install hyperfine

Now, verify your installation by checking your system's installed version:

    hyperfine --version

{{< output >}}
hyperfine 1.11.0
{{< /output >}}

## How to Use hyperfine

The sections below show you how to work with hyperfine to benchmark commands. They range from the most basic benchmark runs to useful advanced options for rigorously testing commands.

The examples demonstrated in each of the sections use code for binary tree algorithms as provided by [The Computer Language Benchmarks Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/index.html). These examples use two scripting languages that are installed on most Linux distributions by default: **Perl** and **Python 3**. A hash-bang line has been added to each script to make it easier to execute the scripts.

To follow along, refer to our text file versions of the [Perl script](binary-tree-pearl.txt) and the [Python script](binary-tree-python.txt). You can view the original versions of the scripts in the following links: [Perl script](https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/binarytrees-perl-1.html) and [Python 3 script](https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/binarytrees-python3-1.html).

Before following along, copy the contents of the Perl and Python script files and paste them into individual files. Provide the `.pl` extension for the Perl script and the `.py` extension for the Python script. Then give each script executable permission with the commands below. Replace the script names with your own if they are different.

    sudo chmod +x binary-tree.pl
    sudo chmod +x binary-tree.py

### Benchmarking a Command

hyperfine can execute basic benchmarks commands. The following simple command benchmarks our Perl script. Notice that hyperfine can easily include command-line arguments in its commands, like the argument `10` displayed in the example below:

    hyperfine './binary-tree.pl 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      55.8 ms ±   1.7 ms    [User: 54.1 ms, System: 1.6 ms]
  Range (min … max):    54.4 ms …  66.4 ms    54 runs
{{< /output >}}

hyperfine notifies you if it detects any statistical outliers during its benchmarking. One of the best ways to reduce such outliers is with the `--warmup` flag. This flag runs the benchmark after a given number of warm-up cycles. The command below runs the Perl script again, but, this time, with `20` warm-up cycles first.

    hyperfine --warmup 20 './binary-tree.pl 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      56.0 ms ±   0.9 ms    [User: 54.7 ms, System: 1.2 ms]
  Range (min … max):    54.6 ms …  58.5 ms    52 runs
{{< /output >}}

The `hyperfine` command also has a `--prepare` flag which can similarly help to reduce outliers. It works conversely to the `--warmup` flag by allowing you to provide a command to clear the cache before each run. The example below uses `--prepare` to execute a command to clear the disk cache before each execution of the Perl script.

    hyperfine --prepare 'sync; echo 3 | sudo tee /proc/sys/vm/drop_caches' './binary-tree.pl 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      80.0 ms ±   5.8 ms    [User: 54.0 ms, System: 3.7 ms]
  Range (min … max):    69.2 ms …  92.2 ms    27 runs
{{< /output >}}

### Comparing Command Benchmarks

hyperfine is excellent at providing comparison benchmarks. To execute a comparison benchmark, provide the two commands to benchmark, back to back.

Below is an example that uses the `--warmup` flag from the example in the section above. It benchmarks the Perl (`binary-tree.pl`) and Python 3 (`binary-tree.py`) scripts side by side.

    hyperfine --warmup 20 './binary-tree.pl 10' './binary-tree.py 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      55.8 ms ±   2.0 ms    [User: 54.6 ms, System: 1.1 ms]
  Range (min … max):    54.0 ms …  67.3 ms    53 runs

Benchmark #2: ./binary-tree.py 10
  Time (mean ± σ):      57.0 ms ±   4.9 ms    [User: 77.6 ms, System: 15.2 ms]
  Range (min … max):    49.3 ms …  70.2 ms    58 runs

Summary
  './binary-tree.pl 10' ran
    1.02 ± 0.10 times faster than './binary-tree.py 10'
{{< /output >}}

You can see from the output that each script was benchmarked for a different number of runs. Using the `--min-runs` flag, you can have `hyperfine` guarantee at least a given number of runs for each command.

Below is another example that does just that, and also uses the `--prepare` flag instead of the `--warmup` flag to give a different perspective.

    hyperfine --min-runs 60 --prepare 'sync; echo 3 | sudo tee /proc/sys/vm/drop_caches' './binary-tree.pl 10' './binary-tree.py 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      70.7 ms ±   4.5 ms    [User: 56.1 ms, System: 2.3 ms]
  Range (min … max):    66.9 ms …  95.5 ms    60 runs

Benchmark #2: ./binary-tree.py 10
  Time (mean ± σ):     109.3 ms ±  10.8 ms    [User: 80.6 ms, System: 25.2 ms]
  Range (min … max):    95.8 ms … 159.6 ms    60 runs

Summary
  './binary-tree.pl 10' ran
    1.55 ± 0.18 times faster than './binary-tree.py 10'
{{< /output >}}

### Benchmark Reports

hyperfine comes with several options for exporting your benchmark results. You can use the `--help` flag to see the full list of supported formats, but the following three options are commonly useful.

- `--export-csv`
- `--export-json`
- `export-markdown`

Both the CSV and Markdown exports provide similar data. Essentially, you get a table with a summary of the results for each command. The example below exports Markdown for a comparison between the Perl and Python 3 scripts with a `--warmup` flag.

    hyperfine --warmup 20 './binary-tree.pl 10' './binary-tree.py 10' --export-markdown benchmarks.md

{{< file "benchmarks.md" >}}
| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `./binary-tree.pl 10` | 56.3 ± 1.6 | 54.8 | 63.8 | 1.00 |
| `./binary-tree.py 10` | 56.6 ± 3.4 | 51.0 | 68.7 | 1.00 ± 0.07 |
{{< /file >}}

That Markdown should render something like this:

| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `./binary-tree.pl 10` | 56.3 ± 1.6 | 54.8 | 63.8 | 1.00 |
| `./binary-tree.py 10` | 56.6 ± 3.4 | 51.0 | 68.7 | 1.00 ± 0.07 |

If you are looking for more details in your reports, however, you may want to use the `--export-json` option. The resulting JSON file includes the summary information for each command, as in the table above. The JSON also includes the timing for each run on each command. This can make the JSON useful for visualizing your benchmark runs.

The example command below generates a JSON report for the same benchmark procedure as above. You can see the full output from the example in [benchmarks-json.txt](benchmarks-json.txt) file. A truncated version is shown below:

    hyperfine --warmup 20 './binary-tree.pl 10' './binary-tree.py 10' --export-json benchmarks.json

{{< file "benchmarks.json" >}}
{
  "results": [
    {
      "command": "./binary-tree.pl 10",
      "mean": 0.05719516349499999,
      "stddev": 0.002536978010986194,
      "median": 0.056269627615000005,
      "user": 0.055989819999999975,
      "system": 0.0011128738,
      "min": 0.05515711711500001,
      "max": 0.06938542011500001,
      "times": [
        0.058837667115000006,
        0.05938219511500001,
        0.05660807711500001,
        [...]
      ]
    },
    {
      "command": "./binary-tree.py 10",
      "mean": 0.05767027435989798,
      "stddev": 0.004800360187314943,
      "median": 0.05630276211500001,
      "user": 0.07643589061224489,
      "system": 0.015199427959183675,
      "min": 0.05110141111500001,
      "max": 0.068906813115,
      "times": [
        0.060449119115000005,
        0.056662226115000006,
        0.05561796411500001,
        [...]
      ]
    }
  ]
}
{{< /file >}}

## Conclusion

Check out the [GitHub page for hyperfine](https://github.com/sharkdp/hyperfine) to learn a few more useful features the tool offers, including its integration with other tools. If you want to dive deeper into `hyperfine`, use the `--help` flag to view a comprehensive list of options, each with a clear and helpful description.
