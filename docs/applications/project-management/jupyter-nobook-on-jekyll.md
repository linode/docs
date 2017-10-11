---
author:
  name: Sam Foo
  email: docs@linode.com
description: 'Share data analysis and visualizations on Jupyter Notebooks with Jekyll'
keywords: 'Jupyter, data, R, python, Jekyll'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Tuesday, October 10th, 2017
modified_by:
  name: Linode
published: 'Tuesday, October 10th, 2017'
title: Display Jupyter Notebooks on Jekyll
external_resources:
 - '[Jekyll](https://jekyllrb.com/)'
 - '[MathJax](https://www.mathjax.org/)'
 - '[Jupyter Notebook](https://jupyter.org/)'
---

Jekyll is a static site generator written in Ruby with support for blogging and integration with Github pages. This setup makes sharing data analysis and visualizations simple because Github takes care of hosting. Jekyll comes with a variety of themes and plugins so the user does not have to worry about web development.

## Requirements

This guide assumes some familiarity with Jupyter Notebooks and navigating files via the command line.

Installation versions of this guide are:

 - Jekyll 3.6.0
 - Ruby >=2.1.0

Additionally, `GCC` and `Make` are also required which should be installed by default on most Linux distributions.

## Installation

 Before installing Ruby, installing Ruby Version Manager is highly recommended for a few reasons:

 - No need to `sudo` for when installing gems
 - Simplifies cases of using multiple sets of gems on the same machine
 - Easily switch between different versions of Ruby

1.  The `software-properties-common` package is a convenient way to add new PPAs.

        sudo apt install software-properties-common

2.  Add the RVM to the PPA list.

        sudo apt-add-repository -y ppa:rael-gc/rvm

3.  Update to include to newly added PPA to list of available packages for installation.

        sudo apt update

4.  Install `rvm`.

        sudo apt install rvm

5.  After installation, the terminal will show a new group has been created. Exit out of the terminal session and ssh back into the Linode.

    {:.output}
    ~~~
    Creating group 'rvm'

    Installing RVM to /usr/share/rvm/
    Installation of RVM in /usr/share/rvm/ is almost complete:

      * First you need to add all users that will be using rvm to 'rvm' group,
        and logout - login again, anyone using rvm will be operating with `umask u=rwx,g=rwx,o=rx`.

      * To start using RVM you need to run `source /etc/profile.d/rvm.sh`
        in all your open shell windows, in rare cases you need to reopen all shell windows.
    ~~~

6.  Install Ruby.

        rvm install ruby

7.  Finally, download Jekyll and Bundler.

        gem install jekyll bundler

### Create a New Blog

1.  Create a new blog. This guide will use `exampleblog`.

        jekyll new exampleblog

2.  Navigate into the `exampleblog` directory. Although Jekyll already has a scaffold for a blog, create an `assets` folder to store images, CSS, and JS files.

        cd exampleblog
        mkdir assets
        mkdir assets/images

    The directory tree should be similar to below.

    {:.output}
    ~~~
    exampleblog/
    ├── 404.html
    ├── about.md
    ├── assets
    │   └── images
    ├── _config.yml
    ├── Gemfile
    ├── Gemfile.lock
    ├── index.md
    └── _posts
        └── 2017-10-10-welcome-to-jekyll.markdown
    ~~~

4.  Run the Jekyll server. On a web browser, navigate to `http://127.0.0.1:4000/` to preview the site. There should be a default first post.

        bundle exec jekyll serve

    ![First Jekyll Post](/docs/assets/jekyll_first_post.png)

    {:.note}
    > After starting the Jekyll server, there will be a new `_site` folder. Do not store files in this folder as it is rebuilt each time changes is made to the site.

## Export Jupyter Notebook as Markdown

This section will demonstrate some common features of a Jupyter Notebook can be rendered as HTML on a Jekyll blog. There are three types of outputs from a Jupyter Notebook cell that will be covered: MathJex through LaTeX in Markdown, an HTML table, console output, and graphs from a plotting function. The Iris dataset in R will be used as an example to generate all output in this guide.

1.  Start the Jupyter server and open to the Notebook of interest. Navigate to `File > Download As > Markdown (.md)`. The markdown file will save to the default `Downloads` folder of the browser.

    ![jupyter_menu](/docs/assets/jupyter_menu.png)

2.  Alternatively, this can also be done directly from the command line. In addition to creating `example_notebook.md`, graphics are also saved in a separate `example_notebook_files` folder.

        jupyter nbconvert --to markdown /path/to/example_notebook.ipynb

3.  The demo code used in this guide is below.

    {:.file}
    example.r
    :   ~~~
        \begin{equation*}
        \mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
        \mathbf{i} & \mathbf{j} & \mathbf{k} \\
        \frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
        \frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0
        \end{vmatrix}
        \end{equation*}

        library(datasets)
        data(iris)
        summary(iris)

        head(iris)

        library(ggplot2)
        ggplot(data=iris, aes(x=Petal.Length, y=Petal.Width, color=Species)) + geom_point(aes(shape=Species))
        ~~~

4.  Inside the `_posts` folder of the Jekyll project, create a new markdown file called `YYYY-MM-DD-example-post.md`. An incorrect date format might cause the post to not be visible.

        touch YYYY-MM-DD-example-post.md

5.  The markdown file should begin with three dashes and contain headers which provide information for Jekyll to populate the post with the appropriate page data.

    {:.file}
    :   ~~~
        ---
        layout: post
        title:  "Awesome Data Visualization"
        date:   2017-10-10 12:07:25 +0000
        categories: data
        ---
        ~~~

6.  Copy the contents of the markdown file exported from Jupyter into the new post.

    {:.note}
    > Quickly append to the end of the post markdown file with `cat example_notebook.md | tee -a /exampleblog/_posts/YYYY-MM-DD-example-post.md`

## Modify Markdown Files
Console output should already follow markdown formatting when moved to Jupyter. There may be characters to escape depending on the contents. Refer to the Jekyll documentation for more information about escaping characters and formatting blocks.

![jupyter_console](/docs/assets/jupyter_console.png) | ![jekyll_console](/docs/assets/jekyll_console.png)

### Use CDN to Support MathJax

Content Delivery Networks(CNS) are a great way to add test functionality on a website without downloading additional software. This section will cover how to create a custom header that can be used in posts.

1.  In order for Jekyll to convert LaTeX to PNG, a CDN is available through MathJax.

    {:.output}
    ~~~
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
    ~~~

2.  The default Jekyll **minima** theme has the `_layouts` and `_includes` directory packaged with the gem. Navigate to this directory by:

        cd $(bundle show minima)

    The directory tree contains other HTML files for integrating Disqus and Google Analytics.

    {:.output}
    ~~~
    minima-2.1.1/
    ├── assets
    │   └── main.scss
    ├── _includes
    │   ├── disqus_comments.html
    │   ├── footer.html
    │   ├── google-analytics.html
    │   ├── header.html
    │   ├── head.html
    │   ├── icon-github.html
    │   ├── icon-github.svg
    │   ├── icon-twitter.html
    │   ├── icon-twitter.svg
    │   └── scripts.html
    ├── _layouts
    │   ├── default.html
    │   ├── home.html
    │   ├── page.html
    │   └── post.html
    ├── LICENSE.txt
    ├── README.md
    └── _sass
        ├── minima
            │   ├── _base.scss
                │   ├── _layout.scss
                    │   └── _syntax-highlighting.scss
                        └── minima.scss
    ~~~

    {:.note}
    >The default theme is installed as a gem. If there is another `_layouts` or `_includes` folder in the project root, those HTML files will override the theme.

3.  Within the minima theme, create a new `scripts.html` file. Using Liquid templating, add logic to check for a `mathjax` header in a post.

    {:.file-excerpt}
    scripts.html
    :   ~~~
        {% if page.mathjax %}
        <script type="text/javascript" async
                src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
        </script>
        {% endif %}
        ~~~

4.  Add templating to `_/layouts/post.html` to include `scripts.html` in posts.

    {:.file-excerpt}
    post.html
    :   ~~~
        ---
        layout: default
        ---

        {% include scripts.html %}
        ~~~

5.  Edit the header `/exampleblog/_posts/YYYY-MM-DD-example-notebook.md` with `mathjax: true`. Wrap the LaTeX in `$$` to create a math block. Remember to include the two lines of triple dashes.

    {:.file-excerpt}
    YYYY-MM-DD-example-notebook.md
    :   ~~~
        ---
        layout: post
        mathjax: true
        title:  "Awesome Data Visualization"
        date:   2017-10-10 12:07:25 +0000
        categories: data
        ---

        $$
        \begin{equation*}
        \mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
        \mathbf{i} & \mathbf{j} & \mathbf{k} \\
        \frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
        \frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0
        \end{vmatrix}
        \end{equation*}
        $$

        ~~~

6.  The browser should use MathJax to display output identical to a Jupyter Notebook.

    ![jupyter_mathjax](/docs/assets/jupyter_mathjax.png) | ![jekyll_mathjax.png](/docs/assets/jekyll_mathjax.png)

### Extend Default SCSS

Tabular output in Jupyter is converted to an HTML table. This section covers how to extend theme SCSS in order to stylize tables.

1.  Ensure the scope attribute in the HTML table is wrapper in quotes.

    {:.file-excerpt}
    YYYY-MM-DD-example-notebook.md
    :   ~~~
        <table>
        <thead>
        <tr>
        <th scope="col">Sepal.Length</th><th scope="col">Sepal.Width</th><th scope="col">Petal.Length</th><th scope="col">Petal.Width</th><th scope="col">Species</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>5.1   </td><td>3.5   </td><td>1.4   </td><td>0.2   </td><td>setosa</td></tr>
        <tr><td>4.9   </td><td>3.0   </td><td>1.4   </td><td>0.2   </td><td>setosa</td></tr>
        <tr><td>4.7   </td><td>3.2   </td><td>1.3   </td><td>0.2   </td><td>setosa</td></tr>
        <tr><td>4.6   </td><td>3.1   </td><td>1.5   </td><td>0.2   </td><td>setosa</td></tr>
        <tr><td>5.0   </td><td>3.6   </td><td>1.4   </td><td>0.2   </td><td>setosa</td></tr>
        <tr><td>5.4   </td><td>3.9   </td><td>1.7   </td><td>0.4   </td><td>setosa</td></tr>
        </tbody>
        </table>
        ~~~

2.  In `/exampleblog/assets`, create a new file called `main.scss`. This imports the existing minima theme SCSS and adds the following:

    {:.file}
    main.scss
    :   ~~~
        ---
        ---
        @import "minima";

        p, blockquote, ul, ol, dl, li, table, pre {
        margin: 15px 0; }

        table {
          padding: 0; }
          table tr {
            border-top: 1px solid #cccccc;
            background-color: white;
            margin: 0;
            padding: 0; }
            table tr:nth-child(2n) {
              background-color: #f8f8f8; }
              table tr th {
              font-weight: bold;
              border: 1px solid #cccccc;
              text-align: left;
              margin: 0;
              padding: 6px 13px; }
            table tr td {
              border: 1px solid #cccccc;
              text-align: left;
              margin: 0;
              padding: 6px 13px; }
            table tr th :first-child, table tr td :first-child {
              margin-top: 0; }
            table tr th :last-child, table tr td :last-child {
        margin-bottom: 0; }
        ~~~

3.  The HTML table will have the new styles applied.

    ![jupyter_table](/docs/assets/jupyter_table.png) | ![jekyll_table](/docs/assets/jekyll_table.png)

### Add an Image in Jekyll
Adding an image through markdown requires having the images stored in the project directory.

1.  Move all of the images exported from Jupyter into the `/assets/images` folder.

2.  Modify the references to images within the markdown to the appropriate path. Wrap the path in two curly braces and double quotes.

    {:.file-excerpt}
    YYYY-MM-DD-example-post.md
    :   ~~~
        ![png]({{ "/assets/images/example_notebook_5_0.png" }})
        ~~~

3.  Graphs with legends that are in a longer dimension also can be displayed.

    ![ggplot](/docs/assets/jekyll_ggplot.png)

    {:.note}
    >Adding interactive graphs using Javascript libraries is beyond the scope of this guide.


