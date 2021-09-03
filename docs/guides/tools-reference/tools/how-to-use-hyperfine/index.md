---
slug: how-to-use-hyperfine
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to use hyperfine for benchmarking command-line tools on your Linux system."
og_description: "Learn how to use hyperfine for benchmarking command-line tools on your Linux system."
keywords: ['hyperfine linux','install hyperfine','benchmarking linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-03
modified_by:
  name: Nathaniel Stickman
title: "How to Install and Use hyperfine on Linux"
h1_title: "How to Install and Use hyperfine on Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

`hyperfine` allows you to benchmark command-line commands with features to thoroughly test various commands' performance side by side. `hyperfine` stands out from similar tools by giving you fine control over the benchmarking process and advanced features for more effective testing.

This guide gets you informed about what `hyperfine` is and how it compares to other tools. Then, learn how to install `hyperfine` and how to start using it to benchmark command-line commands on your Linux system.

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

## What is hyperfine?

`hyperfine` is a benchmarking tool for the command line, allowing you to compare the performance of commands. With `hyperfine`, it becomes easy to see how different command-line tools, scripts, and command arguments affect performance.

Frequently, the default `time` command gets used to compare commands' run times. For instance, you could compare `curl` and `wget` with `time` commands like these:

    time curl https://github.com/

{{< output >}}
[...]

real	0m0.078s
user	0m0.022s
sys	0m0.000s
{{< /output >}}

    time wget https://github.com/

{{< output >}}
[...]

real	0m0.093s
user	0m0.009s
sys	0m0.001s
{{< /output >}}

But with `time`, it is difficult to compare results over multiple runs, especially when you are working with multiple commands as well.

Here, `hyperfine` helps with features designed specifically for benchmarking. Its results tend not only to be more readable, but it also gives you fine control of how the benchmarking is performed. Here are a few of those features that make it exceptional for benchmarking:

- By default, `hyperfine` performs multiple runs with each command, and it gives you options to control the number of runs.
- `hyperfine` intelligently detects statistical outliers, making it easy to catch when other processes are affecting your benchmarking runs.
- `hyperfine` can provide warm-up runs and other controls for when system caching is a factor.
- You can have `hyperfine` export its benchmarking result in a variety of formats for external use.

### hyperfine vs. bench

`hyperfine` was inspired by [`bench`](https://github.com/Gabriel439/bench), a similar tool for benchmarking command-line commands. Both tools allow you to easily benchmark commands and provide readable and exportable results.

However, `hyperfine` focuses more on rigorous benchmarking features and on a higher degree of control of the benchmarking process. Several of the performance features described for `hyperfine` above — such as detection of outliers and provision of warm-up runs — are absent in `bench`.

On the other hand, `bench` prioritizes simple usability and more visually engaging output. `bench` can, for instance, create HTML output complete with graphs of commands' performances during benchmarking runs.

## How to Install hyperfine

You can use the DNF package manager to install `hyperfine` on AlmaLinux, CentOS, or Fedora:

    sudo dnf install hyperfine

For Debian and Ubuntu distributions, use the following commands to download and install the `hyperfine` package:

    wget https://github.com/sharkdp/hyperfine/releases/download/v1.11.0/hyperfine_1.11.0_amd64.deb
    sudo dpkg -i hyperfine_1.11.0_amd64.deb

You may want to check the [releases page](https://github.com/sharkdp/hyperfine/releases) for `hyperfine` and replace `1.11.0` in the commands above with the latest version number you find there.

## How to Use hyperfine

The sections below show you how to begin working with `hyperfine` to benchmark commands. They range from the most basic benchmark runs to useful advanced options for rigorously testing commands.

For the examples shown in each of these section, this guide uses code for binary tree algorithms as provided by [The Computer Language Benchmarks Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/index.html). The examples use two scripting languages that come with most Linux distributions by default: Perl and Python 3. To each script, a hash-bang line has been added to make it easier to execute the scripts.

You can get our version of the [Perl script](https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/binarytrees-perl-1.html) by following [this link](binary-tree.pl). And you can pick up our version of the [Python 3 script](https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/binarytrees-python3-1.html) by following [this link](binary-tree.py).

Before following along, you need to give each script executable permission, which you can do with commands like these:

    sudo chmod +x binary-tree.pl
    sudo chmod +x binary-tree.py

HTTPie and curlie
curl and wget

### Benchmarking a Command

`hyperfine` can execute basic benchmarks with a command as simple as this, which benchmarks our Perl script. Notice that `hyperfine` can easily include command-line arguments in its commands, like the `10` below:

    hyperfine './binary-tree.pl 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      55.8 ms ±   1.7 ms    [User: 54.1 ms, System: 1.6 ms]
  Range (min … max):    54.4 ms …  66.4 ms    54 runs
{{< /output >}}

`hyperfine` notifies you if it detects any statistical outliers during the benchmarking. One of the best ways to reduce such outliers is with the `--warmup`. This flag runs the benchmark after a given number of warm-up cycles. The command below runs the Perl script again, but, this time, with 20 warm-up cycles first:

    hyperfine --warmup 20 './binary-tree.pl 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      56.0 ms ±   0.9 ms    [User: 54.7 ms, System: 1.2 ms]
  Range (min … max):    54.6 ms …  58.5 ms    52 runs
{{< /output >}}

`hyperfine` also has a `--prepare` flag which can similarly help to reduce outliers. It works conversely to the `--warmup` flag by allowing you to provide a command to clear the cache before each run. The next example uses `--prepare` to execute a command to clear the disk cache before each execution of the Perl script:

    hyperfine --prepare 'sync; echo 3 | sudo tee /proc/sys/vm/drop_caches' './binary-tree.pl 10'

{{< output >}}
Benchmark #1: ./binary-tree.pl 10
  Time (mean ± σ):      80.0 ms ±   5.8 ms    [User: 54.0 ms, System: 3.7 ms]
  Range (min … max):    69.2 ms …  92.2 ms    27 runs
{{< /output >}}

### Comparing Command Benchmarks

`hyperfine` shines when it comes to providing benchmarks in comparison. It makes the process simple, too. Just provide the two commands back to back.

Here is an example that uses the `--warmup` flag from the section above to benchmark the Perl and Python 3 scripts side by side:

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

You can see above that each script was benchmarked for a different number of runs. Using the `--min-runs` option, you can have `hyperfine` guarantee at least a given number of runs for each command.

Here is another example that does just that, and also uses the `--prepare` option instead of the `--warmup` option to give a different perspective:

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

`hyperfine` comes with several options for exporting your benchmark results. You can use the `--help` flag to see the full list of supported formats, but the following three are commonly useful:

- `--export-csv`
- `--export-json`
- `export-markdown`

Both the CSV and Markdown exports provide similar data. Essentially, you get a table with a summary of the results for each command. The example below gives you Markdown for a comparison between the Perl and Python 3 scripts with a warm-up:

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

If you are looking for more details in your reports, however, you may want to use the `--export-json` option. The resulting JSON file includes the summary information for each command, as in the table above. But, over and above that, the JSON includes the timing for each run on each command. This can make the JSON useful for visualizing your benchmark runs.

Here is an example that generates a JSON report for the same benchmark procedure as above. You can see the full output from the example in [this file](benchmarks.json), while a truncated version is shown below:

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

Check out the GitHub [page for `hyperfine`](https://github.com/sharkdp/hyperfine) to learn a few more useful features the tool offers, including its integration with other tools. If you want to dive deeper into `hyperfine`, use the `--help` flag to get a comprehensive list of options each with a clear and helpful description.
