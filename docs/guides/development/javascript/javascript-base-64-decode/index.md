---
slug: javascript-base-64-decode
description: 'Wondering how to encode and decode with base64 in JavaScript? Follow these steps to learn how plus find the benefits and limitations of the base64 code.'
keywords: ['javascript base 64 decode','encode string javascript','base64 js']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-29
modified_by:
  name: Linode
title: "JavaScript Decode Base64 String - A Developer’s Guide"
title_meta: "How to Use JavaScript Base 64 to Decode and Encode"
external_resources:
- '[Wikipedia Base64 page](https://en.wikipedia.org/wiki/Base64)'
- '[RFC 4648 for Base64](https://datatracker.ietf.org/doc/html/rfc4648)'
- '[Mozilla btoa documentation](https://developer.mozilla.org/en-US/docs/Web/API/btoa)'
- '[Mozilla atob documentation](https://developer.mozilla.org/en-US/docs/Web/API/atob)'
authors: ["Jeff Novotny"]
---

It is often necessary to embed a binary or other non-ASCII file inside an email or a web page. However, for a variety of reasons, it is not always safe to include the file in its original state. One possible solution is to first convert the binary data to Base64 text before including it. This guide provides an introduction to Base64 encoding and explains how to use the JavaScript Base64 functions to encode and decode data.

## An Introduction to Base 64 and JavaScript

Base64 is an encoding scheme used to convert binary files to text, although it can be used on any type of data. Base64 is sometimes written as Base-64 or Base 64. It converts a sequence of three bytes, totaling 24-bits, into four 6-bit characters. Base64 data is divided into four-character blocks, each representing 24 bits of the original file.

Base64 allows channels that only support text to store and transmit non-text files. Because the Base64 character set only contains common text characters, it is always safe to use. It avoids the risk of data corruption caused by unsupported characters or *escape characters*, which have a special meaning. JavaScript provides Base64 decoding among its built-in functions.

The set of 6-bit Base64 characters allows for 64 distinct printable characters. So the encoded text can be represented using only these characters. The characters in the set are supported by all systems and are distinct from the underlying values they map to. The complete Base64 to character table is defined in [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648#section-4).

The set of Base64 characters and their integer mappings are as follows:

- The uppercase alphabet characters from `A` to `Z`. They represent the Base64 values from `0` to `25`.
- The lowercase alphabet characters from `a` to `z`. These map to the range of Base64 values between `26` to `51`.
- The digits `0` to `9`. These map to the Base64 values starting at `52` and ending at `61`.
- The `+` character, representing `62` in Base 64.
- The `/` character, representing `63` in Base 64.
- There is an additional `=` in the character set. It is used to represent padding in Base64.

When the number of bytes to be converted into Base64 is a multiple of three, no padding is required. The three bytes are translated into four Base64 characters. In each case, the character string has 24 bits. In other cases, padding must be added to convert the trailing characters into a four-character block. The six-bit block containing the end of the final character is filled out with zeroes. The padding character `=` is assigned to any remaining characters in the block.

The following example explains how to manually convert a file to Base64, using the input string `La`:

1.  Break the binary file into groups of three eight-byte characters. In this example there are only two characters, so padding must be added to fill out the block.
1.  Convert the three bytes to a bit string. For three bytes, this results in a string of 24 bits. The ASCII decimal representation for `L` is `76`, while for `a`, it is `96`. Therefore, the equivalent bit string is `0100 1100 0110 0001`.
1.  Regroup the bits into four 6-bit sextets. After the conversion, but before any padding, this is represented as `010011 000110 0001`.
1.  If necessary, add zeros to complete the final sextet. Append the padding character until there are four sextets. The Base64 characters are now `010011 000110 000100 padding` in binary.
1.  Turn each sextet into its decimal representation. This results in the series `19 6 4 padding`.
1.  Translate the decimal integers to their equivalent Base64 characters. The previous sequence of values translates to `T`, `G`, `E`, and `=`.
1.  Combine all the Base64 values into a stream of four-character blocks. In this case, the block contains `TGE=`.

The following table illustrates how the text characters are converted into a Base64 encoding. In this case, `0` bits and a padding symbol are added to round out the sequence.

```file {title="Base64_translate.txt"}
L        a
76       96
01001100 01100001
010011 000110 0001
010011 000110 000100 pad
19     6      4      pad
T      G      E      =
```

## What Are the Benefits of Base64 Code?

Base64 is very convenient and enhances compatibility and security. Following are some of the advantages of Base64:

- It allows binary or image files to be embedded in HTML or CSS files. Base64 is compatible with JavaScript, CSS, and HTML.
- It is lossless. All information is retained during the encoding and decoding process.
- It can be used to send email attachments. SMTP originally only allowed 7-bit ASCII characters. Modern systems are more flexible, but Base64 ensures legacy systems can safely receive any attachments.
- Because images are not stored as separate files, Base64 minimizes the number of requests for web data. This can lead to better performance when displaying web pages with many small images.
- It is useful whenever data must be stored using a limited data set.
- Base64 encoding is certain to be compatible between different systems. This was far more important during the early days of computing.
- Most programming languages provide utilities to convert files to and from Base64. Base64 encode and decode functions are available in JavaScript.
- It prevents binary files from accidentally being treated as executables. It also makes it more difficult for other web pages to automatically link to any embedded images.

## What Are the Limitations of Base64 Code?

Unfortunately, there are also some drawbacks to Base64 encoding, mainly involving performance. Following are some of the disadvantages of Base64:

- It increases the size of the file and the amount of data to transfer. Most files increase in size by about 30 to 35% depending on the amount of padding. If a large amount of Base64 data is included, additional fetch operations might be required.
- It requires extra time and processing power to encode and decode the content.
- Base64 text is not guaranteed to be safe for URLs due to the presence of the `/`, `+`, and `=` characters. The RFC describes an alternate Base64 `base64url` character set which is URL-safe.
- Some older browsers do not support Base64 encoding. This would result in the display of meaningless strings of non-decoded text.
- Base64 does not encrypt its data and is not considered to be secure without other security measures.
- Base64 does not compress the encoded data. If compression is required, other protocols must be used.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Encode and Decode with Base64 in JavaScript?

Although translating data to or from Base64 manually is quite complicated, it is very easy in JavaScript. Developers can use the built-in function `btoa`, standing for "binary to ASCII", to encode data into Base64. Data can be decoded using the complementary `atob` routine. Applying the `atob` function to the output from `btoa` always results in the original data.

All current releases of all common web browsers support these operations. However, these JavaScript methods only support 8-bit bytes. Unicode characters must be first converted to 8-bit bytes before being encoded. For more information about dealing with Unicode strings, consult the [Mozilla documentation](https://developer.mozilla.org/en-US/docs/Web/API/btoa).

{{< note >}}
The names of these functions are not quite accurate. The "binary" text must be in Unicode string format, and the Base64 encoding is only a subset of the ASCII character set.
{{< /note >}}

### Encode Data with Base64 in JavaScript.

To encode any data in Base64 format, use the `btoa` function. Provide the original text as an argument to the function. To use JavaScript to encode a string into Base64, follow the steps below. The example below uses the JavaScript debugger found in most web browsers.

{{< note >}}
To run short JavaScript code snippets without embedding them in a web page, use the developer tools in the browser. For instance, in the current release of Firefox, choose **Tools** -> **Browser Tools** -> **Web Developer Tools**. Then select the **Debugger** tab. Enter the JavaScript commands at the `>>` prompt.
{{< /note >}}

1.  Assign the data to encode to a variable.

    ```command
    var origString = 'La';
    ```

1.  Encode the data using the built-in `btoa` JavaScript function. Pass the string variable to the function.

    ```command
    var base64EncodeString = btoa(origString);
    ```

1.  Print the result using `console.log` to ensure the string is encoded correctly.

    ```command
    console.log(base64EncodeString);
    ```

    ```output
    TGE=
    ```

### Decode Data with Base64 in JavaScript.

JavaScript can also decode Base64 text. The procedure to decode a Base64 representation back into the original is very similar. Use the `atob` function and pass it the Base64 string. `atob` should produce the original string. To decode Base64 data, follow the steps below:

1.  Pass the data to be decoded to the `atob` function and store the result in a new variable.

    ```command
    var txtDecodeString = atob(base64EncodeString);
    ```

1.  Confirm the data is decoded correctly. The result should match the original data.

    ```command
    console.log(txtDecodeString);
    ```

    ```output
    La
    ```

Here is the full Base64 js file to encode and decode the sample text. The input data is hard coded in this example, but the routine can easily be enhanced to accept input from the user.

```file {title="base64.js"}
var origString = 'La';
var base64EncodeString = btoa(origString);
console.log(base64EncodeString);
var txtDecodeString = atob(base64EncodeString);
console.log(txtDecodeString);
```

## A Summary of Base64 in JavaScript

The Base64 encoding mechanism is useful for converting files into a safe format, using a restricted set of characters. The Base64 representation can be embedded in HTML and CSS files, allowing for fewer server requests. It ensures compatibility and protects binary files from being executed or linked to from other web pages.

Base64 converts three eight-byte characters into four six-bit octets. It then translates these values into the Base64 set of printable characters. Developers can encode strings into Base64 in JavaScript using the `btoa` function. The `atob` function can decode the Base64 string back to its original format. These two functions are built into JavaScript and all modern browsers support them.
