---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to benchmark a Linux server: test your CPU, RAM, storage devices, database performance, network bandwidth and stress test an HTTP server'
keywords: ["benchmark", "test", "stress test", "benchmark CPU", "benchmark RAM", "benchmark storage", "benchmark network bandwidth"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-29
modified: 2017-11-30
modified_by:
  name: Linode
title: 'How to Benchmark a Linux Server'
contributor:
  name: Alexandru Andrei
  link: Github/Twitter/LinkedIn URL
external_resources:
  - '[Manual Page for sysbench](https://manpages.debian.org/stretch/sysbench/sysbench.1.en.html
)'
  - '[sysbench GitHub Page](https://github.com/akopytov/sysbench)'
---

When you want to compare performance between two or more machines, you can run utilities designed to push these systems as far as they can go, returning results that help you make a choice on which one is faster for a specific job. Another purpose of running benchmarks can be to find out what kind of resources you need to allocate to a Linode so that it can serve a certain purpose in a satisfactory manner, e.g. how much RAM and CPU cores it needs, to be able to serve a website to 10 visitors per second without lagging or running out of memory.

In this tutorial you'll learn how to benchmark your server's CPU, memory and storage device(s) with *sysbench*. You'll also learn how to stress test a web server and database server, to see how far you can push your current configuration before it starts to run out of resources. You can also use this when you want to optimize your web application and see what kind of performance boost you get from the updated code. Finally, you'll be guided on how to test your network bandwidth.

## Before You Begin

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

Familiarize yourself with our [Getting Started](/docs/getting-started) guide, deploy a Debian 9 image and complete the steps for setting your Linode's hostname and timezone.

## General Guidelines for Effective Benchmarking

1.  There are many utilities and methods with which you can test the performance of your instance. The most important aspect is that the results are consistent. Running a test with the same parameters, multiple times, on the same (virtual) machine, should return almost exactly the same numbers. If they differ too much, the results become unreliable and you cannot compare them across different systems. An example about a thing that can alter results in an undesired way is cache. This happens when you read data from a storage device. At the first read, data is retrieved from the device itself but the operating system will also cache this information in the Random Access Memory, which is faster, so subsequent reads are more efficient. This is good for normal use because it improves speed but it's bad for benchmarking since it artificially inflates results.

2.  Often times, the numbers you get by running the same benchmark twice, even on the same configuration, will vary slightly. If these differences are above an acceptable margin (for example larger than a 5% difference), you can re-run the test multiple times and calculate the average values, to get more meaningful data. You should always run a test at least twice and check for differences.

3.  What utilities you use and what kind of benchmarks you want to run depend heavily on the way you intend to use your Linode. A good benchmark is one that closely resembles the workload your application will give to the machine. Consult the manual pages of the utilities you use to test your Linode and optimize the workload as best as you can by using the appropriate command line parameters. For example, if your database uses the InnoDB engine and not MyISAM, then you should pass `--mysql-table-engine=innodb` as a parameter to sysbench. Benchmarks that are too general and not customized enough to resemble expected workload can lead to the following problem: an unoptimized benchmark could tell you that machine A is faster than machine B. If however, you run the optimized benchmark, it could happen that machine B is faster than machine A for that specific use case.

4.  There are many ways to test the capabilities of a machine and some don't even need specialised tools. The Arch Wiki has a good starting point to learn more about this: [Arch Wiki Guide on Benchmarking](https://wiki.archlinux.org/index.php/benchmarking).

5.  Run the benchmarks on fresh, clean servers. You don't want other processes competing for resources.

6.  When you want to compare results between different systems, remember to pass identical command line parameters to the benchmarking utility, on every machine.

## How to Use sysbench

1.  First, install the utility:

        sudo apt install sysbench

2.  You can consult the manual page by entering `man sysbench` in your terminal. When you want to close the manual press **q**. If you prefer the online version you can find it here: [Debian's sysbench Manual](https://manpages.debian.org/stretch/sysbench/sysbench.1.en.html).

3.  The manual is unfortunately incomplete. One of the areas that isn't covered is the one regarding memory benchmarking. You can still access helping information though by using the command line. Replace the `--test=memory` value with the test type that interests you.

        sysbench --test=memory help

### Benchmark the CPU with sysbench

1.  To benchmark your CPU run:

        sysbench --test=cpu run

2.  When the benchmark finishes executing, you will get output similar to this:

        sysbench 0.4.12:  multi-threaded system evaluation benchmark

        Running the test with following options:
        Number of threads: 1

        Doing CPU performance benchmark

        Threads started!
        Done.

        Maximum prime number checked in CPU test: 10000


        Test execution summary:
            total time:                          12.5789s
            total number of events:              10000
            total time taken by event execution: 12.5774
            per-request statistics:
                 min:                                  1.25ms
                 avg:                                  1.26ms
                 max:                                  1.79ms
                 approx.  95 percentile:               1.27ms

        Threads fairness:
            events (avg/stddev):           10000.0000/0.00
            execution time (avg/stddev):   12.5774/0.00

    **total time** is the most important result here but you should also pay attention to **per-request statistics**. The numbers in that section should be very close to each other. If **max** is much larger than the others, then the results are skewed by some undesired event, like another process stealing and competing for CPU resources, the hypervisor throttling your CPU or something else. In such a case you should repeat the test until all values are similar.

3.  If the test finishes too fast, you might want to add more numbers for sysbench to crunch by changing the `--cpu-max-prime` parameter which is 10000 by default. On a multi-core system you might also adjust `--num-threads` and set it equal to the number of cores available.

        sysbench --test=cpu --cpu-max-prime=30000 --num-threads=2 run

### Benchmark System RAM with sysbench

1.  Remember to adjust `--num-threads`, according to the number of cores you have, and run a memory read test:

        sysbench --test=memory --num-threads=1 --memory-total-size=1024G --memory-oper=read --memory-block-size=32K run

    The results you will get by using these parameters won't reflect the maximum memory bandwidth your Linode is capable of. Random Access Memory is very fast, but applications often work with small memory blocks (sometimes even smaller than the 32 Kilobytes we have used here). Increasing the `--memory-total-size` and `--memory-block-size` parameters (use powers of two as values, like 16, 32, 64 and so on) will allow you to see the upper limits of the bandwidth available. Here's an example: `sysbench --test=memory --num-threads=1 --memory-total-size=1024T --memory-oper=read --memory-block-size=1G run`. The results will be orientative since almost no piece of software uses such large blocks. If you intend to host an application on your Linode and know what block sizes it will deal with, use that value as a test parameter.

2.  When the test is finished, the output should look like this:

        sysbench 0.4.12:  multi-threaded system evaluation benchmark

        Running the test with following options:
        Number of threads: 1

        Doing memory operations speed test
        Memory block size: 32K

        Memory transfer size: 1048576M

        Memory operations type: read
        Memory scope type: global
        Threads started!
        Done.

        Operations performed: 33554432 (3579528.58 ops/sec)

        1048576.00 MB transferred (111860.27 MB/sec)


        Test execution summary:
            total time:                          9.3740s
            total number of events:              33554432
            total time taken by event execution: 6.5892
            per-request statistics:
                 min:                                  0.00ms
                 avg:                                  0.00ms
                 max:                                  0.11ms
                 approx.  95 percentile:               0.00ms

        Threads fairness:
            events (avg/stddev):           33554432.0000/0.00
            execution time (avg/stddev):   6.5892/0.00

    Like in the previous subsection, you should pay attention to the **total time** and the **per-request statistics** (**min**, **avg** and **max** should be fairly similar, otherwise you should repeat the test). However, the more important values of this test are **Operations performed** (**ops/sec**) and **MB transferred** (**MB/sec**).

3.  To write to memory:

        sysbench --test=memory --num-threads=1 --memory-total-size=128G --memory-oper=write --memory-block-size=32K run

### Benchmark Storage Devices with sysbench

1.  There are six kind of tests sysbench can run on storage media. The test type is passed through the `--file-test-mode` parameter and can take the following values: seqwr (sequential write), seqrewr (sequential rewrite), seqrd (sequential read), rndrd (random read), rndwr (random write) and rndrw (random read/write). The one you should choose depends on what kind of workload you expect. If uncertain, test random reads and random writes, as those happen more often under normal circumstances. Sequential writes and reads usually take place when the system creates or reads large files, in a contiguous sweep, which for most use-cases, is a rare occurrence. If your application does however deal with such scenarios often, then run the sequential read and write tests. Keep in mind that some workloads, even when they deal with large files (for example a database kept in a large file), write randomly, not sequentially as bits and pieces are added, modified or read in arbitrary locations of that file.

2.  Prepare the files that will be used by the benchmark:

        sysbench --test=fileio --file-total-size=10G --file-num=128 prepare

3.  Run a random read test, keeping `--file-total-size` and `--file-num` consistent with the values you used in the previous step:

        sysbench --test=fileio --file-total-size=10G --file-test-mode=rndrd --file-block-size=1M --file-num=128 --num-threads=1 --file-extra-flags=direct run

    A `--file-block-size` of four Kilobytes (4K) should be used if you want to see how the storage device performs in worst-case scenarios and one megabyte (1M) if you want to see how it performs under good conditions.The last parameter, `--file-extra-flags`, will instruct the utility to avoid reading files from cache and transfer data directly from the storage device.

4.  Typical output looks like this:

        sysbench 0.4.12:  multi-threaded system evaluation benchmark

        Running the test with following options:
        Number of threads: 1

        Extra file open flags: 16384
        128 files, 80Mb each
        10Gb total file size
        Block size 1Mb
        Number of random requests for random IO: 10000
        Read/Write ratio for combined random IO test: 1.50
        Periodic FSYNC enabled, calling fsync() each 100 requests.
        Calling fsync() at the end of test, Enabled.
        Using synchronous I/O mode
        Doing random read test
        Threads started!
        Done.

        Operations performed:  10000 Read, 0 Write, 0 Other = 10000 Total
        Read 9.7656Gb  Written 0b  Total transferred 9.7656Gb  (433.33Mb/sec)
          433.33 Requests/sec executed

        Test execution summary:
            total time:                          23.0773s
            total number of events:              10000
            total time taken by event execution: 23.0664
            per-request statistics:
                 min:                                  0.67ms
                 avg:                                  2.31ms
                 max:                                 27.99ms
                 approx.  95 percentile:               2.93ms

        Threads fairness:
            events (avg/stddev):           10000.0000/0.00
            execution time (avg/stddev):   23.0664/0.00

    The most important results here are transfer rates (**Mb/sec**) and **Requests/sec executed**. **per-request statistics** are expected to vary more here. It's worth mentioning that **Mb/sec** doesn't intend to show you the storage device's maximum read/write speeds. To see how fast the device can read and write, there's a section dedicated to that further in the tutorial.

5.  If you want to run this benchmark with different parameters, clean up the prepared files and then go back to step two:

        sysbench --test=fileio cleanup

6.  To run a random write test there is no need to prepare files in advance:

        sysbench --test=fileio --file-total-size=10G --file-test-mode=rndwr --file-block-size=1M --file-num=128 --num-threads=1 --file-extra-flags=dsync run

### Benchmark MariaDB/MySQL Database with sysbench

1.  Benchmarking a database gets the CPU, RAM and storage devices to work collaboratively, so it's actually a good idea to run this even if your application doesn't use MariaDB or MySQL. It can give you perspective on how the system performs as a whole. Install the database server:

        sudo apt install mariadb-server

2.  Now create a database and a user:

        sudo mysql -u root -e "CREATE DATABASE sbtest;"
        sudo mysql -u root -e "CREATE USER 'sysbench'@'localhost';"
        sudo mysql -u root -e "GRANT ALL PRIVILEGES ON sbtest.* TO 'sysbench'@'localhost';"

3.  Prepare the database for the benchmark:

        sysbench --test=oltp --oltp-table-size=10000 --mysql-user=sysbench --mysql-table-engine=innodb prepare

4.  Finally, run the benchmark:

        sysbench --test=oltp --num-threads=1 --oltp-table-size=10000 --mysql-user=sysbench --mysql-table-engine=innodb run

5.  Here's an example of a benchmark result:

        OLTP test statistics:
            queries performed:
                read:                            140000
                write:                           50000
                other:                           20000
                total:                           210000
            transactions:                        10000  (305.48 per sec.)
            deadlocks:                           0      (0.00 per sec.)
            read/write requests:                 190000 (5804.05 per sec.)
            other operations:                    20000  (610.95 per sec.)

        Test execution summary:
            total time:                          32.7358s
            total number of events:              10000
            total time taken by event execution: 32.6685
            per-request statistics:
                 min:                                  2.43ms
                 avg:                                  3.27ms
                 max:                                 17.02ms
                 approx.  95 percentile:               4.46ms

        Threads fairness:
            events (avg/stddev):           10000.0000/0.00
            execution time (avg/stddev):   32.6685/0.00

    The most important values here are the ones that end with **per sec** and the **avg** time under **per-request statistics**.

6.  If you want to run the test again, with different parameters, clean up the database and start again from step three.

        sysbench --test=oltp --mysql-user=sysbench cleanup

## Find Storage Device's Maximum Sequential Read/Write Speeds

1.  If you want to see how fast Linode's SSDs can write a 10GB file, make sure you have enough free space and then enter the following command:

        dd if=/dev/zero of=temp bs=1M count=10240 status=progress oflag=sync


2.  To see how fast you can read files, first clear caches from memory:

        echo 3 | sudo tee /proc/sys/vm/drop_caches

3.  Now use dd to read the previously created file:

        dd if=temp of=/dev/null status=progress

4.  Remove the file:

        rm temp

## Benchmark HTTP Server with Apache's ab Utility

1.  You will need to launch a second Linode to host your web application. While you could install your site on the current Linode, benchmark results would be misleading because the same operating system would create thousands of requests and also serve them. These would compete for resources and CPU time and the benchmark results would be much lower than what a separate Linode that only has to serve requests would give you.

    Instructions on how to configure an HTTP server on a Linode are dependent on the web application you are using. As a general guide you can look at instructions to [Install a LAMP Stack on Debian](/docs/web-servers/lamp/lamp-on-debian-8-jessie) or [How to Install a LEMP Stack on Ubuntu](/docs/web-servers/lemp/how-to-install-a-lemp-server-on-ubuntu-16-04/). You could also use other HTTP servers if you prefer them over Apache and nginx. After you've configured the server, upload a demo version of your site there. If you're using a popular content management system like Magento, PrestaShop, Joomla or others, you can search Linode Docs for more specific instructions on how to host that platform.

2.  Install this package to get the Apache benchmarking utility:

        sudo apt install apache2-utils

3.  In the next command, the `-n` parameter specifies the number of requests to make to your web server and `-c` specifies the maximum number of concurrent requests. Depending on how complex your web application is, you may need to adjust these up or down. Press **CTRL+C** if the test is taking too long and change the values passed to the command. If the test finishes too fast, increase the values of both parameters until this runs for at least one minute, to get meaningful results. Replace `203.0.113.1` with the IP address of the Linode hosting your website. If you need to fine tune other settings, consult the utility manual by entering `man ab` in the command line.

        ab -n 100000 -c 500 203.0.113.1/

4.  Here's the part of the output that is of interest:

        Concurrency Level:      500
        Time taken for tests:   54.415 seconds
        Complete requests:      100000
        Failed requests:        17
           (Connect: 0, Receive: 0, Length: 17, Exceptions: 0)
        Total transferred:      1097313425 bytes
        HTML transferred:       1069918083 bytes
        Requests per second:    1837.74 [#/sec] (mean)
        Time per request:       272.073 [ms] (mean)
        Time per request:       0.544 [ms] (mean, across all concurrent requests)
        Transfer rate:          19693.16 [Kbytes/sec] received

        Connection Times (ms)
                      min  mean[+/-sd] median   max
        Connect:        0    7  86.1      0    3240
        Processing:     5  138 2015.0     26   53376
        Waiting:        4  135 1996.5     26   53376
        Total:         17  145 2055.7     26   54401

        Percentage of the requests served within a certain time (ms)
          50%     26
          66%     26
          75%     26
          80%     26
          90%     26
          95%     28
          98%     31
          99%     43
         100%  54401 (longest request)

    **Requests per second** and **Time per request** can give you a rough idea about how many users the web server can handle and how fast it can respond under that level of stress. **Connection Times** show you the best and the worst response times, so you can estimate how long visitors will wait until their connection is processed. The median time shows you how long most of them will wait and the max time shows you the worst case scenarios, how long the unluckiest visitors will have to wait under that specific server load. If **Failed requests** is not zero then it means the server is having trouble keeping up with so many visitors, usually because it ran out of memory.

    The last fields under **Percentage of the requests served within a certain time** show you how waiting times are distributed. The value under **50%** for example means that 50% of users had to wait less than that time to get the page served.

    It's important to note that this test is just a rough estimate of a real world scenario. In this benchmark, the utility makes requests to the same URL which means the web server is probably reading the same files, images and database entries. In a real scenario, users access different parts of the website at the same time, putting more strain on the server. However, this benchmark does provide a simple way to compare performance of different servers from different providers or see how different Linode configurations compare to each other (e.g. how much faster does a Linode with double the CPU power and RAM serve requests).

## Benchmark Network Bandwidth

1.  Network benchmarks are tricky because they always depend on the network path and the quality of all linking points from your Linode to the machine you are downloading/uploading from/to. Furthermore, the network hops relaying packets from source to destination can often change, even if the endpoints are the same, taking you through a different network path which may be faster or slower.  So consider this test orientative, not exact. Install the script with:

        sudo apt install speedtest-cli

2.  Run the benchmark:

        speedtest

3.  Here's an example of the important part of the output:

        Selecting best server based on ping...
        Hosted by School District of Philadelphia (Philadelphia, PA) [78.06 km]: 179.792 ms
        Testing download speed................................................................................
        Download: 182.64 Mbit/s
        Testing upload speed....................................................................................................
        Upload: 42.26 Mbit/s

4.  The auto-selected server should be as close as possible to the location of your Linode (close to the datacenter where it's physically located). The *ping* value specified in milliseconds (**ms**) should generally be (at least) under 50ms for optimal results. Sometimes the script gets confused and doesn't automatically select the best server location. If this happens, or you just want to see what kind of speeds you get when downloading/uploading from/to a different location (for example because you know you will serve visitors in that part of the world), you can consult a list of all available test servers with the following command:

        speedtest --list

5.  To filter this list and only return servers in a specific location use:

        speedtest --list | grep -i frankfurt

    Here is an example of an output:

         1746) Vodafone DE (Frankfurt, Germany) [9152.31 km]
         5975) SoftLayer Technologies, Inc. (Frankfurt, Germany) [9152.31 km]
         9273) DEAC (Frankfurt, Germany) [9152.31 km]
        10260) Interoute VDC (Frankfurt, Germany) [9152.31 km]
         7560) 23media GmbH (Frankfurt, Germany) [9152.31 km]
         3585) LeaseWeb (Frankfurt, Germany) [9152.31 km]
         9874) LWLcom GmbH (Frankfurt, Germany) [9152.31 km]
         8040) IP-Projects GmbH & Co. KG (Frankfurt, Germany) [9152.31 km]
        12974) ShadowGaming (Frankfurt, Germany) [9152.31 km]
        14521) MBN (Frankfurt, Germany) [9152.31 km]

6.  Once you find a server you like, use its index number in the next command like in the following example:

        speedtest --server 1746

7.  You can find more information about this tool on [speedtest-cli GitHub Page](https://github.com/sivel/speedtest-cli).
