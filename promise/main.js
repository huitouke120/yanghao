function yhPromise(fun) {

  this.status = 'pending';

  let resolve = function (val) {
    this.value = val;
    if (val instanceof yhPromise) {
      this.status = 'success'
      if (this.callback) {
        let innerresolve = this.callback.resolve;
        if (innerresolve) {
          innerresolve(this.callback.callback(val.value));
        } else {
          this.callback(val.value);
        }
      }
    } else {
      this.status = 'success'
      if (this.callback) {
        let innerresolve = this.callback.resolve;
        if (innerresolve) {
          innerresolve(this.callback.callback(val));
        } else {
          this.callback(val);
        }
      }
    }
  }.bind(this)
  let reject = function () {
    this.status = 'failed'
  }.bind(this)

  fun(resolve, reject);
}
yhPromise.prototype.then = function (callback) {
  return new yhPromise((resolve) => {
    if (this.status=='pending') {
      this.callback = {
        callback,
        resolve
      };
    } else {
      resolve(callback());
    }
  })
}

let p = new yhPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('p')
  }, 2000)
}).then((val) => {
  return new yhPromise((resolve) => {
    resolve('ggg')
  })
}).then((val) => {
  console.log(val)
  return 4;
}).then((v) => {
  console.log(v)
})