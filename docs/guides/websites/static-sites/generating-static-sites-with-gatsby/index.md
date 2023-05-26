---
slug: generating-static-sites-with-gatsby
description: "Gatsby offers a static-site generation framework based on React. Take all of the advantages of React for designing frontends, and combine them with a rich set of features for generating static sites. Find out more about Gatsby and how to build and deploy your own websites with it in this tutorial."
keywords: ['what is gatsby js','gatsby static site generator tutorial','gatsby templates']
tags: ['web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-03
modified_by:
  name: Nathaniel Stickman
title: "Generating Static Sites with Gatsby"
title_meta: "How to Generate Static Sites with Gatsby"
external_resources:
- '[Gatsby: Tutorial - Learn how Gatsby Works](https://www.gatsbyjs.com/docs/tutorial/)'
- '[Ibaslogic: Gatsby Tutorial from Scratch: The Definitive Guide](https://ibaslogic.com/gatsby-tutorial-from-scratch-for-beginners/)'
- '[LogRocket: Gatsby - The Ultimate Guide with Examples](https://blog.logrocket.com/gatsby-ultimate-guide-examples/)'
authors: ["Nathaniel Stickman"]
---

Gatsby is a static-site generator built on React. It has all the performance benefits of static sites, backed by the feature-rich React library. Gatsby additionally supports an array of plugins and templates to further help you develop static sites.

Through this tutorial, learn what Gatsby is and what it has to offer. By follow along with the example code, you can create your first Gatsby website from a template, as well as learn how to customize your site moving forward.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

        ```command
        sudo apt update && sudo apt upgrade
        ```

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

        ```command
        sudo dnf upgrade
        ```

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is Gatsby?

Gatsby is a framework for creating static websites. An open-source project built on React, Gatsby puts together static sites with an eye toward developer features and high performance.

A static site consists only of a the code required to display a site with your browser, with no server-side computations or database. One of the benefits of generating static sites is that everything is rendered at build time. By avoiding runtime rendering, a website loads quicker and more responsively. Build-time rendering often also improves websites' SEO performance.

Gatsby brings several features in particular to a static-site generation that set it apart.

Foremost is the fact that Gatsby is built on React, giving developers all of the benefits of working with React. That also makes Gatsby an exceptional choice for developers already familiar with React.

Gatsby also offers compelling options when it comes to developing site content for static sites. Using plugins, developers can enable content management systems (CMS) like WordPress and Contentful as content sources. Alternatively, Gatsby can directly process Markdown files for site content.

### Gatsby vs Next.js

Next.js also offers static-site generation options, and it has been considered a comparable tool to Gatsby. So how do the two compare, and why would you choose one over the other?

Gatsby specializes in static sites, and it does not offer much for supporting dynamic content. Gatsby thus offers a simple performance and optimization based around generating static content at build time. This makes Gatsby an excellent framework for working with the kinds of websites that favor static generation. These include blogs, profiles, and other websites that do not require dynamic data fetching.

Gatsby, because of its build-time generation, does not require any server-side code. Everything runs on the client side once the static site has been generated.

Next.js, on the other hand, operates a more flexible model. It is designed to offer a combination of static generation and server-side rendering. The latter occurs at request time, rather than build time. With this, Next.js offers some of the performance benefits of pre-rendering while accommodating applications that need to fetch content dynamically.

Applications built with Next.js, therefore, run at least partially on the server side. Next has to be running on the server side to provide server-side rendering at the request time.

Finally, another remarkable difference between the two frameworks is Gatsby's ecosystem of templates and themes. With these, it is typically quicker to put together a working website with Gatsby than with Next.js.

## How to Install Gatsby

These steps walk you through installing the tooling for creating and managing Gatsby projects. The Gatsby framework itself only needs to be installed on a project-by-project basis, but having Gatsby's command-line tool (CLI) installed makes the process of working with Gatsby significantly easier.

1. Follow our tutorial on how to [Install and Use the Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/). Gatsby requires Node.js and NPM. Additionally, NPM can be used later for installing Gatsby plugins.

1. Install the Gatsby CLI as a global NPM package:

    ```command
    npm install -g gatsby-cli
    ```

1. Verify your installation by checking the version of the Gatsby tool installed:

    ```command
    gatsby --version
    ```

    ```output
    Gatsby CLI version: 4.24.0
    ```

1. Ensure that your system has Git installed. Gatsby requires Git to download starters, even for the default Gatsby template.

    Follow our tutorial on [How to Install Git on Linux](/docs/guides/how-to-install-git-on-linux-mac-and-windows/#how-to-install-git-on-linux) to see how you can check if Git is installed and, if it is not, how you can install it.

## How to Use Gatsby

With the Gatsby CLI installed, follow the next few sections to learn about applying a starter template. These give you a basis to start your Gatsby project, including a wide array of themes and layouts. Additionally, this guide with cover a explanation of the main parts of Gatsby, how to customize your website, and how to deploy your website.

### Creating a Gatsby Project

Execute the following command to create a new Gatsby project. This and the following examples use `example-app` as the project title. The command below creates the project in a subdirectory of that name within your current directory:

```command
gatsby new example-app
```

But sometimes when starting a new Gatsby project, you want to use a starter template. These templates, maintained either officially or by the Gatsby community, contain the boilerplate code for a pre-designed Gatsby website.

Check out the [Gatsby Starter Library](https://www.gatsbyjs.com/starters/) to see a collection of starter templates to get started.

This guide starts out using the `gatsby-starter-default`, which is the default starter. Because this is the default starter, you do not need to specify it in your command for creating the Gatsby project.

However, to demonstrate how to utilize starters, the following is the command used when creating this project. It follows the basic command for creating a new Gatsby project but adds the address for the starter at the end. These addresses can be found with the starters listed in the library:

```
gatsby new example-app https://github.com/gatsbyjs/gatsby-starter-default
```

Now you can view the default website that comes with the starter template.

#### Run a Development Server

Gatsby includes a development server, and while the server is not fit for production, it provides a convenient way to preview the static site.

To run the development server, change into the project directory and execute the `gatsby develop` command:

```command
cd example-app
gatsby develop
```

Then, navigate to `localhost` port `8000` in a web browser. To visit the application remotely, you can use an SSH tunnel:

- On **Windows**, you can use the PuTTY tool to set up your SSH tunnel. Follow our guide on [Connecting to a Remote Server Over SSH using PuTTY](/docs/guides/connect-to-server-over-ssh-using-putty/), and use `8000` as the port number.

- On **macOS** or **Linux**, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the remote server and `192.0.2.0` with the remote server's IP address:

    ```command
    ssh -L8000:localhost:8000 example-user@192.0.2.0
    ```

You are greeted with the default Gatsby website. Learn more about the structure of a Gatsby static site and about how to make your own in the upcoming sections.

![Default Gatsby website](gatsby-default.png)

### Understand the Parts of a Gatsby Project

Within the Gatsby project directory, the primary place for building your website is within the `src` subdirectory. In this subdirectory, the parts of a Gatsby website are laid out much as you might find with a React application.

There are three main parts of a Gatsby website, each of which with its own subdirectory in the `src` subdirectory.

- **Pages**: JSX files stored here are automatically converted into pages with their own paths, based on the file names. In the default starter, the `page-2.js` file in this subdirectory results in a `/page-2` path. The `index.js` file results in the homepage, with a path of `/`.

**Components**: These render to HTML elements, with each component functioning as a reusable portion of a page. A navigation bar is an example. Rather than maintaining the code for that piece on every distinct page, you can build the navigation menu as a component. Then it can be reused on any page on your website and can be maintained from a central location.

- **Templates**: Page components can be programmatically rendered using templates. Gatsby can, for instance, fetch data from other sources, and render content programmatically from that data using templates. An example is a page component that reads Markdown content from GraphQL and renders that content as blog posts.

    You can see more on templates in the next section, which customizes a blog starter that makes use of templates and GraphQL.

### Develop a Site with Gatsby

To help you understand how to get started working with Gatsby for your own website, this section walks you through customizing a Gatsby project. By the end, you can have a basic blog with your own information, ready for content to be added.

1. Create a new Gatsby project. This one uses the `gatsby-starter-blog` starter template, which includes an excellent set of features for getting started designing a blog.

    For this guide, the project is named `example-blog`. Change into the project directory after; the rest of the tutorial assumes you are in this directory.

    ```command
    gatsby new example-blog https://github.com/gatsbyjs/gatsby-starter-blog
    cd example-blog
    ```

1. Open the `gatsby-config.json` file, and modify the metadata to match your needs. Following is an example:

    ```file {title="gatsby-config.json"}
    // [...]
      siteMetadata: {
        title: `An Example Blog`,
        author: {
          name: `Example User`,
          summary: `Someone who created this example blog with Gatsby.`,
        },
        description: `An example Gatsby blog.`,
        siteUrl: `https://example.com/gatsby-blog`,
      },
    // [...]
    ```

1. Look at the `src/pages/index.js` file. This file is rendered into the blog's homepage, sand you can modify it as you need. But keep in mind that much of the information about yourself and your website is sourced from the metadata adjusted above. For this example, none of the features actually needed to be altered.

    The file is worth a deeper look, however, alongside the `gatsby-node.js` file. Both of these use GraphQL to query for Markdown content stored in the `content/blog` subdirectory. They use the `allMarkdownRemark` plugin, which is capable of pulling frontmatter and other data from these files, as well as parsing the Markdown to HTML.

    ```file {title="src/pages/index.js"}
    // [...]

    export const pageQuery = graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          nodes {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              description
            }
          }
        }
      }
    `
    ```

1. Similarly, look at the `src/components/bio.js` and adjust it to fit your needs. This guide's example has made some modifications to simplify the display:

    ```file {title="src/components/bio.js"}
    // [...]
      return (
        <div className="bio">
          {author?.name && (
            <p>
              by <strong>{author.name}</strong>
            </p>
          )}
          {author?.summary && (
            <small>
              {author.summary}
            </small>
          )}
        </div>
      )
    // [...]
    ```

    To support this, the example used in this guide also removes the `display: flex` line from the `.bio` section of the CSS file, `style.css`.

1. Finally, create some blog posts. You can see the default posts stored in the `content/blog` subdirectory. Replace these subdirectories with subdirectories of your own, adding an `index.md` file within each for the Markdown content.

    Be sure to add frontmatter for each Markdown file. The starter supports the `title`, `date`, and `description` frontmatter fields by default. You can also change this by adjusting the GraphQL queries in the `src/pages/index.js` and `src/templates/blog-post.js` files and in the `graph-node.js` file.

    This starter comes configured to support images from these directories as well which you can use in your Markdown files.

    For this guide, simple blog post files have been added with the following subdirectories. Follow the links to see the file contents used for this example:
    - `first-post`/[index.md](example-blog-content/blog/first-post/index.txt)
    - `second-post`/[index.md](example-blog-content/blog/second-post/index.txt)
    - `third-post`/[index.md](example-blog-content/blog/third-post/index.txt)

Now your custom Gatsby blog is ready for you to try. Run the development server using the command below, and access it from your web browser as covered earlier in this guide:

```command
gatsby develop
```

![Example blog developed with Gatsby](example-blog.png)

### Deploy a Gatsby Static Site

When you are ready to deploy your Gatsby website, you can use the `build` command as shown below:

```command
gatsby build
```

Gatsby uses the `build` command to render your website and store the static files for it in the `public` subdirectory. These are the files you need to copy to the host you plan to use to serve your static site.

You can learn more about that process through our guide on how to [Deploy a Static Site Using Hugo and Object Storage](/docs/guides/host-static-site-object-storage/#upload-your-static-site-to-linode-object-storage), following the section on uploading a static site to Linode Object Storage.

Alternatively, take a look at our guides on how to [Set up a Web Server and Host a Website on Linode](/docs/guides/set-up-web-server-host-website/) or, for something more advanced, on how to [Host a Website with High Availability](/docs/guides/host-a-website-with-high-availability/).

## Conclusion

This guides covered an introduction to Gatsby for creating static sites.

To read further, be sure to peruse the [official Gatsby documentation](https://www.gatsbyjs.com/docs/). You may also be interested in our guide on setting up a [CI/CD Pipeline with Gatsby, Netlify, and Travis CI](/docs/guides/install-gatsbyjs/). Doing so can give you an efficient process for managing your Gatsby website.
