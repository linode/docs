---
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this Guide You will learn how to build a Video streaming app using React and Nodejs'
og_description:  We'll build the server side of our application with *node.js* that will handle fetching and streaming videos, generating thumbnails as well as serving captions/subtitles for videos.'
keywords: ['React','Nodejs','Video streaming','app']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-19
modified_by:
  name: Linode
title: "Index"
h1_title: "Building a Video Streaming Application with React and Node"
contributor:
  name: Deven Rathore
  link: https://codesource.io/
external_resources:
- '[Video Stream With Node.js and HTML5](https://medium.com/better-programming/video-stream-with-node-js-and-html5-320b3191a6b6)'
- '[Adding captions and subtitles to HTML5 video](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video)'
---



## Introduction

Building a video streaming application might seem daunting at first but it's quite easy to do. For the next sections of this article, we'll get into the details of how this can be achieved.

 We'll build the server side of our application with *node.js* that will handle fetching and streaming videos, generating thumbnails as well as serving captions/subtitles for videos. Once done, we'll create our client application in *React* that will consume the videos on our server.


## Before you Begin

For this tutorial, you’ll need:

- A basic understanding on HTML, CSS, JavaScript, Node/express, and React
- A text editor (like VS Code or Atom)
- Web browser (Chrome, Firefox)
- [ffmpeg](https://www.ffmpeg.org/)
- [Node.js](https://nodejs.org/en/)
- [Project source code](https://github.com/Dunebook/Videostreaming-app)


## Video Streams

Videos work with streams. This means that instead of sending the whole video at once, a video is sent as a set of smaller chunks which make up the full video. This explains why if you are on a slow broadband and watching a video, it buffers because it plays the chunk it has received and tries to load more.

With this in mind, we can proceed to build our application. Let's start with the server that will power the application.


## Setting Up the Server

To get started, we create a new directory for our application. You can do this from the terminal or a GUI interface.

{{< highlight bash >}}
    mkdir react-node-video-streaming
{{< / highlight >}}


We'll build the *server* with node.js and the *client* with React. Inside our project directory, create folders for both.

{{< highlight bash >}}
    cd react-node-video-streaming
    mkdir server
    mkdir client
{{< / highlight >}}

Next, let's setup the server.

{{< highlight bash >}}
    cd server
    npm init
{{< / highlight >}}

Follow the prompts from `npm init` which would create a `package.json` file in the directory. Once done, install the packages the server will need.
{{< highlight bash >}}

    npm install --save nodemon express cors

{{< / highlight >}}
`nodemon` automatically restarts our server when we make changes while `express` gives us a nice interface to handle routes. `cors` will allow us to make cross-origin requests since our client and server will be running on different pots.

We can start writing code for our server. Create a new file in the root of the `server` directory `app.js` and add the following.


{{< highlight js >}}
    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    
    const app = express();

{{< / highlight >}}

This just imports the packages we'll be using . `fs` module makes it easy to read/write to files on the server.

For now, we'll create a single route which when requested will send a video back to the client.

{{< highlight js >}}
    app.get('/video', function(req, res) {
      res.sendFile('assets/sample.mp4', { root: __dirname });
    }
    {{< / highlight >}}

This routes simply serves a video file when requested. Of course, for this to work, the file has to exist. Create a folder `assets` and inside it, add any random video and call it `sample.mp4`.

Finally,

{{< highlight js >}}
    app.listen(4000, function () {
      console.log('Listening on port 4000!')
    });
     {{< / highlight >}}

Sets up the server to listen on port 4000.

At the moment the server is not running yet so let's work on that. In `package.json`, add this to the `scripts` section:

    {{< highlight js >}}
    {
      ...
      "dev": "nodemon app.js"
    }
    {{< / highlight >}}

Then from your terminal, run:

{{< highlight bash >}}
    npm run dev
{{< / highlight >}}

If you see the message `Listening on port 4000!` in the terminal, then the server is working correctly. Navigate to [http://localhost:4000/video](http://localhost:4000/video) in your browser and you should see the video playing.


## Scaffolding the Frontend with React

Open a second terminal in the `client` directory. Initialize a React project here like so:

{{< highlight bash >}}
    npx create-react-app .
{{< / highlight >}}

This would generate our application shell using `create-react-app` and install the packages required by React. `.` means all this setup happens in the current directory (client).

Once it is done, open `src/App.js` and replace the contents with:

{{< highlight js >}}
    import React from 'react';
    import './App.css';
    function App() {
      return (
        <div className="App">
          <header className="App-header">
            <video controls muted>
              <source src="http://localhost:4000/video" type="video/mp4"></source>
            </video>
          </header>
        </div>
      );
    }
    export default App;
    {{< / highlight >}}

Save it and in your terminal, run

{{< highlight bash >}}
    yarn start
{{< / highlight >}}

Or if you prefer to use `npm`, run:

{{< highlight bash >}}
    npm start
{{< / highlight >}}

This would start a web server and open the React application in your browser.

From the markup, we have a single `video` element and the `src` is the path on our server that serves a video file. So you should see the video in your React application.


## Building Out the Frontend

So far, we've set up our server to serve a video file when requested. In reality, our react application will have two views: a **List** view that will contain a list of videos and a **Player** view where videos will play. We'll be using Bootstrap to layout our interface so add the following to the `head` section of `public/index.html`:

{{< highlight html >}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.css">
    {{< / highlight >}}

Our application will have 2 routes to handle the **List** and **Player** views so install `react-router-dom` to handle routing of the react application. From the terminal, run the command:

{{< highlight bash >}}
    // If you are using yarn
    yarn add react-router-dom
    
    // if you are using npm
    npm install --save react-router-dom
    {{< / highlight >}}

This installs the recommended router for React applications.

We can start to build out the necessary views. Let’s start with the list view. Create a new file `src/Home.js` and add the following snippet:

{{< highlight js >}}
    import React, { Component } from 'react';
    import { Link } from 'react-router-dom';
    export default class Home extends Component {
      constructor() {
        super();
        this.state = {
          videos: []
        };
      }
      async componentDidMount() {
        try {
          const response = await fetch('http://localhost:4000/videos');
          const data = await response.json();
          this.setState({ videos: [...data] });
        } catch (error) {
          console.log(error);
        }
      }
      render() {
        return (
          <div className="App App-header">
            <div className="container">
              <div className="row">
                {this.state.videos.map(video =>
                  <div className="col-md-4" key={video.id}>
                    <Link to={`/player/${video.id}`}>
                      <div className="card border-0">
                        <img src={`http://localhost:4000${video.poster}`} alt={video.name} />
                        <div className="card-body">
                          <p>{video.name}</p>
                          <p>{video.duration}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  )}
              </div>
            </div>
          </div>
        )
      }
    }
  {{< / highlight >}}

Our component starts off by importing some required packages. Then it initializes the state variable `videos` to an empty array. In the `componentDidMount`, it makes a request to an endpoint (http://localhost:4000/videos) which returns an array of video metadata. It's an array of objects, where each object looks like:

{{< highlight js >}}
    {
      id: 0,
      poster: '/video/0/poster',
      duration: '3 mins',
      name: 'Sample 1'
    }
{{< / highlight >}}

After fetching the video metadata, we render it as a list of videos. Each card is wrapped with a link to the player view which also contains a dynamic parameter.
{{< note >}}
 We have not created the endpoint to get the video metadata or generate thumbnails for videos yet, we'll do that in the next section.
{{< /note >}}

Next, we create the player view. Create a new file `src/Player.js` and add the following:

{{< highlight js >}}
    import React, { Component } from 'react'
    export default class Player extends Component {
      constructor(props) {
        super(props);
        this.state = {
          videoId: this.props.match.params.id,
          videoData: {}
        };
      }
      async componentDidMount() {
        try {
          const res = await fetch(`http://localhost:4000/video/${this.state.videoId}/data`);
          const data = await res.json();
          this.setState({ videoData: data });
        } catch (error) {
          console.log(error);
        }
      }
      render() {
        return (
          <div className="App">
            <header className="App-header">
              <video controls muted autoPlay>
                <source src={`http://localhost:4000/video/${this.state.videoId}`} type="video/mp4"></source>
              </video>
              <h1>{ this.state.videoData.name }</h1>
            </header>
          </div>
        )
      }
    }
  {{< / highlight >}}

For the player view, we get the video `id` from the URL parameter. With the `id`, we can make a request to the server to fetch the video information. In the markup, `src` attribute is a link which appends the video id to `/video` route and the server responds with the actual video.

That's all we need for the views. Let's glue them both together. Replace `src/App.js` with:

{{< highlight js >}}
    import React from 'react';
    import {
      Route,
      BrowserRouter as Router,
      Switch,
    } from "react-router-dom";
    import Home from './Home';
    import Player from './Player';
    import './App.css';
    function App() {
      return (
        <Router>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/player/:id" component={Player}></Route>
          </Switch>
        </Router>
      );
    }
    export default App;
    {{< / highlight >}}

Here, we import the router package as well as our components. `/` route shows the Home component. For the `/player` route, notice the dynamic `:id` which would match anything that matches the pattern. This is how we pass the `id` to the `Player` component.


## Handling Requests from the Frontend

Right now, we have three requests from the frontend that are not handled by our server yet:

- Sending an array of video metadata that will be used to populate the list view
- an endpoint to send metadata for a single video used by the `Player` view
- an endpoint to stream the actual video

Let's tackle them one after another

**Endpoint to Handle List of Videos Metadata**
For this demo application, we'll create an array of objects that will hold the metadata and send that to the frontend when requested. In a real application, you would probably be reading the data from a database, which would then be used to generate an array like this but for simplicity sake, we won’t be doing that in this tutorial.

From the `server` directory, open `app.js` and add this just after the import statements:

{{< highlight js >}}
    const videos = [
      {
        id: 0,
        poster: '/video/0/poster',
        duration: '3 mins',
        name: 'Sample 1'
      },
      {
        id: 1,
        poster: '/video/1/poster',
        duration: '4 mins',
        name: 'Sample 2'
      },
      {
        id: 2,
        poster: '/video/2/poster',
        duration: '2 mins',
        name: 'Sample 3'
      },
    ];
{{< / highlight >}}

So as you can see, each object contains information about the video. Notice the `poster` attribute which contains the link to a poster image of the video. Later in this tutorial, we’ll see how we can generate a poster image from a video.

With this in place, let’s create a new route `/videos` that will send this data to the frontend:

{{< highlight js >}}
    app.use(cors());
    
    app.get('/videos', function(req, res) {
      res.json(videos);
    });
    {{< / highlight >}}

First, we enable `cors` on the server since we’ll be making the requests from a different origin (domain). `cors` was already installed earlier. Then the route returns the array we just created in `json` format.

Save the file and it should automatically restart the server. Once it’s started, switch to your browser and check the react application. Your app should look like so:


{{< image src="Image1.png" alt="React Video streaming app" title="React application" >}}

### Endpoint to Send Metadata for a Single Video

Our react application fetches the video by `id` so we can use the `id` to get the requested video data from the array. Let’s create a new route that will handle this:

{{< highlight js >}}
    app.get('/video/:id/data', function(req, res) {
      const id = parseInt(req.params.id, 10);
      res.json(videos[id]);
    });
{{< / highlight >}}

This route just matches the endpoint called by our react application. If you remember, the **Player** view makes a request to `*http://localhost:4000/video/*``${``*this.state.videoId*``}``*/data*` which would match this route. We get the `id` from the route parameters and convert it to an integer. Then we send the object that matches the `id` back to the client.

Now, the player view should look like this:


{{< image src="Image2.png" alt="React Video streaming app" title="React application preview" >}}


### Endpoint to Stream the Video

At the beginning, we created a route that just serves a video to the client. We were not actually sending smaller chunks, we just serve a video file on request. But now, we have at least 3 videos in our array and we need a way to be able to dynamically get the requested videos as well as do the actual streaming.

First off, delete the previous route that sends a video to the client. We need 3 videos so you can either duplicate the first video you have or use the ones in the [source code](https://github.com/slightlynerd/react-node-video-streaming). We also have to rename them to match the `id`s in our array as seen in the screenshot below.

{{< image src="Image3.png" alt="React Video streaming app" title="Video Files preview" >}}


Let’s create the route for streaming videos.

{{< highlight js >}}
    app.get('/video/:id', function(req, res) {
      const path = `assets/${req.params.id}.mp4`;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] 
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
      }
    });
{{< / highlight >}}

This is a fair bit of code so let’s walk through it in chunks (pun intended).

{{< highlight js >}}
    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    {{< / highlight >}}

First, we get the `id` from the route `/video/:id` and use it to generate the `path` to the video. Using `fs`, we read the file to get the file size. For videos, a `range` is sent in the request which let’s us know the chunks of the video to send back to the client.

Some browsers send a range in the initial request but others don’t. For those that don’t or if for any other reason the browser doesn’t send a range, we handle that in the `else` block.

{{< highlight js >}}
    else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
{{< / highlight >}}

We get the file size and send the first few chunks of the video.

{{< highlight js >}}
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    }
{{< / highlight >}}    

Subsequent requests will include a range so we handle that in the `if` block. We create a read stream using the `start` and `end` values of the range. We then set the response headers, setting the `Content-Length` to the chunk size we generated. We also use the HTTP code 206 which let’s the browser know this is a partial content. This means the browser will keep making requests until it has fetched all chunks of the video.

Save the file now which should automatically restart the server. Then navigate to your browser and refresh the application. You should see something like this:


{{< image src="Image4.png" alt="React Video streaming app" title="React application Preview" >}}




## Dynamically Generating Thumbnails for Videos

Our *Home* view appears broken at the moment because the poster images are not generated.
To generate a thumbnail, we need to install 2 libraries. First, install [ffmpeg](https://www.ffmpeg.org/) on your system. Then open the terminal in the `server` directory and install `thumbsupply`:

{{< highlight bash >}}
    // using npm
    npm install --save thumbsupply
    
    // using yarn
    yarn add thumbsupply
{{< / highlight >}}  
 
Most thumbnail generating packages require `ffmpeg` which is why it’s required. Then update your imports statements in `server/app.js` to include `thumbsupply`.
 
{{< highlight js >}}
    const thumbsupply = require('thumbsupply');
{{< / highlight >}}      

Then we’ll create a new route that will handle generating thumbnails:

{{< highlight js >}}
    app.get('/video/:id/poster', function(req, res) {
      thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`)
        .then(thumb => res.sendFile(thumb))
    });
{{< / highlight >}} 

`thumbsupply` provides a `generateThumbnail` method that accepts a path to a video and then generates the thumbnail. If successful, we send the generated file back to the client.

Save the file which would restart the server. Refresh the application in the browser and you would see the `Home` view now includes poster images for the videos.


{{< image src="Image5.png" alt="React Video streaming app" title="React application with poster Images" >}}




## Add Captions to Videos

To make videos even more accessible, adding captions to videos helps the deaf and hard of hearing to be able to follow along videos. It’s also fair to point out that [captions and subtitles are not the same thing](http://web.archive.org/web/20160117160743/http://screenfont.ca/learn/). Even though they are not the same, they are implemented the same way. 

For this section, we’ll need 2 things:

- A caption file
- HTML5 `track` element

We won’t look at how to create caption files in this tutorial because it’s beyond the scope but here’s what a caption file looks like:


    WEBVTT
    
    00:00:00.500 --> 00:00:02.000
    The Web is always changing
    
    00:00:02.500 --> 00:00:08.300
    and the way we access it is changing

The file starts `WEBVTT` which indicates this is a **Web Video Track File**. This is the format use for captions/subtitles on the web and the file extension is `.vtt`. A duration is specified for the caption and the caption text sits under the duration.

The second thing is the `track` element. Update the `src/Player.js` video element like so:

{{< highlight js >}}
    <video controls muted autoPlay crossOrigin="anonymous">
      <source src={`http://localhost:4000/video/${this.state.videoId}`} type="video/mp4"></source>
      <track label="English" kind="captions" srcLang="en" src={`http://localhost:4000/video/${this.state.videoId}/caption`} default></track>
    </video>
{{< / highlight >}}

We’ve added `crossOrigin="anonymous"` to the video element else the request for captions will fail. The `track` element includes:

- `label` - to specify the label that appears in the captions menu
- `kind` - can be *captions* or *subtitles*
- `srcLang` - the language the caption is in i.e. *en* means English
- `src` - is the location of the caption file
- `default` - indicates this as the default caption

With that set, we can now create the endpoint that will handle caption requests. Create a new route in `server/app.js`:

{{< highlight js >}}
    app.get('/video/:id/caption', function(req, res) {
      res.sendFile('assets/captions/sample.vtt', { root: __dirname });
    });
{{< / highlight >}}

We have a captions file in `assets/captions` which will serve the same caption file for all caption requests. In a real application, there would be multiple caption files which would match the video of course.

Now once you save and the server restarts, you should see captions appear on the video.


{{< image src="Image6.png" alt="React Video streaming app" title="React application with Video Captions" >}}



## Making Things Pretty

We can add some styles to make the application look better. Update the React application `src/App.css` file with this:

{{< highlight css >}}
    .App-header {
      min-height: 100vh;
      color: white;
    }
    header, footer {
      background-color: #374153;
      text-align: center;
      color: white;
      padding: 10px 0;
    }
    header {
      margin-bottom: 50px;
      font-size: 28px;
    }
    footer {
      margin-top: 50px;
      font-size: 14px;
    }
    .card {
      margin: 10px 0;
    }
    a, a:hover {
      color: #282c34;
      text-decoration: none;
    }
    video {
      width: 100%;
      height: 50vh;
    }
    img {
      height: 200px;
      object-fit: cover;
      object-position: center top;
    }
    p {
      margin-bottom: 5px;
      font-size: 16px;
    }
{{< / highlight >}}     

Replace `src/index.css` with:

{{< highlight css >}}
    body {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #282c34;
    }
{{< / highlight >}}    

Add this to the `head` section of `public/index.html`:

{{< highlight html >}}
    <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
{{< / highlight >}}    

Finally, let’s create `header` and `footer` components:

`src/Header.js`

{{< highlight js >}}
    import React from 'react';
    function Header() {
      return (
        <header>
          uTunnel
        </header>
      );
    }
    export default Header;
{{< / highlight >}}    

`src/Footer.js`

{{< highlight js >}}
    import React from 'react';
    function Footer() {
      return (
        <footer>
          &copy; 2020, uTunnel. All rights reserved.
        </footer>
      );
    }
    export default Footer;
{{< / highlight >}}    

Now import and use them in `src/Home.js` and `src/Player.js` like so:

{{< highlight js >}}
    import Header from './Header';
    import Footer from './Footer';
    
    render() {
      return (
        <div className="App-header">
            <Header />
            ...
            <Footer />
        </div>
      )
    }
{{< / highlight >}}        

Now the application should look like this:


{{< image src="Image7.png" alt="React Video streaming app" title="React Video streaming app final preview 1" >}}

{{< image src="Image8.png" alt="React Video streaming app" title="React Video streaming app final preview 2" >}}




## Conclusion

In this tutorial, we have seen how to create a server in node.js that enables video streaming, generating captions and posters for videos, and serving metadata of videos. We’ve also seen how to use React on the frontend to consume the endpoints and data generated by the server. You can check out the [source code](https://github.com/Dunebook/Videostreaming-app) to compare notes.




