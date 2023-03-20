---
slug: how-to-use-unicode-in-python3
description: 'This guide introduces the concept of Unicode to developers, explains how Python handles unicode, and demonstrates how to handle common errors'
keywords: ['Python unicode','Unicode python','Unicode error python','Python unicode to string']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-20
modified_by:
  name: Linode
title: "How to Use Unicode in Python 3"
title_meta: "Using Unicode in Python 3"
external_resources:
- '[Python Unicode Documentation](https://docs.python.org/3/howto/unicode.html)'
- '[Unicode site](https://home.unicode.org/)'
- '[Unicode 14.0 documentation](https://www.unicode.org/versions/Unicode14.0.0/)'
- '[Wikipedia ASCII page, including code points](https://en.wikipedia.org/wiki/ASCII)'
- '[Wikipedia UTF-8 page](https://en.wikipedia.org/wiki/UTF-8)'
- '[RFC 3629](https://datatracker.ietf.org/doc/html/rfc3629)'
- '[An explanation of the Unicode standard](https://jkorpela.fi/unicode/guide.html)'
- '[Python background on lexical analysis](https://docs.python.org/3/reference/lexical_analysis.html)'
authors: ["Jeff Novotny"]
---

Most of the time, using [*Unicode*](https://home.unicode.org/) characters in Python does not require extra effort. However, sometimes encoding and decoding do not work properly, which results in errors. To resolve these issues, this guide helps you understand how Python encodes and decodes Unicode. Fortunately, the Python library includes some powerful and useful utilities and built-in functions to manage these tasks. This guide introduces Unicode and the [*UTF-8*](https://en.wikipedia.org/wiki/UTF-8) character encoding and explains how Python handles Unicode. It also discusses some common Python Unicode errors and demonstrates how to resolve them.

For an in-depth explanation of Unicode, read on, otherwise jump to [How Does Python Implement Unicode?](#how-does-python-implement-unicode)

## An Introduction to Unicode on Python

To properly understand how Python manages Unicode, you need to understand character processing. Computer files are written using a specific character set. A character set is a collection of characters used within a language or domain. For instance, the written English language maps to a character set containing 26 upper and lower case letters, along with punctuation marks. However, computers use a more formal collection called a *Coded Character Set* (CCS).

In a CCS, each character is assigned a corresponding numerical value known as a *code point*. A set of code points makes it possible for a system to translate between the on-screen representation of each character and its binary equivalent. Every character set is also associated with a *code unit*. The code unit determines the size of each encoded character. For instance, a character set could encode every single character using 16 bits, or two bytes. The same code point could be associated with different code units in different encodings. For instance, the value `127` might be represented using 7, 8, 16, or 32 bits. Some formats even use a variable-length encoding. This means it is not possible to determine the binary representation of a character based on its code point.

Text is decoded and encoded using a specific encoding standard. The encoding algorithm is known as a *codec*, which is a portmanteau of the coder/decoder. The system must know what codec to use to encode/decode the file correctly. Files can be decoded from bytes to characters and text can be encoded from characters to bytes. Format conversions can certainly become complicated, but most files use either the ASCII or Unicode format.

## What is Unicode?

Unicode is currently the most widely-used encoding standard. It was developed through the joint efforts of Xerox and Apple, but it is currently administered and maintained by the Unicode Consortium. Unicode has successfully unified pre-existing character sets and now serves as the international standard. Unicode has the goal of including every character used in the world's active writing systems.

Unicode describes the list of available characters and their code points but does not describe how to map the code points to bytes. It also includes a formal Unicode name for each character. A variety of *character encoding schemes* (CES) can be applied to Unicode text to map the characters to bytes.

The Unicode standard includes the following components:

- **Character Repertoire**: This is the full set of characters that Unicode supports. Unicode currently defines nearly 150,000 characters. The repertoire is open to new additions, and additional characters are always being proposed. The characters are subdivided into several sub-components known as general categories. Some examples of general categories are `letter`, `mark`, `number`, and `symbol`.
- **Coded Character Set (CCS)**: Like other CCS systems, the Unicode standard maps each character to a code point. Each code point represents one and only one character. For instance, Unicode hexadecimal code point `1F6A6` represents the traffic light emoji 🚦. The Unicode code point for a given character can differ from the code points used in other systems, although all ASCII characters continue to use the ASCII code points.
- **Character Encoding Form (CEF)**: This component explains how to map code points to code units.
- **Character Encoding Scheme (CES)**: The encoding scheme maps code units to a sequence of bytes. It describes how to transmit files over a network and how to store character information in binary format. Unicode does not recommend a specific CES. Standards including UTF-8, UTF-32, or ISO/IEC 2022 can be used. However, UTF-8 is usually favored, mainly because it is more concise than the other systems.

The Unicode character set includes all traditional ASCII characters, international writing scripts, symbols, and a large number of emojis. Unicode also contains various control and non-printable characters. Each Unicode letter is identified using the letter `U`, the `+` sign, and its code point. For example, the Unicode character having code point `639` is represented by the string `U+0639`.

The Unicode code space is divided into seventeen planes to help structure and organize the collection. Related characters are placed within contiguous blocks inside a single plane. This makes it easier to locate specific characters in the published Unicode charts. All characters have a fixed name that uniquely identifies them. This name cannot be subsequently changed, even if it is inaccurate or contains errors.

Unicode contains several unallocated "non-character" code points and blocks of private-use code points. The private characters can be used internally or through an agreement between a sender and receiver. In addition, a set of "formatting" characters modifies the behavior of adjacent characters, including ligatures. Some abstract characters can only be represented by a sequence of two or more characters. Unicode maintains a list of these abstract characters, but they are often the source of some confusion.

Although moderated, Unicode is an open system. New additions are always being proposed. Unicode can expand to over one million code points, and there is still plenty of room for new characters. The current release of Unicode is 14.0, which was released in 2021.

Most operating systems, web browsers, text processors, and programming languages such as Python have built-in support for Unicode. They can decipher Unicode-encoded text and display the appropriate characters. Some applications do not support Unicode or have not yet implemented the latest release. In this case, users might see empty rectangles or the `?` symbol in place of actual text. Some systems only support one or two-byte Unicode characters, which is a subset of the entire collection.

The [Unicode site](https://home.unicode.org/) provides a complete overview of the Unicode standard, along with a FAQ and explanation of how to use the site. Perhaps the most important section of the site is the [specification of the latest release](https://www.unicode.org/versions/Unicode14.0.0/). The documentation allows developers to view the latest code charts and read an overview of each section.

### What is the Difference between ASCII and Unicode?

ASCII is a very early character encoding developed from telegraph code. It can be considered an ancestor of the current Unicode system. ASCII is an abbreviation of the American Standard Code for Information Interchange. It was the standard during the early days of the internet until approximately 2008 and is still common today.

The ASCII character set consists of 128 characters, which have code points between 0 and 127. Each code point is represented as a 7-bit binary number. Some applications used the eighth and final bit for proprietary purposes, leading to a lack of compatibility. The set of ASCII characters was found to be too small and restrictive, so new encodings were developed to allow for more characters. However, most modern encoding systems are based on ASCII and typically preserve the original code points for the original ASCII characters.

Within the ASCII character set, control characters and related characters, such as digits, have contiguous code points. This makes it easier to locate characters. The ASCII system consists of the following characters.

{{< note >}}
All code points in this list use the decimal system.
{{< /note >}}

- Lowercase letters from `a` to `z`. These have code points between `97` to `122`.
- Uppercase letters from `A` to `Z`. They are assigned code points between `65` to `90`.
- The digits `0` to `9`, run from code points `30` to `39`.
- The space character, with code point `32`.
- Essential punctuation points.
- Opening and closing brackets, parentheses, braces, chevrons, and forward/backward slashes.
- A small set of mathematical, typographical, and other symbols, including `+`, `&`, `$`, and `^`.
- A set of 32 non-printable control characters, including codes for a line return, tab, bell, backspace, and form feed. These characters have code points `1` to `31`, and `127`. Many of these codes apply to archaic printing devices and are no longer in use. A few of these codes have been assigned new meanings.
- A `null` character that has code point `0`.

A complete list of the characters can be found on the [Wikipedia ASCII page](https://en.wikipedia.org/wiki/ASCII#Printable_characters). The ordering of characters based on their ASCII code points is known as *ASCIIbetical order*. Computer systems sometimes process characters using ASCIIbetical order rather than alphabetical order.

By contrast, Unicode is an expanded and updated encoding standard that builds upon the original ASCII standard. Unicode separates the code points from the details of the encoding system. This permits a much wider range of characters up to four bytes.

The Unicode character set incorporates the entirety of the ASCII character set as the first 127 characters. All ASCII characters have the same code points in both encodings. This means any ASCII text file is a valid UTF-8 file. Additionally, any UTF-8 file that only uses ASCII characters can be processed as ASCII text. This ensures legacy ASCII-only applications can accept files with only ASCII characters, maintaining backward compatibility.

The greater flexibility of Unicode allowed it to become the modern standard for character encoding in computer systems and on the internet. However, ASCII-only applications and systems persist to this day. ASCII-only applications and files are guaranteed to be compatible with any system.

### What is UTF-8?

UTF-8 is one of several character encoding schemes implementing the Unicode encoding standard. An encoding scheme translates a string to a byte sequence and a byte sequence back into a string. UTF-8 is defined in [RFC 3629](https://datatracker.ietf.org/doc/html/rfc3629). It is capable of encoding all 1,112,064 code points in Unicode.

UTF-8 is backward-compatible with ASCII. All ASCII files are UTF-8 compliant and a UTF-8 file that only contains ASCII characters is compatible with ASCII systems.

A code unit in UTF-8 is 8 bits, compared to 7 bits for ASCII. However, one character can map to anywhere between one and four code units. The alternative UTF-32 codec represents all characters using four code units each consisting of four bytes. This means UTF-8 generates much smaller files than UTF-32.

UTF-8 is the most popular encoding on the internet and is used in between 95 to 100% of all websites. It is now considered the international standard for Unicode encoding. Virtually all modern applications support UTF-8, and many standards and applications only accept files encoded in UTF-8. UTF-8 files are safe to use with programming languages that use escape or special characters.

Here are some of the main advantages of UTF-8:

- UTF-8 can encode all possible Unicode code points.
- It only uses a byte containing all zeroes to represent the `null` character. This maximizes interoperability with the C programming language and legacy protocols that use `0` to indicate the end of a file.
- All ASCII strings are valid UTF-8 strings and have the same code points. This means UTF-8 can encode ASCII files. Seven-bit values never otherwise occur in UTF-8, avoiding confusion.
- UTF-8 is a compact and concise encoding. Most Unicode characters can be stored in one or two bytes.
- UTF-8 can resynchronize at the next code point to recover from corrupted or lost data. Because certain values cannot occur in UTF-8, errors are easier to detect. The start of a character can be found within three bytes of any point in the file, and the sequence for one character never begins inside another character.
- It avoids the bytes `FF` or `FE`, to avoid confusion with the UTF-16 byte order mark. This means it is impossible to misinterpret a UTF-8 file as UTF-16.
- It is byte-oriented and the encoding does not depend on the underlying hardware architecture. The first byte indicates the number of bytes of the next character.
- If a file gets split in the middle of a character, only a single character is lost.

The Unicode encoding process follows an establishing encoding formula, which designates certain bits as framing bits. In practice, this restricts the maximum value to 21 bits. The encoding technique can be described as follows.

- One-byte values begin with a `0`, followed by the 7 bits of the code point. All ASCII values, and only the ASCII values, are encoded as one-byte values.
- For two-byte values, the first byte begins with `110`, and the second with `10`. A byte beginning with `10` is a *continuation byte*. The remainder of the bits encodes the code point. These values are used for all Latin-style alphabets, along with Greek, Cyrillic, Hebrew, Arabic, and some other languages. Two-byte values also encode diacritical marks and International Phonetic Alphabet (IPA) extensions.
- Three-byte values start with `1110`. The second and third bytes begin with `10`. This plane of values encodes the Basic Multilingual Plane, including almost all characters commonly in use, and many emojis.
- Four-byte values are indicated with leading `11110` bits. The remaining three bytes start with `10`. Emojis, mathematical symbols, and some ideographic symbols from Asian languages are encoded using four bytes.
- Certain bit patterns indicate an invalid sequence. This could indicate a potentially valid code point that has not been assigned a value yet or an invalid UTF-8 value. An example is an unexpected continuation byte. Most invalid values are dropped, but hackers have used them to bypass security measures.
- The byte order mark `0xEF 0xBB 0xBF` at the start of a file indicates the file uses UTF-8. However, it is not recommended or required and might confuse some systems. If the file begins with the byte order mark `FEFF`, the file is encoded in UTF-16, not UTF-8.

As an example, here is how to encode the Unicode code point for the Peso symbol `₱`.

- The Unicode code point for this symbol is `0x20B1`. It can be found in the currency chart in the [Unicode charts](https://www.unicode.org/charts/).
- This value requires a three-byte encoding, with 16 bits used for the code point and eight bits for the framing.
- Converted to binary, this value is `0010 0000 1011 0001`.
- The first four bits are encoded in the first byte and preceded by the framing bits `1110`. This results in `1110 0010`.
- The second byte begins with `10`, followed by the next six bits of the code point. This results in `1000 0010`.
- The third and final byte also starts with `10`, followed by the remaining encoding bits. This yields `1011 0001`.
- Taken together, this is `1110 0010 1000 0010 1011 0001`. In hexadecimal, this is `0xE282B1`.

UTF-8 can be contrasted with the UTF-16 and UTF-32 encoding schemes. UTF-16 always uses at least two bytes to encode characters. It can also use four bytes, while UTF-32 always uses four bytes. These schemes are somewhat easier to decode and use fewer framing bits. However, they are less concise than UTF-8 and are not ASCII-compatible.

## How Does Python Implement Unicode?

Python handles Unicode very differently in Python 2 and Python 3. In Python 2, the default encoding is ASCII. But in Python 3, UTF-8 is the default. This makes text processing much easier than before. It is no longer necessary to declare the encoding in the first or second line of the file. Nor is it necessary to preface Unicode strings with `u`.

{{< note >}}
This guide only discusses Unicode processing for Python 3. Python 2 handles Unicode very differently, so these instructions do not apply. For more information, consult the [Python 2 Unicode documentation](https://docs.python.org/2/howto/unicode.html) for further guidance. Python strongly recommends that developers upgrade to Python 3.
{{< /note >}}

According to the Python [Unicode documentation](https://docs.python.org/3/howto/unicode.html), the most important principle is to only work with Unicode strings internally. Decode the input data as soon as possible and encode the output only at the end. This greatly simplifies most programs and avoids introducing errors.

All Python 3 strings are Unicode strings and are stored as Unicode. This means Unicode characters can be included in a string. When the text is encoded, all characters are converted to their byte equivalent. To use Unicode characters in a string, declare the string normally, and include the Unicode characters in the correct position.

```file
u = "❤️"
print(u)
```

```output
❤️
```

Python 3 also permits many Unicode characters to be used as part of variable and function names. However, symbols or emojis can't serve in these roles. For instance, the "heart" emoji can not be part of a variable name. In the following example, the variable name `Øyen` contains a character from the Norwegian alphabet.

```file
Øyen = "Lofoten"
print(Øyen)
```

```output
Lofoten
```

A string can still be declared using a `u` at the front of the string, but this is no longer required. If a developer is simultaneously processing Unicode and ASCII files, they might want to use this convention to increase clarity. This is also necessary to backport files to Python 2.

```file
u = u"❤️"
```

A character can also be declared using its *escape sequence*. The Unicode escape sequence for two-byte characters is a backslash `\` character, a `u`, and four hexadecimal digits indicating the code point. If the hexadecimal character is shorter than four digits, insert leading zeros to pad the length to four.

The Unicode code point for the musical note symbol `♩` is `0x2669`. This symbol can be assigned to a Python string using its hexadecimal equivalent.

```file
x = "\u2669"
print(x)
```

```output
♩
```

The escape sequence for a Unicode character requiring three or four bytes begins with `\U`. The hexadecimal value must contain eight digits, so pad the front of the value with zeros until it is the proper length.

For example, the Unicode bumblebee emoji is encoded in a three-byte format possessing the Unicode code point `U+1F41D`. To assign this emoji character to a variable using its escape sequence, pad it out to `0001F41D`. After the character is assigned to a string, it can be printed out using the Python `print` function.

```file
bee = "\U0001F41D"
print(bee)
```

```output
🐝
```

### Using the Python `unicodedata` Library

Python provides many additional functions and libraries to help developers work with Unicode. The most relevant library is `unicodedata`. It allows developers to extract more information, such as the official name or code point, about each Unicode character. This library can be imported using the following Python directive.

```file
import unicodedata
```

To find the code point of a Unicode character, use the `ord` function. Precede the character with a `u`. This example demonstrates how to determine the code point for the musical note symbol.

{{< note >}}
This function only returns valid results for Unicode characters with a single code point. Although `ord` is a core Python function, the `unicodedata` library is necessary to determine multi-byte mappings.
{{< /note >}}

```file
print(ord(u"♩"))
```

```output
9833
```

The opposite function of `ord` is `chr`. It is used to convert the decimal integer of a code point to the actual character.

```file
print(chr(9833))
```

```output
♩
```

The `name` method is used to retrieve the official Unicode name for any Unicode character.

```file
print(unicodedata.name(u"🐝"))
```

```output
HONEYBEE
```

The official Unicode name can also be used to determine the character. Pass the official name, including all spaces, to the `lookup` method.

```file
print(unicodedata.lookup("QUARTER NOTE"))
```

```output
♩
```

A character can also be assigned to a string using its official Unicode name. Enclose the name in braces and precede it with a backslash and `N`. The following example assigns the musical note symbol to the `note` string.

```file
note = "\N{QUARTER NOTE}"
print(note)
```

```output
♩
```

### Reading and Writing Unicode Files in Python

The same concepts are used to read a file containing Unicode characters. Declare the file encoding as `utf-8` when calling the `open` function. Read the file normally.

```file {title="read_unicode.py"}
with open('sample.txt', encoding='utf-8') as f:
    for line in f:
        print(repr(line))
```

Given a `sample.txt` file containing some of the Unicode characters used in this guide, `read_unicode.py` returns the following results.

```output
'Øyen\n'
'♩\n'
'❤️\n'
'🐝\n'
```

For a write operation, create the file object as follows. Ensure the encoding is set to `utf-8`. The `write` method can accept Unicode characters or code points preceded by `\u` or `\U`.

```file {title="write_unicode.py"}
with open('sample.txt', encoding='utf-8', mode='w') as f:
```

For more information on reading and writing Unicode files, consult the [Python Unicode documentation](https://docs.python.org/3/howto/unicode.html).

### Limitations

Python 3 has far fewer limitations than Python 2. However, certain functions might not work as expected for characters requiring more than one code point or interactions between two consecutive characters. A good example of this is the `ord` function, which expects a single code point.

Always confirm the encoding of an input file unless it is known to be a UTF-8 file. Usually, the file specifies the encoding in the first or second line. However, sometimes the codec is not clear, so developers might have to contact the file originator.

### Encoding Text in Python

Encoding and decoding is the process of converting from strings to bytes. Strings display the text in a human-readable format, and bytes store the characters as binary data. Encoding converts data from a character string to a series of bytes. Decoding translates the bytes back to human-readable characters and symbols. It is important not to confuse these two methods. `encode` is a string method, while `decode` is a method of the Python byte object. It is not possible to encode bytes because the bytes are already encoded. Likewise, it is not possible to decode a string. A string is already a series of characters and it technically does not have any encoding. The string object does not even have a `decode` method. Attempting to call `decode` for a string results in an error.

To use Python to encode Unicode characters, use the string `encode` method. The default encoding standard is UTF-8, but for reasons of clarity, it is good practice to always explicitly pass in the protocol. The following example demonstrates how to encode the musical note Unicode character. Python converts the Unicode string to bytes and returns an encoded byte object.

```file
note = "♩"
note.encode("utf-8")
```

```output
b'\xe2\x99\xa9'
```

The `encode` method works the same way on multi-character strings. The ASCII characters are not converted to bytes. This preserves backward compatibility with ASCII-only applications.

```file
greeting = "Have a nice day! ♩"
greeting.encode("utf-8")
```

```output
b'Have a nice day! \xe2\x99\xa9'
```

### Decoding Unicode Bytes in Python

The inverse function to `encode` is `decode`. If this function is applied to a sequence of bytes, it returns the equivalent Unicode string of characters. To decode a function, use the `decode` method of the byte object. The encoding protocol is assumed to be UTF-8 by default, but it is safer to explicitly state it. This example decodes the byte encoding for the note character back into a string.

```file
notebytes = b'\xe2\x99\xa9'
notebytes.decode("utf-8")
```

```output
'♩'
```

## Common Unicode Errors in Python

Most of the time, the encoding and decoding process goes smoothly without much extra effort. However, Unicode errors can occur in Python. When Python cannot decode a file, it displays the `UnicodeDecodeError` message.

The most common Python Unicode error happens when a non-UTF-8 file is decoded using the UTF-8 codec. In this example, a string is encoded using the `latin-1` encoding. Attempting to decode it as a UTF-8 file results in a `UnicodeDecodeError`.

```file
quartercup = "¼"
quart_encode = quartercup.encode("latin-1")
quart_encode.decode("utf-8")
```

```output
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xbc in position 0: invalid start byte
```

To decode this string properly, declare it as a `latin-1` file in the function call. The type of encoding is often specified in the first line of the file. Python searches for the keywords `coding: name` or `coding=name`. But the convention is to use the format `# -*- coding: latin-1 -*-`, a carryover from the emacs editor.

```file
quart_encode.decode("latin-1")
```

```output
'¼'
```

This error can also occur when the `decode` method is applied to a byte object containing invalid Unicode sequences. This can happen if the file was corrupted or the characters were not encoded correctly. In this example, the `0xfe` byte is assigned to a Python byte object. This character is not permitted anywhere in a UTF-8 file because `xfe` is reserved for the UTF-16 byte order mark. If this byte is decoded using the UTF-8 decoder, Python raises an error.

```file
junk_bytes = b'\xfe'
junk_bytes.decode("utf-8")
```

```output
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xfe in position 0: invalid start byte
```

The `UnicodeEncodeError` is less common because developers generally have some control over the material they are decoding. However, it can happen if a developer attempts to encode Unicode data using another encoding algorithm. In this case, encoding is used on a string containing the bumblebee emoji. The string can be correctly converted to bytes using the UTF-8 encoder. However, when `encode` is invoked with the `ASCII` encoder, the attempt fails, generating the `UnicodeEncodeError`. This is because the bumblebee emoji does not exist in ASCII, and the ASCII codec cannot translate the Unicode code point.

```file
bee = "\U0001F41D"
utf8_bee = bee.encode("utf-8")
ascii_bee = bee.encode("ascii")
```

```output
UnicodeEncodeError: 'ascii' codec can't encode character '\U0001f41d' in position 0: ordinal not in range(128)
```

{{< note >}}
This UTF-8 codec permits unassigned Unicode code points to be encoded to bytes. However, these byte objects cannot later be decoded back into characters.
{{< /note >}}

To avoid errors, `encode` and `decode` accept the `replace` keyword as the second parameter. This substitutes the Unicode replacement character, `U+FFFD` for any character that cannot be properly translated. The `ignore` keyword completely ignores unknown characters. However, most developers prefer to avoid silent errors and receive an indication something has gone wrong.

```file
junk_bytes = b'\xfe'
junk_bytes.decode("utf-8", "replace")
```

```output
'�'
```

## Concluding Thoughts About Unicode on Python

Unicode was designed as a replacement and extension for the ASCII character set, which only contained 128 characters. Unicode covers characters from almost every world language, along with many symbols and emoji. Each character has an equivalent code point, which is used to identify, display, and translate the character.

UTF-8 is an encoding technique for converting Unicode characters to bytes and vice versa. It uses between one and four bytes to store a Unicode code point and is fully backward-compatible with ASCII. Python fully supports both Unicode and UTF-8 and permits strings to include any Unicode character. It includes the `unicodedata` library, which allows Python to manipulate Unicode data. Python decodes and encodes Unicode data using built-in string and byte methods. For more information on using Unicode in Python, see the [Python documentation](https://docs.python.org/3/howto/unicode.html).
