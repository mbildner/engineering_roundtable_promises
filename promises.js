'use strict';

function Promise (callback){
  var callbackStack = [];

  this.then = function(cb){
    callbackStack.push(cb);
    return this;
  };

  function provider (data){
    var cb, intermediate = data;
    while (cb = callbackStack.shift()){
      intermediate = cb(intermediate);
    }
  }

  callback(provider);
}

module.exports = Promise;
