```YAML
author:
     name: Pj Metz
     email: metz.pj@gmail.com
description: 'Building a new Twitter bot and hosting it on Linode. Guide is for beginners new to coding and cloud services.'
keywords: ["node.js", "beginner", "javascript", "twitter bot"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-27
modified_by:
	name: Linode
title: 'Node.js Twitter Bot Beginner’s Guide: Replying to Users and Scheduling Tweets'
contributor:
	name: Pj Metz
	link: [Metzinaround.com](https://www.metzinaround.com)
external_resources:
	- "[Creating a new User in Ubuntu 		 (https://youtu.be/fDHHKR0nVQg)"
	- "[FileZilla](https://www.linode.com/docs/guides/filezilla/)
```

#  Node.js Twitter Bot Beginner’s Guide: Replying to Users and Scheduling Tweets

Twitter bots are a great way to practice using an API and developing some coding skills along the way. You can usually get the bot going for under 100 lines of code, so it’s especially good for beginners. In this tutorial, I’ll show you how to use Node.js, *a framework for javascript* and a few npms, or *node package managers* to have your bot tweeting in no time.

## Before you Begin:

You should download or install:
[Visual Studio Code](https://code.visualstudio.com/)
[GitHub desktop](https://desktop.github.com/)

Be ready to visit:
[Twitter](https://twitter.com/home)
[Twitter Developer portal](https://developer.twitter.com/en)
[GitHub](https://github.com/)
[Linode](https://www.linode.com)

You can look at the documentation:
[Node.js](https://nodejs.org/en/)
[Twit](https://www.npmjs.com/package/twit)
[node-schedule](https://www.npmjs.com/package/node-schedule)
[DotEnv](https://www.npmjs.com/package/dotenv)
</br>

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Setting up a Twitter Account

This is where you decide what you want your account to be named and what it will do automatically. This bot will tweet a link to a video game soundtrack once a week (pulled randomly from an array of links) and will respond to a user who asks for a link with a random link from the same array. We’ll call our bot [@SNESSoundtracks.](https://twitter.com/snessoundtracks) Go to Twitter and follow the instructions for making a brand new account for your bot.
</br>

## Twitter Developer Portal

The developer portal is where you register your new account to be able to use the Twitter API. This is an important step because it unlocks the accounts ability to tweet by using the API with code instead of manually tweeting. You know, the whole point of a bot?

Head to the developer [page.](https://developer.twitter.com/en) Once there you’ll see a link near the profile picture on the top right that says “apply.”

Click that, and it’ll take you to a page where you apply to have your Twitter profile become an active developer profile. Follow the instructions on screen until you have an authenticated developer account. Once that’s done, create the app and fill out the descriptions for it. All you have to say is that you’re doing it as a hobby and it’s just for learning to code or practicing a bot. As long as you’re not giving info to the government or really consuming streaming data for analytical purposes, this is all pretty straight forward. When you’ve finished, the developer portal should look like this.

![The Twitter Developer page](https://user-images.githubusercontent.com/65838556/115882571-e00d3900-a41a-11eb-83bc-2811066299f2.png)
</br>

## The Keys and the Code and the Node Package Manager

In the developer portal, there's a a logo that looks like a key. That contains several strings that will allow your twitter bot to connect with the code you're writing. It’s easier to get the keys after you have somewhere to put them. We’re gonna be keeping them in a dotenv file for safekeeping from people who would try to get access to your keys. So let’s get started on the code and come back to the keys.

The easiest way I’ve found to start a new project is to create a new repo on GitHub.com and then pull it locally using GitHub desktop. To do this, start a new repository on github.com and make sure to create a readme, a license for use, and to include a .gitignore file for node.  Then click the **green dropdown menu button labeled "Code"** to the right side of your screen. If you have Github desktop installed, you can click the option to Open with Github Desktop. Then you can choose where to save your repo locally. Now your source control is on your machine and on Github.

![Github.com dashboard showing the green button clicked and how to select "open in Github desktop"](https://user-images.githubusercontent.com/65838556/115883389-ba346400-a41b-11eb-849b-9185748805b3.png)
</br>


Now, we will create some variables for these keys you’ll be copying from the Twitter developer page later. You’ll have four keys you need in order to connect your app to the code you’ve written. Create a file in your project called `.env`. Inside, add four variables: `access_token`, `access_token_secret`, `consumer_secret`, `consumer_key`. The consumer keys will pair with the API keys.

Something important about a dotenv file, you won’t need quotes around the values of your variables, as long as there aren’t spaces. Make sure to write it like this: `consumer_key=whateveryourkeyis`. Your dotenv file is going to be your one source of truth for the keys. The `config.js` file will point to the `.env` values, and because you created a `gitignore`, you won’t upload your keys to GitHub. Head back to the twitter developer page and click the keys, and copy and paste them into the appropriate variables in your `.env` file.

Up next, we’re going to install all the npm packages we need, so enter the following into your terminal in VSCode.

```
"Npm init -y"

"Npm install node"

"Npm install node-schedule"

"Npm install twit"

"Npm install dotenv"
```
</br>
This installs all the dependencies we’ll need to be able to have a functional Twitter bot that can read the API, post on a schedule, use the `.env` file, and use `node.js`. We have one more thing to adjust, and that’s to create some scripts inside the `package.json` file code block. Open it and add the following to the scripts section.

```javascript
	"test": "index.js",
	      "start": "node ./index.js",
	      "develop": "NODE_ENV=develop node index.js"
```
</br>
That `index.js` file doesn’t exist yet, so go ahead and create it and name it whatever you like. I’ll be calling mine `snes.js`. Go ahead and make a `config.js` at the same time and input the following into it.

```javascript
	module.exports = {
	    consumer_key: process.env.consumer_key,
	    consumer_secret: process.env.consumer_secret,
	    access_token: process.env.access_token,
	    access_token_secret: process.env.access_token_secret,
	};
```

After all this, open up `index.js`, or whatever you've named it, and get ready to type some javascript

## Code It Up.

```javascript
	console.log("SNES Soundtracks booting up");

	//making sure npm run develop works
	if (process.env.NODE_ENV === "develop") {
	    require("dotenv").config();
	};

	//rules for node-schedule
	var schedule = require("node-schedule");
	var rule = new schedule.RecurrenceRule();
	  rule.dayOfWeek = 1,
	  rule.hour = 10;
	  rule.tz = "Etc/GMT+4";

	//array to pull soundtracks from
	var soundtrackArray = [ "an array of youtube video URLs"];
	var soundtrackArrayLength = soundtrackArray.length;
	var soundtrackArrayElement = Math.floor(Math.random() * soundtrackArrayLength);

```
</br>

At the beginning, I log a start up message to the console just so I know it’s running. Next is an if statement to use the dotenv when the node environment is ‘develop’, which is handled in the scripts of the json file from earlier. We set up a few variables for the node-schedule so the bot can tweet on a set day and time. I pulled this directly from the docs for node-schedule. Basically, it will tweet every Monday at 10 am Eastern Daylight Savings Time. Finally, I set up an array for the bot to pull from at random with the last three lines of this section. I removed the URLs for the tutorial.

```javascript
	// Create a Twitter object to connect to Twitter API
	var Twit = require('twit');

	// Pulling keys from another file
	var config = require('./config.js');
	// Making a Twit object for connection to the API
	var T = new Twit(config);

	// Setting up a user stream
	var stream = T.stream('statuses/filter', { track: '@SnesSoundtracks' });

	// Now looking for tweet events
	// See: https://dev.Twitter.com/streaming/userstreams
	stream.on('tweet', pressStart);
```
</br>

This is where we start using Twit. We create an object called `Twit` that requires the npm, and then pass a configure that requires the configuration file into the object. We then use new to create `T`, an instance of the object from before. From now on, when we want to use something from Twit, we simply use T.whatever in order to call up the property, field, or method we need from their library. We set up a stream so that we are monitoring specifically @SnesSoundtracks while the code is running. Finally, we create an event listener with `stream.on`, and use a string parameter to name it, and input a function we’ve called, `pressStart`. `pressStart` is defined in the next set of code.


```javascript
	function pressStart(tweet) {

	    var id = tweet.id_str;
	    var text = tweet.text;
	    var name = tweet.user.screen_name;

	    let regex = /(please)/gi;


	    let playerOne = text.match(regex) || [];
	    let playerTwo = playerOne.length > 0;

	    //this helps with errors, so you can see if the regex matched and if playerTwo is true or false
	    console.log(playerOne);
	    console.log(playerTwo);


	    // checks text of tweet for mention of SNESSoundtracks
	    if (text.includes('@SnesSoundtracks') && playerTwo === true) {

	        // Start a reply back to the sender
	        var replyText = ("@" + name + " Here's your soundtrack!" + soundtrackArray[soundtrackArrayElement]);

	        // Post that tweet
	        T.post('statuses/update', { status: replyText, in_reply_to_status_id: id }, gameOver);

	    } else {
	        console.log("uh-uh-uh, they didn't say the magic word.");
	    };

	    function gameOver(err, reply) {
	        if (err) {
	            console.log(err.message);
	            console.log("Game Over");
	        } else {
	            console.log('Tweeted: ' + reply.text);
	        }
	    };
	}
```
</br>

`pressStart` contains a few local variables, a bit of logic, and a final function that must be included in the `T.post` method. You can use an unnamed function there and it will do the same thing, but I went ahead and wrote on separately for readability. Essentially, the function `gameOver` gives us a chance to log an error if it occurs or to log the tweet that was sent out.

`pressStart` takes “tweet” as a parameter. This is the tweet that another user writes that tags SnesSoundtracks. That tweet has tons of data attached to it, data that Twit helps us parse through. The first three variables are the id of the tweet, the text of the tweet, and the username of the person who wrote the tweet. We will need those three in order to respond accurately as a comment to the original tweet by the other user.

Up next is a regex for whatever word you want to activate the bot to reply. I chose “please." As long as the user is polite, they’ll get a random soundtrack.

The regex has “g” and “i” at the end so it ignores capitalization and checks globally for the word please. `playerOne` is a variable that can either be an empty array or will use `.match` to create an array with one element: the word “please”. `playerTwo` is a boolean that verifies whether the array `playerOne` has anything in it.

The if statement requires that the tweet text contains the bot’s name and an array of at least one element was passed into `playerTwo`. If both of these come back as true, then we proceed to an area where the variable `replyText` is created, which includes a random element of the array, as well as the username of the person being replied to and a short message. `replyText` is passed into an object that contains two properties: `status` and `in_reply_to_status_id`. `status` is the actual text to be posted to the tweet, in our case the variable `replyText` is our status. `In_reply_to_status_id` is defined as `id`, which is a variable from the beginning of the `pressStart` function. `id` is a unique identifier of a tweet from Twitter’s API. This allows Twit to identify which tweet the bot will reply to as a comment. Finally, the else statement at the end will log a quote from Jurassic Park to the console if the user doesn’t say please, just so we can see why the bot didn't tweet back.

```javascript
	function pressSelect() {

	    var weeklyReplyText = soundtrackArray[soundtrackArrayElement] + " Here's your soundtrack for the week!";
	    T.post('statuses/update', { status: weeklyReplyText }, gameOver2);

	    function gameOver2(err, reply) {
	        if (err) {
	            console.log(err.message);
	            console.log("Game Over");
	        } else {
	            console.log('Tweeted: ' + reply.text);
	        }
	    }
	}

	 const job1 = schedule.scheduleJob(rule, pressSelect);

	 job1.on("Every Day Tweet", pressSelect);
```
</br>

Here is the function used to tweet on a schedule, which I’ve named `pressSelect`. `pressSelect` has the `replyText` variable, slightly changed to be an original tweet rather than a comment on a different tweet, but pulls from the same array. The `gameOver` function is also present, though renamed just to be safe. Since `gameOver` and `gameOver2` are local variables within their respective functions, there shouldn’t be any issues. However, I'm just being safe.

The final part of this code is creating a variable called `job1`. `job1` is the `scheduleJob` method from the node-schedule object at the top of the code. I pass in `rule` created earlier in the code and `pressSelect` as parameters. We then use an event listener with `pressSelect` passed in again. That's it for the code.

## Running the Code

To test your code and ensure it works, type `npm run develop` into the terminal. If you get a Twit error about consumer keys, ensure there are no spaces between the variable, equals sign, and key itself in your .env file. If the error persists, you may have copied your keys wrong. You can always generate them again and copy them directly into the .env file. If you’d like to test `pressSelect` on its own and make sure it works, you can just comment out the last two lines of the code and call `pressSelect ` directly. Under the commented out code, just type

```

	pressSelect();

```
and the function will run. This way, you don’t have to wait for whatever day and hour you scheduled node-schedule for.

Once the bot is running, if you want to test the way it responds to other users, log in to another Twitter account and tweet at your bot. You should be able to see some action in the terminal that tells you it’s working, followed by the response on Twitter.

## Hosting Your Code

You could certainly let this code run for a long while from your local machine, but it’d be better if you had it hosted somewhere else. One great option is Linode.

After signing up for a Linode account, the home page will look like this.

![Linode home screen](https://lh3.googleusercontent.com/JFNpdFMCe9A37beAwtxazN-zqcSr88Ff457bnQhbQpkQJILfqAv7g0bR_CQ6SxMu8EfKgIcaqTGuZvPTTI2hOb6dYyi3CyLMubEKOwFEZMkCaByjpk83L2o0c4W8GTwE4VPSodE-)
</br>

Create a Linode, and pick Ubuntu 20.14 from the first dropdown menu. Select the region closest to you and then choose Nanode, the smallest option. It’s only $5 a month and has more than enough space and RAM for your Twitter bot and any other projects you’d want on it. When it asks for an Ubuntu label, name it after your project. Create a root password and click create. Make sure to remember the root password as you’ll have to use it every time to get into the Linode.

Once it boots up it’s time to get inside and clean up a bit.

## Installing, Updating, and Preparing for the bot.

Linode provides a LISH console to use to access your Linode. On the top right of the Linode homepage, you’ll see a link for “Launch LISH Console.”

![The homepage for an active Linode](https://lh3.googleusercontent.com/JFNpdFMCe9A37beAwtxazN-zqcSr88Ff457bnQhbQpkQJILfqAv7g0bR_CQ6SxMu8EfKgIcaqTGuZvPTTI2hOb6dYyi3CyLMubEKOwFEZMkCaByjpk83L2o0c4W8GTwE4VPSodE-)
</br>

Click that and you have access to the Ubuntu instance you just created. You can also SSH into it from any terminal using the SSH access text just below the LISH.

Once you’re in, you should run `apt update` to check for updates available, and then `apt dist-upgrade.` It's recommended to make a new username for Linux so you're not running everything through the root, but in this case, all you're doing is a Twitter bot, so it's not hugely important. If you'd like to do it the right way, you can run make a new user and give it admin rights by following this [video.](https://youtu.be/fDHHKR0nVQg)


If your code is on Github, you can use git to clone your file, or you can use the GUI interface of [Filezilla](https://www.linode.com/docs/guides/filezilla/) to transfer your code to the Linux instance. Since this is a beginner tutorial, let’s use Filezilla to transfer our files.


## Using Filezilla

Here's how Filezilla looks once you open it.

![The opening screen of Filezilla](https://lh5.googleusercontent.com/Wl8STNGN-_2A-4jBHrTZS0evnCwnt_Ts_vuSqFl9NTfzhG2pGHpZb9rvjpcL80QXLZ1NeKz5xzE2XzepPWU6LXZ2-VVnbeYpJ7GvXyP6xfoSgiT3EROD2Wogm3NEcWfheHnYDAop)
</br>

Inside Filezilla, you can see input fields for `Host`, `Username`, `Password`, and `Port`. `Host` is the IP Address for your nanode, `username` should be `root` or whatever username you set up earlier, and `password` is what you set at the beginning. Use `22` as the port number. Upon connecting, you’ll get a message saying the key is unknown. This is normal, but you should double-check that the IP Address is correct. If it is, check the box to remember your Linode on Filezilla.

Go to the directory where you’re keeping the files for your Twitter bot. You’ll need the `.env`, `config.js`, the `package.json`, `package-lock.json`, the `node_modules` folder, and the index file for your bot. Reminder, my index file is called `snes.js`. The files I’m moving over are highlighted in the following picture.

![An image of the file directory containing the files for a twitter bot. .env, config.js, snes.js, and package.json are highlighted](https://lh4.googleusercontent.com/LiCT5nHxonGW71MJ2tbk_FScrHkkhIPuyBDLq74jxtfeW5YE9yGk-dBlAvlSvQaeBC5NPpiWv-VyV4YCFbrQEZHRcHatviZSuplcSOwfHj84yRMNmZXwc96OlCXK_B9MSqtFkgp7)
</br>

Once you highlight the files you want to transfer, you can click and drag your files to the right where you can see your Linux machine's files. Once you’ve transferred the files, you can use the LISH console or any terminal with an SSH connection to run your bot the same way you would from a terminal in Visual Studio Code. Type `npm run develop` and your code will start up using the .env variables you set up earlier. This makes the bot run and it will continue running on the server as long as the server remains uninterrupted.