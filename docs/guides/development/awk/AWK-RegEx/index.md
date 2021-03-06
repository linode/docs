---
slug: AWK-RegEx
author:
  name: Andy Lester
  email: andy@petdance.com
description: 'Regular expressions are powerful – and awk makes them even more so.'
og_description: 'Regular expressions are powerful – and awk makes them even more so.'
keywords: ['awk regex']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-05
modified_by:
  name: Linode
title: "How to filter data using AWK RegEx"
h1_title: "How to filter data using AWK RegEx"
contributor:
  name: Andy Lester
  link: https://twitter.com/petdance
---
# How to filter data using AWK RegEx

AWK is ideal for finding data in text files. Among its other virtues, the [programming language](https://www.linode.com/docs/guides/introduction-to-awk/) is optimized to make that task as easy as possible.

Central to AWK’s power as a tool for filtering data is its support for regular expressions. A regular expression, or regex for short, is a compact way to describe a pattern for which you want to search. This gives you the power to search for patterns in your text rather than a set of defined strings. Rather than searching for the strings `field1`, `field2`, and `field3` as separate things to search for, a regex like `/field[1-3]/` searches for all three at once. This gives you flexibility in your searching.

The general form of an AWK program is a list of patterns and actions, with each pattern matched against each line in the input file. For a simple example:

```
   /warning/ { print }
```

Each line of the input file is matched against the pattern; if the line matches the pattern, then the action is executed. In this case, `/warning/` is the pattern that is matched against the input string, and `print` is the action to take on any line that matches the pattern. `print` with no arguments prints the entire input line.

For short AWK programs running in the shell, put the program in single quotes and specify an input file.

```
   awk '/warning/ { print }' inputfile.txt
```

This looks at the contents of `inputfile.txt`, line by line. For each line that matches the pattern `/warning/`, the line is printed.

Since `print` is the default action for a pattern, you can shorten it to:

```
   awk '/warning/' inputfile.txt
```

This simple program is exactly the same as running:

```
   grep warning inputfile.txt
```

## Patterns

The simplest pattern possible is regular alphanumeric characters that appear on the line of text.

The pattern `/error/` matches any line where the string "error" appears, such as:

```
   Please correct your error.
   No errors found
   Dave was error-prone.
```

The pattern doesn't have to match any sort of idea of a "word." Rather, `/error/` matches all of these:

```
   error
   errors
   terror
   function display_user_error_to_screen()
```

But note that this code does not match the string `Error` or `ERROR` because AWK's pattern matching is case-sensitive. You can override this by setting `IGNORECASE=1` at the beginning of your program.

## . - the "any" character

The single period or dot means "any character." It matches any single character.  This means that the pattern `/a.k/` matches all of these lines:

```
   awk
   ark
   black
```

…but would not match

```
   bake        (No character between "a" and "k")
   cheapskate  (Two characters between "a" and "k")
```

## Character classes

A character class is a set of characters that to match in your pattern. A character class is shown as a set of square brackets with a list of characters inside. A character class for vowels would be `[aeiou]`.  You can also specify a range of characters with the `-`.

Say you were looking through text files for a student's grades, with the word "grade" followed by "A", "B", "C", "D" or "F".  You could write this either as `/grade: [ABCDF]/` or `/grade: [A-DF]/`.

For example, the pattern `/grade: [A-DF]/` would match

```
   grade: F
   grade: Awful
   The city of Belgrade: Destination of mystery
```

But would not match:

```
   grade: c
   grade: Q
```

You can also start a character class with a `^` character to indicate that the results should match any character except for the characters in the class; here, `^`	 means “not.” The character class `[^abc]` matches any character except for `a`, `b` or `c`.

## Escape sequences

Sometimes you need to find characters that can't be typed as a string. There are special "escape sequences" for those. An "escape sequence" starts with a backslash that indicates that whatever follows is special.

```
   \n      Linefeed
   \r      Carriage return
   \t      Tab
   \xDD    Character represented by the hex digits DD. For example, the escape character is "\x1B".
```

Some character classes are used frequently. The character class `[a-zA-Z_]` for a single word character is used so often that AWK provides a shortcut, `\w`.  For the opposite, any character that is not a word, use the capitalized version `\W`.

Here are some helpful shortcuts:

```
   \w      A word character (A-Z, a-z or _)
   \W      A non-word character
   \s      A whitespace character (tab, linefeed, carriage return, etc)
   \S      A non-whitespace character
```

Finally, because a backslash is always the beginning of an escape sequence, if you want a literal backslash, use:

```
   \\      Backslash
```

## *, +, ?, {} - specifying  how many

AWK regular expressions have three special characters that specify how many of something it should match.  `*` means "match zero or more;" `+` means "match one or more;" and `?` means "match zero or one only."

Here are some examples:

- The pattern `/bir+d/` matches `bird`, `birrd` and `birrrrrrrrd`, or any number of other versions so long as there is more than one `r`.

- The pattern `/bir*d/` matches `bid`, `bird`, `birrrrd`, and `birrrrrrrrrrd`.  It’s the same as the `+`, but the `r` can be missing entirely.

- The pattern `/bir?d/` matches only `bid` and `bird`.  A string like `birrrrd` has more `r`s than the `r?` will accept.

You can also use the `{}` notation to specify exactly how many of something should be found, based on the number or numbers inside the curly braces.

A single number inside the braces says to match exactly that number of something. For example, to find exactly six digits, use `/\d{6}/`.  It is exactly the same as `/\d\d\d\d\d\d/`, but easier to type and to read.

If there are two numbers separated by a comma (_not_ a hyphen), that specifies an upper and lower bound of how many to match.  So, to find a value between 7 and 10 word characters in a row, use `/\w{7,10}/`.

If you omit one of the two numbers, that means that that part of the numeric range is unbounded. Say you want to find `kaboom` or `kabooooom` or even `kabooooooooooooooom`, so long as there are at least two `o`s, use `/kabo{2,}m/`.  The string `kabom` would not match, because there is only one `o`.

Using quantity specifiers can make things easier to read. Here are two commonly-used patterns:

### 3 digits, hyphen, 3 digits, hyphen, 4 digits (US phone number)

```
   /\d\d\d-\d\d\d-\d\d\d\d/
```

### 3 digits, hyphen, 2 digits, hyphen, 4 digits (US Social Security number)

```
   /\d\d\d-\d\d-\d\d\d\d/
```

It can be confusing to keep track of patterns, especially those for matching the number of somethings you have. Quantity modifiers make it easier.

```
   /\d{3}-\d{3}-\d{4}/
   /\d{3}-\d{2}-\d{4}/
```

Now you can easily see how many digits you're looking for.

## () - Grouping

Sometimes you need to group together parts of a pattern for repetition. Quantifiers like `*` and `+` work on a single character of the pattern, unless grouping parentheses make a larger group.

Say you need to search text for the sound of laughter, using the string `ha`, or maybe `haha` or `hahahahahahaha` of some indeterminate length. You might want to write this as `/ha+/`, but the `+` meaning "one or more" only applies to the letter `a`.  To look for repeating `ha`,
use grouping parentheses, such as `/(ha)+/`.

Grouping is regularly used when looking for strings that may or not be there. For example, the US ZIP code format is 5 digits, optionally followed by a hyphen and four more digits.  You'd write this as `/\d{5}(-\d{4})?/` The `\d{5}` must be there, and then the `-\d{4}` is optional because of the `?` that applies to the parenthesized grouping before it.

## | - Alternation

Alternation is used to find one of two or more shorter patterns. The pattern `/dog|cat/` finds either `dog` or `cat` in the file you search; and `/Moe|Larry|Curly/` matches any of `Moe` or `Larry` or `Curly`.

In general, put your alternation patterns in grouping parentheses, even if they're not strictly necessary. It's a good habit to get into. Imagine that you're looking for `doghouse` or `clubhouse` or `firehouse`; you might write it as `/dog|club|firehouse/` but that would be wrong. The correct way is `/(dog|club|fire)house/`.

## \< and \> word boundaries

Word boundaries represent an empty string, not a character. If you want to match the word `cat` and without also matching `category` or `indicate`, use the "beginning of a word" modifier `\<` and the "end of a word" operator `\>`, like so:

```
 `/\<cat\>/`
```

Earlier in this guide, we saw how the pattern `/grade: [A-DF]/` would match all three of these:

```
   grade: F
   grade: Awful
   The city of Belgrade: Destination of mystery
```

With word boundaries, `/\<grade: [A-DF]\>/` only matches the first string, `grade: F`.

You don't have to use both beginning and end of word boundaries. For example, if you use only the beginning word boundary with `/\<cat/`, you would match `cat` and `catastrophe`, but not `tomcat` or `indicate`.

Note that AWK uses different word boundary sequences from Perl and Perl-Compatible Regular Expressions (PCRE). Perl uses `\b` for both beginning- and end-of-word boundaries, so don't get tripped up.

## Beginning and end of lines with ^ and $

Sometimes you want to match text only if it appears at the beginning or end of the line. The anchor metacharacters `^` and `$` do this for you. The caret `^` matches the beginning of the line, and the dollar sign `$` matches the end.

The pattern `/dog/` matches:

```
   dogs and cats
   cats and dogs
```

But `/^dog/` would only match:

```
   dogs and cats
```

Sometimes it's OK if the line you're searching for has optional whitespace before the string you're looking for. `\s*` is the pattern for optional whitespace, so you'd use `/^\s*dog/` to match any of these:

```
   dogs and cats
    doghouse
             dog food
```

## Searching for special metacharacters

Searching for patterns where you want to find literal metacharacters require special care, and you must "escape" the metacharacters with a `\` backslash character. Otherwise, you get unwanted results.

If you're looking for the string `/Mr. Jones/`, the `.` still means "any single character", even though to us humans it's obvious that you meant "a period at the end of the honorific Mr."  Because of this, the pattern `/Mr. Smith/` matches:

```
   Mr. Smith
   Mrs Smith
   MrQ Smith
   Mr# Smith
```

Instead, you must escape the `.` with a backslash. That is, use, using `/Mr\. Smith/`.

Any time AWK gives you an error message about a pattern's syntax, the first thing to check is for a metacharacter that should be escaped but wasn’t.

Here are more examples of patterns that won't work as expected, and their corrected forms:

```
   /(312) 588-2300/            /\(312\) 588-2300/
   /M*A*S*H/                   /M\*A\*S\*H/
   /Tom+Jerry/                 /Tom\+Jerry/
```

## Putting it all together

Here are some common examples of text you might search for using AWK and regular expressions.

### IP addresses

IPv4 addresses are a common target for searching in files. This pattern finds numeric patterns that at least look like IP addresses.

```
   /\<[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\>/
```

It looks for four numbers of one to three digits, each separated by a single dot. Note that this may match things that are not valid IP addresses, like `10.21.5.784`, since 784 is larger than 255. Validating the numeric values of the numbers in the IP address is not something that regular expressions are designed for, but this pattern should do fine for basic file scanning.

Note that the pattern begins and ends with the `\<` beginning-of-word and `\>` end-of-word markers.  Otherwise you might match strings with more than 3 digits at the beginning or end of the IP address.

### Dates

The simplest pattern to find a date in the format "YYYY-MM-DD" is:

```
   /\<[0-9]{4}-[0-9]{2}-[0-9]{2}\>/
```

To allow for the month or day being single digits, like "2021-2-28", you could use:

```
   /\<[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\>/
```

## Time

Searching for times in the HH:MM form is similar:

```
   /\<[0-9]{2}:[0-9]{2}\>
```

If the hours can be single digit:

```
   /\<[0-9]{1,2}:[0-9]{2}\>
```

To also find the seconds, like "HH:MM:SS":

   /\<[0-9]{1,2}:[0-9]{2}:[0-9]{2}\>

To make seconds optional, make the seconds be a group in parentheses and put a `?` after it:

```
   /\<[0-9]{1,2}:[0-9]{2}(:[0-9]{2})?\>
```
