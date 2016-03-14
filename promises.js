'use strict';

function Promise (callback){
  var cbStack = [];
  var errBack = function(){};

  this.catch = function(errorCb){
    errBack = errorCb;
    return this;
  };

  this.then = function(cb){
    cbStack.push(cb);
    return this;
  };

  function provider (data){
    var i, cb, intermediate = data;

    for (i=0; i<cbStack.length; i++){
      cb = cbStack[i];
      try {
        if (intermediate instanceof Promise) {
          cbStack.slice(i).forEach(function(nextCb){
            intermediate.then(nextCb);
          });
          break;
        }
        intermediate = cb(intermediate);
      } catch (error) {
        errBack(error);
        break;
      }
    }
  }

  function rejecter (reason){
    errBack(reason);
  }
  callback(provider, rejecter);
}


function deferredFive (){
  var promise = new Promise(function(resolve, reject){
    global.setTimeout(function(){ resolve(5); }, 0);
  });

  return promise;
}

function addSix(number){
  var promise = new Promise(function(resolve, reject){
    global.setTimeout(function(){
      resolve(number + 6);
    }, 0);
  });

  return promise;
}

function subtractThree(number){
  var promise = new Promise(function(resolve, reject){
    global.setTimeout(function(){
      resolve(number - 3);
    }, 0);
  });

  return promise;
}

function multiplySeven(number){
  var promise = new Promise(function(resolve, reject){
    global.setTimeout(function(){
      resolve(number * 7);
    }, 0);
  });

  return promise;
}


deferredFive()
  .then(addSix)
  .then(subtractThree)
  .then(multiplySeven)
  .then(function(result){
    return 'Our final answer is: ' + result;
  })
  .then(function(finalAnswer){
    console.log(finalAnswer);
  });

