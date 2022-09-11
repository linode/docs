---
slug: create-react-app-supabase
author:
  name: Linode Community
  email: docs@linode.com
description: "Supabase comes with a rich set of features, including a powerful database and a full REST API. This makes it a strong choice to act as a backend for many applications. Learn more about how to do just that with your own React application in this tutorial."
og_description: "Supabase comes with a rich set of features, including a powerful database and a full REST API. This makes it a strong choice to act as a backend for many applications. Learn more about how to do just that with your own React application in this tutorial."
keywords: ['supabase react example','supabase api','supabase vs firebase']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-11
modified_by:
  name: Nathaniel Stickman
title: "How to Create a React App with a Supabase Backend"
h1_title: "How to Create a React App with a Supabase Backend"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Supabase: Quickstart - React](https://supabase.com/docs/guides/with-react)'
- '[freeCodeCamp: How to Build a TodoApp Using ReactJS, NextJS, and Supabase](https://www.freecodecamp.org/news/how-to-build-a-todoapp-using-react-and-supabase/)'
- '[Adeva: The Complete Tutorial to Building a CRUD App with React.js and Supabase](https://adevait.com/react/building-crud-app-with-react-js-supabase)'
- '[GitHub: tmm/react-supabase](https://github.com/tmm/react-supabase)'
---

Supabase provides a powerful open-source database and REST API. In fact, you can utilize Supabase as a capable backend for your applications. It acts to simplify your database needs and connects your application frontends to a ready API for fetching and modifying your data.

This guide shows you just how to do that, giving you everything you need to make a React application with a Supabase backend. Whatever your needs, this tutorial shows you how to get Supabase and React connected and interacting, letting you focus on building better applications.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Create a Supabase Backend

With relatively little setup, Supabase can provide your with a capable backend. It uses a PostgreSQL database and includes a full REST API to provide thorough data storage and access for your application frontends.

These next sections guide your toward getting your own Supabase instance up and running and configuring it for use with an example React application.

### Setting Up Supabase

You have two options when it comes to setting up your Supabase instance. The first is the cloud-hosted option provided by Supabase. You can navigate to the [project creation](https://app.supabase.com/) page and create an account or sign in. From there, you can select **New Project** to get started.

The other option is self-hosted, and this is the option used in this tutorial. You can learn how to get started with your own self-hosted Supabase instance by following along with our guide on **How to Self-host Supabase with Docker**. Ensure that your self-hosted instance is up and running by executing the following command from its base directory:

    sudo docker compose up -d

Either way, by the end you should have an instance of Supabase ready to house your project.

Be sure to locate your instance's API URL and anon key. You can find these under **Settings** and **API** on a cloud instance. They are stored in the `.env` file for self-hosted instances.

### Populating the Supabase Database

Your Supabase instance provides both a database and a REST API interface for fetching data. For many applications, it can serve as the only backend your application needs.

To get started and demonstrate its usage for this tutorial, you can create a table and some initial data for your Supabase database. These next steps show you how to do that. The example data here gets used later to demonstrate the React portion of the application.

1. Navigate to the Supabase Studio dashboard for your instance, and select the **Default Project** displayed in the page's body.

1. Select the **Table Editor** option from the menu on the left, and click the **Create a new table** button that appears in middle of the page.

1. In the form that displays, give the table a name and columns.

    This tutorial's example application is a shopping list. Thus, here and following the table name used is `shopping_list`, and the table has an `item` column with `text` content and a `checked` column with `bool` content. The `checked` column also has a default value of `false`.

    This is in addition to the default columns, `id` and `created_at`.

    [![The Supabase form for creating a new table](supabase-create-table_small.png)](supabase-create-table.png)

1. You should now be on the page for the table, and can input new rows of data using the **+ Insert row** button.

    Create several entries in this table, entering an `item` value for each. All of the other columns populate automatically.

    [![The Supabase form for inserting a new row](supabase-insert-row_small.png)](supabase-insert-row.png)

    You can also accomplish this using the **SQL Editor** option on the left menu. There, you can use a SQL `insert` statement to add the desired rows, like this:

        insert into shopping_list (item)
        values
          ('Bananas'),
          ('Bread'),
          ('Beans')
        ;

1. In the **Table Editor**, you should now see the rows of data you have entered.

    [![The Supabase table editor listing rows of data](supabase-table-rows_small.png)](supabase-table-rows.png)

## How to Create a React Frontend

With Supabase prepped and populated, you are ready to start building out a React frontend to interface with the backend provided by Supabase.

The React frontend developed here displays a shopping list. It gives the user the option of marking items "Purchased" and allows the user to add more items.

### Setting Up the React Project

These next steps show you how to initialize a React application with NPM and how to add the Supabase client SDK to the project.

1. Follow our tutorial on how to [Install and Use the Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/). The present guide uses NPM to bootstrap a React project, to install the Appwrite web SDK, and to run the React frontend.

1. Create the React project. This example uses `create-react-app` to bootstrap a new React project and names the new project `example-app`. The command results in a directory with that name being created in the current directory.

    For this guide, the new React application's directory is created in the current user's home directory:

        cd ~/
        npx create-react-app example-app

    {{< output >}}
Need to install the following packages:
  create-react-app@5.0.1
Ok to proceed? (y)
    {{< /output >}}

1. Change into the new React application directory. The rest of this tutorial assumes you are still in this directory unless otherwise noted:

        cd example-app

1. Install the Supabase JavaScript SDK via NPM. The React frontend can use this SDK to simplify interfacing with the Supabase API:

        npm install @supabase/supabase-js --save

### Developing the React Frontend

This tutorial's React frontend primarily consists of three JSX files, all stored in the `src` subdirectory in the React project directory. Each of these files serves a particular role, and each is dealt with in its own section below to help break it down.

#### App.js

The new React project comes with an `App.js` file. This file acts as the entry point for your React application, giving the containing structure and importing more specific components.

Remove the existing contents of the file, and give the file the contents shown below. You can also find the full example file [here](example-app-src/App.js).

You can follow along with the in-code comments to see what each part of the code is doing.

{{< file "src/App.js" js >}}
// Import React and the stylesheet.
import React from 'react';
import './App.css';

// Import the component to be used for fetching, updating,
// and displaying the shopping list.
import ShoppingList from './ShoppingList';

// Initialize the application display, giving a
// placeholder for the ShoppingList component.
function App() {
  return (
    <div className="App">
      <ShoppingList />
    </div>
  );
}

export default App;
{{< /file >}}

#### Utils.js

Before diving into the `ShoppingList` component, it is useful to have a tool put together for making the connection to Supabase.

For this purpose, create a new file in the `src` subdirectory, naming the file `utils.js`. Then, give the file the contents you see below. You can find the full example file [here](example-app-src/utils.js).

{{< file "src/utils.js" js >}}
// Import the module for client creation from the Supabase SDK.
import { createClient } from '@supabase/supabase-js'

// Set variables for your Supabase connection. Replace supabaseUrl with the
// API address for your instance, and replace supabaseAnonKey with the anon
// key for your instance.
const supabaseUrl = 'http://192.0.2.0:8000';
const supabaseAnonKey = 'example-supabase-anon-key';

console.log(supabaseUrl);
console.log(supabaseAnonKey);

// Create the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
{{< /file >}}

#### Films.js

Now everything is ready for the `ShoppingList` component. This is where the central logic for this example application resides. It uses the client connection to fetch data from the Supabase instance and then determines how to display that data.

This section walks through the file in parts to make it easier to digest. If you want to see the whole example file, you can find it [here](example-app-src/ShoppingList.js).

- First, you need to import both the React modules the application needs and `utils.js` for the client connection. Then you can start off the `ShoppingList` class with a declaration of the base state and a call to fetch the shopping list when the application loads.

    {{< file "src/ShoppingList.js" js >}}
// Import the React modules for building the component.
import React, { Component } from 'react';

// Import the Supabase client from utils.
import { supabase } from './utils'

class ShoppingList extends Component {
    // Establish the components state variables.
    state = {
        newShoppingItem: '',
        shoppingListItems: []
    }

    // Have the component fetch a fresh shopping list on load.
    componentDidMount() {
        this.fetchShoppingList();
    }
    {{< /file >}}

- The class gets a method to handle fetching the shopping list from Supabase. Notice that the methods used to interact with the Supabase API are modelled on SQL, making the interactions easier to orchestrate and predict.

    {{< file "src/ShoppingList.js" js >}}
    // Retrieve the shopping list items.
    fetchShoppingList = async () => {
        // Clear the list as represented in the state.
        this.setState({
            ...this.state,
            shoppingListItems: []
        });

        // Execute a query via the Supabase client to fetch the shopping list.
        // For this example, the list excludes any items already marked
        // "purchased" (checked = true).
        try {
            let { data, error } = await supabase
                .from('shopping_list')
                .select('*')
                .eq('checked', 'false');

            if (error) { throw error }

            if (data) {
                this.setState({
                    ...this.state,
                    shoppingListItems: data
                });
            }
        } catch (error) {
            alert(error.message);
        }
    }
    {{< /file >}}

- This application provides two means of interacting with the shopping list. First, you can mark items "Purchased" and, second, you can add new items to the list. These next two functions accomplish these tasks.

    {{< file "src/ShoppingList.js" js >}}
    // Mark an item as purchased.
    markItemPurchased = async (itemId, doMarkPurchased) => {
        // Call to the backend to update the item record.
        try {
            let { data, error } = await supabase
                .from('shopping_list')
                .update({ checked: doMarkPurchased })
                .match({ id: itemId });

            if (error) { throw error }

            if (data) {
                console.log(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Add a new item to the shopping list.
    addNewItem = async () => {
        // Have the backend insert a new record with the given item name.
        try {
            let { data, error } = await supabase
                .from('shopping_list')
                .insert({ item: this.state.newItemName });

            if (error) { throw error }

            if (data) {
                console.log(data);

                // Create an updated version of the shopping list, adding the
                // new item to it.
                const updatedShoppingList = this.state.shoppingListItems;
                updatedShoppingList.push(data[0])

                // Update the application state with the updated list.
                this.setState({
                    ...this.state,
                    shoppingListItems: updatedShoppingList
                });
            }
        } catch (error) {
            alert(error.message);
        }
    }
    {{< /file >}}

- Finally, the application needs logic to determine how the shopping list displays. This is broken into two functions here. One, `renderShoppingList`, controls how each element in the list gets rendered. It parses the list. The next, `render`, is a method for React's `Component` module that handles the rendering overall.

    {{< file "src/ShoppingList.js" js >}}
    // Process a shopping and render it to HTML.
    renderShoppingList = (shoppingList) => {
        if (shoppingList.length > 0) {
            return (shoppingList.map((item) => {
                const itemStatusCheckbox = <input type="checkbox" onChange={ (e) => this.markItemPurchased(item.id, e.target.checked) } />
                return (
                    <div className="shoppingListContainer">
                        <strong>{item.item}</strong>
                        {itemStatusCheckbox}
                    </div>
                );
            }))
        } else {
            return (<div><strong>No items!</strong></div>)
        }
    }

    // Render the ShoppingList component display.
    render () {
        return (
            <div>
                <div style={{ display: 'grid', columnGap: '.5em', rowGap: '1em', padding: '3em' }}>
                    <div style={{ gridColumnStart: 1, gridColumnEnd: 2 }}>
                        <h2>Shopping List</h2>
                        <div>{ this.renderShoppingList(this.state.shoppingListItems) }</div>
                    </div>
                </div>
                <div style={{ width: '50%', margin: 'auto' }}>
                    <h2>Add New Item</h2>
                    <div>
                        <input type="text" onChange={ (e) => { this.setState({ ...this.state, newItemName: e.target.value }) } } />
                        <button onClick={this.addNewItem}>Add</button>
                    </div>
                </div>
            </div>
        )
    }
}

// Have the class exported. The export then gets used in App.js.
export default ShoppingList;
    {{< /file >}}

### Deploying the React Application

You are now about ready to run the React application.

First, you need to open port `3000` on your server's firewall. This is the default port used for running the React developer server to see the application in action.

{{< note >}}
The Supabase Studio interface for your instance may already be running on port `3000` by default. If that is the case, NPM prompts you to run React on a different port, which defaults to `3001`. In that case, open `3001` in your firewall instead.

You can make this setting permanent by opening your React project's `package.json` file and adding a `PORT` variable within the `start` script line:

    {{< file "package.json" json >}}
 "scripts": {
     "start": "PORT=3001 react-scripts start",
    {{< /file >}}

{{< /note >}}

- For Debian and Ubuntu, refer to our guide on [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/).

- For AlmaLinux, CentOS, and Fedora, refer to our guide on [Enabling and Configuring FirewallD on CentOS](/docs/guides/introduction-to-firewalld-on-centos/)

Once you have done that, you can start up the React server with the following command:

    npm start

## How to Run React and Supabase
Show the application in action

With both Supabase and your React application running, you should be able to see your shopping list by navigating to port `3000` (or `3001`) on your server's address. Using the IP address used in examples above, this would mean navigating to `http://192.0.2.0:3000`.

![Example shopping list application](example-app.png)

## Conclusion

You have now taken your Supabase instance to the next level. You have started to make use of its rich set of features as a powerful database and backend server for your applications. Of course, this tutorial covers the basis and gets your started — there is plenty more that you can do with Supabase to take your applications to the next level.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.

