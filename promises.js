'use strict';

function Promise (callback){
  var thenCallback = function(){};

  this.then = function(cb){
    thenCallback = cb;
  };

  function provider (data){
    thenCallback(data);
  }

  callback(provider);
}

module.exports = Promise;
