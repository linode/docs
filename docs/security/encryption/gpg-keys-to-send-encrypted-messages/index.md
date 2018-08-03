---
author:
  name: Linode
  email: docs@linode.com
description: 'How to Use GPG Keys to Send Encrypted Messages'
keywords: ['gpg','GnuPG','security','cryptography']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-02
modified: 2018-08-02
modified_by:
  name: Linode
title: "How to Use GPG Keys to Send Encrypted Messages"
contributor:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
## What is GnuPG?

GNU Privacy Guard (GnuPG) is a tool for secure communication that is part of the [GNU Project](https://www.gnu.org/gnu/thegnuproject.en.html).

## Why Send Encrypted Messages?

## Basic Cryptographic Concepts

Public-key cryptography uses a key-pair system where any single user has a private and public key pair. GnuPG uses a somewhat more sophisticated scheme in which a user has a primary keypair and then zero or more additional subordinate keypairs. The primary and subordinate keypairs are bundled to facilitate key management and the bundle can often be considered simply as one keypair.

GnuPG uses *symmetric ciphers*, *public-key ciphers*, and *one-way hashing*

## Create GPG Keys

1. Download and install the most recent version of the [GPG command line tools](https://www.gnupg.org/download/) for Ubuntu or Debian.

        sudo apt-get update
        sudo apt-get install gnupg

1. Create a new primary keypair:

        gpg --gen-key

    Several prompts will appear before the keypair is generated:

    - Select `RSA and RSA (default)` for the type of key.
    - Enter `4096` for the key size.
    - Specify the length of the time the key should be valid in days, weeks, months or years. For example, `1y` will set an expration date of one year from the time of keypair creation.
    - Enter a name, email address, and comment to associate with the key pair. Any one of these three values can be used to identify the keypair for future use. Enter the desired information for each value and confirm when prompted.

    - Provide a passphrase. The passphrase is used to unlock the private key, so it is important to ensure the passphrase is strong. Use a mix of alphnumeric characters.

    Once you have responded to all prompts, the keypair will be generated. This may take a few minutes to generate depending on the key size that was chosen.

    - If your system requires more entropy to generate the keypair, in a new shell session, install the `rng-utils` package:

            apt-get install rng-tools

    - Check and feed random data from an entropy source (e.g. hardware RNG device) to an entropy sink (e.g. kernel entropy pool) to provide the needed entropy for a secure keypair to be generated:

            rngd -f -r /dev/urandom

    - To check the amount of entropy available on your Linode:

            cat /proc/sys/kernel/random/entropy_avail

     The value should be somewhere near 3000 for keypair generation.

     To verify the expiration date or the values you entered to identify your key, use the list-keys command to list the keys on your public keyring:

        gpg --list-keys

## Generate a Revocation Certificate

A revocation certificate is useful if you forget your passphrase of if your private key is somehow compromised. It is used to notify others that the public key is no longer valid.

1. Generate a revocation certificate. Replace `user@example.com` with the email address associated with the key:

        gpg --output revoke.asc --gen-revoke user@example.com

    - A prompt will ask you to select a reason for the revocation and provide an optional description.
    - The revocation certificate will output to the current directory as a file named `revoke.asc`. Save the certificate to a safe location on a different system so that you can access it in case your key is compromised in the future.

    Once you've revoked a public key it cannot be used to encrypt future messages to you. It can still be used to verify signatures that you made in the past and to decrypt past messages sent to you.

## Submit Your GPG Key to a Key Server

You can submit your public key to a GPG server to make it available to the general public. The GnuPG configuration file `~/.gnupg/gpg.conf` by default sets the keyserver as `hkp://keys.gnupg.net` and provides examples of other keyservers that can be used in the file's comments. Since keyservers around the globe synchronize their keys to each other it should not be necessary to change the default value set in the configuration file.

Find the long keyid for the public key you would like to send to the keyserver:

    gpg --keyid-format long --list-keys user@example.com

You will see an output similar to the example. The long keyid is the value after the key size `4096R` in the `pub` row. In the example the long keyid is `C7277DE1A11C0F78`:

{{< output >}}
pub   4096R/C7277DE1A11C0F78 2018-08-02 [expires: 2018-09-01]
uid                          leslie sala <user@example.com>
sub   4096R/B838757D5C4E6643 2018-08-02 [expires: 2018-09-01]
{{</ output >}}

To send your public key to the default keyserver use the following command and replace `keyid` with your public key's long keyid:

    gpg --send-keys keyid

Anyone can request your public key from the keyserver with the following command:

    gpg --recv-keys user@example.com




## GPG Key Algorithms

- RSA
- ElGamal
- DSA
- ECDH
- ECDSA
- EdDSA
