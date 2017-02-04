/**
 * Ajar
 * Version 1.0.0
 */

(function(window) {

  /**
   * parse
   *
   * Extracts the response from an XHR object
   * and parses it as JSON.
   *
   * @param {XMLHttpRequest} xhr A completed request object
   * @return {Object|Array} Parsed JSON data
   */

  function parse(xhr) {
    if (!xhr.responseType || xhr.responseType === 'text') {
      return JSON.parse(xhr.responseText);
    }

    return JSON.parse(xhr.response);
  }

  /**
   * handleErrors
   *
   * Straightforward error handling.
   *
   * @param {XMLHttpRequest} xhr Request object
   */

  function handleErrors(xhr) {
    console.log(xhr);
    throw new Error(xhr.statusText);
  }

  /**
   * send
   *
   * Creates the send method for the Ajar
   * http request methods.
   *
   * @param {XMLHttpRequest} xhr Request to send
   * @param {Object} params Request params to send
   * @param {Function} cb A function to execute on success
   */

  function send(xhr, params) {
    return function(cb) {
      cb = typeof cb === 'function' ? cb : function() { /* noop */ };
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            cb(parse(xhr));
          } else {
            handleErrors(xhr);
            cb(new Error('Server returned ' + xhr.status + ': ' + xhr.statusText));
          }
        }
      };

      if (params) {
        xhr.send(params);
      } else {
        xhr.send();
      }
    };
  }

  /**
   * queryString
   *
   * Converts an object into a URL query string.
   *
   * @param {Object} params Object to convert
   * @return {String} A URL query string
   */

  function queryString(params) {
    var keys = Object.keys(params);
    return keys.reduce(function(str, key, i) {
      var val = params[key];
      str += key + '=' + encodeURIComponent(val);
      if (i < keys.length) str += '&';
      return str;
    }, '?');
  }

  /**
   * request
   *
   * Begins a request for the URL passed to the
   * parent function. The request may contain JSON
   * data or query params.
   *
   * @param {String} url URL to request
   * @param {String} type An http method
   * @param {Object} params JSON or query params
   * @return {Object} Send method executes request
   */

  function request(url, type) {
    var method = typeof type === 'string' ? type : 'GET';
    return function(params) {
      var xhr = new XMLHttpRequest();
      if (params && method === 'GET') url += queryString(params);
      xhr.open(method, url);
      if (method === 'GET') return { send: send(xhr) };
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      return { send: send(xhr, JSON.stringify(params)) };
    };
  }

  /**
   * Ajar
   *
   * Main library function. Returns a function
   * that will extend the URL param with the
   * previous one and includes http methods.
   *
   * @param {String} url URL to request
   * @return {Function} Http methods
   */

  function Ajar(url) {
    if (!url || (typeof url !== 'string' && typeof url !== 'number')) {
      throw new Error('Could not create a request for URL:', url);
    }

    var ajar = function(u) {
      u = url + '/' + u;
      return Ajar(u);
    };

    ajar.get = request(url, 'GET');
    ajar.post = request(url, 'POST');
    ajar.put = request(url, 'PUT');
    ajar.del = request(url, 'DELETE');

    return ajar;
  }

  window.Ajar = Ajar;

})(window);
