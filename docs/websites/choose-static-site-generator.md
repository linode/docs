---
author:
  name: Ahmed Bouchefra
  email: techiediaries9@gmail.com
description: 'this article takes a detailed look at the three most popular static site generators: Jekyll, Hugo and Hexo.'
keywords: ["static", "site", "generator", "jekyll vs hugo vs hexo"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-2-1
modified: 2018-2-1
modified_by:
  name: Linode
title: 'Choosing a Static Site Generator'
contributor:
  name: Ahmed Bouchefra
  link: https://www.techiediaries.com
---


In this article we'll take an in-depth look at the three most popular static site generators: [Jekyll](https://jekyllrb.com/) (a Ruby generator built by Github for powering their Github pages), [Hugo](https://gohugo.io/) (an extremly fast static generator built on top of the Go programming language) and [Hexo](https://hexo.io/) (a fast website generator based on Node.js). We'll also look at more specialized options such as [Gatsby](https://www.gatsbyjs.org/) (a blazing fast static site/PWA generator built around modern web technologies such as React and GraphQL) and [Gitbook](https://www.gitbook.com/) (a CLI and Node.js library for building and hosting books using Git and Markdown).

## What's Static Website Generation?

Static website generation refers to the process of statically generating a website i.e generate the HTML files, for example, in a local machine and then upload the website files to a server that serves them to users when they are requested. The server doesn't do any server side processing or database communication it only sends the plain HTML files once they are requested.

## Reasons for Choosing the Static Approach?

Nowadays there is a plethora of server side languages, database management systems and content management systems so why do many website owners go static?

There are many reasons such as:

* contents are stored as flat files so no need for a database
* a static website doesn't need dynamic server side processing
* static websites are super fast than dynamic websites since they require no server side processing or database access
* static websites are more secure than any dynamic website since there are less security holes to exploit
* super scaling when used with CDN
* caching static files is more effecive than caching dynamic pages

## Jekyll vs Hugo vs Hexo

In this section we'll introduce three popular static site generators: Jekyll, Hugo and Hexo, see their pros and cons and we'll also compare them according to different criteria such as:

* speed,
* community and popularity,
* templating system and themes,
* workflow and easiness of use,
* markdown and multiple formats support,
* advanced content management,
* assets handling,
* plugins support and extensibility

### An introduction to Jekyll

[Jekyll](https://jekyllrb.com/) is a blog-aware static site generator designed for building personal, portfolio and orgnanization websites but also fully fledged blogs.

Jekyll is built in Ruby language by Github and you can use Github Pages for free to host your static website and easily link it with your custom top domain name using a *CNAME* file.

### Pros and Cons of Jekyll

Just like any tool, Jekyll has its own set of pros and cons. Let's cover the most important ones:

For the pros:

* it's free and open source
* you can build themes as gems and distribute them through RubyGems
* easy and simple to use
* you can easily migrate your content from popular platforms (e.g. WordPress) thanks to [Jekyll importers](https://import.jekyllrb.com/docs/home/)
* great Github Pages support
* comes with default and decent minimal theme out of the box

Jekyll has also a few cons such as:

* as you website content grows, the build process becomes significantly slower (this is the major weakness of Jekyll)
* the incremental build is still experimental
* no built-in post pagination as of Jekyll 3
* it doesn't support using variables in titles or YAML
* many plugins becomes outdated
* gem dependencies may introduce incompatibilities
* Github Pages supports Jekyll out of the box but only a set of [Github-safe plugins](https://help.github.com/articles/using-jekyll-plugins-with-github-pages/) can be used
* no built-in support for livereload

### Community and Popularity

Jekyll is by far the most popular static generator since it was built and supported by GitHub and used for the popular service GitHub Pages which are used for free to host static pages for personal or project websites.

Jekyll has the largest community among other static generators that has provided a plethora of great tutorials, open source themes and plugins.

It's seen as the contender of WordPress in the static world and many bloggers have migrated their blogs from WordPress to Jekyll.

In StackOverflow, Jekyll has more related questions than both Hugo and Hexo

![Image](https://screenshotscdn.firefoxusercontent.com/images/45ba2c16-e792-4c5f-b67a-ea4c66a324dd.png)

### Templating System and Themes

Jekyll uses the [Liquid](https://jekyllrb.com/docs/templates/) templating engine. Liquid was developed and used by Shopify.

You can also use *Textile* which is supported through an [official plugin](https://github.com/jekyll/jekyll-textile-converter).

#### Gem-based Themes

Jekyll allows you to use themes as gems that can be installed from RubyGems which has many benefits

>Gem-based themes make it easy for theme developers to make updates available to anyone who has the theme gem. When there’s an update, theme developers push the update to RubyGems. [Source](https://jekyllrb.com/docs/themes/#understanding-gem-based-themes)

### Markdown and Multiple Format Support

Jekyll uses the popular [Markdown](https://daringfireball.net/projects/markdown/) format with [YAML](https://jekyllrb.com/docs/frontmatter/) for front matter, CSS and HTML for formatting static content.

Jekyll supports Markdown and HTML by default but you can also support other formats by installing the required converters.

### Speed

A common feature of static site generators is fast time loading as no server side technolgy beats pre-built static files, particularly if delivered by a CDN, in reducing the Time To First Byte. Static generators take the responsability of processing/building pages from the server side/request time to the build time in the developer's local machine. As a result,  when it comes to speed static generators are usually compared for how fast they are at build time.

Jekyll is fast as long as you have a small website i.e with small amount of content but when your content grows you are going to experience slow building times so if you are making small updates and iterations the process will turn to be painfull over time.

#### Incremental Build

Many static site generators provide incremental build which significantly improves the performance for large sites and reduces the time for building the whole site by incrementaly re-generating only the posts and pages that have been changed.

Jekyll supports the incremental build feature but it's only experimental (which may break site generation in some cases) and not enabled by default.

{{< note >}}
You can enable the experimental incremental build feature by adding the --incremental switch to the build command.
{{< /note >}}

### Assets Handling

Jekyll has an assets pipline that supports *Sass* and *SCSS* out of the box. It also allow you to customize Sass pre-processing in many ways via some configuration options such as specifying the raw Sass/SCSS folder (defaults to `sass_dir`) and setting the output style supported by Sass.

You can also add support for *Coffeescript* by adding an official plugin [jekyll-coffeescript](https://github.com/jekyll/jekyll-coffeescript).

### Content Management Model

You can use Jekyll as a Content Management System (CMS) but without the hassle of installing and configuring databases and related tools.

Since it's blog-aware it has support for blog-level constructs such as [permalinks](https://jekyllrb.com/docs/permalinks/), categories, tags, collections, pages and posts and you can also create custom layouts for you website.

Once you generate a website you can start by adding posts in the `_posts` folder. You can also create subfolders inside `_posts`.

You can add a page, the basic building of any website by placing an HTML/Markdown file inside the root folder or a sub-folder

[Collections](https://jekyllrb.com/docs/collections/) are recent additions to Jekyll. You can find more information about collections from [Jekyll docs](https://jekyllrb.com/docs/collections/)

>Collections allow you to define a new type of document that behave like Pages or Posts do normally, but also have their own unique properties and namespace

You can work with [drafts](https://jekyllrb.com/docs/drafts/) by placing posts without dates inside the `_drafts` folder then you can use the --drafts switch with `jekyll serve` or `jekyll build` to preview your drafts.

You can also work with data files with Jekyll. Find more information from the [docs](https://jekyllrb.com/docs/datafiles/)

>Jekyll supports loading data from YAML, JSON, and CSV files located in the _data directory. Note that CSV files must contain a header row.

### Plugins and Extensibility

Jekyll has a powerful [plugin system](https://jekyllrb.com/docs/plugins/) with hooks that allow you to create custom generated content for your site. This allows you to run code at different points in your site generation process.

You can find [open source plugins](https://planetjekyll.github.io/plugins/), either official or created by the community, for a variety of tasks so you don't have to re-invent the wheel and you can also create you own plugin if you are familiar with te Ruby language.

As a recap, Jekyll is so popular with the largest community so you can find many great tutorials, themes and plugins. It's easy to use, extensible and has a good assets pipeline but one major drawback is the slowness once your content size starts to grow (this perhaps may be solved when the incremental building becomes stable).

## An introduction to Hugo

Hugo is a static site generator built in Go. It's advertised as "The world’s fastest framework for building websites". It's recent compared to Jekyll but rapidely growing in popularity.

Unlike Jekyll, Hugo is written in Go, a statically compiled language. This affects in many ways the set of Hugo's features particularly plugins.

You can install Hugo in seconds and build an average static website in less than a second.

Hugo uses Markdown format with YAML Front Matter.

### Pros and cons of Hugo

Hugo has many pros:

* open source and free project
* blazing fast speed, enginnered and optimized for speed
* batteries included: built-in pagination, built-in redirection with aliases etc.
* built-in support for dynamic API driven content
* built-in support for unlimited content types
* thanks to shortcodes, Hugo offers a flexible alternative to Markdown
* pre-made templates and patterns
* support for multiple and custom outputs
* complete built-in support for i18n
* robust theming system
* available free and open source [themes](http://themes.gohugo.io/)
* easy to install
* dependency free
* powerful content model

Hugo has also quite a few cons:

* themes use Go templates so you'll need to be familiar with Go to create your theme
* Hugo doesn't ship with a default theme
* luck for extensibility and plugins (major drawback)

#### Community and Popularity

Hugo is not as popular as Jekyll but it's now [among the most three popular static generators](https://www.staticgen.com/) in the web. It's seen as a blazing fast alternative to Jekyll.

### Speed

If you’re concerned about performance and speed, Hugo is the static generator you need. It’s has many built-in features, but most importantly it's blazing fast thanks to Go.

Hugo is super fast. You can build your website in terms of milliseconds (instead of seconds or even minutes in case of Jekyll)

This benchmark on Youtube shows Hugo building *5000* pages in about *6* seconds

### Template Engine and Themes

Hugo uses by default the Go template package and also supports two Go-based template engines *Amber* and *Ace*. The package template doesn't support layouts only partials.

Hugo provides a set of helper methods that make it easy to do custom filtering, sorting and conditionals.

You can find free and open source themes in [https://themes.gohugo.io/](https://themes.gohugo.io/)

### Assets Handling

Hugo doesn't have an asset pipeline so you'll have to use an external tool for handling assets that need pre-processing such as *ES6*, Sass or LESS etc.

If you don't want to work with an external assets pipline you'll have to stick with plain JavaScript and CSS since, during building, Hugo only copies the files from the static folder to the build folder.

### Markdown and Multiple Format Support

Hugo supports Markdown and *Emacs Org-Mode* out of the box. ather formats such as Asciidoc can be supported by using external helpers. You can find more information [here](https://gohugo.io/content-management/formats/).

### Content Management Model

Hugo has the most powerful content management system among the other static generators.

You can create sections and entries which are Markdown files with Front Matter (with YAML, JSON or TOML)

You can easily query content from different sections and dispaly them in templates

Hugo also makes it very easy to work with tags and categories. You can query all post belonging to a tag or a category with simple logic.

Hugo also supports data files and dynamically loading data from remote URLs.

### Plugins and Extensibility

Plugins are one of the major weaknesses of Hugo. That's inherited from the fact that Go is a compiled (vs interprited) language so you have no easy and direct way to use a plugin with Hugo.

As long as you only need the built-in features (which are many) of Hugo you are fine but if your website needs custom behavior that's not provided by a built-in feature you'll face a problem.

Hugo provides external helpers which are close to extensions but unfortunately they don't have access to the template engine or content management internals.

As a recap, Hugo is blazing fast, easy to install even for people with no strong tech background, has plenty of built-in features for most use cases but doesn't have an asset pipline and no support for real extensions.

### An Introduction to Hexo

[Hexo](https://hexo.io/) is Node based, open source static generator available under the MIT license. Thanks to the Node.js platform Hexo allows you to generate hundreds of static files in a matter of seconds.

### Pros and cons of Hexo

Hexo has many pros:

* blazing fast and incredible speed
* deploy to Github pages or any other host with one deploy command
* powerful Markdown support
* highly extensible
* available free and open source [themes](https://hexo.io/themes/)
* available free [plugins](https://hexo.io/plugins/)

For the cons:

* Hexo has a relatively large community but the majority is non-english speakers (from China)

### Community and Popularity

Hexo community is getting bigger with Hexo becoming more popular. It's now among the most popular static generators in the web. The main drawback regarding Hexo community is that most of it comes from China.

There are less tutorials for Hexo compared to Jekyll but the [documentation](https://hexo.io/docs/) is clear and easy to follow.

As the time of this writing Hexo has *20.336* stars in Github.

### Speed

Hexo is based on Node.js, a platform known by its effiecency and performance, as a result it's very fast (Hundreds of files take only seconds to build) but not faster than Hugo.

### Assets Handling

Just like Hugo, Hexo doesn't have an asset pipeline out of the box for pre-processing assets (ES6 ,Sass etc.) but since it's a Node utility you can easily integrate it with Gulp or Grunt as a part of a build workflow for using an extrenal tool to pre-compile assets. You can also use many available plugins which seamlessly add assets pre-processing to Hexo. Check for example [hexo-renderer-sass](https://github.com/knksmith57/hexo-renderer-sass)  or [hexo-renderer-scss](https://github.com/mamboer/hexo-renderer-scss) or [hexo-asset-pipeline](https://github.com/hexojs/hexo-asset-pipeline).

Hexo allows you to have asset folders per post which have the same name as the post file. The content of the asset folder will be copied to the same folder where the post HTML file is located.

You can have asset folders per posts by adding a simple configuration setting `post_asset_folder: true`

Hexo also allows you to have global assets folders inside the `source` folder.

You can use different tags for easily referencing assets inside different asset folders such as asset_path, asset_img and asset_link.

### Templates Engine and Themes

Hexo uses *Embedded JavaScript templates* (EJS) a simple [templating language](http://ejs.co/) that lets you generate HTML markup with plain JavaScript. It has support for layouts, partials and local variables.

Hexo introduced *Fragment Caching*, a feature inspired from [Ruby on Rails](http://guides.rubyonrails.org/caching_with_rails.html#fragment-caching). It allows content to be saved and cached as fragments which speeds up the file generation process.

You can build a Hexo theme very easily, you just need to create a new folder with a [specified structure](https://hexo.io/docs/themes.html). To start using your theme, modify the theme setting in your site’s `_config.yml`. or you can also use open source and free [themes](https://hexo.io/themes/) created by the community.

### Markdown and Multiple Format Support

Hexo supports all the features of GitHub Flavored Markdown. You can also add support for other formats (Textile, reStructedText etc.) by using plugins such as [hexo-renderer-pandoc](https://github.com/wzpan/hexo-renderer-pandoc) or [hexo-renderer-marked](https://github.com/hexojs/hexo-renderer-marked)

### Content Management Model

Hexo has a content management system focused on blogging with support for [Internationalization](https://hexo.io/docs/internationalization.html). You can [create posts](https://hexo.io/docs/writing.html) and drafts as Markdown files with Front Matter for meta data.

Hexo supports [data files](https://hexo.io/docs/data-files.html) which load YAML or JSON files from `source/_data` in your posts.

### Plugins and Extensibility

Hexo is highly extensible with a plethora of [available plugins](https://hexo.io/plugins/) and has support for all Octopress plugins and many Jekyll plugins.

As a recap, Hexo is easy to install and use, very fast, highly extensible. It has no built in pre-processing for Sass, ES6 etc. but it can be easily integrated as a part of Gulp or Grunt to use external assets pre-processing tools. Hexo is a good option for maintaining a blog.

## Other Specialized Alternatives: Gatsby and Gitbook

### Gatsby

[Gatsby](https://www.gatsbyjs.org/) is a modern and blazing-fast static site generator based on React and GraphQL (for pulling data from different sources like headless CMS systems, SaaS services, APIs, databases or the file system etc.)

Gatsby is also a Progressive Web App generator so your static website is a PWA out of the box. You'll have many best practicies of modern web development that make your app the fatest possible such as code splitting, critical CSS and JavaScript and resources prefetching etc.

![Image](https://screenshotscdn.firefoxusercontent.com/images/8f1bc0a9-b908-4bed-83bc-50bcdbbb9af8.png)

To start using Gatsby you'll need to have a development machine with Node and npm installed then run the following command:

Gatsby has many advantages such as:

* cutting-edge technologies
* automatic routing based on your directory structure.
* re-usable components thanks to React
* Webpack-based system
* extensible by plugins
* high and unbeatable speed
* Easy data pulling from sources like CMS systems, APIs, databases, file system and markdown.

For working with Gatsby you'll need to be familiar with React since you use React components to create your pages

## Conclusion

Choosing the right static website generator is an important step if you want to have a good and enjoyable experience managing your website particularly if you are periodically adding or updating content like the case for a blogging platform for example.

Each one of the static generators we mentioned in this article has their strengths and weaknesses so depending on your needs you can choose the right one for generating your website.

Tough if you are just starting with static site generators, Jekyll may be the best option for you since it has a big community and as a result more tutorials.

Each one of the static generators we mentioned in this article has their strengths and weaknesses so depending on your needs you can choose the right one for generating your website.

Tough if you are just starting with static site generators, Jekyll may be the best option for you since it has a big community and as a result more tutorials.
