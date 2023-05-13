---
slug: how-to-reverse-a-string-in-python
description: "Wondering how to reverse a string in python? Follow our step-by-step instructions on the process, including information on the different methods available."
keywords: ['how to reverse a string in python','python reverse string','reverse string python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-13
modified_by:
  name: Linode
title: "Reverse a String in Python"
title_meta: "How to Reverse a String in Python"
authors: ["Nathaniel Stickman"]
---

Python supports several common string operations, like [slicing, indexing, searching,](/docs/guides/how-to-slice-and-index-strings-in-python/) and [advanced formatting](/docs/guides/string-manipulation-python-3/). However, it lacks a dedicated, built-in method for reversing strings. This guide shows you how to reverse a string in Python by leveraging Python's tools for working with sequences.

## Before You Begin

This guide's example rely on Python 3. Make sure that you have Python 3 installed on your system before getting started.

You can learn how to install Python 3 from our guide [How to Install Python 3](/docs/guides/how-to-install-python-on-ubuntu-20-04/). Be sure to use the drop-down menu at the top of the guide to select the Linux distribution that is compatible with your system.

## How to Reverse a String in Python: 5 Ways

The sections below include several ways you can reverse strings in Python. While all the possible approaches are not covered, this guide focuses on the most effective and interesting ways to reverse a string in Python.

Each section's examples work to reverse a string created using the line below:

    example_string = "doom wolf"

The string, when reversed, reads "flow mood".

### Using Slicing

Python's *slice* notation is a powerful tool for manipulating lists and other sequences. You can learn more about Python slices in our guide [Python Lists and How to Use Them](/docs/guides/python-lists-and-how-to-use-them/).

Slice notation also extends to strings, where it treats each character in a string as an item in a list. This means you can use the slice notation you would use for reversing a list to reverse a string:

    reversed_with_slice = example_string[::-1]
    print(reversed_with_slice)

{{< output >}}
flow mood
{{< /output >}}

You can see the slice notation above in the square brackets. The list below includes a breakdown of how slice notation operates:

-  Slice notation is made up of the following parts:

        [start:stop:steps]

- The first colon (`:`) typically separates the index to begin the slice and the index to end the slice. In the example, these options are left blank to make the slice consist of the whole string.

- The steps are indicated after the second colon, telling the slice how to progress through the sequence.

    A negative number, has the slice walk backward, starting at the last item in the sequence, and moving through each item until it reaches the beginning.

Of the methods for reversing a string covered in this guide, slicing is the fastest and takes the least amount of code.

### Reverse a String Using a Loop

Loops can be used to "manually" reverse a string by iterating through each character. Python provides two kinds of loops you can use: the `while` loop and the `for` loop. See our [For and While Loops in Python 3](/docs/guides/python-for-and-while-loops/) guide for deeper dive into these loop statements.

#### While Loop

A `while` loop takes a single condition and loops until that condition is no longer met. The standard approach is to then have the condition manipulated, within the loop, to end the loop when it is no longer needed.

To reverse a string with a `while` loop, you can use a variable starting at the value of the string's length. The value should be reduced by one with each iteration of the loop, and the loop should end when the value passes zero. By the end of the loop, the code has walked through each index in the string from the end to the beginning. The Python code below uses a while loop to iterate through the string "doom wolf" and adds the reversed string to the `reversed_string` variable. The code's comments include more details on how this is achieved.

    example_string = "doom wolf"

    # Begin with an empty string.
    reversed_string = ""

    # Initialize an index to use for the loop's condition. You need to
    # subtract one from the length, since Python indices start at zero.
    string_working_index = len(example_string) - 1

    # Start a loop that ends when the index gets below zero.
    while string_working_index >= 0:

        # Use the index to add a character from the original string to
        # the reversed string.
        reversed_string += example_string[string_working_index]

        # Reduce the index by one to continue progressing backward
        # through the string.
        string_working_index -= 1

    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

#### For Loop

A `for` loop takes a sequence and loops through each item in it. You can use it much like the `while` loop above. However, a more idiomatic approach is shown in the example below. The loop iterates over each character of the original string and adds each one to the beginning of a list. It uses the `join()` method to convert that list into a string. The code's comments include more details on how this is achieved.

    example_string = "doom wolf"

    # Begin with an empty list.
    reversed_string_list = []

    # Loop through the characters in the original string.
    for current_character in example_string:

        # Add each character in turn to the beginning of the new list.
        reversed_string_list.insert(0, current_character)

    # Use the join method to create a string from the new list.
    reversed_string = "".join(reversed_string_list)

    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

The `for` loop used above is one of the fastest ways to reverse a string using Python. It is second only to the slice method, and it roughly ties with Python's own `reversed()` method. The `reversed()` method is covered [later on in this guide](/docs/guides/how-to-reverse-a-string-in-python/#using-the-reversed-method).

### Using Join

While the `join()` method is not directly used to reverse a string, it is essential to several of the approaches covered in this guide. Some of the approaches used to reverse a string require that you first convert the string to a list. This is necessary that you have access to several of the list data type's built-in methods. The `join()` method is typically used at the end of your code to convert the list back into a string.

The for loop section above uses the `join()` method to convert the list into a string after the list items have been reversed. Another example that uses the `join()` method is displayed below. This example uses the slice approach to reversing a string after converting the string to a list:

    example_string = "doom wolf"
    example_string_list = list(example_string)
    reversed_string_list = example_string_list[::-1]
    reversed_string = "".join(reversed_string_list)
    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

The `join()` method's syntax operates as follows:

- The empty string (`""`) at the beginning of `"".join(reversed_string_list)` is the object that the `join` method belongs to. This empty string becomes the separator between each element from the list. This new string is then returned and can be stored in a variable.

    So, if you wanted to add a space between each character in the reversed string, you could alter the code above with: `" ".join(reversed_string_list)`.

- The `join` method takes a list as an argument. The method then binds each element in the list together using the initial string as a separator. Finally, the method returns the resulting string.

### Using Recursion

Creating a *recursive* function is another option for reversing a string. In a recursive function, the function calls itself and then further processes the output. Usually, in this kind of recursive function, each recursive function call gets a smaller, and smaller version of the input. The function keeps calling itself until it reaches the end of the input. When it does, all of the recursive calls' results collate into a final result.

This next bit of code shows you what a recursive function for reversing a string can look like:

    def reverse_by_recursion(reversing_string):
        if len(reversing_string) == 0:
            return reversing_string
        else:
            return reverse_by_recursion(reversing_string[1:]) + reversing_string[0]

The above function works in the following way:

-  A condition is created to catch the end of the recursion:

        if len(reversing_string) == 0:
            return reversing_string

    When the input has been worked all the way through, the recursive loop needs to stop and the function needs to return the result.

-  With each iteration, the function calls itself with everything but the first element of the current input:

        return reverse_by_recursion(reversing_string[1:]) + reversing_string[0]

    Functionally, then, each recursive call is dealing with a shorter and shorter version of the original string. Each instance of the function is also stores the first character of its input to add to the end of the new string.

    The first few recursions for the example string look as follows:

        example_string = "doom wolf"
        reverse_by_recursion("oom wolf") + "d"
        reverse_by_recursion("om wolf") + "o"
        reverse_by_recursion("m wolf") + "o"
        reverse_by_recursion(" wolf") + "m"

-  Eventually, the condition `len(reversing_string) == 0` is met, and the recursion ends. Working back from the deepest recursion level, the results recombine to form the new `reversing_string`.

    For the example string, the process of this working back looks something like this:

        "f" + "l" + "o" + "w" + " " + "m" + "o" + "o" + "d"

While not the fastest of the approaches covered in this guide, the recursive function has the advantage of following *functional programming* principles.

{{< note >}}
The Python interpreter enforces a limit to the number of recursions (or recursion depth) a function can have. By default, the limit is 1,000.

This is because, unlike some other language compilers (like those for C/C++ and Scala), the Python interpreter does not have tail-call recursion optimization.

Essentially, this means that Python can experience incredibly high processing demands when the number of recursions gets too large.
{{< /note >}}

### Using the reversed() Method

Another approach to reversing a string is to use Python's built-in `reversed()` method. This method takes a list or other sequential object — like a string — and returns an iterable object in reverse.

The example below uses the method on the `example_string` variable, and then uses the `join()` method discussed above to convert the returned iterable into a string.

    example_string = "doom wolf"

    # Assign the returned iterable to a variable.
    reversed_iterator = reversed(example_string)

    # Put the elements of the iterable together as a string, using
    # a blank string ("") as the separator for each character.
    reversed_string = "".join(list(reversed_iterator))

    print(reversed_string)

{{< output >}}
flow mood
{{< /output >}}

Though not quite as fast as using slice and a bit more verbose, the `reversed()` method provides a convenient ready-made solution.
Aside from the slicing approach, the `reversed()` method is faster than the other ways used to reverse a string in this guide.

### Using a Custom Function

In the [Using Recursion](/docs/guides/how-to-reverse-a-string-in-python/#using-recursion) section, a custom function is used to reverse a string. In fact, you can use a custom function for any of the approaches outlined in this guide.

Creating a dedicated function for reversing a string can be convenient when you want to use the same approach in multiple places. This is especially the case when you are using a more complicated approach, like the `while` or `for` loop.

The function defined below demonstrates how useful a custom function can be. The function takes a string as input and reverses it using the slice approach.

The function also includes an optional parameter — `reversal_style`. Adjusting this parameter, you can have the function reverse the string with a loop or the `reversed()` method instead of a slice.

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

There are many ways to reverse a string in Python. However, some approaches are more efficient than others and which you choose depends on your own needs. For example, if execution speed is a concern, you should use slicing, since it is the fastest. You can also create a custom function that employs looping if you'd like to reuse the function throughout your code. If you're not as concerned with performance, you may choose to use a recursive function.

If you'de like to learn more about Python, take a look through our other [Python guides and tutorials](/docs/guides/development/python/).