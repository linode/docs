---
author:
  name: Chuck Jungmann
  email: chuck@cpjj.net
description: 'Using a CGI or FastCGI Script as a File Handler'
keywords: 'apache,cgi,fastcgi,AddHandler,SetHandler,AddType,mod_fastcgi'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Tuesday, June 22nd, 2016'
modified_by:
  name: Chuck Jungmann
published: 'Tuesday, June 22nd, 2016'
title: 'Configuring a Script Intepreter for Apache'
external_resources:
 - '[Apache HTTP Server Version 2.4 Documentation](https://httpd.apache.org/docs/2.4/)'
 - '[Module mod_fastcgi](https://htmlpreview.github.io/?https://github.com/FastCGI-Backups/mod_fastcgi/blob/master/docs/mod_fastcgi.html)'
 - '[Archive of FastCGI.com](https://github.com/FastCGI-Archives/FastCGI.com/blob/master/README.md)'
 - '[CGI Environment Variables](http://cgi101.com/learn/ch3/text.html)'
 - '[Debugging with GDB](http://www.delorie.com/gnu/docs/gdb/gdb_toc.html)'
---

I have written a script interpreter that I want Apache to use when
files with a certain extension are called.  I could not find any help
doing this online, despite how easy it turned out to be.  I have written
this guide to help others succeed where I struggled to understand.

This guide will use a simple CGI script to demonstrate how to configure
Apache to use the script as a file handler when an appropriate file is
called.  Then it will show how to convert the CGI script to a FastCGI
script for performance reasons, and how to modify the configuration to
use the FastCGI version instead of the CGI script.

The main sections are arranged thus:
- [Prerequisites](#Prerequisites)
- [The CGI Script](#TheCGIScript)
- [Configuring Apache to Use a File Handler](#ConfiguringApache)
- [Test CGI File Handler](#TestCGIHandler)
- [Upgrading CGI to FastCGI](#UpgradeToFastCGI)
- [Test FastCGI File Handler](#TestFastCGIHandler)
- [Reading the Target File](#ReadingTheTargetFile)
- [CGI/FastCGI Programming Suggestions](#ScriptProgrammingSuggestions)

## Prerequisites                            {#Prerequisites}

The first three steps prepare the environment for running a CGI file handler,
the remaining steps add the resources necessary for building and running a
FastCGI program.

### CGI Setup

1. A running LAMP installation.  Complete the
   [Getting Started](/docs/getting-started) guide.

2. Enable the `actions` mod for configuring a custom file handler and restart
   Apache

       sudo a2enmod actions
       sudo /etc/init.d/apache2 restart

3. Install `build-essential` tools for for compiling the C-language example CGI
   and FastCGI programs and the FastCGI libraries.
   
       sudo apt-get install build-essential

### FastCGI Setup                           {#FastCGISetup}

4. Download, compile, and install FastCGI libraries.

   Note: When writing this guide, the otherwise lost contents of fastcgi.com have
   been archived at [FastCGI Archives](https://github.com/FastCGI-Archives/FastCGI.com),
   and the `wget` URL below reflects this relocation.

   ~~~
   cd /usr/local/src
   sudo wget https://github.com/FastCGI-Archives/FastCGI.com/blob/master/original_snapshot/fcgi-2.4.1-SNAP-0910052249.tar.gz
   sudo tar -xvz fcgi-2.4.1*
   cd fcgi-2.4.1*
   sudo ./configure
   sudo make
   sudo make install
   ~~~

5. Install and enable `mod_fastcgi`, then restart Apache

       sudo apt-get install libapache2_mod_fastcgi
       sudo a2enmod fastcgi
       sudo /etc/init.d/apache2 restart


## The CGI Script                           {#TheCGIScript}

Many languages can be used to program a CGI script.  The example in this
guide is a C program because I prefer that language, but it could as easily
be written in Perl, Python, Java, or BASH.

The example CGI script does nothing except announce its presence.

1. Put the following source code into a file for compilation:

   {:file} simplescript.c
   ~~~c
   #include <sys/types.h>
   #include <unistd.h>     // for getpid()
   #include <stdlib.h>     // for malloc(), free()
   #include <stdio.h>

   /** In this simple program, we'll assume all requests are successful. */
   void print_headers(void)
   {
      fputs("Status: 200 OK\n", stdout);
      fputs("Content-Type: text/html\n", stdout);
      putc('\n', stdout);
   }

   /** Print head element, then start body, add h1 with title, leaving body element open.*/
   void print_doc_top(char *title)
   {
      fputs("<html><head><title>", stdout);
      fputs(title, stdout);
      fputs("</title></head>\n", stdout);

      fputs("<body><h1>", stdout);
      fputs(title)
      fputs("</h1>\n", stdout);
   }

   /** Close body and html document. */
   void print_doc_bottom(void)
   {
      fputs("</body></html>\n", stdout);
   }

   int main(int argc, char **argv)
   {
      int loop_count = 0;
      int procid = getpid();

      // Print the page
      print_headers();
      print_doc_top("Simple Example");

      // Print the content
      printf("<p>Process %d, loop count %d</p>\n", procid, ++loop_count);

      print_doc_bottom();

      return 0;
   }
   ~~~

2. Compile and install the progam:    {#CompileAndInstallAsCGI}

       gcc simplescript.c -o simple.cgi
       cp -R simple.cgi /usr/local/lib/cgi-bin


## Configuring Apache to Use a File Handler {#ConfiguringApache}

In order to configure Apache to use the CGI program as a file handler,
it is necessary to establish two handlers, one to run files with a _.cgi_
extension found in _/usr/local/lib/cgi-bin_ as built-in file type _cgi-script_,
then another handler to run files with, in this case, a _.simple_ extension
as a user-defined type that maps to our CGI program.

1. Create the configuration file

   {:file} /etc/apache2/conf-available/simpledoc.conf
   ~~~apache
   <IfModule mod_actions.c>
      # Associate .cgi extension with the built-in file handler
      AddHandle cgi-script .cgi

      # Define a new file type and the program that will process it
      Alias /simple-cgi-bin /usr/local/lib/cgi-bin
      Action application/simpledoc /simple-cgi-bin/simple.cgi

      # Prepare permissions in the host directory of the handler
      <Directory /usr/local/lib/cgi-bin>
         Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
         Require all granted
      </Directory>

      # Associate custom extension with new file handler
      <FilesMatch ".*\.simple$">
         SetHandler application/simpledoc
      </FilesMatch>
   </IfModule>
   ~~~

2. Enable the configuration

       sudo a2enconf simpledoc

3. Restart Apache to use the new configuration

      sudo /etc/init.d/apache2 restart

## Test CGI Handler                         {#TestCGIHandler}

Create a virtual host that will serve a file with the new extension

1. Create directory to for virtual host

       sudo mkdir /var/www/simpletest

2. Create "script" file in the new directory

       sudo touch /var/www/simpletest/index.simple

3. Create Apache virtual host configuration

   Notice this is as basic a site configuration as possible.  It is not
   necessary to enable CGI or other permissions in the directory because
   execution occurs in _/usr/local/lib/cgi-bin_, and the execution
   permissions were set globally above.

   {:file} /etc/apache2/sites-available/simpletest.conf
   ~~~apache
   <VirtualHost *:80>
      DocumentRoot /var/www/simpletest
      DirectoryIndex index.simple
      ServerName simpletest
      ServerAlias /
   </VirtualHost>
   ~~~

4. Enable the site and restart Apache

       sudo a2ensite simpletest
       sudo /etc/init.d/apache2 restart

5. Navigate to the site defined by the virtual host.  Since _index.simple_ is
   also the DirectoryIndex, we don't have to name the target file:

       google-chrome http://localhost/simpletest

6. Confirm expected operation.

   The web page will show a header and a single test line that
   shows the process id and loop count.  For CGI, where each call
   will create a new process, the process id will change with each
   replot, but the loop count value will always by 1.

## Upgrading CGI to FastCGI                 {#UpgradeToFastCGI}

### The Difference Between CGI and FastCGI

For each HTTP response, a CGI script must be loaded and run.  Using an
interpreted language like Perl, Python, or Java greatly increases the server
burden as the entire language runtime must be loaded from scratch for each
request.  Establishing a database connection for each request is another
possible performance penalty in CGI programs.  As a result, CGI programming
as fallen out of favor for all but the smallest web sites.

FastCGI is a mature specification that addresses the CGI performance bottleneck
by allowing a CGI program to continue running while it services many HTTP requests
in a loop.  Expensive resources like database connections can be created once
and reused throughout the life of the program.

FastCGI does require more from a programmer, as careless programming can result
in memory or resource leaks that accumulate.  Additionally, a FastCGI program,
for data security, must ensure that settings from one response cannot be accessed
by later responses.  This includes, but is not limited to, global script variable
values, the currently selected database, and MySQL session variables.

With these costs and benefits in mind, let's convert our simple CGI program to
a FastCGI progam and adjust the Apache configurations to use the new program.
After confirming that the new script is running as a FastCGI program, we'll
further enhance the FastCGI program by adding code that actually reads and uses
the contents of the target document.

### Changing simplescript.c for FastCGI Operation

Review [FastCGI Setup](#FastCGISetup) to ensure the your working enviroment
has the required FastCGI C/C++ libraries and Apache mods.

In our example, there are only two changes required to make our CGI program
operate as a FastCGI program, changing one include file and moving the page-building
functions into a loop that FastCGI runs.

1. Change the include file.

   Remove add *fcgi_* in front of `<stdio.h>` so it looks like `<fcgi_stdio.h>`

2. In function `main()`, enclose the page-building functions in a `while` loop.
   The new main function will look like

   {:file-excerpt} simplescript.c
   ~~~c
   int main(int argc, char **argv)
   {
      int loop_count = 0;
      int procid = getpid();

      while (FCGI_Accept()==0)
      {
         // Print the page
         print_headers();
         print_doc_top("Simple Example");

         // Print the content
         printf("<p>Process %d, loop count %d</p>\n", procid, ++loop_count);

         print_doc_bottom();
      }

      return 0;
   }
   ~~~

3. Build and install as a FastCGI Program {#CompileAndInstallAsFastCGI}

   Notice the build changes, adding the FastCGI with the linker options `-L` to
   add the library search path, and `-lfcgi` to link the library.  The `-o`
   output changes the output to use a _.fcgi_ extension to signal the
   intention to run as FastCGI.

       gcc simplescript.c -L /usr/local/lib -lfcgi -o simple.fcgi
       sudo cp -R simple.fcgi /usr/local/lib/cgi-bin

   Please note that once the FastCGI program is running, you will not be able to
   update the program until there are no instances of the program running.  The
   easiest way to do that is to shutdown Apache before copying the file:

       # After making changes to simplescript.c, recompile and reinstall:
       gcc simplescript.c -L /usr/local/lib -lfcgi -o simple.fcgi
       
       sudo /etc/init.d/apache stop
       sudo cp -R simple.fcgi /usr/local/lib/cgi-bin
       sudo /etc/init.d/apache start

   I put the last three commands in a makefile target named _update_ for easy access.


## Test FastCGI Handler                     {#TestFastCGIHandler}

1. Modify simpledoc.conf

   The only difference is that a different `Action` directive will be called,
   depending on whether or not _mod_fastcgi_ is enabled.

   {:file} /etc/apache2/conf-available/simpledoc.conf
   ~~~apache
   <IfModule mod_actions.c>
      # Associate .cgi extension with the built-in file handler
      AddHandle cgi-script .cgi

      # Define a new file type and the program that will process it
      Alias /simple-cgi-bin /usr/local/lib/cgi-bin

      # Determine which server will be used based on whether or not
      # _mod_fastcgi_ is enabled.
      <IfModule mod_fastcgi.c>
         Action application/simpledoc /simple-cgi-bin/simple.fcgi
      </IfModule>
      <IfModule !mod_fastcgi.c>
         Action application/simpledoc /simple-cgi-bin/simple.cgi
      </IfModule>

      # Prepare permissions in the host directory of the handler
      <Directory /usr/local/lib/cgi-bin>
         Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
         Require all granted
      </Directory>

      # Associate custom extension with new file handler
      <FilesMatch ".*\.simple$">
         SetHandler application/simpledoc
      </FilesMatch>
   </IfModule>
   ~~~

   Note that an `AddHandle fcgi-script .fcgi` should not be necessary because
   it should have been handled in _mod_fastcgi_.

   Also note that your FastCGI performance can be tweaked with the `FastCgiServer`
   directive.  Here is an example that could be placed as the first line in the
   `<IfModule mod_fastcgi.c>` section to create a pool of 5 FastCGI servers:

       FastCgiServer /usr/local/lib/cgi-bin/simple.fcgi -processes 5

   Look at the [FastCGI documentation](https://htmlpreview.github.io/?https://github.com/FastCGI-Backups/mod_fastcgi/blob/master/docs/mod_fastcgi.html)
   for information about other FastCGI directives.

2. Restart Apache

   It is not necessary to call `a2ensite` again because it's already enabled.
   Restarting Apache will cause the new site configuration to be used.

       sudo /etc/init.d/apache restart

3. Navigate to the site defined by the virtual host.  Since _index.simple_ is
   also the DirectoryIndex, we don't have to name the target file:

       google-chrome http://localhost/simpletest

## Reading the Target File                  {#ReadingTheTargetFile}

Among the environment variables of a CGI or FastCGI script called as a file
handler is `PATH_TRANSLATED`, which is the filesystem path to the target file
that resulted in a call to your file handler.
See [Print Out the Environment Variables](#PrintEnvironmentVariables) if
`PATH_TRANSLATED` is not working for you.

The value of `PATH_TRANSLATED` is not only useful for opening the target
file, but also for moving to the host directory of the target file in case
other files are needed from the same or a related location.

You may not need everything in the example function below, but code is
included to change the directory or to directly access the target file.
Use the code the suits your situation.

1. Add a new function to our example source file.

   {:file-excerpt} simplescript.c
   ~~~c
   /**
    * This function reads the target file and prints its contents in a paragraph.
    *
    * This function is not too smart, so don't put too much into the target file.
    */
   void process_target(void)
   {
      FILE *file = NULL;
      char *pathtrans = getenv("PATH_TRANSLATED");

      // Open target directly
      file = fopen(pathtrans, "r");

      // Look for final slash, before which would be the target's directory:
      char *lastslash = strrchr(pathtrans,'/');

      // If the target is in another directory, move to it, then open
      if (lastslash)
      {
         // Copy directory portion of path to a char buffer:
         size_t bufflen = lastslash-pathtrans;
         char *buff = malloc(bufflen+1);
         if (buff)
         {
            strcpy(buff, pathtrans, bufflen);
            buff[bufflen] = '\0';
            chdir(buff);
            free(buff);

            file = fopen((lastslash+1), "r");
         }
      }
      else  // target in current directory
         file = open(pathtrans,"r");

      if (file)
      {
         char bufft[500];
         size_t rcount = fread(bufft, 1, sizeof(bufft), file);
         fclose(file);

         bufft[rcount] = '\0';
         printf("<p>%s</p>\n", bufft);
      }      
   }
   ~~~

2. Add some text to the target file.  Let's put the text in the same _.simple_
   file we used before:

       echo "John Doe" | sudo tee /var/www/simpletest/index.simple

3. Navigate to the site defined by the virtual host.  Since _index.simple_ is
   also the DirectoryIndex, we don't have to name the target file:

       google-chrome http://localhost/simpletest

## Conclusion

If you have been able to follow the steps above, you should now be ready to
create your own script interpreter.

I recommend using the _simpledoc.conf_ example found under
[Test FastCFI Handler](#TestFastCGIHandler), changing only

1. The `Action` directives for FastCGI and CGI
   - Change the handler type name from _application/simpledoc_ to something
     that reflects your usage,
   - Change the _simple_ in the script names _simple.fcgi_ and _simple.cgi_ to a
     related name.
     
2. Change the extension in `FilesMatch` group to a something shorter and more
   related to your projet.

   
## CGI/FastCGI Programming Suggestions      {#ScriptProgrammingSuggestions}

Here are some things I have learned while developing my FastCGI component.

### Print Out the Environment Variables     {#PrintEnvironmentVariables}

CGI and FastCGI programs get their information from environment variables and
stdin.  To study the data available to your program, it is easier to simply
display all of the environment variables on your server than it is to consult
CGI documentation about what variables you should expect.

Add the following function to your copy of simplescript.c, call the function
in your main function before calling `print_doc_bottom()`.  Compile the code
and install the program [as CGI](#CompileAndInstallAsCGI) or
[as FastCGI](#CompileAndInstallAsFastCGI), then browse to the page to see the
list of environment variables.

{:file-excerpt} simplescript.c
~~~c
/**
 * Write a unordered list of environment variables.
 *
 * This function is not safe for a public site because it reveals private
 * information about your host computer.  Use it for reference in development,
 * then remove any calls to the function before deploying your web application.
 */
void print_environment(void)
{
   extern char **environ;
   char **env = environ;

   fputs("<h2>CGI Environment listing</h2>\n<ul>\n", stdout);

   while (*env)
   {
      fputs("<li>", stdout);
      fputs(*env, stdout);
      fputs("</li>\n", stdout);

      ++env;
   }

   fputs("</ul>\n", stdout);
}
~~~

### Use CGI Mode While Developing the FastCGI Program

When the FastCGI program is running, you will not be able to overwrite the
executable.  In that case, it will be necessary to stop Apache, then copy
the file, and then restart Apache.  This inconvenience can be avoided by
running Apache in CGI mode.  Running Apache with _mod_fastcgi_ disabled will
run the CGI version, and with _mod_fastcgi_ enabled, it will run the FastCGI
version of the program.

### Run The CGI Program as a Command Line Program For Debugging

There are two levels at which one might want to debug a FastCGI script:
1. Testing the output with a given set of parameters,
2. Debugging the CGI program using GDB

#### Simulate Passing Parameters

To run as a command line program, however, you will need to somehow transmit the
data that would otherwise come from environment variables and stdin.  In my project,
I used command line parameters `-s` to indicate a target file, and repeated `-v`
parameters to simulate a stdin data stream.

Cookies, if used in your application, can likewise be passed as command line
parameters, but also directly as an environment variable on the command line.
Using the _simple.cgi_ example above, one could type:

    HTTP_COOKIE="SessionId=1; SessionHash=AiFtKa12Gv0euKCoKZ5zLDPlwOBqasv6" simple.cgi

Other environment variables could likewise be passed to your CGI or FastCGI
program with the variable name, followed by _=_ followed by the value in
quotes.

#### Using GDB for Debugging

I run `gdbtui` for my C/C++ debugger.  If you are getting a segfault or other
unexpected output when running on the command line, prefix the command with
`gdbtui --args`  For example, if

    simple.cgi -s index.simple

Terminates with a segment fault, type

    gdbtui --args simple.cgi -s index.simple

to see why the fault occurs.   

    






