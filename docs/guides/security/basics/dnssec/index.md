---
slug: dnssec
title: "How to Secure DNS with DNSSEC"
description: ''
keywords: ['dns','security','dnssec','domain name','poison','cache']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["David Robert Newman"]
published: 2023-05-08
modified_by:
  name: Linode
external_resources:
- '[DNSSEC - What Is It and Why Is It Important?](https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en)'
- '[RFC 9364 DNS Security Extensions (DNSSEC)](https://www.rfc-editor.org/rfc/rfc9364)'
---

The Domain Name System (DNS), the directory name system that underlies the global Internet, provides no assurance that online sites are who they claim to be, or that the information they provide is valid. Recognizing this shortcoming, the Internet Engineering Task Force (IETF) developed Domain Nam,e System Security Extensions (DNSSEC) to add authentication and integrity protection to the DNS protocol.

This guide explains what DNSSEC is and how it works, and why you might or might not want to deploy it. It provides step-by-step procedures for enabling DNSSEC on your name servers.

## What is DNSSEC?

DNSSEC is a set of security extensions to authenticate and validate the DNS data you request. DNSSEC uses public-key cryptography to sign DNS data, verifying the identity of each zone and the integrity of records within that zone.

## Why Use DNSSEC?

Strong authentication wasn’t a design goal of the original DNS protocol, which dates from a time when the Internet was a relatively small research network with high trust among users.

As a result, attackers can easily fool DNS clients into interacting with unauthorized sites. Each time you send a DNS query, the only thing your resolver verifies is that the response came from the IP address where you sent the original query. Since it’s easy to spoof IP addresses, an attacker can pose as an authoritative name server and send you fake DNS data.

A forged response can affect many users, not just you. Most recursive name servers maintain a cache of responses so they can quickly respond to queries rather than going out to origin name servers for every lookup. An attacker can cause *cache poisoning* by placing one or more fraudulent entries in a cache.

Imagine if many ISP customers were given fraudulent DNS responses for a bank because one customer went to a rogue name server, poisoning the cache for all users of that ISP's name server.

DNSSEC’s digital signatures address this problem in two ways:

-  Data origin authentication cryptographically verifies the source of zone information
-  Data integrity protection cryptographically signs all resource records within each zone to ensure data can’t be modified in flight

## Why Should You Not Use DNSSEC?

For all its benefits, there are reasons why you might not want to proceed with DNSSEC. Configuration and maintenance of DNSSEC keys is entirely manual in most major DNS server implementations.

Setup is somewhat complex, and finite key lifetimes have serious connectivity implications. If you incorrectly configure keys, or fail to perform key rollover before older keys expire, your entire domain will be unreachable on the public Internet. (There are workarounds, but they involve starting over both with your name servers and at your domain registrar.) If you run DNSSEC, you must ensure that you rotate keys before they expire.

DNSSEC signing also means your name servers disclose all domain and subdomain records, whether you intend that or not.

DNSSEC provides new record types, Next Secure and Next Secure 3 (NSEC and NSEC3), that provide signed evidence of the nonexistence of fraudulent records. For example, if your zone file has records for r.example.com and t.example.com, an attacker could not pose as s.example.com because your NSEC or NSEC3 records provide cryptographic evidence that there is no record between r and t.

However, because NSEC records work by pointing to the next legitimate record in the zone, they would disclose the names of any legitimate records within that space. If you have a host you don’t want widely advertised called secret.example.com, the NSEC response would also reveal that information in a query for r.example.com.

DNS records aren’t supposed to hide anything, it is, after all, a public directory. But the reality is that some users have little-advertised records, and for these DNSSEC could pose a problem. Its design provides cryptographic proof of the existence of all records, not just the ones you want widely known.

## Terminology and DNSSEC Resource Records

DNSSEC introduces a few new terms and record types. The resource record set (**RRset**) describes all resource records of a given type within a zone. For example, all A records within the zone example.com comprise a single RRset.

DNSSEC also provides these other new record types:

- **RRSIG**: DNSSEC signs RRsets, not individual records. An RRSIG is a cryptographic signature of an RRset.
- **DNSKEY**: A public signing key.
- **DS**: Delegation signer. DS records contain the hash of a DNSKEY record.
- **NSEC and NSEC3** – Next Secure records, which provide proof-of-nonexistence of DNS records. NSEC records are in plaintext and NSEC3 records provide a hash of the record name.

## How Does DNSSEC Work?

Every DNSSEC-enabled zone has a zone-signing key (ZSK) with public and private components. The private portion of a ZSK signs the contents of a zone. The public portion validates that signature to resolvers making queries. When enabling DNSSEC, you use the ZSK’s private portion to sign your RRsets, then store the signatures as RRSIG records. In effect, RRSIGs say to anyone asking “this DNS name is legitimate, and no one has altered its records.”

When a DNSSEC-enabled resolver makes a query for some resource (e.g., an A record), the name server returns three items: the RRset for that record, its RRSIG, and the zone’s DNSKEY record (which contains the public ZSK). The resolver uses all three items to validate the record.

A key-signing key (KSK) verifies the ZSK, validating the DNSKEY record just as the ZSK validates RRsets. The private portion of the KSK signs the public portions of both the ZSK and KSK. Resolvers use the public KSK to validate the public ZSK.

Thus far, all DNSSEC has done has established trust within a zone – but there isn’t yet any external verification. This is where delegation signer (DS) records come in. This is an algorithmic hash you create of your zone’s public KSK. Next, list that hash in your parent zone (typically, at the registrar where you bought your domain).

The parent zone’s owner uses its private key to sign that DS key, essentially saying “I vouch for this child zone, and all the records within it.” In turn, the parent zone lists its DS key in its parent zone. This establishes the chain of trust – every child zone relies on the validation of its parent, all the way up to the root DNS zone (“.”).

There is no parent to sign the root zone, but there is a very public and highly audited Root Signing Ceremony that takes place every quarter to ensure all DNS operators of the integrity of the entire chain.

The chain of trust is a key concept in DNSSEC. It establishes that each DNSSEC-enabled server is authenticated, and that no one has altered the records each server provides.

## How to Enable DNSSEC Using NSD

This guide uses the example.com domain as an example. Replace this address with your own in the examples that follow. It is authoritative for the zone example.com (see “An Introduction to DNS on Linux” and substitute your domain name as appropriate).

1.  Remove any previously installed keys and certificates in /etc/nsd, then generate new ones:

    ```command
    cd /etc/nsd
    sudo rm *pem *key
    sudo nsd-control-setup
    ```

    ```output
    setup in directory /etc/nsd
    Certificate request self-signature ok
    subject=CN = nsd-control
    removing artifacts
    Setup success. Certificates created.
    ```

1.  Restart NSD to ensure the server loads the new keys and certificates:

    ```command
    sudo systemctl restart nsd
    ```

1.  Install the `ldnsutils` suite, needed for key generation and signing:

    ```command
    sudo apt install ldnsutils
    ```

1.  Move to the zones directory and generate ZSK and KSK files. Switch to the root user for export commands because sudo won’t work here. You can optionally capture the ZSK and KSK variables for later reuse in the “Zone Maintenance” section.

    ```command
    cd /etc/nsd/zones/master
    sudo su - root
    export ZSK=`/usr/bin/ldns-keygen -a ECDSAP256SHA256 -b 1024 example.com`
    export KSK=`/usr/bin/ldns-keygen -k -a ECDSAP256SHA256 -b 2048 example.com`
    # optional capture of $ZSK and $KSK variables for later maintenance
    echo $ZSK > example.com.zsk
    echo $KSK > example.com.ksk
    ```

    Note the use of the ECDSAP256SHA256 algorithm, also known as algorithm 13. Although DNSSEC accommodates many algorithms, this one is a current best practice. This choice uses the very strong Elliptic Curve Digital Signal Algorithm (ECDSA) with the P-256 curve and computes hashes with SHA-256. Currently, it is not computationally feasible to defeat this algorithm within a key’s lifetime.

1.  The KSK command above generated a delegation signing (DS) record, but you will soon create a separate DS record, and can delete this one:

    ```command
    rm *ds
    ````

1.  While still logged in as root, sign the example.com zone using the ZSK and KSK variables you previously created.

    ```command
    ldns-signzone -n -s $(head -n 1000 /dev/urandom | sha256sum | cut -b 1-16) example.com.zone $ZSK $KSK
    ```

1.  In addition to keys, the zones directory now contains a signed zone file.

    ```command
    ls
    ```

    ```output
    Kexample.com.+013+06274.key       Kexample.com.+013+55738.private
    Kexample.com.+013+06274.private   example.com.zone
    Kexamples.com.+013+55738.key      example.com.zone.signed
    ```


1.  Open the main /etc/nsd/nsd.conf configuration file and, in the zone: section, point to the signed zone file.

    ```code
    zone:
    ..
    zonefile: "zones/master/example.com.zone.signed"
    ..
    ```

1.  Save and close the file. Then reload the NSD configuration and signed zone file.

    ```command
    nsd-control reconfig
    nsd-control reload example.com
    # exit as root user
    exit
    ```

    A dig query for the zone using DNSKEY now return records with DNSSEC signatures::

    ```command
    dig DNSKEY @ns1.example.com example.com +multiline +norec
    ```

    ```output
    ..
    example.com.	3600 IN	DNSKEY 256 3 13 (
    	    		LWaVmaC8mVyGlrU1uF+tOsO8od6HCy21owPW+k5EDUI0
    	    		T0MGJietjPQ2akcOuyfixZ3h0DGeCdCByfsrGD4t3w==
			    	) ; ZSK; alg = ECDSAP256SHA256 ; key id = 6274
    example.com.	3600 IN	DNSKEY 257 3 13 (
        		    ebKStT/78jf0NVrKm5qVrTrSLWRoGIqmvgNYKgdzTAgv
    			    Wxjfjh4P3JPEgwlMxLHmb3liZd+8De2FwJEWy7m0Yg==
    			    ) ; KSK; alg = ECDSAP256SHA256 ; key id = 55738
    ..
	```

1.  Generate DS records for the zone, and save the results to a text file or to your clipboard. You need these for the final step of having your zone signed at your domain registrar.

	```command
    cd /etc/nsd/zones/master
    sudo ldns-key2ds -n -f -2 example.com.zone.signed
    ```

    ```output
    example.com.	3600	IN	DS	6274 13 2 044783c65c032a0ae25a1de626e341c483a89601c766e812a001bc512145fc81
    example.com.	3600	IN	DS	55738 13 2 c4dae4d001f8c8f1b4f1adec890eba39010143752e6ce03b6567c85aa7fbde46
    ```

1.  Your server does not return valid responses until you upload these DS records at your registrar. For each DS record, add this information at the registrar:

    - Key tag: A number that identifies the DS record. The tags in these examples are 6274 and 55738.
    - Digest type: The hashing function used to create a message digest. In the command above, you used SHA-256 (identified as “2” at the registrar)
    - Digest: The message digest (the long string in each record) contained in the .ds file
    - Algorithm: The method used to produce the message digest. In the example above, you used ECDSAP256SHA256 (type 13)

    Putting this all together, here are the DS fields entered at dynadot.com, the registrar for linoderocks.com:

    Save both DS records at your registrar, and the DNSSEC chain of trust is complete.

1.  Next, verify your configuration with a DNSSEC test site such as dnsviz.net.

    In the following test diagram, each rectangle represents a different level in the chain of trust, with one apiece for the root, .com., and linoderocks.com domains. The green arrows all along the path indicate a complete chain of trust extends from the root (“.”) on through to linoderocks.com.

    If any zone is missing valid DS records for the zone under it, or has a corrupt or expired ZSK, the dnsviz.net website displays red arrows. If you see red arrows anywhere in your diagram, do not proceed until resolving those. DNSSEC does not work unless the chain of trust is complete.


## Zone Maintenance

DNSSEC requires extra steps when updating records and keys.

Anytime you make changes within a zone, you need to resign the entire zone:

```command
ldns-signzone -n -s $(head -n 1000 /dev/urandom | sha256sum | cut -b 1-16) example.com.zone $ZSK $KSK
```

For the $ZSK and $KSK variables in this command, enter the names of your current ZSK and KSK files, without the filename extensions. Then reload the zone:

```command
sudo nsd-control reload example.com
```

Wait for your zone’s default time-to-live (TTL) timer (often, 1 hour) to expire before testing the zone at dnsviz.net or similar sites. Until the TTL expires and other name servers refresh their caches, other name servers may hold old records in their caches, which don’t match your newly signed zone. After the TTL expires, all sources should agree on your zone’s contents.

As for key rotation, zone signatures expire after 30 days by default and, if not renewed, leave your zone unreachable on the public Internet. Neither of the two most common DNS server distributions – bind and NSD – include tools for automated key rollover. The open-source [dnssec-reverb](https://github.com/northox/dnssec-reverb) project does automate key rollover, and works with both Bind and NSD.

Regardless of whether you use dnssec-reverb, some other tool, or write your own shell scripts, it’s essential that you automate and test key rollover before putting a server into production.

## Conclusion

DNSSEC corrects a major shortcoming of the original DNS design: It authenticates that every server really is the one it claims to be. It verifies that no one has tampered with zone data. And it provides affirmative proof of the nonexistence of fraudulent hosts and subdomains. Given the critical role DNS plays in networking, DNSSEC not only protects your name servers but also virtually all your applications running all your servers.




