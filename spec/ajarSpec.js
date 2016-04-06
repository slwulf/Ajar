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
var fileName = '../dist/Ajar.js';
var distFile = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');
var jsdom = require('mocha-jsdom')({ src: distFile });

describe('Ajar()', function() {
  var baseURL = 'http://jsonplaceholder.typicode.com';
  var Ajar;

  before(function() {
    Ajar = window.Ajar;
  });

  it('throws an error when no URL is provided', function() {
    var fn = function() { Ajar(); }
    expect(fn).to.throw();
  });

  it('returns an object with XHR methods', function() {
    var actual = Ajar('/test');
    expect(actual).to.have.ownProperty('get');
    expect(actual).to.have.ownProperty('post');
    expect(actual).to.have.ownProperty('put');
    expect(actual).to.have.ownProperty('del');
  });

  describe('.get()', function() {
    var users;

    before(function() {
      users = Ajar(baseURL + '/users');
    });

    it('makes a GET request to the URL provided to Ajar()', function() {
      users.get().send(function(data) {
        /**
         * According to the JSONPlaceholder
         * API page, there are 10 users.
         */
        expect(data.length).to.equal(10);
      });

      users.get({ id: 2 }).send(function(user) {
        /**
         * According to the JSONPlaceholder
         * API, the user with ID of 2 has the
         * name "Ervin Howell"
         */
        expect(user.name).to.equal('Ervin Howell');
      });
    });
  });

  describe('.post()', function() {
    var posts;

    before(function() {
      posts = Ajar(baseURL + '/posts');
    });

    it('makes a POST request to the URL provided to Ajar()', function() {
      var request = posts.post({
        title: 'Ajar TEST',
        body: 'lorem ipsum',
        userId: 1
      });

      request.send(function(newPost) {
        expect(newPost).to.have.ownProperty('title');
        expect(newPost.title).to.equal('Ajar TEST');
      });
    });
  });

  describe('.put()', function() {
    it('makes a PUT request to the URL provided to Ajar()', function() {
      //
    });
  });

  describe('.del()', function() {
    it('makes a DELETE request to the URL provided to Ajar()', function() {
      //
    });
  });

  describe('.send()', function() {
    var users;

    before(function() {
      users = Ajar(baseURL + '/users');
    });

    it('is exposed by all http methods', function() {
      expect(users.get()).to.have.ownProperty('send');
      expect(users.post()).to.have.ownProperty('send');
      expect(users.put()).to.have.ownProperty('send');
      expect(users.del()).to.have.ownProperty('send');
    });

    it('accepts a callback function', function() {
      var actual = false;
      users.get().send(function(data) {
        if (data) actual = true;
        expect(actual).to.be.true;
      });
    });
  });

});
