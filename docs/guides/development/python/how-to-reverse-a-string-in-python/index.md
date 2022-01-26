---
slug: how-to-reverse-a-string-in-python
author:
  name: Linode Community
  email: docs@linode.com
description: "Wondering how to reverse a string in python? ✓ Follow our step-by-step instructions on the process, including information on the different methods available."
og_description: "Wondering how to reverse a string in python? ✓ Follow our step-by-step instructions on the process, including information on the different methods available."
keywords: ['how to reverse a string in python','python reverse string','reverse string python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-26
modified_by:
  name: Nathaniel Stickman
title: "Reverse a String in Python: A Quick Tutorial from Linode"
h1_title: "How to Reverse a String in Python"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[W3 Schools: How to Reverse a String in Python](https://www.w3schools.com/python/python_howto_reverse_string.asp)'
- '[Real Python: Reverse Strings in Python: reversed(), Slicing, and More](https://realpython.com/reverse-string-python/)'
- '[GeeksforGeeks: Reverse String in Python (5 Different Ways)](https://www.geeksforgeeks.org/reverse-string-python-5-different-ways/)'
- '[Educative: How Do You Reverse a String in Python?](https://www.educative.io/edpresso/how-do-you-reverse-a-string-in-python)'
---

Python comes with plenty of support for manipulating strings. But, despite that, it lacks a dedicated, built-in method for reversing strings.

This tutorial helps you see all of the ways you can do just that: reverse a string in Python. Since Python treats strings as sequences of characters, this guide shows you how to leverage Python's tools for working with sequences.

## Before You Begin

This guide uses Python 3, via the `python3` command. Make sure that you have Python 3 installed on your system before getting started.

You can learn how to install Python 3 from our guide [How to Install Python 3](/docs/guides/how-to-install-python-on-ubuntu-20-04/). Be sure to use the drop down at the top of the guide to select a Linux distribution compatible with your system.

## How to Reverse a String in Python: 5 Ways

In what follows, you can see the main approaches at your disposal for reversing strings in Python. Technically, these are not all of the approaches — that would be a huge list. But here you can see the most effective and interesting ways of accomplishing this task.

Each of the examples works to reverse an string created using this line:

    example_string = "doom wolf"

The string, when reversed, reads "flow mood".

### Using Slicing

Python's *slice* notation is a powerful tool for manipulating lists and other sequences. You can learn more about Python slices in our guide [Python Lists and How to Use Them](/docs/guides/python-lists-and-how-to-use-them/).

This slice notation also extends to strings, where it treats each character in a string as an item in a list.

You can, thus, use the slice notation you would use for reversing a list to reverse a string:

    reversed_with_slice = example_string[::-1]
    print(reversed_with_slice)

{{< output >}}
flow mood
{{< /output >}}

You can see the slice notation above in the square brackets. Here is a breakdown of how operates:

- The first colon (`:`) typically separates the index to begin the slice with and the index end the slice with. These options are left blank in this case, making the slice consist of the whole string.

- The steps are indicated after the second colon, telling the slice how to progress through the sequence.

    A negative number, like above, has the slice walk backward, starting at the last item in the sequence and moving through each item until it reaches the beginning.

For another picture of how slices work, here you can see the parts that make up slice notation:

    [start:stop:steps]

Of the methods for reversing a string covered in this guide, this one is the fastest and takes the least code.

### Using a Loop

Loops can be used to "manually" reverse a string by iterating through each character. Python provides two kinds of loops you can use: the `while` loop and the `for` loop.

#### While Loop

A `while` loop takes a single condition and loops until that condition is no longer met. The standard approach is to then have the condition manipulated within the loop to end the loop when it is no longer needed.

To reverse a string with a `while` loop, you can use a variable starting at the value of your string's length. The value should be reduced by one with each iteration of the loop, and the loop should end when the value passes zero. By the end of the loop, the code has walked through each index in the string from the end to the beginning:

    # Begin with a blank string.
    reversed_string = ""

    # Initialize and index to use for the loop's condition. You need to
    # subtract one from the length, since Python indices start at zero.
    string_working_index = len(example_string) - 1

    # Start a loop that ends when the index gets below zero.
    while string_working_index >= 0:

        # Use the index to add a character from the original string to
        # the reversed string.
        reversed_string += example_string[string_working_index]

        # Reduce the index by one to continue progressing backward
        # through the string.
        string_index_working -= 1

    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

#### For Loop

A `for` loop takes a sequence and loops through each item in it. You can use it much like the `while` loop above.

However, a more idiomatic approach is shown here. The loop iterators over each character of the original string and adds each one in turn to the beginning of a list. It uses the `join` method to make that list a string. You can learn more about the join method in the [Using Join](/docs/guides/how-to-reverse-a-string-in-python/#using-join) section further on:

    # Begin with an empty list.
    reversed_string_list = []

    # Start a loop through the characters in the original string.
    for current_character in example_string:

        # Add each character in turn to the beginning of the new list.
        reversed_string_list.insert(0, current_character)

    # Use the join method to create a string from the new list.
    reversed_string = "".join(reversed_string_list)

    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

The above, in fact, came out as one of the fastest methods used in this guide. It was second only to the slice method, and it roughly tied with Python's own `reversed` function. (You can learn about the `reversed` function further on, in the [Using Reversed](/docs/guides/how-to-reverse-a-string-in-python/#using-reversed) section).

### Using Join

While technically not a means of reversing a string, the `join` method still provides an essential tool for several of the approaches covered here.

The `join` method allows you to convert a list to a string using a given string as a separator.

You can see this in the `for` loop example above. Here is another example, using the slice approach after converting the string to a list:

    example_string_list = list(example_string)
    reversed_string_list = example_string_list[::-1]
    reversed_string = "".join(reversed_string_list)
    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

To break down the `join` syntax:

- The initial string (`""`) is actually the object the `join` method belongs to. This string becomes the separator between each element from the list when they are added to the resulting string.

    So, if you wanted to add a space between each character in the reversed string, you could alter the code above with: `" ".join`.

- The `join` method takes a list as an argument. The method then binds each element in the list together using the initial string as a separator. Finally, the method returns the resulting string.

### Using Recursion

A *recursive* function is another option for reversing a string. In a recursive function, the function ends up calling itself it further process the output.

Usually in this kind of recursive function, each recursive function call gets a smaller and smaller version of the input. The function keeps calling itself until it reaches the end of the input. When it does, all of the recursive calls' results collate into a final result.

This next bit of code shows you what a recursive function for reversing a string can look like:

    def reverse_by_recursion(reversing_string):
        if len(reversing_string) == 0:
            return reversing_string
        else:
            return reverse_by_recursion(reversing_string[1:]) + reversing_string[0]

Here is how the function above works:

- A condition is created to catch the end of the recursion:

        if len(reversing_string) == 0:
            return reversing_string

    When the input has been worked all the way through, the recursive loop needs to stop and the function needs to return the result.

- With each iteration, the function calls itself with everything but the first element of the current input:

        return reverse_by_recursion(reversing_string[1:]) + reversing_string[0]

    Functionally, then, each recursive call is dealing with a shorter and shorter version of the original string. Each instance of the function is also holding onto the first character of its input to add to the end of the new string.

    Thus, this is what the first few recursions looks like for the example string:

        reverse_by_recursion("oom wolf") + "d"
        reverse_by_recursion("om wolf") + "o"
        reverse_by_recursion("m wolf") + "o"
        reverse_by_recursion(" wolf") + "m"

- Eventually, the condition `len(reversing_string) == 0` gets met, and the recursion ends. Working back from the deepest recursion level, the results recombine to form the new `reversing_string`.

    For the example string, the process of this working back looks something like this:

        "f" + "l" + "o" + "w" + " " + "m" + "o" + "o" + "d"

While not the fastest of the approaches covered in this guide, the recursive function has the advantage of following *functional programming* principles.

{{< note >}}
The Python interpreter enforces a limit to the number of recursions (or recursion depth) a function can have. By default, the limit is 1,000.

This is because, unlike some other language compilers (like those for C/C++ and Scala), the Python interpreter does not have tail-call recursion optimization.

Essentially this means that Python can experience incredibly high processing demands when the number of recursions gets large.
{{< /note >}}

### Using reversed()

Another relatively straightforward approach is to use Python's built-in `reversed` function. This function takes a list or other sequential object — like a string — and returns an iterator of that object in reverse.

The example below uses the function on the `example_string`, and then uses the `join` method discussed above to make the returned iterator into a string:

    # Get the string reversed in the form of an iterator.
    reversed_iterator = reversed(example_string)

    # Put the elements of the iterator together as a string, using
    # a blank string ("") as the separator for each character.
    reversed_string = "".join(list(reversed_iterator))

    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

Though not quite as fast as the slice, and though it takes up a few more lines of code, the `reversed` function provides a convenient ready-made solution.

And, aside from slices, this came out as a faster solution than the others covered in this guide.

### Using a Custom Function

You can see that, above, a custom function gets used for the recursive approach. In fact, you can use a custom function for any of the approaches in this guide.

Creating a dedicated function for reversing a string can be convenient when you want to use the same approach in multiple places. This is especially the case when you are using a more complicated approach, like the `while` or `for` loop.

The function defined below shows a little of how useful a custom function can be. The function takes a string as input and reverses it using the slice approach.

But the function also includes an optional parameter — `reversal_style`. Adjusting this, you can have the function reverse the string with loop or the `reversed` function instead of a slice.

As another bonus, the function also includes a condition to reverse the string word-by-word, rather than character-by-character:

    def reverse_string_my_way(string_in, reversal_style="slice"):

        # Use a for loop if indicated by reversal_style.
        if reversal_style == "loop":
            string_out_list = []
            for item in string_in:
                string_out_list.insert(0, item)
            string_out = "".join(string_out_list)

        # Use the reversed function if indicated by reversal_style.
        elif reversal_style == "reversed":
            reversed_iterator = reversed(string_in)
            string_out = "".join(list(reversed_iterator))

        # Reverse the order of words, rather than characters, in
        # the string if indicated by reversal_style.
        elif reversal_style == "word":
            word_list = string_in.split(" ")
            word_list = word_list[::-1]
            string_out = " ".join(word_list)

        # By default, use the slice approach to reverse the string.
        else:
            string_out = string_in[::-1]

        return string_out

    print(reverse_string_my_way(example_string)) # Uses the slice approach.
    print(reverse_string_my_way(example_string, "loop")) # Uses a for loop.
    print(reverse_string_my_way(example_string, "word")) # Reverses the order of words.

{{< output >}}
flow mood
flow mood
wolf doom
{{< /output >}}

## Conclusion

In this tutorial, you have gotten a thorough account of the ways you can reverse strings in Python. From using slices to recursive functions, you have the tools you need to reverse strings in whatever way suits your application.

Looking to further expand you Python skills? Take a trek through our [Python guides](/docs/guides/development/python/) to get well on your way to mastering the language.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
