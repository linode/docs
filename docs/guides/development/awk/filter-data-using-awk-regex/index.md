---
slug: filter-data-using-awk-regex
description: "AWK is a powerful tool used for text processing, and data retrieval. It's support of regular expressions gives you even more power to process your text and data. This guide gives you an introduction to AWK and regex and also, includes useful examples, like finding an IP address, phone number, and dates."
keywords: ['awk regex']
tags: ['awk']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-05
image: FilterData.jpg
modified_by:
  name: Linode
title: "Filter Data using AWK RegEx"
title_meta: "How to Filter Data using AWK RegEx"
authors: ["Andy Lester"]
---

AWK, named after the developers Aho, Weinberger, and Kernighan, is ideal for finding data in text files. Among its other virtues, the [AWK Programming Language](/docs/guides/introduction-to-awk/) is optimized to make this task as easy as possible.

## How To Filter Data Using AWK RegEx

Apart from AWK's power as a tool for filtering data, it also supports regular expressions. A regular expression, or RegEX for short, is a compact way to describe a pattern for which you want to search. This gives you the power to search for patterns in your text rather than a set of defined strings. Rather than searching for the strings `field1`, `field2`, and `field3` as separate things to search for, a regex like `/field[1-3]/` searches for all three strings at once. This gives you flexibility when searching through data.

Awk's basic syntax is as follows:

      awk [options] 'pattern {action}' file

Each line of the input file is matched against the pattern; if the line matches the pattern, then the action is executed.

To become more familiar with AWK, create a sample text file and save it as `inputfile.txt` with the contents below. The example includes warnings returned by [Vale](https://github.com/errata-ai/vale), a syntax linter for prose.

{{< file "~/inputfile.txt" >}}
[
  { path:
     'docs/guides/databases/mariadb/how-to-install-mariadb-on-centos-8/index.md',
    start_line: 33,
    end_line: 33,
    start_column: 84,
    end_column: 225,
    annotation_level: 'warning',
    title: '[warning] Linode.OxfordComma',
    message:
     'Use a comma before the last "and" or "or" in a list of four or more items.' },
  { path:
     'docs/guides/databases/mariadb/how-to-install-mariadb-on-centos-8/index.md',
    start_line: 33,
    end_line: 33,
    start_column: 85,
    end_column: 90,
    annotation_level: 'warning',
    title: '[warning] Linode.SentenceLength',
    message: 'Shorter sentences improve readability (max 25 words).' },
  { path:
     'docs/guides/databases/mariadb/how-to-install-mariadb-on-centos-8/index.md',
    start_line: 66,
    end_line: 66,
    start_column: 9,
    end_column: 17,
    annotation_level: 'warning',
    title: '[warning] Linode.FutureTense',
    message: 'Avoid using future tense: "will bind"'
  }
]
{{< /file >}}

The general form of an AWK program is a list of patterns and actions with each pattern matched against each line in the input file.

Consider the following simple example:

      awk '/warning/ { print }' inputfile.txt

This looks at the contents of `inputfile.txt`, line by line. For each line that matches the pattern `/warning/`, the line is printed as shown below.

{{< output >}}
annotation_level: 'warning',
title: '[warning] Linode.OxfordComma',
annotation_level: 'warning',
title: '[warning] Linode.SentenceLength',
annotation_level: 'warning',
title: '[warning] Linode.FutureTense',
{{< /output >}}

Since `print` is the default action for a pattern, you can shorten it to:

      awk '/warning/' inputfile.txt

If you were using Grep, the above command is the same as running:

      grep warning inputfile.txt

## Use AWK With Patterns

The simplest pattern possible is regular alphanumeric characters that appear on the line of text.

In the example below, the pattern `/error/` matches any line where the string "error" appears.

    echo -e "Please correct your error.\nDave was error-prone.\nfunction display_user_error_to_screen()" | awk '/error/'

{{< output >}}
Please correct your error.
Dave was error-prone.
function display_user_error_to_screen()
{{< /output >}}

{{< note respectIndent=false >}}
The pattern `/error/` does not match the string `Error` or `ERROR` because AWK's pattern matching is case-sensitive. You can override this by setting `IGNORECASE=1` at the beginning of your program.
{{< /note >}}

### Using Awk with Dot (.) in a Pattern

The dot (`.`) metacharacter matches any single character you pass to AWK for processing. Consider the following example:

    echo -e "black\nark\nawk" | awk '/a.k/'

The pattern `/a.k/` matches `awk`, `ark`, `black`.

{{< output >}}
black
ark
awk
{{< /output >}}

If your input text instead used `bake`, and `cheapskate`, no match is returned, since there are no
characters between `a` and `k`.

## Character Classes

If you want to match a set of characters then you can use a character class. A character class is defined using square brackets `[]` with a list of characters inside.

**Example:** A character class for vowels is `[aeiou]`.

You can also specify a range of characters with a hyphen `-`. Say you were looking through text files for a student's grades, with the word "grade" followed by "A", "B", "C", "D" or "F". You can write your character class either as `/grade:[ABCDF]/` or `/grade:[A-DF]/`.

For example, the pattern `/grade:[A-DF]/` in the following example matches `grade:F` and `grade:Awful`.

    echo -e "grade:F\ngrade:Awful" | awk '/grade:[A-DF]/'

{{< output >}}
grade:F
grade:Awful
{{< /output >}}

However, the pattern `/grade:[A-DF]/` would not match `grade:c`, or `grade:Q`

### Negating a Character Class

You can also search for a character that is not in the character class using `^` metacharacter. This indicates that the result should match any character except the listed characters. In short, `^` means **not**.

**Example:** The character class `[^abc]` matches any character except for `a`, `b`, or `c`.

## Escape Sequence

There are special *escape sequences* to find characters that cannot be typed as a string. An escape sequence starts with a backslash `\` that is used to mark a special character.

| Escape Sequence | Description |
| ----------------  |:-------------|
| \n                | Linefeed          |
| \r                | Carriage return |
| \t                | Tab |
| \xDD              | Character represented by the hex digits DD. For example, the escape character is "\x1B"|
| \\\               | Backslash |

Some character classes are used frequently. The character class `[a-zA-Z_]` for a single word character is used so often that AWK provides a shortcut, `\w`. And similarly, for any character that is not a word, use the capitalized version `\W`.

Here are some helpful shortcuts:

| Special character | Description |
| ----------------- |-------------|
| \w                | A word character (A-Z, a-z or _)|
| \W                | A non-word character |
| \s                | A whitespace character (tab, linefeed, carriage return, etc) |
| \S                | A non-whitespace character|

## Regular Expression Quantifiers

Quantifiers specify how many of something should be matched. The following table lists the different quantifiers.

| Quantifier| Description                   |
| --------- |----------------------------   |
| +         | Match one or more occurrences   |
| *         | Match zero or more occurrences |
| ?         | Match zero or one occurrence   |
| {n}       | Match exactly n occurrences    |
| {n,}      | Match at least n occurrences   |
| {n,m}     | Match from n to m occurrences  |

Below are some examples of quantifiers in use:

1. **Match one or more occurrence (+)**

    The pattern `/go+gle/` in the example below matches `gogle`, `google`, and `gooogle` as there is more than one `'o'`.

        echo -e "gogle\ngoogle\ngooogle"  | awk '/go+gle/'

    {{< output >}}
gogle
google
gooogle
{{< /output >}}

1. **Match zero or more occurrences (*)**

   The pattern `/Ge*ks/` in the example below matches `Gks`, `Geks`, and `Geeks`.

        echo -e "Gks\nGeks\nGeeks"  | awk '/Ge*ks/'

   {{< output >}}
Gks
Geks
Geeks
{{< /output >}}

1. **Match zero or one occurrence (?)**

   The pattern `/Colou?r/` in the example below matches only `Color` and `Colour`.

        echo -e "Color\nColour"  | awk '/Colou?r/'

   {{< output >}}
Color
Colour
{{< /output >}}

   Also, the pattern `/Ge?ks/` in the example matches only `Geks`,`Gks`, but not `Geeks`.

        echo -e "Geks\nGks\nGeeks"  | awk '/Ge?ks/'

   {{< output >}}
Geks
Gks
{{< /output >}}

1. **Match exactly n occurrences {n}**

    To find exactly six digits, use `/\d{6}/`. It is the same as `/\d\d\d\d\d\d/`, but easier to type and to read.

    For example, the pattern `/Ge{2}ks/` in the example below matches `Geeks`.

        echo -e "Geeks"  | awk '/Ge{2}ks/'

    {{< output >}}
Geeks
{{< /output >}}

1. **Match at least n occurrences {n,}**

    If there are two numbers separated by a comma (**not** a hyphen), that specifies an upper and lower bound of how many characters to match. So, to find a value between seven and ten-word characters in a row, use `/\w{7,10}/`.

    For example, the pattern `/Ge{2,}ks/` in the example below matches `Geeks`, `Geeeks`, `Geeeeks`, and so on, but not `Geks`.

        echo -e "Geeks\nGeeeks\nGeeeeks\nGeks"  | awk '/Ge{2,}ks/'

    {{< output >}}
Geeks
Geeeks
Geeeeks
{{< /output >}}

1. **Match from n to m occurrences {n,m}**

    If you omit either `n` or `m`, it indicates that part of the numeric range is unbounded. Say you want to find `kaboom` or `kabooooom` or even `kabooooooooooooooom`, as long as there are at least two `o`'s, use `/kabo{2,}m/`. The string `kabom` would not match, because there is only one `'o'`.

    For example, the pattern `/Ge{1,2}ks/` in the example below matches `Geks`, `Geeks`, but not `Geeeks`.

        echo -e "Geks\nGeeks\nGeeeks"  | awk '/Ge{1,2}ks/'

    {{< output >}}
Geks
Geeks
{{< /output >}}

1. **Quantity Specifiers:**

    To specify how many of something should be found, enclose a number inside curly braces (`{}`). A single number inside the braces says to match exactly that number of something. For example, to find exactly six digits, use `/\d{6}/`. It is exactly the same as `/\d\d\d\d\d\d/`, but easier to type and to read. The examples below demonstrate the differences between these two formats.

    - The regular expression below matches three digits, hyphen, three digits, a hyphen, four digits (US phone number)

            /\d\d\d-\d\d\d-\d\d\d\d/

    - The regular expression below matches three digits, hyphen, two digits, a hyphen, four digits (US Social Security Number)

            /\d\d\d-\d\d-\d\d\d\d/

        To denote the same expressions as shown above, you can use *Quantity Specifiers*. This format makes it easier to see how many digits you are looking for within your text.

            /\d{3}-\d{3}-\d{4}/
            /\d{3}-\d{2}-\d{4}/

## Grouping Expressions

Sometimes you need to group parts of a pattern for repetition. Quantifiers like `*` and `+` work on a single character of the pattern, unless grouping parentheses make a larger group.

Parentheses `()` are used for grouping expressions. Grouping is regularly used when looking for strings that may or not be present in the text you are searching.

For example, the following regular expression matches the lines containing **Apple Juice**

    echo -e "Apple Juice\nApple Pie\nApple Tart\nApple Cake" | awk '/Apple (Juice)/'

{{< output >}}
echo -e "Apple Juice\nApple Pie\nApple Tart\nApple Cake" | awk '/Apple (Juice)/'
Apple Juice
{{< /output >}}

### Alternatives

The character `|` means **OR** in the context of a grouped match. It is used to find one of two or more shorter patterns. In general, put your alternative patterns in grouping parentheses, even if they are not strictly necessary.

For example, the following regular expression matches the lines containing **Apple Juice** or **Apple Cake**.

    echo -e "Apple Juice\nApple Pie\nApple Tart\nApple Cake" | awk '/Apple (Juice|Cake)/'

{{< output >}}
Apple Juice
Apple Cake
{{< /output >}}

## Word Boundaries (`\<` and `\>`)

- The word boundary `\<` matches an empty string at the **beginning of a word**.
- The word boundary `\>` matches an empty string at the **end of a word**.

1. For example, if you want to match the word `cat` without also matching `category` or `indicate`, use the *beginning of a word* modifier `\<` and the *end of a word* modifier `\>` as shown in the example below.

        echo -e "cat\ncategory\n" | awk '/\<cat\>/'

    {{< output >}}
cat
{{< /output >}}

1. You don't have to use both the beginning and end of word boundaries. For example, if you use only the beginning word boundary with `/\<cat/`, you would match `cat` and `catastrophe`, but not `tomcat` or `indicate`.

        echo -e "cat\ncatastrophe\ntomcat\nindicate" | awk '/\<cat/'

    {{< output >}}
cat
catastrophe
{{< /output >}}

1. Earlier in this guide, you saw how the pattern `/grade:[A-DF]/` matched `grade:F`, and `grade:Awful`. With word boundaries, `/\<grade:[A-DF]\>/` only matches the first string, `grade:F`.

        echo -e "grade:F\ngrade:Awful" | awk '/\<grade:[A-DF]\>/'

    {{< output >}}
echo -e "grade:F\ngrade:Awful" | awk '/\<grade:[A-DF]\>/'
grade:F
{{< /output >}}

    {{< note respectIndent=false >}}
AWK uses different word boundary sequences compared to Perl and Perl Compatible Regular Expressions (PCRE). Perl uses `\b` for both the beginning and end of word boundaries.
    {{< /note >}}

## Beginning and End of Lines (`^` and `$`)

To match text only if it appears at the beginning of a line use the caret (`^`) metacharacter. To match text only if it appears at the end of a line use the dollar sign (`$`) metacharacter.

- In the following example, the pattern `/dog/` matches `dogs and cats` or `cats and dogs`.

        echo -e "dogs and cats\ncats and dogs" | awk '/dog/'

    {{< output >}}
dogs and cats
cats and dogs
{{< /output >}}

- However, the pattern `/^dog/` only matches `dogs and cats`.

        echo -e "dogs and cats\ncats and dogs" | awk '/^dog/'

    {{< output >}}
dogs and cats
{{< /output >}}

- Sometimes the line you are searching for may have optional whitespace before the string you are looking for. You can use `\s*` as the pattern for optional whitespace, so you would use `/^\s*dog/` to match any of these:

      dogs and cats
         doghouse
             dog food

## Searching for Special Metacharacters

Searching for patterns where you want to find literal metacharacters requires special care, and you must *escape* the metacharacter with a `\` backslash character. Otherwise, you get unwanted results.

If you are looking for the string `/Mr. Jones/`, the `.` is interpreted as meaning *any single character*, even though it is obvious that you meant *a period at the end of `Mr.`*. For this reason, you must escape the `.` with a backslash. The updated pattern is `/Mr\. Smith/`.

{{< note respectIndent=false >}}
If AWK gives you an error message about a pattern's syntax, the first thing you should check for is a metacharacter that perhaps you did not properly escape.
    {{< /note >}}

Here are more examples of patterns that do not work as expected, and their corrected version:

      /(312) 588-2300/            /\(312\) 588-2300/
      /M*A*S*H/                   /M\*A\*S\*H/
      /Tom+Jerry/                 /Tom\+Jerry/

## Putting It All Together

This section includes common examples of text you might search for using AWK and regular expressions.

### IP Addresses

IPv4 addresses are a common target to search for in files. This expression finds numeric patterns that have the typical format of IPv4 addresses.

      /\<[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\>/

The expression looks for four numbers of one to three digits, each separated by a single dot. However, the expression may match numbers that are not valid IPv4 addresses, like `10.21.5.784`, since 784 is larger than 255.

{{< note respectIndent=false >}}
The above pattern begins and ends with the `\<` "beginning of the word" and `\>` "end of word" markers. Otherwise, you might match strings with more than three digits at the beginning or end of the IP address.
    {{< /note >}}

### Dates

- The simplest pattern to find a date in the format of "YYYY-MM-DD" is the following:

      /\<[0-9]{4}-[0-9]{2}-[0-9]{2}\>/

- To allow for the month or day being a single digit like "2021-2-28", you could use:

      /\<[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\>/

### Time

- You can search for the time in the "HH:MM" format similar to the date format.

      /\<[0-9]{2}:[0-9]{2}\>

- You can allow the hours to be single digits.

      /\<[0-9]{1,2}:[0-9]{2}\>

- You can also find the seconds in "HH:MM:SS" format.

      /\<[0-9]{1,2}:[0-9]{2}:[0-9]{2}\>

- To make seconds optional, group seconds in parentheses and put a `?` after it.

      /\<[0-9]{1,2}:[0-9]{2}(:[0-9]{2})?\>
