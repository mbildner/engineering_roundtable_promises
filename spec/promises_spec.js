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

describe('stacking callbacks', function(){
  var promise;

  beforeEach(function(){
    promise = new Promise(function(resolve){
      defer(function(){
        resolve('never gonna');
      });
    });
  });

  context('when `then` is called multiple times', function(){
    it('pipes the return of one callback into the next', function(done){
      promise.then(function(result){
        return result + ' give';
      });

      promise.then(function(result){
        return result + ' you';
      });

      promise.then(function(result){
        return result + ' up';
      });

      promise.then(function(result){
        expect(result).toBe('never gonna give you up');
        done();
      });
    });
  });
});
