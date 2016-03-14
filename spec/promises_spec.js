'use strict';

var context = describe;

function defer(cb){
  global.setTimeout(cb, 0);
}

var Promise = require('../promises.js');

describe('a deferred result', function(){
  var promise, finalAnswer;

  beforeEach(function(){
    promise = new Promise(function(resolve){
      defer(function(){
        resolve('this is amazing!');
      });
    });
  });

  context('when `resolve` is called', function(){
    it('pipes that data into the `then` callback', function(done){
      promise.then(function(asyncResult){
        expect(asyncResult).toBe('this is amazing!');
        done();
      });
    });
  });
});
