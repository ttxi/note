---
sidebarDepth: 2
---
# Promsie源码

## 关于函数
什么是高阶函数： 把函数作为参数或者返回值的一类函数。

### before函数
```js
Function.prototype.before = function(beforeFn){
    return ()=>{
        beforeFn();
        this();
    }
}
function fn(){
    console.log('source')
}
const newFn = fn.before(say=>{
    console.log('say');
});
newFn();
```
AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，其实就是给原函数增加一层，不用管原函数内部实现
```txt
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * 
```
### 类型检测
```js
function checkType(content,Type){
    return Object.prototype.toString.call(content) === `[object ${Type}]`
}
const flag = checkType('hello','String');

// -----------------------------------
function checkType(Type){
    return function(content){
        return Object.prototype.toString.call(content) === `[object ${Type}]`
    }
}
const flag = checkType('hello','String');
const util = {};
const types = ['String','Number','Boolean'];
types.forEach(type=>{
    util['is'+type] = checkType(type);
});
```
函数分步传递参数，将函数拆分成功能更具体化的函数

### 柯里化函数
```js
const currying = (fn,args = []) => {
    let len = fn.length;
    return (..._)=>{
        let arg = args.concat(_);
        if(arg.length < len){
            return currying(fn,arg);
        }
        return fn(...arg);
    }
};
const add = (a, b, c, d, e) => {
  return a + b + c + d + e;
};
let r = currying(add)(1)(2,3)(4,5);
console.log(r);
```
柯里化类型函数
```js
const types = ['String','Number','Boolean'];
let utils = {}
types.forEach(type=>{
    utils[`is${type}`] = currying(isType)(type);
})
```
### after函数的应用
```js
const after = (times, callback) => () => {
  if (--times === 0) {
    callback();
  }
};
const newFn = after(3, () => {
  console.log("ok");
});
```
#发布订阅模式 、 观察者模式
一种一对多的关系，发布者和订阅者是否有关联，观察者模式基于发布订阅模式

## Promise
```js
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
// 所有的promise 都要遵循这个规范 这样就可以保证不同人写的promise可以混用
// 核心就在这个resolvePromise方法中
function resolvePromise(x, promise2, resolve, reject) {
  // x 决定promise2 的状态 走成功还是失败
  if (promise2 === x) {
    return reject(new TypeError("循环引用"));
  }
  // 判断x 是不是一个promise 先保证x 得是一个对象或者函数，如果不是对象或者函数那么x 一定不是promise
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called;
    // 我需要看 这个x 上有没有then方法 有then方法才说明他是一个promise
    try {
      let then = x.then; // x可能是别人写的promise 那么取then有风险，
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            // x.then((y)=>{},r=>{}) 取then就会有风险
            if (called) return;
            called = true;
            resolvePromise(y, promise2, resolve, reject); // 递归解析直到我们的y的值是一个普通值
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        //  没有then方法的都执行这里
        resolve(x); // 只是一个对象而已 就是一个普通值
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // x 就是一个普通的值,直接把x 传递给promise2的成功即可
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onResvoledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      // 如何判断是不是一个promise 主要看有没有then方法
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResvoledCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    // 有可能这个 onFulfilled, onRejected 是可选的
    onFulfilled =
      typeof onFulfilled === "function"
        ? onFulfilled
        : function (data) {
            return data;
          };
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onResvoledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  catch(errCallback) {
    return this.then(null, errCallback);
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }
  static all(values) {
    return new Promise((resolve, reject) => {
      let times = 0;
      function processMap(key, value) {
        arr[key] = value;
        if (++times === values.length) {
          resolve(arr);
        }
      }
      const arr = [];
      for (let i = 0; i < values.length; i++) {
        let val = values[i]; // 可能是promise 也有可能是普通值
        let then = val && val.then;
        if (typeof then === "function") {
          then.call(
            val,
            (data) => {
              // 获取成功的结果
              processMap(i, data);
            },
            reject
          );
        } else {
          processMap(i, val);
        }
      }
    });
  }
  finally(cb) {
    return this.then(
      (y) => {
        return Promise.resolve(cb()).then(() => y);
      },
      (r) => {
        return Promise.resolve(cb()).then(() => {
          throw r;
        });
      }
    );
  }
}

// 在测试的时候 会测试你的promise对象是否符合规范
// 还可以帮我们创造一个延迟对象
Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
// npm install promises-aplus-tests -g
// promises-aplus-tests 3.promise
// catch Promise.resolve Promise.reject

module.exports = Promise;
```