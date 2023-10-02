---
slug: how-many-kb-in-a-mb
author:
  name: Jack Wallen
description: 'How many KB are in a MB? Which is bigger, MB or GB? Data units can present lots of questions. Read our guide to become a data storage expert.'
keywords: ['how many kb in mb','mb','kb to gb','megabytes in a gigabyte']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-31
modified_by:
  name: Linode
title: "How Many Kilobytes are in a Megabyte?"
h1_title: "Data Storage Guide: How Many KB are in a MB?"
enable_h1: true
contributor:
  name: Jack Wallen
---

Kilobytes and Megabytes are units of measure that are used in nearly every computing platform on the planet. This goes for mobile phones, desktops, servers, virtual machines, containers, and cloud hosting. Being well-versed in these measurements is important in a variety of applications, but is especially important when you work with third-party cloud vendors that charge for bandwidth and storage . At a bare minimum, you need to calculate the average usage so you know how much that cloud service is going to cost.

No matter the reason, when working as a system administrator or in any computer-related field, you need to know how many kilobits are in a megabyte and how many megabytes are in a gigabyte. After all, it's sometimes easy to mistakenly label something as a bit when you mean byte, or vice versa. This is also important to understand when you're promised a certain level of bandwidth, only to find out there's been confusion between bits and bytes.

## What Is the Difference Between a Bit and a Byte?

Both are a means to measure units of data. The smallest unit of measurement for data is the bit. A bit is a binary measurement, so it can either be 0 or 1. Every computer sends and receives data as a collection of ones and zeros (binary). Each 0 or 1 is a bit.

Data that is transferred over a network connection is generally measured in bits with the following designations:

| Name | Number of Bits |
|:-------:|:-------:|
| bit | 1 |
 kilobits | 1,000 |
| megabits | 1,000,000 |
| gigabits | 1,000,000,000 |

In the early days of the Internet, you had a modem that was either 14.4, 28.8, or 33.6. Those numbers represented how many bits per second the hardware could send or receive. So 14.4, 28.8, and 33.6 were actually measured in kilobits per second (or kbits/s), so 14.4 kbits/s, 28.8 kbits/s, and 33.6 kbits/s.

A byte is considered a group of 8 bits, so 1 byte is equal to 8 bits. Historically, a byte was the number of bits used to encode a single character of text. Think about it this way: The binary code for the letter "a" is 01000001 and 01000001 is 8 bits. So each character is represented by 8 bits.

One thing to keep in mind is bits are represented by a lower case "b" and a byte is represented by an upper case "B."

## What Are Kilobytes?

A kilobyte is approximately 1,000 bytes and since a byte is 8 bits, a kilobyte is roughly 8,000 bits. But why do we say "approximately" and "roughly"? A kilobyte is actually 1024 bytes.

The confusion comes because the prefix "kilo" means 1,000. Since computers are based on the binary system (or base-2), hard drives and memory are actually measured in powers of 2. The list below displays several base-2 values:

- 2^0 = 1
- 2^1 = 2
- 2^2 = 4
- 2^3 = 8
- 2^4 = 16
- 2^5 = 32
- 2^6 = 64
- 2^7 = 128
- 2^8 = 256
- 2^9 = 512
- 2^10 = 1024

The kilobyte is typically used to represent small amounts of data within a computer's storage. You often find documents, images, and audio files listed in kilobytes (KB). For example, on a Linux system, if you issue the command `ls -lh`, you see various files listed in either bits or kilobytes

## What Are Megabytes?

This is likely familiar territory. This is because, as computers evolved and became cheaper to manufacture, the size of internal storage, RAM, and network connectivity speeds, continued to grow.

The megabyte is commonly used to measure either 1000^2 Bytes (decimal) or 1024^2 bytes (binary). In terms of megabytes to bits, a file that is 1 MB equates to an 8,000,000 bit file (remember, there are 8 bits in a Byte).

## How Many Kilobytes are in a Megabyte?

A megabyte (1 MB) is 1,024 KB. In general parlance, you can simply say 1 MB = 1000 KB. Although it's not technically correct, it's widely accepted.

## What are Gigabytes?

A gigabyte (GB) is another unit of measurement which is considerably more relevant in today's modern world, simply because GB has become more of a standard. Many hard drives, especially Solid State Drives (SSD), come in sizes like 250 GB or 500 GB.

## How Many Megabytes in a Gigabyte?

Given how the math is working out, 1 GB equals 1000 MB in decimal format and 1024 MB in binary format. When you say your computer has a 250 GB drive, that means it has 250,000 MB (decimal) or 256,000 MB (binary).

## Conclusion

Much of this is common knowledge, especially when looking at these units of measurement from a decimal perspective. But when you need to get more exact, such as when calculating the cost of cloud hosting, go the binary route so your numbers actually align with your hosting provider.