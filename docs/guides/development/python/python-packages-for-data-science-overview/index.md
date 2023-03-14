---
slug: python-packages-for-data-science-overview
description: This guide outlines some of the top Python packages for data science, including Pandas, NumPy, and Matplotlib.
keywords: ['python libraries for data science']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-11
modified_by:
  name: Linode
title: "An Overview of Python Packages for Data Science"
authors: ["John Mueller"]
---

Python is one of the most popular programming languages in the world because it provides a vast array of packages, it’s easy to learn, and it’s incredibly flexible. The data science community has adopted Python as one of its go-to programming languages, because of the many packages that help analyze and visualize large datasets. This guide discusses the strengths and use cases for the top five Python data science packages.

## NumPy

Numerical Python, [NumPy](https://numpy.org/), provides you with advanced numerical processing capabilities using a powerful [N-dimensional array object](https://numpy.org/doc/stable/reference/arrays.ndarray.html). Given that data science relies heavily on matrices, which fit well into n-dimensional arrays, this feature alone should attract the data scientist’s attention. A few of the advanced math capabilities include: linear algebra, Fourier transformations, and random number capabilities. The NumPy arrays are quite powerful, also extremely easy to use, and they form the basis for almost everything a data scientist can do with  NumPy.

NumPy excels in reducing the amount of coding that a developer has to perform. You can find almost any sort of numerical processing you might need and the [API](https://numpy.org/doc/stable/reference/index.html) is only a starting point for a much longer adventure into the world of what’s possible for your use case. You get all of this functionality in an open source package. This particular package is so popular that many Python installers include it as an installed item by default. NumPy is also used as the base libraries for many other libraries such as these:

- SciPy
- Scikit-learn
- Matplotlib

NumPy makes executing code fast because it relies heavily on vectorization. The dense packing of data used by NumPy saves memory, but it also causes code to execute between 5 and 100 times faster than native Python, which is a significant advantage when you’re processing huge amounts of data. NumPy provides full access to C, C++, and Fortran code, so it can provide a speed boost, as well as interoperability, (since these other languages execute much faster than Python does).

NumPy’s main failing is that it’s a low-level package. That’s why so many people are building higher-level packages on top of it. Sometimes you have to think a bit before you can work out precisely how to do something in NumPy that might be perfectly obvious in SciPy or Scikit-learn. You definitely don’t want to try to create graphical output using NumPy—Matplotlib is the tool to use in this case.

## SciPy

Scientific Python, [SciPy](https://www.scipy.org/), is built upon a NumPy base. It acts as the hub of an ecosystem of open source packages devoted to mathematics, science, and engineering that includes:

- SciPy library
- Matplotlib
- Pandas
- SymPy
- IPython

Looking at the [documentation](https://www.scipy.org/docs.html), what you see at the outset are links for the various supported products that are all part of the SciPy stack. What SciPy does is act as a coordinator to ensure that the various packages work together so you don’t end up fighting with inter-version differences, rather than getting real work done. What’s important to note is that the service provided at one level is coordination, but you can access all of the other packages separately. The only package unique to SciPy is the SciPy library.

The [SciPy library](https://docs.scipy.org/doc/scipy/reference/) provides you with access to easier to use versions of some of the classes you find in other packages such as NumPy. It’s designed to augment other packages, such as Pandas and provide input for yet other packages like Matplotlib. What you receive is a group of functions in these categories:

- Integration (`scipy.integrate`)
- Optimization (`scipy.optimize`)
- Interpolation (`scipy.interpolate`)
- Fourier Transforms (`scipy.fft`)
- Signal Processing (`scipy.signal`)
- Linear Algebra (`scipy.linalg`)
- Compressed Sparse Graph Routines (`scipy.sparse.csgraph`)
- Spatial data structures and algorithms (`scipy.spatial`)
- Statistics (`scipy.stats`)
- Multidimensional image processing (`scipy.ndimage`)
- File IO (`scipy.io`)

The main issue with having a single coordinator for everything is that it becomes somewhat cumbersome to manage and load times can be high. Also, you lose sight of the low-level details and start to wonder just what is going on under the hood. There are times when the package can be a little counterintuitive and confusing, such as the [Sparse eigenvalue](https://docs.scipy.org/doc/scipy/reference/tutorial/arpack.html) support, which requires the [ARnoldi PACKage (ARPACK)](https://people.sc.fsu.edu/~jburkardt/f_src/arpack/arpack.html) FORTRAN package and FORTAN knowledge.

## Pandas

[Pandas](https://pandas.pydata.org/) is the package you want if you’re working with data of any kind because it excels at interacting with files of all sorts, and helps you clean and transform the data you retrieve. When you look at the [documentation](https://pandas.pydata.org/docs/reference/index.html), the first thing you see is an impressive list of file types that Pandas supports. Followed by that is a list of top-level methods for dealing with issues such as data *missingness* and data transformations. You can use data transformations so that your data appears in the form needed to make it work with your other data and to perform analysis.

There are currently 35 data-offset functions, such functions that deal with things like calculating quarters of a year, along with the usual date and time functions. Something that is missing from most packages is the ability to [calculate the business month](https://pandas.pydata.org/docs/reference/offset_frequency.html#businessmonthbegin) and if you have a [custom business month](https://pandas.pydata.org/docs/reference/offset_frequency.html#custombusinessmonthbegin), Pandas has you covered in this regard.

The Pandas plotting functions are unique. You won’t find a pie chart here, or a line graph either. There are plotting techniques such as the [lag plots](https://pandas.pydata.org/docs/reference/api/pandas.plotting.lag_plot.html) used for time series analysis and [box plots](https://pandas.pydata.org/docs/reference/api/pandas.plotting.boxplot.html) commonly used for anomaly detection. There are also oddities such as [Andrews curves](https://pandas.pydata.org/docs/reference/api/pandas.plotting.andrews_curves.html), which are used for [visualizing clusters of multivariate data](https://glowingpython.blogspot.com/2014/10/andrews-curves.html).

The pros and cons of Pandas come from the same source—it’s a specialized package that most people will need at some point, but the lack of generalization means that you always combine Pandas with another package. It’s literally not a standalone package, which is by design. Think of Pandas as that unique tool in your toolbox that you may not break out every day, but you really need it when it is required.

## Scikit-learn

When you go to the [Scikit-learn site](https://scikit-learn.org/stable/), the first thing that you see is a bunch of graphics showing different methods of modeling data. This product is designed to work with SciPy and NumPy to help data scientists model data with a lot less effort. You can easily perform modeling at these levels:

- Clustering
- Classification
- Regression
- Model selection

In addition, Scikit-learn excels at [dimensionality reduction](https://scikit-learn.org/stable/modules/decomposition.html#decompositions) and [preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html#preprocessing), which are requirements when working with complex data. Whereas Pandas helps you shape and transform the data, Scikit-learn is more adept at helping you manipulate the data to obtain the result you need. Consequently, the two packages do have some overlap, but they’re more complimentary than anything else.

The one thing you don’t see immediately is that Scikit-learn provides access to a wealth of [toy datasets](https://scikit-learn.org/stable/modules/classes.html#module-sklearn.datasets) that allow you to test your model quickly using standardized data. In fact, you sometimes see Scikit-learn used in examples exclusively for the datasets it provides. The datasets are so well known that you’re likely to see them just about everywhere. The datasets functionality also includes a list of generators to use to create custom data for testing with little effort.

As with Pandas, Scikit-learn is one of those specialized tools that you put in your toolbox knowing that you won’t need its full functionality every day, but you will need it when the time comes. Unlike Pandas, Scikit-learn provides you with access to standardized datasets that you could use in every project you create as a starting point to see how well a model will work. Because the datasets are so well known, you can compare your results with the results that other people have obtained to know whether a solution you create actually is an improvement over what’s available.

## Matplotlib

[Matplotlib](https://matplotlib.org/) is a general-purpose package for creating plots of all sorts. You find all of the standard plots here: bar, line, pie, and so on. You can browse the large number of available plot types in [Matplotlib’s official documentation](https://matplotlib.org/stable/gallery/index.html). Most people won’t even recognize all of the plot names because there are so many and some of them are specialized. You can display your data in an amazing assortment of ways, including both plots and subplots. If you want to display a 9 x 9 matrix of plots for various dataset features,Matplotlib is the package you need. You have access to every aspect of the plot and can even do things like making [temperature colormaps](https://matplotlib.org/stable/tutorials/colors/colormaps.html).

Sometimes you’ll use other packages in place of, or in combination with, Matplotlib because Matplotlib doesn't quite provide the required support. For instance, if you want to calculate a [Cook’s Distance](https://www.statisticshowto.com/cooks-distance/) for anomaly detection in a dataset, then what you need is [Yellowbrick](https://www.scikit-yb.org/en/latest/api/regressor/influence.html), which is part of Scikit-learn. As another example, you might want to calculate [Z-Scores](https://www.statisticshowto.com/probability-and-statistics/z-score/) for your data and then display them graphically. In this case, [Seaborn](https://seaborn.pydata.org/) is actually a better way to perform the task because it provides the [`displot()` method](https://seaborn.pydata.org/generated/seaborn.displot.html#seaborn.displot) and shows both a histogram and a [Kernel Density Estimate (KDE)](https://jakevdp.github.io/PythonDataScienceHandbook/05.13-kernel-density-estimation.html) plot with a single call. In this second case, it’s not uncommon to see Seaborn used to display the data and Matplotlib used to manage the plots, so it’s a team effort. These sorts of instances are the exception, rather than the rule, because Matplotlib, for the most part, is a complete package.

You can’t use Matplotlib alone. You need to combine Matplotlib with other packages to do things like extract the data, clean it, and then condition it as needed. Your work with Matplotlib represents a last step in a longer process.

## Conclusion

In some respects, Python is a “build your own” language. You can find packages to address just about any need and these packages extend Python in various ways. In fact, the hard part of the process is often finding just the right package to do what you need with the least amount of effort. If you have these packages installed on your computer, you already have at least 90 percent of what you need to create truly amazing applications with Python. It then comes down to finding the one or two packages you need to perform very specialized tasks, when they do occur, in your application. You can use sources like Python Package Index ([PyPI](https://pypi.org/)) to locate these packages, but it’s often easier to find what you need by looking at examples online. When you find an article or conversation that contains an example of what you need,even if it isn’t a complete example, the libraries you see used, in addition to those described in this guide will usually give you a great starting point to create your application quickly, easily, and with few bugs.