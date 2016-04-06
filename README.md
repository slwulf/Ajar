## Ajay
#### Asynchronous JavaScript (and you!)

This library is intended to be a tiny wrapper around `XMLHttpRequest`. Its goal is to simplify front-end interaction with RESTful APIs by exposing a composable interface for endpoints and the various HTTP request types.

Ajay ignores the "XML" in "XMLHttpRequest" since most RESTful APIs have a JSON interface, and most JavaScript developers don't love working with XML. That means that XML endpoints are not supported by this library.

### Usage

Ajay is designed for sending multiple different requests to the same endpoint. The main function is called with an API URL as its sole argument. This returns the methods `.get()`, `.post()`, `.put()`, and `.del()`, all of which can accept a params argument. Those methods in turn expose a `.send()` method, which accepts a callback function to be executed on successful completion of the request.

```javascript
var posts = Ajay('/posts');
var firstPost = Ajay('/posts/1');

// GET
posts
  .get()
  .send(console.log);
posts
  .get({ userId: 1 })
  .send(console.log);

// POST
posts
  .post({
    title: 'Hello World',
    body: 'This is my first post!',
    userId: 1
  })
  .send();

// PUT
firstPost
  .put({ title: 'Goodbye World' })
  .send();

// DELETE
firstPost
  .del()
  .send();
```
