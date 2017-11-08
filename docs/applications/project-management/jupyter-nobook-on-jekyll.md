---
author:
  name: Sam Foo
  email: docs@linode.com
description: 'Share data analysis and visualizations on Jupyter Notebooks with Jekyll.'
og_description: 'Share data analysis and visualizations on Jupyter Notebooks with Jekyll.'
keywords: 'Jupyter, ruby, python, Jekyll'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, November 6th, 2017
modified_by:
  name: Linode
published: 'Monday, November 6th, 2017'
title: Display Jupyter Notebooks with Jekyll
external_resources:
 - '[Jekyll](https://jekyllrb.com/)'
 - '[MathJax](https://www.mathjax.org/)'
 - '[Jupyter Notebook](https://jupyter.org/)'
---

![Jupyter and Jekyll](/docs/assets/jupyter_jekyll.jpg)

Jekyll is a static site generator written in Ruby with support for blogging and integration with Github pages. This setup makes sharing data analysis and visualizations simple because Github takes care of hosting. Jekyll comes with a variety of themes and plugins so the user does not have to worry about web development.

This guide will take you through the process of installing Jekyll and configuring it to display several types of output from a Jupyter notebook.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the appropriate sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account.

3.  Update your system:

        sudo apt update && sudo apt upgrade

4.  Install GCC and Make, if they are not already installed on your distribution by default:

        sudo apt install gcc make

## Install Ruby and Jekyll

Install Ruby Version Manager (RVM). RVM is recommended for a few reasons:

-  No need to `sudo` for when installing gems
-  Simplifies cases of using multiple sets of gems on the same machine
-  Easily switch between different versions of Ruby

1.  The `software-properties-common` package is a convenient way to add new PPAs:

        sudo apt install software-properties-common

2.  Add the RVM repository to the PPA list:

        sudo apt-add-repository -y ppa:rael-gc/rvm

3.  Update the PPA list of available packages and install RVM:

        sudo apt update && sudo apt install rvm

4.  After installation, the terminal will show the new group it created. Exit out of the terminal session and SSH back into the Linode:

    {: .output }
    ~~~
    Creating group 'rvm'
    
    Installing RVM to /usr/share/rvm/
    Installation of RVM in /usr/share/rvm/ is almost complete:
    
      * First you need to add all users that will be using rvm to 'rvm' group,
        and logout - login again, anyone using rvm will be operating with `umask u=rwx,g=rwx,o=rx`.
     
      * To start using RVM you need to run `source /etc/profile.d/rvm.sh`
        in all your open shell windows, in rare cases you need to reopen all shell windows.
    ~~~

5.  Install Ruby:

        rvm install ruby

6.  Use `gem` to download Jekyll and Bundler:

        gem install jekyll bundler

### Create a New Blog

1.  Create a new blog. This guide will use `exampleblog`:

        jekyll new exampleblog

2.  Navigate into the `exampleblog` directory. Although Jekyll already has a scaffold for a blog, create an `assets` folder to store images, CSS, and JS files.

        cd exampleblog
        mkdir -p assets/images

    The directory tree should be similar to:

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

3.  Run the Jekyll server. Using a web browser, navigate to your Linode's public IP address (port `4000`) to preview the site. There should be a default first post.

        bundle exec jekyll serve --host=0.0.0.0

    ![First Jekyll Post](/docs/assets/jekyll_first_post.png "First Jekyll Post")

    {:.note}
    > After starting the Jekyll server, there will be a new `_site` folder. Do not store files in this folder as it is rebuilt each time changes are made to the site.

## Configure Jupyter Notebook

If you do not already have Anaconda with Jupyter installed on your system, this section will guide you through the process of setting up a notebook that will provide sample output, which can then be exported to your Jekyll blog.

The steps in this section can be completed from either your local machine or from the Linode used for your Jekyll blog. If you use a Linode, you can use [ngrok](https://ngrok.com/) to view your notebook.

1.  If you do not already have Anaconda on your system, download and install it:

        curl -O https://repo.continuum.io/archive/Anaconda3-5.0.0.1-Linux-x86_64.sh
        bash Anaconda3-5.0.0.1-Linux-x86_64.sh

    Follow the prompts to install Anaconda on your system.

2.  Create an Anaconda environment for Jupyter with R. Replace `data-notebooks` in the following command with a suitable environment name:

        conda create --name data-notebooks
        source activate data-notebooks

3.  Start the Jupyter notebook:

        jupyter notebook

## Export Jupyter Notebook as Markdown

This section demonstrates some common features of a Jupyter Notebook that can be rendered as HTML on a Jekyll blog. There are four types of outputs from a Jupyter Notebook cell covered here: MathJex through LaTeX in Markdown, an HTML table, console output, and graphs from a plotting function. The Iris dataset will be used as an example to generate the output in this guide.

1.  Open the notebook of interest, or use the code below to create an example notebook. Run all of the relevant cells so that the output you want to display on your Jekyll blog is visible on the page. Navigate to `File > Download As > Markdown (.md)`. The markdown file will save to the default `Downloads` folder of the browser.

    ![Jupyter Menu](/docs/assets/jekyll/jupyter_menu.png "Jupyter Menu")

    Alternatively, this can be done directly from the command line. In addition to creating `example_notebook.md`, graphics are also saved in a separate `example_notebook_files` folder.

        jupyter nbconvert --to markdown /path/to/example_notebook.ipynb

2.  The demo code used in this guide is below:

    {:.file}
    example.ipynb
    :   ~~~
        \begin{equation*}
        \mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
        \mathbf{i} & \mathbf{j} & \mathbf{k} \\
        \frac{\partial X}{\partial u} &  \frac{\partial Y}{\partial u} & 0 \\
        \frac{\partial X}{\partial v} &  \frac{\partial Y}{\partial v} & 0
        \end{vmatrix}
        \end{equation*}

        import pandas as pd
        import seaborn as sns
        %matplotlib inline

        url = "https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data"
        names = ['sepal-length', 'sepal-width', 'petal-length', 'petal-width', 'class']
        iris = pd.read_csv(url, names=names)

        iris.head()
        iris.describe()

        sns.pairplot(x_vars=["petal-length"], y_vars=["petal-width"], data=iris, hue="class", size=10)
        ~~~

3.  Inside the `_posts` folder of the Jekyll project, create a new markdown file called `YYYY-MM-DD-example-post.md`. If the date format is incorrect, the post may not be displayed on the blog:

        touch YYYY-MM-DD-example-post.md

4.  The markdown file should begin with three dashes and contain headers which provide information for Jekyll to populate the post with the appropriate page data. The date must be in the format specified. The hours, minutes, seconds, and timezone adjustment are optional:

    {:.file}
    YYYY-MM-DD-example-post.md
    : ~~~
      ---
      layout: post
      title:  "Awesome Data Visualization"
      date:   2017-10-10 12:07:25 +0000
      categories:
        - data
      ---
      ~~~

5.  Copy the contents of the markdown file exported from Jupyter into the new post.

    To do this from the command line, use:

        cat example_notebook.md | tee -a exampleblog/_posts/YYYY-MM-DD-example-post.md

## Modify Markdown Files

If you navigate to your Jekyll blog in a browser, you should see a link to the title of the new post ("Awesome Data Visualization" in the example). However, you will probably notice that much of the output is not properly formatted. There may be characters to escape depending on the contents. Refer to the [Jekyll documentation](https://jekyllrb.com/docs/posts/) for more information about escaping characters and formatting blocks.

The following sections show how to adjust and style the tables and images for improved presentation.

### Extend Default SCSS

Tabular output in Jupyter is converted to an HTML table. This section covers how to extend theme SCSS in order to stylize tables.

1.  In `/exampleblog/assets`, create a new file called `main.scss`. This imports the existing minima theme SCSS and adds the following:

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

2.  The HTML table will have the new styles applied.

    ![Jupyter Table](/docs/assets/jupyter_table.png "Jupyter Table") | ![Jekyll Table](/docs/assets/jekyll/jekyll_table.png "Jekyll Table")

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

    ![GG Plot](/docs/assets/jekyll/jekyll_ggplot.png "GG Plot")

    This is just an example. Adding interactive graphs using Javascript libraries is beyond the scope of this guide.

### Use a CDN to Support MathJax

Content Delivery Networks(CDNs) are a great way to add functionality on a website without downloading additional software. This section will cover how to create a custom header that can be used in posts.

1.  In order for Jekyll to convert LaTeX to PNG, a CDN is available through MathJax. Copy the following HTML tag and paste it below the metadata section of `YYYY-MM-DD-example-post.md`:

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

3.  Within the `_includes` directory in the minima theme, create a new `scripts.html` file. Using Liquid templating, add logic to check for a `mathjax` header in a post:

      {:.file-excerpt}
      _includes/scripts.html
      :   ~~~ html
          {% if page.mathjax %}
          <script type="text/javascript" async
                  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
          </script>
          {% endif %}
          ~~~

4.  Add templating to `_layouts/post.html` to include `scripts.html` in posts:

    {:.file-excerpt}
    _layouts/post.html
    :   ~~~
        ---
        layout: default
        ---

        {% include scripts.html %}
        ~~~

5.  Edit the header `/exampleblog/_posts/YYYY-MM-DD-example-post.md` with `mathjax: true`. Wrap the LaTeX in `$$` to create a math block. Remember to include the two lines of `---`:

    {:.file-excerpt}
    YYYY-MM-DD-example-post.md
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

    ![Jupyter Mathjax](/docs/assets/jupyter_mathjax.png "Jupyter Mathjax") | ![Jekyll Mathjax](/docs/assets/jekyll/jekyll_mathjax.png "Jekyll Mathjax")
