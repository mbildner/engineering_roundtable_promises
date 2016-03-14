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

    while (cb = cbStack.shift()){
      try {
        intermediate instanceof Promise
          ? intermediate.then(cb)
          : intermediate = cb(intermediate);
      }
      catch (error) {
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
Promise.all = function(promises){
  var waitingToFinish = promises.length;
  var collectedData = [];

  return new Promise(function(resolve, reject){
    promises.forEach(function(promise, i){
      promise.then(function(data){
        collectedData[i] = data;
        waitingToFinish--;
        if (!--waitingToFinish){
          resolve(collectedData);
        }
      });

      promise.catch(reject);
    });
  });
};


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

function deferredFail (){
  var promise = new Promise(function(resolve, reject){
    global.setTimeout(function(){
      reject("here's your deferred failure!");
    });
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


Promise.all([
  deferredFive(),
  deferredFive(),
  deferredFive()
])
  .then(function(data){
    console.log(data);
  })
  .catch(function(reason){
    console.log(reason);
  });
