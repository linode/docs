---
slug: advanced-bash-scripting-1
description: 'This guide expands on the previous Bash guides. You learn advanced bash scripting, commands, debugging, and more.'
keywords: ['advanced bash scripting', 'bash expressions', 'bash functions', 'bash aliases', 'bash debugging', 'bash list constructs']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-29
modified_by:
  name: Linode
title: "Advanced Bash Scripting: Part 1"
title_meta: "A Software Engineer's Guide to Advanced Bash Scripting: Part 1"
external_resources:
- '[Bash cheat sheet](https://scilifelab.github.io/courses/ngsintro/1902/files/Bash_cheat_sheet_level2.pdf)'
- '[GNU Bash](https://www.gnu.org/software/bash/)'
authors: ["John Mueller"]
---

This guide expands extends the [Introduction to Bash Shell Scripting](/docs/guides/intro-bash-shell-scripting/) guide and our [Intermediate Guide to Bash Shell Scripting](/docs/guides/an-intermediate-guide-to-bash-scripting/) guide by demonstrating the use of Bash functions, list constructs, arrays, aliases, and regular expressions.

## Using Functions to Reuse Code

Bash functions make it possible to package code for reuse. You write code once but can reference it as many times as needed in your script. Using functions reduces coding time, and coding errors, and makes debugging and updating far simpler. As with all good programming languages, Bash functions accept arguments (values) as input and can return values as output.

### Creating Functions

The following example shows the two techniques to create and access a function within a script:

```file {title="hello.sh"}
#!/bin/bash

# Method 1
sayHello1() {
   echo "Hello"
}

# Method 2
function sayHello2 {
   echo "Hello Again"
}

sayHello1
sayHello2
```

The `sayHello1` function has parenthesis after its name to signify that it’s a function. This is the preferred method. The `sayHello2` function lacks parenthesis but uses the `function` keyword instead. To call, or use, a function, you can type the function's name on a separate line.

In order to use this script within a terminal, you must set the script to have executable permission by running the following `chmod` command:

```command
chmod +x hello.sh
```

To run the example script, use the following command:

```command
./hello.sh
```

```output
Hello
Hello Again
```

Consider modifying the `sayHello1()` function as shown below:

```file {title="hello.sh"}
#!/bin/bash

# Method 1
sayHello1() { echo "Hello" }

# Method 2
function sayHello2 {
   echo "Hello Again"
}

sayHello1
sayHello2
```

Executing the above script throws a `syntax error: unexpected end of file` error. This is because the command for `sayHello1` is on the same line as the function name.


### Working with Function Arguments

Functions process variable values, or arguments, in much the same way as command line arguments. You don’t declare the arguments as part of the function declaration. To understand how this works, consider the following `hello.sh` script example:

```file {target="hello.sh"}
#!/bin/bash

sayHello() {
   echo "Hello $1"
}

sayHello "Amanda"
```

The name "Amanda" appears immediately after the function call to `sayHello`. As with command line arguments, you access the value using `$1` because `$0` contains the function name. Two special symbols merit mention when working with functions. The first, `$#`, provides the number of parameters sent to the function. The second, `$@`, provides access to the parameters as a list. You employ them in a function as shown below:

```file {target="hello.sh"}
#!/bin/bash

sayHello() {
  echo "There are $# names to process."
  for name in $@
  do
    echo $name
  done
}

sayHello "Amanda" "Sam" "Mary" "James"
```

In the example above, the `sayHello` function receives four names. The function first outputs the number of names, and then it processes each name individually using a `for` loop. The output looks like the following:

```output
There are 4 names to process.
Amanda
Sam
Mary
James
```


### Return Values from Functions

Functions must return a value. There are several ways to achieve this goal using Bash. For the first method, use the `return` keyword as shown below:

```file {title="return_keyword_example.sh"}
#!/bin/bash

doAdd() {
  if test $# -eq 2
  then
    return $(($1 + $2))
  else
    printf "%s\n" "Must Supply Only 2 Input Arguments!"
    exit 1
  fi
}

doAdd 1 2
echo "1 + 2 = $?"

doAdd 3 4 5
echo "3 + 4 + 5 = $?"
```

In the example above, the `doAdd()` function first tests whether there are two input values to add. If not, it displays an error message. This is one way to handle errors, halting the script with the error in place. The error message is critical because it helps with Bash debugging. If there are two input values, then the function returns the summation of the two input arguments, which in the first function call are `1`, and `2`. The second function call tests the simple exception handling. The output looks like the following:

```ooutput
1 + 2 = 3
Must Supply Only 2 Input Arguments!
```

At the command line, enter `echo $?`. The script displays an exit code of `1`. Unfortunately, the `return` keyword only works for numeric values. To return some other data type, you must rely on alternatives, like the one shown in the example below:

```file {title="example.sh"}
#!/bin/bash

sayHello() {
  local greeting="Hello $1"
  echo "$greeting"
}

result="$(sayHello 'Tony Barret')"
echo "It’s a beautiful day! $result!"
```

Executing the example script above returns a text output:

```output
 It’s a beautiful day! Hello Tony Barret!
 ```

The `sayHello` function uses a function local variable, `greeting`, to contain the text that the function returns to the caller. Local variables are only accessible to the function, so they provide a means to keep the function self-contained and reduce potential conflicts. Notice how the input argument to `sayHello` is enclosed in single quotes. If you don’t enclose the argument in single quotes, the output only contains the input value up to the first space. To return the value, this form of function relies on `echo` to output the `greeting` and place it in the result.

## Chain Commands Together with List Constructs

Making scripts simpler makes them less time-consuming to read, debug, and use. As a result, the script becomes more reliable. A list construct can replace `if…then` statements (and sometimes `case` statements) with a single chained statement where the commands are executed one at a time in sequence. There are two basic types of Bash list constructs:

- **And list (&&)**: The commands continue to execute as long as the previous command returns true.
- **Or list (||)**: The commands continue to execute as long as the previous command returns false.

You can combine the list types to return a result with the proper output based on a number of conditions. The following is an example of a list construct in action:

```file {title="list_construct_example.sh"}
#!/bin/bash

var1=1
var2=2

if test $var1 -gt 0 && echo "Argument #1 = $var1" || \
   test $var2 -gt 0 && echo "Argument #2 = $var2"
then
  echo "At least one of the variables is valid."
else
  echo "The variables are not valid."
fi
```

The example above begins with two variables set to specific values, but you could use any variables, including command line inputs. The `if` statement relies on a list construct to test the two variables. If at least one of the variables isn’t zero (signified by the `||` part of the list construct), then the `if` condition passes and the code outputs:

 ```output
 At least one of the variables is valid.
 ```

The `&&` portions of the list construct outputs the values of each of the arguments, which can assist in debugging Bash scripts. Notice the use of the `\` line continuation character in the example. This symbol allows the condition to span over several lines to visually keep the code readable. The output of the example script looks like the following:

```output
Argument #1 = 1
Argument #2 = 2
At least one of the variables is valid.
```

## Process a Group of Data Elements using Arrays

Arrays are a container for a list of data elements that you wish to process as a group. Even if you don’t process an individual element of the array, the elements as a whole generally have something in common. Bash arrays allow a mix of data types, so you can combine numeric and string data as needed. In addition, Bash arrays are zero-based, which means that the first element in an array is element `0`, not element `1`. The following is an example of how to create a Bash array and then process it using a `for` loop.

```file {title="array_example.sh"}
#!/bin/bash

myValues=(1 2 3 4 5)

for value in ${myValues[@]}
do
  echo "$value * $value = $(( $value*$value ))"
done
```

To create an array represented by the `myValues` variable, assign the variable a list of values separated by spaces in parentheses. When working with individual values that contain spaces, you must place the values in double quotes so that Bash knows that it’s an individual value.

Notice the `myValues` variable in the `for` statement. You use the `@` operator to specify that you want to process all of the array elements. You can specify a particular array element by replacing `@` with a numeric value. To work with a range of elements, you use syntax like `${myValues[@]:1:3}`, where `1` is the starting element and `3` is the ending element. In some cases, you need to obtain the array size, which can do by using `${#myValues[@]}`. Following is the output from the example above:

```output
1 * 1 = 1
2 * 2 = 4
3 * 3 = 9
4 * 4 = 16
5 * 5 = 25
```

## Shortcuts with Aliases

Typing long commands at the command line is error-prone. An alias is a method of referring to a command (no matter how long) with a memorable alternative. To see how an alias works, open a terminal window and enter the following:

```command
alias lsize='ls --human-readable --size -1 -S --classify'
```

Now, every time you enter `lsize` on the command line, you see a directory listing of files sorted by size. Unfortunately, this alias only lasts for the current session. To make the alias more permanent, you create a script containing all of your Bash aliases as shown in the steps below:

1.  Open or create a file named `~/.bashrc` or `~/.bash_profile` on your server using your favorite editor.

    - `~/.bashrc`: Use this file for interactive non-login shells, those that you don’t log in to use. Generally, when working with a Linode, you find that the `~/.bashrc` file already exists and contains aliases that are commented out.

    - `~/.bash_profile`: Use this file for interactive login shells, such as when you log into Linux using Secure Shell (SSH) or PuTTY.

1.  Add the aliases you want to use to the file, making sure not to include the shebang (the `#!/bin/bash` part). The aliases appear just as they do when you type them at the command prompt.

1.  Save the file, exit the terminal, and then log back into the terminal to test your new aliases.

Aliases don’t affect your scripts. Instead, they’re something you can use at the command line. Bash makes the aliases accessible when you open a terminal window. Additionally, you don’t need to make the file executable using the `chmod` command.

## Replace Grep and Sed with Regular Expressions

Regular expressions represent data patterns. For example, a telephone number might consist of a pattern like this: `(999)999-9999`, where the value `9` represents a numeric value from zero to nine. You can use these patterns to perform tasks like ensuring users enter data in the correct pattern. Bash regular expressions have a form similar to other programming languages. If you already know how to use regular expressions in another language, Bash regular expressions will be familiar. The following is an example of a regular expression combined with an `if` statement to determine an input’s data type:

```file {title="regex_example.sh"}
#!/bin/bash

val1='A'

if [[ $val1 =~ [0-9] ]]
then
  echo "Input is a number."
elif [[ $val1 =~ [a-z] ]]
then
  echo "Input is a lowercase letter."
elif [[ $val1 =~ [A-Z] ]]
then
  echo "Input is an uppercase letter."
else
  echo "Input is an unknown type."
fi
```

The example above shows some of the data types that you can test for using regular expressions. Regular expressions of any complexity require that you tell Bash where the string starts using the `^` symbol and where it ends using the `$` symbol. For example, a telephone number regular expression could look like this: `[[ ^((\([0-9]{3}\) )|([0-9]{3}\-))[0-9]{3}\-[0-9]{4}$ ]]`, where the form of pattern matching is `(999)(999)999-9999`, including the country code.

Note that an uppercase letter is different from a lowercase letter. This is important when testing for input such as an email address using the regular expression: `[[ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$ ]]`. This regular expression test is for both uppercase and lowercase letters, along with numbers, and special characters. The form of the email address says that it must contain an `@` symbol and a period. Because Bash regular expressions can become quite complex, it's helpful to refer to a [Bash cheat sheet](https://scilifelab.github.io/courses/ngsintro/1902/files/Bash_cheat_sheet_level2.pdf).

## Conclusion

Bash functions, list constructs, arrays, aliases, and regular expressions can be combined together to create intricate scripts and interactions.  The [GNU Bash](https://www.gnu.org/software/bash/) resource provides a great place for more information about the utility of working with Bash scripting.
