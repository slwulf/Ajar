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

// set up DOM dependencies
var fileName = '../dist/ajar.js';
var distFile = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');
var jsdom = require('mocha-jsdom')({ src: distFile });

describe('Ajar()', function() {
  var baseURL = 'http://jsonplaceholder.typicode.com';
  var Ajar, users, posts;

  before(function() {
    Ajar = window.Ajar;
    posts = Ajar(baseURL + '/posts');
    users = Ajar(baseURL + '/users');
  });

  it('throws an error when no URL is provided', function() {
    var fn = function() { Ajar(); }
    expect(fn).to.throw();
  });

  it('can add to the URL of previously created Ajar instances', function() {
    var fn = function() { return posts(1) };
    expect(fn).to.not.throw();
  });

  describe('.get()', function() {
    it('makes a GET request to the URL passed to Ajar', function() {
      users.get().send(function(data) {
        /**
         * JSONPlaceholder API should have
         * 10 user records.
         */
        expect(data).to.have.lengthOf(10);
      });

      // test query params also
      users.get({ id: 2 }).send(function(user) {
        /**
         * JSONPlaceholder API second user
         * record has the name "Ervin Howell"
         */
        expect(user.name).to.equal('Ervin Howell');
      });
    });
  });

  describe('.post()', function() {
    it('makes a POST request to the URL passed to Ajar', function() {
      var newPost = posts.post({
        title: 'TEST AJAR',
        body: 'Hello world.',
        userId: 2
      });

      newPost.send(function(post) {
        /**
         * JSONPlaceholder API POST endpoints
         * do not actually create a record, but
         * respond with the request body
         */
        expect(post.title).to.equal('TEST AJAR');
      });
    });
  });

  describe('.put()', function() {
    it('makes a PUT request to the URL passed to Ajar', function() {
      var firstPost = posts(1);
      var changes = firstPost.put({ body: 'Goodbye world.' });

      changes.send(function(data) {
        /**
         * JSONPlaceholder API PUT endpoints
         * do not actually update a record, but
         * respond with the request body
         */
         expect(data.body).to.equal('Goodbye world.');
      });
    });
  });

  describe('.del()', function() {
    it('makes a DELETE request to the URL passed to Ajar', function() {
      var secondPost = posts(2);
      secondPost.del().send(function(data) {
        /**
         * JSONPlaceholder API DELETE endpoints
         * do not actually delete a record, but
         * respond with an empty object
         */
         expect(data).to.be(Object);
         expect(Object.keys(data)).to.have.lengthOf(0);
      });
    });
  });
});
