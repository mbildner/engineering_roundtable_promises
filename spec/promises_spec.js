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

describe('chaining callbacks', function(){
  var promise;

  beforeEach(function(){
    promise = new Promise(function(resolve){
      defer(function(){
        resolve('never gonna');
      });
    });
  });

  context('when calls to `then` are chained', function(){
    it('pipes the return of one callback into the next', function(done){
      promise
      .then(function(result){
        return result + ' let';
      })
      .then(function(result){
        return result + ' you';
      })
      .then(function(result){
        return result + ' down';
      })
      .then(function(result){
        expect(result).toBe('never gonna let you down');
        done();
      });
    });
  });
});

describe('rejecting promises', function(){
  var promise;

  beforeEach(function(){
    promise = new Promise(function(resolve, reject){
      defer(function(){
        reject('just not that into you');
      });
    });
  });

  context('when you manually reject a promise', function(){
    it('calls our `catch` method, with our provided reason', function(done){
      promise
      .catch(function(reason){
        expect(reason).toBe('just not that into you');
        done();
      });
    });
  });
});

describe('protecting a promise', function(){
  var promise;

  beforeEach(function(){
    promise = new Promise(function(resolve, reject){
      defer(function(){
        resolve('take on me');
      });
    });
  });

  context('when a callback barfs an error', function(){
    it('catches you when you fall', function(done){
      promise
      .then(function(data){
        // this function intentionally broken
        whyAreYouDoingThis();
      })
      .catch(function(error){
        expect(error.toString())
          .toMatch(
            /whyAreYouDoingThis is not defined/
          );
        done();
      });
    });
  });
});
