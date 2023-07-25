---
slug: python-string-interpolation
description: 'Python 3 string interpolation provides string substitution and string formatting. This guide covers the str.format() method, the modulo operator, f-strings, and the Template class.'
keywords: ['python string interpolation','python3 string format','python string format example']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-20
modified_by:
  name: Linode
title: "Python String Interpolation"
title_meta: "An Introduction to Python String Interpolation"
authors: ["John Mueller"]
---

During *string interpolation* a string literal is evaluated and if any placeholders are present, they are substituted by the indicated variable values. String interpolation helps reduce repetition in code and allows for dynamic string substitution. Python string interpolation consists of two parts: a *string template* and a value, or set of values, that you want to place within that template. To trigger string interpolation, the compiler needs some method of determining where to place the values within the string template. Python provides four techniques to do this, and this guide covers them all. Each string interpolation technique has its own advantages and disadvantages. The four ways to trigger string interpolation are the following:

- A modulo character (`%`) placed within a string literal indicates where to make the string replacement and can be followed by string format indicators and variable names that store replacement values.
-  Call the `.format()` method on your string literal. Use a pair of curly braces (`{}`) to indicate where to make the string replacement. The `.format()` method's arguments indicate the values to use for the string replacement.
- Precede any string literal by the letter `f` to use formatted string literals, also referred to as "f-strings". The string literal can contain curly braces (`{}`) that delimit a python expression and variables to use for the string substitution.
- Import the [String module's Template class](https://docs.python.org/3/library/string.html#template-strings) into your Python code. Store your string template in a variable using the `Template()` class. Then, use the Template class' `.substitute()` function to indicate which values to use in the string substitution.

The sections below cover each of the four ways you can use string interpolation in Python.

## The String Modulo Operator and String Formatting

If code readability is a top concern, the modulo operator (`%`) method for string interpolation and formatting is a good choice. Its syntax is more concise compared to other string interpolation methods, because it does not require as many formatting arguments. The modulo operator is, however, the least flexible of the methods available for string interpolation. It is also an older string formatting method that may not remain supported as newer versions of Python are released. If you are working with an older Python codebase that uses the string modulo operator, then you may need to become familiar with its syntax.

The general syntax for string formatting with the string modulo operator is the following:

    %[flags][width][.precision]format_indicator %(values)

### Using String Format Indicators

String formatting with the modulo operator includes the `%` character and a format indicator for each of the entries in the string template. A format indicator converts a provided value into the type indicated by the format indicator. The conversion is done before the value is inserted into the string. Python provides the following format indicators:

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

The values to use for string substitution are placed after another `%` outside of the string literal. They can appear alone when working with a single value, or within a tuple when working with multiple values. You can use arithmetic calculations to generate a string replacement value, as demonstrated in the example below.

    myVal1 = 10.1
    myVal2 = 2.2
    print("The sum of %s and %s is %s." %(my_val_1, my_val_2, my_val_1+my_val_2))
    print("The sum of %d and %d is %d." %(my_val_1, my_val_2, my_val_1+my_val_2))
    print("The sum of %f and %f is %f." %(my_val_1, my_val_2, my_val_1+my_val_2))
    print("The sum of %e and %e is %E." %(my_val_1, my_val_2, my_val_1+my_val_2))
    print("The sum of %x and %x is %X." %(int(my_val_1), int(my_val_2),
                                          int(my_val_1+my_val_2)))
    print("The sum of %o and %o is %o." %(int(my_val_1), int(my_val_2),
                                      int(my_val_1+my_val_2)))

The output shows the result of the various format indicators.

{{< output >}}
The sum of 10.1 and 2.2 is 12.3.
The sum of 10 and 2 is 12.
The sum of 10.100000 and 2.200000 is 12.300000.
The sum of 1.010000e+01 and 2.200000e+00 is 1.230000E+01.
The sum of a and 2 is C.
The sum of 12 and 2 is 14.
{{</ output >}}

The format indicators in the first `print()` statement convert `my_val_1`, `my_val_2`, and `my_val_1+my_val_2` into strings. The string values are then substituted where the `%` character is placed within the string literal. The subsequent format indicator examples perform similar substitutions, but instead convert the values to decimals, floating point numbers, exponents, hexadecimal numbers, and octal numbers. Notice that you must convert floating-point values to integer values when working with the `%x`, `%X`, or `%o` format indicators. This is why the `int()` method is used in the last two `print()` statements.

The following code shows the difference between string output and raw output for the same variable value:

    my_val = 'Hello There!'
    print("%s, it's a lovely day!" %my_val)
    print("%r, it's a lovely day!" %my_val)

When working with raw output, the compiler doesn't interpret any of the characters and displays every character that is present in your string. This allows you to use special characters as needed. The second `print()` statement made use of the raw output format indicator (`%r`), so the output displays the opening and closing single quotes.

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

In the first example, the first part of the format specifier tells the compiler to make the entirety of the output seven digits long (`%07`). The second part of the format specifier tells the compiler to keep the part after the decimal point limited to two digits (`2f`). The second example uses a value of one for the entirety of the output, but limits the decimal output to two digits. When you specify a length that can’t possibly hold the entire value, Python still displays the whole value as shown.

## The Python String .format() Method and Positional Arguments

Python's `str.format()` method provides another option for working with string formatting and interpolation. With the `str.format()` method, it’s possible to obtain any string output you need, however, it may require complex code. Due to its complexity, the `.format()` method may not always be the best choice. Formatting characters can prove difficult to read and even harder to troubleshoot.

The `str.format()` method can be called on any Python string object. *Replacement fields* are surrounded by curly braces (`{}`). A replacement field contains the name of a [keyword argument](https://docs.python.org/3/glossary.html#term-argument) or the numeric index of a positional argument.

The example below demonstrates using the `str.format()` with replacement fields and a named keyword argument.

    'My name is {name} and I am {age} years old'.format(name= 'Frida', age=114)

The Python interpreter returns the original string. However, the replacement fields are expanded to display the values of the `.format()` method's keyword arguments.

{{< output >}}
'My name is Frida and I am 114 years old'
{{</ output >}}

The next example demonstrates using the `str.format()` with replacement fields and the numeric index of a positional argument.

    'My name is {0} and I am {1} years old'.format('Frida', 114)

The Python interpreter returns the original string. In this case, the replacement fields are expanded to display the values of the `str.format()` method's positional arguments.

Similar to the modulo method of string formatting, you can use format indicators with your `str.format()` method's arguments to further modify your string output. For example, the two variables, `my_val_1` and `my_val_2` store floating-point numbers.

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

Another way to format strings is with Python f-strings, also known as *formatted string literals*. As with the other string formatting techniques discussed in this guide, f-strings can contain replacement fields denoted with curly braces (`{}`). When compared to the `str.format()` method, the f-string method produces simpler and more readable code. In addition, f-strings are more performant than the modulo operator or the `str.format()` method.

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

The Python 3 [Template Class](https://docs.python.org/3/library/string.html#template-strings) is part of the String module. Compared to the other methods described in this guide, template strings provide simpler string substitution. However, it does not support string formatting, like f-strings, `str.format()`, and the string modulo operator. While this makes Template class strings less powerful, they are considered more secure. For this reason, the Template class is a good choice if you are working with user-generated strings.

String substitutions are indicated using a `$` interpolation character. The `$` should be followed by the name of a dictionary key that has been passed as an argument to the Template class's `substitute()` method. The `substitute()` method requires a dictionary-like object with keys as its argument. The `Template()` class accepts the template string as its argument. The example below imports the Template class, stores a new instance of the Template class and the string template in a variable. The new Template class' `substitution()` method is called and it contains the substitution string to use.

    from string import Template
    greeting = Template('Welcome, $name')
    greeting.substitute(name='Frida!')

The Python interpreter returns the interpolated string:

{{< output >}}
'Welcome, Frida!'
{{</ output >}}

The Python 3 Template class provides more readable code, especially when using a single template with various values stored in a [dictionary](/docs/guides/python-3-dictionaries/). For example:

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

When you run the above Python file, the following interpolated strings are returned as output:

{{< output >}}
Welcome, Anais Nin
Welcome, Octavia Butler
Welcome, Frida Kahlo
{{</ output >}}

The code in the `template_example.py` file is straightforward and readable. You can see that the template to be used derives its substitution values from the dictionaries appended to the `names` list. Then, a concise for loop, calls the template, and uses the `substitute()` method to perform the template substitutions.

## Conclusion

Python provides multiple ways to format strings, each with its own advantages and disadvantages. The method you choose depends on your particular use case and your familiarity with each method. Overall, the f-string method provides a good combination of formatting power and readable code. However, you may consider the `str.format()` method or the Template string class if maintaining security with user-generated strings is a concern. Finally, the string modulo operator is a legacy method for string substitution and formatting. But, it is helpful to familiarize yourself with this method if you are working with a legacy Python codebase.











