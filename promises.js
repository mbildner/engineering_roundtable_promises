'use strict';

function Promise (callback){
  var callbackStack = [];
  var errback = function(reason){ throw new Error(reason)};

  this.then = function(cb){
    callbackStack.push(cb);
    return this;
  };

  this.catch = function(eb){
    errback = eb;
  };

  function provider (data){
    var cb, intermediate = data;
    while (cb = callbackStack.shift()){
      try {
        intermediate instanceof Promise
          ? intermediate.then(cb)
          : intermediate = cb(intermediate);
      } catch (error) {
        errback(error);
        break;
      }
    }
  }

  function rejecter (reason){
    errback(reason);
  }

  callback(provider, rejecter);
}

Promise.all = function(promises){
  var unresolvedPromises = promises.length;
  var allData = [];
  var whenAllFinished = new Promise(function(resolve, reject){
    promises.forEach(function(promise, index){
      promise
        .then(function(data){
          allData[index] = data;
          unresolvedPromises--;
          if (!unresolvedPromises){
            resolve(allData);
          }
        })
        .catch(reject);
    });
  });

  return whenAllFinished;
};

module.exports = Promise;
