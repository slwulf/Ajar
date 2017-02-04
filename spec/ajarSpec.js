/**
 * Ajar Spec
 *
 * Some of the following tests rely on data provided by the
 * JSONPlaceholder API at http://jsonplaceholder.typicode.com/
 * in order to determine whether the HTTP request was successful.
 * This will be noted in any tests where assertions depend on
 * a successful return of this data.
 */

var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');

// set up DOM dependencies
var fileName = '../dist/ajar.js';
var distFile = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');

describe('Ajar()', function() {
  var baseURL = 'http://jsonplaceholder.typicode.com';
  var Ajar, users, posts, window, document;

  beforeEach(function(done) {
    document = jsdom.jsdom();
    window = document.defaultView;

    var script = document.createElement('script');
    script.textContent = distFile;
    document.body.appendChild(script);

    Ajar = window.Ajar;
    posts = Ajar(baseURL + '/posts');
    users = Ajar(baseURL + '/users');
    done();
  });

  it('throws an error when no URL is provided', function() {
    var fn = function() { Ajar(); }
    expect(fn).to.throw();
  });

  it('can add to the URL of previously created Ajar instances', function(done) {
    posts(1).get().send(function(post) {
      expect(post.id).to.equal(1);
      done();
    });
  });

  describe('.get()', function() {
    it('makes a GET request to the URL passed to Ajar', function(done) {
      users.get().send(function(data) {
        expect(data).to.have.lengthOf(10);
        done();
      });
    });

    it('makes a GET request with query params', function(done) {
      users.get({ id: 2 }).send(function(user) {
        expect(user[0].name).to.equal('Ervin Howell');
        done();
      });
    });
  });

  describe('.post()', function() {
    it('makes a POST request to the URL passed to Ajar', function(done) {
      var newPost = posts.post({
        title: 'TEST AJAR',
        body: 'Hello world.',
        userId: 2
      });

      newPost.send(function(post) {
        expect(post.title).to.equal('TEST AJAR');
        done();
      });
    });
  });

  describe('.put()', function() {
    it('makes a PUT request to the URL passed to Ajar', function(done) {
      var firstPost = posts(1);
      var changes = firstPost.put({ body: 'Goodbye world.' });

      changes.send(function(data) {
         expect(data.body).to.equal('Goodbye world.');
         done();
      });
    });
  });

  describe('.del()', function() {
    it('makes a DELETE request to the URL passed to Ajar', function(done) {
      var secondPost = posts(2);
      secondPost.del().send(function(data) {
         expect(Object.keys(data)).to.have.lengthOf(0);
         done();
      });
    });
  });
});
