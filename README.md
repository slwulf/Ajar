## Ajar
#### Asynchronous JavaScript and REST

Ajar is a tiny wrapper around `XMLHttpRequest` that attempts to simplify front-end communication with RESTful APIs. Ajar ignores the "XML" in "XMLHttpRequest". XML endpoints are not supported by this library.

The Ajar API was heavily inspired by the API of [Fetchival](https://github.com/typicode/fetchival), so credit to Typicode for some of this.

### Usage

Ajar is designed for creating composable HTTP requests to RESTful APIs. The library function `Ajar` accepts a URL and returns a function with HTTP request methods `.get()`, `.post()`, `.put()`, and `.del()`.

These methods return another method, `.send()`, which executes the request. The send method also accepts a callback function to be run on success. That callback receives any data returned from the server as its sole argument.

```javascript
var posts = Ajar('/posts');
posts.get().send(console.log);
posts.get({ userID: 1 }).send(console.log);

posts.post({
  title: 'Hello World',
  body: 'This is my first post!'
}).send();

var firstPost = posts(1); // URL will be /posts/1
firstPost.put({ title: 'Goodbye World' }).send();
firstPost.del().send();
```
