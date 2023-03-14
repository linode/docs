---
slug: gpg-keys-to-send-encrypted-messages
description: 'This article shows you how you can use GPG, also known as GNU Privacy Guard, keys to send and receive encrypted messages with friends and colleagues.'
keywords: ['gpg','security','cryptography','encrypt', 'decrypt']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-08
modified: 2018-08-08
modified_by:
  name: Linode
title: "Use GPG Keys to Send Encrypted Messages"
title_meta: "How to Use GPG Keys to Send Encrypted Messages"
external_resources:
- '[Primes, Modular Arithmetic, and Public Key Cryptography ](http://pi.math.cornell.edu/~mec/2003-2004/cryptography/diffiehellman/diffiehellman.html)'
- '[The Mathematics of the RSA Public-Key Cryptosystem ](http://www.mathaware.org/mam/06/Kaliski.pdf)'
tags: ["security"]
aliases: ['/security/encryption/gpg-keys-to-send-encrypted-messages/']
authors: ["Linode"]
---

## What is GnuPG?

GNU Privacy Guard (GnuPG), also known as GPG, is a tool for secure communication that was created by Werner Koch as [Free Software](https://www.gnu.org/philosophy/free-sw.en.html) under the [GNU Project](https://www.gnu.org/gnu/thegnuproject.en.html). GnuPG follows the [OpenPGP protocol](https://www.openpgp.org/about/standard/), which defines and standardizes all the necessary components involved in sending encrypted messages--signatures, private keys, and public key certificates. This piece of free software is notably used by journalists around the world to ensure that their sensitive email communication is kept secure and private.

GPG uses a combination of symmetric-key cryptography and public-key cryptography. Public key cryptography is likely already familiar to you since it is the recommended way to authenticate when [SSHing in to your Linode](/docs/products/compute/compute-instances/guides/set-up-and-secure/#harden-ssh-access). Public-key cryptography uses a key-pair system where any single user has a private and public key pair. The public key can be shared with anyone, while the private key should be protected and secret to maintain the integrity of the system.

This asymmetric cryptographic system is ideal for secure communication, because all it requires is that the sender of the message have a copy of the receiver's public key before encrypting and sending the message. The recipient can then use their private key to decrypt the message. This means anyone can send you a secure message if they have a copy of your public key.

This guide shows how to create your own keypair, distribute the public key to a receiver, and encrypt and decrypt a message on Ubuntu 16.04 and 18.04.

## Create GPG Keys

1. Download and install the most recent version of the [GPG command line tools](https://www.gnupg.org/download/) for Ubuntu:

        sudo apt update
        sudo apt install gnupg

1. Create a new primary keypair:

        gpg --full-generate-key

    Several prompts will appear before the keypair is generated:

    - Select `(1) RSA and RSA (default)` for the type of key.
    - Enter `4096` for the key size.
    - Specify the duration the key should be valid in days, weeks, months, or years. For example, `1y` will set an expiration date of one year from the time of keypair creation.
    - Enter a name, email address, and comment to associate with the key pair. Any one of these three values can be used to identify the keypair for future use. Enter the desired information for each value and confirm when prompted.
    - Provide a passphrase. The passphrase is used to unlock the private key, so it is important to ensure the passphrase is strong. Use a mix of alphanumeric characters.

    Once you have responded to all prompts, the keypair will be generated. This may take a few minutes to generate depending on the key size that was chosen.

    If your system seems to hang at the following message:

    {{< output >}}
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
{{< /output >}}

    The system may require more [entropy](https://en.wikipedia.org/wiki/Entropy_(computing)) to generate the keypair, in a new shell session, install the `rng-utils` package:

        sudo apt install rng-tools

    - Check and feed random data from an entropy source (e.g. hardware RNG device) to an entropy sink (e.g. kernel entropy pool) to provide the needed entropy for a secure keypair to be generated:

            rngd -f -r /dev/urandom

    - Check the amount of entropy available on your Linode. The value should be somewhere near 3000 for keypair generation.

            cat /proc/sys/kernel/random/entropy_avail

1. Verify the keys on your public keyring:

        gpg --list-keys

    The example output contains two public keys:

    {{< output >}}
    pub   4096R/A11C0F78 2018-08-02 [expires: 2018-09-01]
    uid                  exampleName (example comment) <user@example.com>
    sub   4096R/5C4E6643 2018-08-02 [expires: 2018-09-01]

    pub   4096R/F0EF8158 2018-08-02 [expires: 2018-10-01]
    uid                  exampleName2 <user2@example.com>
    sub   4096R/EFA743C3 2018-08-02 [expires: 2018-10-01]
    {{</ output >}}

    Each value in the list represents the following information:

    - Public key: `pub`
    - Key size and type: `4096R`
    - Short key ID: `A11C0F78`
    - Creation date: `2018-08-02`
    - Expiration date: `[expires: 2018-09-01]`
    - User IDs: `exampleName2 (example comment) <user2@example.com>`
    - Subkey: `sub`

   Throughout the remainder of this guide, the first public key will be used to encrypt our message. The output may vary slightly depending on the version of Ubuntu you are using.

## Generate a Revocation Certificate

A revocation certificate is useful if you forget your passphrase or if your private key is somehow compromised. It is used to notify others that the public key is no longer valid. Create the revocation certificate immediately after generating your public key.

Generate a revocation certificate. Replace `user@example.com` with the email address associated with the public key:

    gpg --output revoke.asc --gen-revoke user@example.com

- A prompt will ask you to select a reason for the revocation and provide an optional description. The default reason is recommended.
- The revocation certificate will be saved to the current directory as a file named `revoke.asc`. Save the certificate to a safe location on a different system so that you can access it in case your key is compromised in the future.

Once you've revoked a public key it cannot be used to encrypt future messages to you. It can still be used to verify signatures that you made in the past and to decrypt past messages sent to you.

## Exchange Public Keys

You will need to exchange public keys with someone in order to securely communicate with them. If you do not want to make your key available on a [key server](#submit-your-gpg-key-to-a-key-server), you can exchange keys with someone directly by exporting your public key and sending them directly to the recipient.

### Export Your Public Key

1. Export the public key. Replace `public-key.gpg` with a desired name for the file and `user@example.com` with the email address associated with your key's user id:

         gpg --armor --output public-key.gpg --export user@example.com

    The file will save to the current directory.

1. Send the `public-key.gpg` file to the recipient in an email or copy and paste the contents of the `public-key.gpg` file.

1. The recipient should import the public key and validate it in order to use it to decrypt a message sent by you.

### Import and Validate a Public Key

You can add someone else's public key to your public keyring by importing it. The user's public key must first be sent to you, by email or some other format, before you can import it to your public key ring. When the key is imported you should verify the key by checking its fingerprint and then signing it.

1. Once you've received the user's public key and the `.gpg` file is saved to your Linode, import it to your public key ring. Replace `public-key.gpg` with the file name of the public key you will import. If your file is saved somewhere other than the current directory, make sure you use the full path to the file:

        gpg --import public-key.gpg

1. Verify that the public key has been added to your public key ring:

        gpg --list-keys

1. Check the key's fingerprint:

        gpg --fingerprint public-key.gpg

    The output will resemble the following

    {{< output >}}
    pub   3072R/D9CF8B96 2018-08-03 [expires: 2020-08-02]
        Key fingerprint = D1A2 CDA1 A102 D43F 3DED  A663 705E 95C9 D9CF 8B96
    uid                  importedKeyOwner <user3@example3.com>
    sub   3072R/5AB991B8 2018-08-03 [expires: 2020-08-02]
    {{</ output >}}

    Ask the owner of the public key to send you their public key's fingerprint and verify that the fingerprint values match. If they match, you can be confident that the key you have added is a valid copy of the owner's public key.

1. When you have verified the public key's fingerprint, sign the public key with your own key to officially validate it. Replace `user3@example3.com` with the associated email for the key you are validating:

        gpg --sign-key user3@example3.com

    Enter your passphrase when prompted.

1. View the public key's signatures to verify that your signature has been added:

        gpg --check-sigs user3@example3.com

1. You can export the signature to the public key and then send the signed copy back to the owner of the public key to boost the key's level of confidence for future users:

        gpg --output signed-key.gpg --export --armor user3@example3.com

    Send the signed key to the public key owner via email so they can import the signature to their GPG database.

### Submit Your Public Key to a Key Server

You can submit your public key to a GPG server to make it available to the general public. The GnuPG configuration file `~/.gnupg/gpg.conf` by default sets the key server as `hkp://keys.gnupg.net` and provides examples of other key servers that can be used in the file's comments. Since key servers around the globe synchronize their keys to each other it should not be necessary to change the default value set in the configuration file.

1. Find the long key ID for the public key you would like to send to the key server:

        gpg --keyid-format long --list-keys user@example.com

    You will see an output similar to the example. The long key ID is the value after the key size `4096R` in the `pub` row. In the example the long key ID is `C7277DE1A11C0F78`:

    {{< output >}}
    pub   4096R/C7277DE1A11C0F78 2018-08-02 [expires: 2018-09-01]
    uid                          example user <user@example.com>
    sub   4096R/B838757D5C4E6643 2018-08-02 [expires: 2018-09-01]
    {{</ output >}}

1. To send your public key to the default key server use the following command and replace `keyid` with your public key's long key ID:

        gpg --send-keys keyid

1. Anyone can request your public key from the key server with the following command:

        gpg --recv-keys keyid

    The public key will be added to the user's trust database using the`trustdb.gpg` file.

## Encrypt a Message

After you have obtained someone's public keys, you can send them encrypted messages. When you are encrypting a message to send to someone, you are using their public key to encrypt the message. Only the holder of the corresponding private key will be able to decrypt the message.

To encrypt a message:

    gpg --output encrypted-doc.gpg --encrypt --sign --armor --recipient user3@example3.com -recipient user@example.com doc-to-encrypt.txt

Replace `encrypted-doc.gpg` with a name for the encrypted version of your document, `user3@example3.com` with the email associated with the public key of the encrypted message's recipient, `user@example.com` with your own public key's associated email and `doc-to-encrypt.txt` with the name of the document you will encrypt. If the document is not in the current directory, include the full path to the document.

The extension `.gpg` is used for encrypted/binary data and `.asc` or `.sig` is used for detached or clearsign signatures. Including the `--armor` flag will encrypt the message in plain text.

## Decrypt a Message

A message will need to have been encrypted with your public key for you to able to decrypt it with your private key. Ensure that anyone that will be sending you an encrypted message has a copy of your public key.

To decrypt a message:

    gpg --output decrypted-doc --decrypt doc-to-decrypt.gpg

Replace `decrypted-doc` with the name you want to assign to the decrypted message and `doc-to-decrypt.gpg` with the name of the encrypted document. If the document is not in the current directory, include the full path to the document.
