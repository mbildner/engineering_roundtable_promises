'use strict';

function Promise (callback){
  var callbackStack = [];
  var errback = function(){};

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
        intermediate = cb(intermediate);
      } catch (error) {
        errback(error);
      }
    }
  }

  function rejecter (reason){
    errback(reason);
  }

  callback(provider, rejecter);
}

module.exports = Promise;
