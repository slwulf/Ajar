/**
 * Ajay Spec
 */

var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

// set up DOM dependencies
var fileName = '../dist/ajay.js';
var distFile = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');
var jsdom = require('mocha-jsdom')({ src: distFile });

describe('Ajay', function() {
  var baseURL = 'http://jsonplaceholder.typicode.com';
  var Ajay;

  before(function() {
    Ajay = window.Ajay;
  });

  it('throws an error when no URL is provided', function() {
    var fn = function() { Ajay(); }
    expect(fn).to.throw();
  });

  it('returns an object with XHR methods', function() {
    var actual = Ajay('/test');
    expect(actual).to.have.ownProperty('get');
    expect(actual).to.have.ownProperty('post');
    expect(actual).to.have.ownProperty('put');
    expect(actual).to.have.ownProperty('del');
  });

  describe('.get()', function() {
    var users;

    before(function() {
      users = Ajay(baseURL + '/users');
    });

    it('makes a GET request to the URL provided to Ajay()', function() {
      users.get().send(function(data) {
        expect(data.length).to.equal(10);
      });
    });

    it('accepts a params object', function() {
      users.get({ id: 2 }).send(function(user) {
        expect(user.name).to.equal('Ervin Howell');
      });
    });
  });

  describe('.post()', function() {
    var posts;

    before(function() {
      posts = Ajay(baseURL + '/posts');
    });

    it('makes a POST request to the URL provided to Ajay()', function() {
      var request = posts.post({
        title: 'AJAY TEST',
        body: 'lorem ipsum',
        userId: 1
      });

      request.send(function(newPost) {
        expect(newPost).to.have.ownProperty('title');
        expect(newPost.title).to.equal('AJAY TEST');
      });
    });
  });

});
