---
slug: python-string-interpolation
author:
  name: John Mueller
description: 'Python 3 string interpolation provides string substitution and string formatting. This guide covers the four available methods including the str.format() method, the modulo operator, f-strings, and the Template class.'
keywords: ['python string interpolation','python3 string format','python string format example']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-01
modified_by:
  name: Linode
title: "Python String Interpolation"
h1_title: "A Python String Interpolation Overview"
enable_h1: true
contributor:
  name: John Mueller
  link: http://www.johnmuellerbooks.com/
---

Python *String interpolation* is a mechanism that substitutes variable values into placeholders located in a string. It consists of two parts: a *string template* and a value or values that you want to place within that template. To make string interpolation work, the compiler needs some method of determining where to place the values within the string template. Python provides four techniques to do this, and this guide covers them all. Each string interpolation technique has its own advantages and disadvantages. These techniques include the following:

- `%`: A modulo character, `%`, indicates where to make the string replacement and also provides a list of values to use.
- `.format()`: A pair of braces (`{}`) show where to make a replacement and the `.format()` method's arguments indicate the values to use.
- `f-string`: A string that is preceded by the letter `f` can contain curly braces (`{}`) that delimit a python expression and variables to use for the string substitution.
- `Template class`: The string template appears within a variable using the `Template()` class and the `.substitute()` function indicates which values to use.

## The String Modulo Operator and String Formatting

Using the modulo operator (`%`) for string interpolation and formatting is fairly readable. Its syntax is also more concise compared to other methods, because it does not require as many formatting arguments. The modulo operator is, however, the least flexible of the methods available for string interpolation. It is also an older string formatting method that may not remain supported as Python moves forward. If you are working with an older Python codebase then it may be important to become familiar with how the string modulo operator is used for string substitution and formatting.

The general syntax for string formatting with the string modulo operator is the following:

    %[flags][width][.precision]format_indicator %(values)

### Using String Format Indicators

String formatting with the modulo operator includes the `%` sign and a format indicator for each of the entries in the string template. A format indicator converts a provided value into the type indicated by the format indicator before inserting the value into the string. Python provides the following format indicators:

- `%s`: String (performed using the `str()` function)
- `%d`: Integer
- `%f`: Floating point
- `%e`: Lowercase exponent
- `%E`: Uppercase exponent
- `%x`: Lowercase hexadecimal
- `%X`: Uppercase hexadecimal
- `%o`: Octal
- `%r`: Raw (performed using the `repr()` function)
- `%g`: Floating point for smaller numbers, lowercase exponent for larger numbers
- `%G`: Floating point for smaller numbers, uppercase exponent for larger numbers
- `%a`: ASCII (performed using the `ascii()` function)
- `%c`: Converts an `int` or a `char` to a character, such as `65` to the letter `A`

The values appear after another `%` outside of the string. They can appear alone when working with a single value, or within a tuple when working with multiple values. Below is an example of working with multiple values to format numeric input:

    myVal1 = 10.1
    myVal2 = 2.2
    print("The sum of %s and %s is %s." %(myVal1, myVal2, myVal1+myVal2))
    print("The sum of %d and %d is %d." %(myVal1, myVal2, myVal1+myVal2))
    print("The sum of %f and %f is %f." %(myVal1, myVal2, myVal1+myVal2))
    print("The sum of %e and %e is %E." %(myVal1, myVal2, myVal1+myVal2))
    print("The sum of %x and %x is %X." %(int(myVal1), int(myVal2),
                                          int(myVal1+myVal2)))
    print("The sum of %o and %o is %o." %(int(myVal1), int(myVal2),
                                      int(myVal1+myVal2)))

The output shows the result of the various format indicators.

{{< note >}}
You must convert floating-point values to integer values when working with the %x, %X, or %o format indicators.
{{</ note >}}

{{< output >}}
The sum of 10.1 and 2.2 is 12.3.
The sum of 10 and 2 is 12.
The sum of 10.100000 and 2.200000 is 12.300000.
The sum of 1.010000e+01 and 2.200000e+00 is 1.230000E+01.
The sum of a and 2 is C.
The sum of 12 and 2 is 14.
{{</ output >}}

The following code shows the difference between string output and raw output for a single input value:

    myRaw = 'Hello There!'
    print("%s, it's a lovely day!" %myRaw)
    print("%r, it's a lovely day!" %myRaw)

When working with the raw output, the compiler doesn't interpret any of the characters. This allows you to use special characters as needed.

{{< output >}}
Hello There!, it's a lovely day!
'Hello There!', it's a lovely day!
{{</ output >}}

### Using Flags to Modify Output

The string modulo operator supports flags that further control a string's formatting. The following examples demonstrate the usage of flags in modulo string formatting.

The examples below use the variables, `my_val_1` and `my_val_2` to store the values to embed within the example strings.

    my_val_1 = 10.1
    my_val_2 = 2.2

The format indicator `%5d`, uses the `5` flag to indicate that the integers should be formatted with 5 spaces. Since the `d` portion converts the floating-point numbers to integers, three spaces are placed in front of the integers.

    print("%5d %5d" %(my_val_1, my_val_2))

{{< output >}}
    10     2
{{</ output >}}

Similarly, you can pad your output with zeros:

    print("%05d %02d" %(my_val_1, my_val_2))

{{< output >}}
00010 02
{{</ output >}}

To left justify your integers, use the `-` flag with your string formatting:

    print("%-5d %-5d" %(my_val_1, my_val_2))

{{< output >}}
10    2
{{</ output >}}

It’s possible to achieve more sophisticated formatting using the modulo operator. For example, you can format a floating-point value to have a specific number of digits after the decimal point. You can also add a dollar sign to monetary values. The following code shows both methods.

    print("%07.2f" %my_val_1)
    print("$%1.2f" %my_val_1)

{{< output >}}
0010.10
$10.10
{{</ output >}}

In the first example, the first part of the format specifier tells the compiler to make the entirety of the output seven digits long (`%07`). The second part of the format specifier tells the compiler to keep the part after the decimal point limited to two digits (`2f`). The second example uses a value of one for the entirety of the output but limits the decimal output to two digits. When you specify a length that can’t possibly hold the entire value, Python still displays the whole value as shown.

## The Python String .format() Method and Positional Arguments

Python's `str.format()` method provides another option for working with string formatting and interpolation. With the `str.format()` method, it’s possible to obtain any string output you need, however, it may require complex code. Due to its complexity, the `.format()` method may not always be the best choice. Formatting characters can prove difficult to read and even harder to troubleshoot.

The `str.format()` method can be called on any Python string object. *Replacement fields* are surrounded by curly braces (`{}`). A replacement field contains the name of a keyword argument or the numeric index of a positional argument.

The example below demonstrates using the `str.format()` with replacement fields and a named keyword argument.

    'My name is {name} and I am {age} years old'.format(name= 'Frida', age=114)

The Python interpreter returns the original string. However, the replacement fields are expanded to display the values of the `.format()` method's keyword arguments.

{{< output >}}
'My name is Frida and I am 114 years old'
{{</ output >}}

The next example demonstrates using the `str.format()` with replacement fields and the numeric index of a positional argument.

    'My name is {0} and I am {1} years old'.format('Frida', 114)

The Python interpreter returns the original string. In this case, the replacement fields are expanded to display the values of the `str.format()` method's positional arguments.

Similar to the modulo method of string formatting, you can use format indicators with your `str.format()` methods arguments to further modify your string output. For example, the two variables, `my_val_1` and `my_val_2` store floating-point numbers.

    my_val_1 = 10.1111
    my_val_2 = 2.2222

Use the `str.format()` method and format indicators to adjust the number of digits that are displayed after the decimal point.

    'The first value equals {:.2f} and the second value equals {:.3f}.'.format(my_val_1, my_val_2)

Python returns the following formatted string:

{{< output >}}
'The first value equals 10.11 and the second value equals 2.222.'
{{</ output >}}

The format indicator `{:.2f}` specifies that the floating-point value should display two places after the decimal point. While the format indicator `{:.3f}`, specifies that the floating-point value should display three places after the decimal point.

The `str.format()` method supports many format indicators that align your output, and adjust the [presentation type for string, integer, float, and decimal values](https://docs.python.org/3/library/string.html#format-specification-mini-language).

## Python f-strings

Another way to format strings is with Python f-strings, also known as *formatted string literals*. As with the other string formatting techniques discussed in this guide, f-strings can contain replacement fields denoted with curly braces (`{}`). When compared to the `str.format()`, the f-string method produces simpler and more readable code. In addition, the f-string approach produces output faster than either the modulo or `str.format()` approaches.

When using a Python f-string, you must prefix your string literal with `f` or `F`. For example:

    import datetime
    f'The date today is {datetime.datetime.now():%B %d, %Y}'

The Python interpreter returns the following string:

{{< output >}}
'The date today is March 01, 2022'
{{</ output >}}

The replacement field includes a Python expression and a date format specifier. To achieve the same result using the `str.format()` method, you need the following code:

    import datetime
    'The date today is {:%B %d, %Y}'.format(datetime.datetime.now())

The f-string version of the code is more succinct and readable than the `str.format()` version. Similar to `str.format()`, you should refer to Python's [Format Specification Mini-Language documentation](https://docs.python.org/3/library/string.html#formatspec) to learn all the ways that you can format strings using f-strings.

## Python Template Strings

The Python 3 [Template Class](https://docs.python.org/3/library/string.html#template-strings) is part of the String Module. Compared to the other methods described in this guide, template strings provide simpler string substitution. However, it does not support string formatting, like f-strings, `str.format()`, and the string modulo operator. While this makes template strings less powerful, they are considered more secure. For this reason, template strings are a good choice if you are working with user-generated strings.

String substitutions are indicated using a `$` interpolation character. The `$` should be followed by the name of a dictionary key that has been passed as an argument of the Template class's `substitute()` method. The `substitute()` method requires a dictionary-like object with keys as its argument. The `Template()` class accepts the template string as its argument. For example:

    from string import Template
    greeting = Template('Welcome, $name')
    greeting.substitute(name='Frida!')

The Python interpreter returns the following string:

{{< output >}}
'Welcome, Frida!'
{{</ output >}}

The Python 3 Template class provides a more readable code, especially when using a single template with various values stored in dictionaries. For example:

{{< file "~/home/username/template_example.py">}}
from string import Template

names = []
names.append(dict(first='Anais', last='Nin'))
names.append(dict(first='Octavia', last='Butler'))
names.append(dict(first='Frida', last='Kahlo'))

greeting = Template('Welcome, $first $last')

for name in names:
    print(greeting.substitute(name))
{{</ file >}}

When run, the above Python file outputs the following strings:

{{< output >}}
Welcome, Anais Nin
Welcome, Octavia Butler
Welcome, Frida Kahlo
{{</ output >}}

The code in the `template_example.py` file is straightforward and readable. You can see that the template to be used derives its substitution values from the dictionaries appended to the `names` list. Then, a concise for loop, calls the template, and uses the `substitute()` method to perform the template substitutions.

## Conclusion

Python provides multiple ways to format strings, each with its own advantages and disadvantages. The method you choose depends on your particular use case and your familiarity with each method. Overall, the f-string method provides a good combination of formatting power and readable code. However, you may consider the `str.format()` method or the Template string method if maintaining security with user-generated strings is a concern. Finally, the string modulo operator is a legacy method for string substitution and formatting. But, it is helpful to familiarize yourself with this method if you are working with a legacy Python codebase.











