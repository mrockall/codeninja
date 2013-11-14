# Code Ninja!

These are the slides for the talk/workshop entitled 'Building a Multi-Screen, Multi-Player Game in the Browser'. Most of the slides just contain an image or say 'DEMO!', so will include a rough idea of what I want to talk about in this readme.

# Setup
All you need to do to setup these slides is clone the [parent repo](https://github.com/mrockall/codeninja) and open up index.html in a browser.
If you want to mess with the actual code of the presentation, you can see the full setup [here](https://github.com/hakimel/reveal.js/#installation).

# The Presentation
## #0 Introduction
Not much to say about this whole section really!

## #1 Event Driven Web
### How the Web Works
For starts, I wanted to outline briefly how the web works. Obviously there's not going to be too much detail here. I think once you have a general understanding of what powers the web then when we run into things like Node that it will seem much cooler.
When people ask how the web works, I explain how it is all request based. The real magic is HTTP because it outlines for us a simple vocabulary that we can use to communicate with other computers in other places. The web is then made up of three other languages, HTML (for description), CSS (for style) and Javascript (for doing stuff). These languages are web standards and every website in the world is made of them.
How the HTML/CSS/JS websites are built is totally different and takes place on the computer that hosts them. These computers are known as servers and they react to your HTTP requests, build the things that you have asked for and return them to you. The languages used to react and build the websites can be different from server to server. Some commonly used ones are Apache, Nginx, PHP and Ruby.
### What is Node?
Node is a platform written in JS that uses an event-driven, non-blocking I/O model for building network applications. It's cool for a number of reasons.. first off, it's built on JS so you write in JS! That means developers can re-use code and work on both the front-end and the back-end. Secondly, it's non-blocking and event driven. This means it's fast and very scalable.
Some servers like Apache are thread based. This means that when a request comes in, the server spawns a new thread to handle the request. The thread then processes the request in it's entirety and closes. Event driven servers manage all requests in a single thread. This thread jumps between different active connections and fires asynchronous requests for things take a while to complete, such as storage and databases. When those requests are finished, they return additional events which are placed on the event stack to be handled!
### Socket.io

# Credits
Slides built using [Reveal.JS](https://github.com/hakimel/reveal.js/)
