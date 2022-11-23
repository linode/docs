---
slug: how-to-create-a-next-js-with-a-supabase-backend
author:
  name: Linode Community
  email: docs@linode.com
description: "Supabase gives you an effective Firebase alternative based on PostgresSQL, and includes a ready interface for user authentication and a REST API. This makes Supabase an outstanding backend, and pairs it well with frontend technologies like Next.js. Next.js itself pushes the offerings of React with the addition of server-side and static pre-rendering. Learn in this tutorial how you can get started using these two tools together."
keywords: ['supabase nextjs example','supabase nextjs typescript','supabase next js api']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-13
modified_by:
  name: Nathaniel Stickman
title: "How to Create a Next.js App with a Supabase Backend"
h1_title: "Creating a Next.js App with a Supabase Backend"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Supabase: Quickstart - Next.js](https://supabase.com/docs/guides/with-nextjs)'
- '[freeCodeCamp: Full Stack Development with Next.js and Supabase – The Complete Guide](https://www.freecodecamp.org/news/the-complete-guide-to-full-stack-development-with-supabas/)'
- '[LogRocket: Build a Full-stack App with Next.js and Supabase](https://blog.logrocket.com/build-full-stack-app-next-js-supabase/)'
---

Supabase offers an open-source database solution and comes complete with a REST API for accessing data. This makes Supabase more than just an outstanding database. It can function as a complete backend for many applications. Supabase abstracts API development and gives your application's frontend access to the data it needs.

Next.js, for its part, provides a framework for advanced yet streamlined frontend development. Next.js is based on React and includes an array of its features. But Next.js also features server-side rendering and static pre-rendering, giving your frontend applications additional capabilities and advantages.

This guide covers everything you need to get started using these two tools together. Learn what you need to have your Supabase instance provide its REST API services to a simple Next.js frontend. By the end of this guide, you have a complete demonstration of how you can create a full-stack application.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

            sudo dnf upgrade

{{< note >}}
The steps written in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Create a Supabase Backend

With a relatively little setup, Supabase can provide you with a capable backend. It uses a PostgreSQL database and includes a full REST API to provide thorough data storage and access for your application's front end.

These next sections guide you through getting your Supabase instance set up and running and through configuring it for use with a front-end application.

### Set Up Supabase

You have two options when it comes to setting up your Supabase instance. The first is the cloud-hosted option provided by Supabase. You can navigate to the [Supabase](https://app.supabase.com/) page and create an account or sign in. From there, you can select **New Project** to get started.

The other option is self-hosted. You can learn how to get started with your own self-hosted Supabase instance by following along with our guide on **How to Self-host Supabase with Docker**. Ensure that your self-hosted instance is up and running by executing the following command from its base directory:

    sudo docker compose up -d

This guide assumes that you have followed the guide above to set up your own self-hosted Supabase instance. The only difference is that this guide assumes you have used the default ports for your instance. That means port `3000` for the studio interface and port `8000` for the external API.

Before moving on, be sure to locate your instance's API `URL` and `anon` key. You can find these under **Settings** and **API** on a cloud instance. They are stored in the `.env` file for self-hosted instances.

### Populate the Supabase Database

To help with this guide's demonstration, you need to create a table and some initial data in your Supabase database. These next steps show you how to do that.

1. Navigate to the Supabase Studio dashboard for your instance, and select the **Default Project** displayed in the page's body.

    Assuming your server address is `192.0.2.0` and that the studio is on the default port, you should be able to reach it by navigating to `http://192.0.2.0:3000` in a browser.

1. Select the **Table Editor** option from the menu on the left, and click the **Create a new table** button that appears in the middle of the page.

1. In the form that displays, give the table a name and columns.

   {{< note >}}
   This guide uses a "shopping list" as an example application that can add new items and mark existing items as "Purchased".
   {{< /note >}}

    Consider the table named `shopping_list` with the default columns, `id` and `created_at`. Additionally, the table has an `item` column with `text` content and a `checked` column with `bool` content. The `checked` column also has a default value of `false`.

    [![The Supabase form for creating a new table](supabase-create-table_small.png)](supabase-create-table.png)

1. You should now be on the **Table Editor** page for the table and can input new rows of data using the **+ Insert row** button.

    Create several entries in this table, entering an `item` value for each. All of the other columns populate automatically.

    [![The Supabase form for inserting a new row](supabase-insert-row_small.png)](supabase-insert-row.png)

    You can also accomplish this using the **SQL Editor** option on the left menu. There, you can use a SQL `insert` statement to add the desired rows as shown below:

        insert into shopping_list (item)
        values
          ('Bananas'),
          ('Bread'),
          ('Beans')
        ;

1. In the **Table Editor**, you should now see the rows of data you have entered.

    [![The Supabase table editor listing rows of data](supabase-table-rows_small.png)](supabase-table-rows.png)

## How to Create a Next.js Frontend

With Supabase prepped and populated, you are ready to start building out a Next.js frontend to interface with the backend provided by Supabase.


### Set Up the Next.js Project

The steps below show you how to initialize a Next.js application with NPM and how to add the Supabase client SDK to the project.

This guide uses JavaScript code for the Next.js application. However, you can configure Next.js for TypeScript. With that configuration, all of your Next.js applications can be managed using TypeScript code instead of JavaScript.

You can learn more about setting up a Next.js project with TypeScript in our **Building a Next.js App with TypeScript** guide.

1. Follow our guide on how to [Install and Use the Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/). NPM handles the project's dependencies and runs the Next.js front end. It also includes `npx`, which the next step uses to bootstrap a Next.js project template.

1. Create the Next.js project using the command, `create-next-app` to bootstrap a template application. This example names the new project `example-app`.

    The commands below result in a directory with the new project's name being created. In this case, it is the current user's home directory:

        cd ~/
        npx create-next-app example-app

    {{< output >}}
Need to install the following packages:
  create-next-app@12.3.0
Ok to proceed? (y)
    {{< /output >}}

1. Change into the project's directory.

        cd example-app

   {{< note >}}
   The steps in this guide assume that you remain in the project directory, `example-app` unless otherwise noted.
   {{< /note >}}

1. Install the Supabase JavaScript SDK via NPM. The front-end uses this SDK to simplify interfacing with the Supabase API.

        npm install @supabase/supabase-js --save

### Develop the Next.js Frontend

The example Next.js project used in this guide is built around three files. It edits the existing `index.js` file, used as an entry point for most Next.js projects. The project adds two new files to this. One is for handling connections to the Supabase instance. The other is for the logic and rendering of the shopping list itself.

These next sections take a look at each of these files, walking you through how to put them together. Following along, you can see how everything comes together to bring the application to life.

#### Index.js

Typically, Next.js projects use the `pages/index.js` file as an entry point, acting as the center of your application's look and feel. The file may not contain much, but it calls out to other components and brings everything together.

The template created above includes a default `pages/index.js` file. Open that file, and modify its existing contents to the contents shown below. You can also find the full example file [here](example-app-src/pages/index.js).

Follow along with the in-code comments, here and throughout the next few sections, to get explanations of what each part of the Next.js code is doing.

{{< file "pages/index.js" js >}}
// Import the head element and the default styles module. Edit this CSS file,
// or use a new one, to define your own application styles.
import Head from 'next/head'
import styles from '../styles/Home.module.css'

// Import a component to handle the shopping list logic and rendering.
import ShoppingList from '../components/ShoppingList.js'

// Define the layout of the page. Most of the actual content for this
// example gets processed in the ShoppingList component.
export default function Home() {
  return (
    <div className={styles.container}>
        <Head>
            <title>Example Next.js App</title>
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>Shopping List</h1>
            <ShoppingList />
        </main>
    </div>
  )
}
{{< /file >}}

#### SupabaseConnection.js

Before taking up the logic for displaying the shopping list, the following file supplies a simple and reusable interface to the Supabase backend.

Add a new `utils` subdirectory to your Next.js project, and create a file named `supabaseConnection.js`. Give that file the contents shown below. You can find the full example file [here](example-app-src/utils/supabaseConnection.js).

{{< file "utils/supabaseConnection.js" js >}}
// Import the module for client creation from the Supabase SDK.
import { createClient } from '@supabase/supabase-js'

// Set variables for your Supabase connection. Replace supabaseUrl with the
// API address for your instance, and replace supabaseAnonKey with the anon
// key for your instance.
const supabaseUrl = 'http://192.0.2.0:8000';
const supabaseAnonKey = 'example-supabase-anon-key';

// Create and export the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
{{< /file >}}

#### ShoppingList.js

To handle the logic for processing and rendering the shopping list, you can create a `ShoppingList` component. Recall that the `index.js` file includes a tag for this component. The component itself handles all of the logic for the shopping list, making your application much more adaptable and expandable.

Add another subdirectory to the project, `components`, and add a file to it named `ShoppingList.js`. Then give that file the contents shown in each of the code blocks following. Because this file is more extensive and complicated than the other two, this section breaks it down into parts. However, you can see the whole file [here](example-app-src/components/ShoppingList.js).

- The component first needs to import the necessary modules and set up its state variables. The component also uses the `useEffect` function to call for a fresh shopping list when the component loads.

    {{< file "components/ShoppingList.js" js >}}
// Import the React modules for using state and effect.
import { useState, useEffect } from 'react'

// Import the default styles module. Edit this CSS file, or use a new one, to
// define your own application styles.
import styles from '../styles/Home.module.css'

// Import the Supabase client from utils.
import { supabase } from '../utils/supabaseConnection';

export default function ShoppingList() {
    // Establish the state variables.
    const [newShoppingItem, setNewShoppingItem] = useState('');
    const [shoppingListItems, setShoppingListItems] = useState([]);

    // Have the app fetch the shopping list on load.
    useEffect(() => {
        fetchShoppingList()
    }, [])
    {{< /file >}}

- The component needs three actions: fetching the shopping list, marking an item on the list "Purchased," and adding an item to the list. For each, the component gets a function.

    {{< file "components/ShoppingList.js" js >}}
    // Retrieve the shopping list items.
    const fetchShoppingList = async () => {
        // Clear the shopping list first.
        setShoppingListItems([]);

        // Execute a Supabase query to fetch the shopping list.
        try {
            // Select all items that have not been marked purchased.
            let { data, error } = await supabase
                .from('shopping_list')
                .select('*')
                .eq('checked', 'false');

            // Handle any errors.
            if (error) { throw error }

            // Upon a successful response, update the shopping list.
            if (data) {
                setShoppingListItems(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Mark an item as purchased.
    const markItemPurchased = async (itemId, doMarkPurchased) => {
        try {
            // Update the record with the appropriate item ID.
            let { data, error } = await supabase
                .from('shopping_list')
                .update({ checked: doMarkPurchased })
                .match({ id: itemId });

            // Handle any errors.
            if (error) { throw error }

            if (data) {
                console.log(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Add a new item to the shopping list.
    const addNewShoppingItem = async () => {
        try {
            // Insert the new item, providing the item name. The rest gets
            // filled in automatically.
            let { data, error } = await supabase
                .from('shopping_list')
                .insert({ item: newShoppingItem });

            // Handle any errors.
            if (error) { throw error }

            // Upon success, update the shopping list.
            if (data) {
                console.log(data);

                fetchShoppingList();
            }
        } catch (error) {
            alert(error.message);
        }
    }
    {{< /file >}}

- Finally, the component needs logic to render the shopping list. It first parses each list item to give it an HTML display, and it then defines the entire display for the component itself.

    {{< file "components/ShoppingList.js" js >}}
    // Process the shopping list and render the HTML for each item.
    const renderShoppingList = (shoppingList) => {
        if (shoppingList.length > 0) {
            return (shoppingList.map((item) => {
                const itemStatusCheckbox = <input type="checkbox" onChange={ (e) => markItemPurchased(item.id, e.target.checked) } />
                return (
                    <div key={"item-" + item.id} className={styles.card}>
                        <strong>{item.item}</strong>
                        {itemStatusCheckbox}
                    </div>
                );
            }))
        } else {
            return (
                <div className={styles.card}>
                    <strong>No items!</strong>
                </div>
            );
        }
    }

    // Render the ShoppingList component display.
    return (
        <div className={styles.grid}>
            <div>
                {renderShoppingList(shoppingListItems)}
            </div>
            <div>
                <div className={styles.card}>
                    <h2>Add New Item</h2>
                    <p>
                        <input type="text" onChange={ (e) => { setNewShoppingItem(e.target.value) } } />
                        <button onClick={addNewShoppingItem}>Add</button>
                    </p>
                </div>
            </div>
        </div>
    )
}
    {{< /file >}}

### Deploy the Next.js Application

To start up your Next.js front end, you should first specify what port you want it to run on. By default, Next.js runs on port `3000`, but that may be where your Supabase Studio interface is running.

- Open the `package.json` file for your Next.js project, and locate the `scripts` section.

- Modify the `dev` and `start` items with the `-p` option followed by the port you want your application to run on. For this example, the application is set up to run on port `8080`:

    {{< file "package.json" json >}}
// [...]
  "scripts": {
    "dev": "next dev -p 8080",
    "build": "next build",
    "start": "next start -p 8080",
    "lint": "next lint"
  },
// [...]
    {{< /file >}}

- Open the chosen port on your system's firewall to be able to access the application remotely.

    - For **Debian** and **Ubuntu**, refer to our guide on [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/).

    - For **AlmaLinux**, *CentOS*, and **Fedora**, refer to our guide on [Enabling and Configuring FirewallD on CentOS](/docs/guides/introduction-to-firewalld-on-centos/)

Once you have the port set up, you can start up the Next.js development server with the following command:

    npm run dev

Both Supabase and Next.js should now be running.

## How to Run Next.js and Supabase

Using the example IP address and the port configured above, you can access the shopping list application by navigating to the Next.js application address: `http://192.0.2.0:3000`.

![Example shopping list application](example-app.png)

## Conclusion

Congratulations on getting together a Next.js application fully equipped with a Supabase backend. This is just the start of what all these rich tools have to offer. But with this start, you have what you need to put them into practice.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.

