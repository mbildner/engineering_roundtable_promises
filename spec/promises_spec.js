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

    it('does not call your other crappy callbacks', function(done){
      promise
      .then(function(){
        throw new Error('Stahp!');
      })
      .then(function(){
        // this function would kill our tests
        fail();
      })
      .catch(function(error){
        expect(error.toString())
        .toMatch(
          /Error: Stahp/
        );
      });

      defer(done);
    });
  });
});

describe('flattening async stuff', function(){
  context('when multiple promises are passed to each other', function(){
    function five(){
      var promise = new Promise(function(resolve){
        defer(function(){
          resolve(5);
        });
      });

      return promise;
    }

    function addSix(number){
      var promise = new Promise(function(resolve){
        defer(function(){
          resolve(number + 6);
        });
      });

      return promise;
    }

    function timesSeven(number){
      var promise = new Promise(function(resolve){
        defer(function(){
          resolve(number * 7);
        });
      });

      return promise;
    }

    it('passes the resolved value from one promise into the `then` callback of the next', function(done){
      five()
      .then(addSix)
      .then(timesSeven)
      .then(function(finalAnswer){
        expect(finalAnswer).toBe(77);
        done();
      });
    });
  });
});

describe('.all', function(){
  function promiseMe(value){
    var promise = new Promise(function(resolve){
      defer(function(){
        resolve(value);
      });
    });

    return promise;
  }

  function failPromise(reason){
    var promise = new Promise(function(resolve, reject){
      defer(function(){
        reject(reason);
      });
    });

    return promise;
  }

  context('when called with an array of non-failing promises', function(){
    it('returns a promise that will resolve with an array of values', function(done){
      Promise.all([
        promiseMe('friday'),
        promiseMe('friday'),
        promiseMe('gotta'),
        promiseMe('get'),
        promiseMe('down'),
      ])
      .then(function(rebecca){
        expect(rebecca).toEqual([
          'friday', 'friday', 'gotta', 'get', 'down'
        ]);
        done();
      });
    });
  });

  context('when called with an array of non-failing promises', function(){
    it('returns a promise that will resolve with an array of values', function(done){
      Promise.all([
        promiseMe('fuckin'),
        promiseMe('magnets'),
        promiseMe('how'),
        failPromise('you shall not pass'),
        promiseMe('do'),
        promiseMe('they'),
        promiseMe('work'),
      ])
      .catch(function(reason){
        expect(reason)
        .toBe('you shall not pass');
        done();
      });
    });
  });
});
