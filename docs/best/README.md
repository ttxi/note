---
sidebarDepth: 2
---

# js 优化

## 防抖（debounce）

### 1、非立即执行版

```js
function debounce(func, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
```

> 非立即执行版的意思是触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间

使用

```js
document.onmousemove = debounce(() => {}, 1000)
```

### 2、立即执行版

```js
function debounce(func, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    let callNow = !timeout
    timeout = setTimeout(() => {
      timeout = null
    }, wait)
    if (callNow) func.apply(context, args)
  }
}
```

> 立即执行版的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。

### 3、双剑合璧版

```js
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}
```

## 节流（throttle）

### 1、时间戳版：

```js
function throttle(func, wait) {
  let previous = 0
  return function () {
    let now = Date.now()
    let context = this
    let args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
```

使用

```js
content.onmousemove = throttle(count, 1000)
```

### 2、定时器版:

```js
function throttle(func, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}
```

区别：
我们应该可以很容易的发现，其实时间戳版和定时器版的节流函数的区别就是，时间戳版的函数触发是在时间段内开始的时候，而定时器版的函数触发是在时间段内结束的时候

### 3、双剑合璧版:

```js
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func, wait, type) {
  if (type === 1) {
    let previous = 0
  } else if (type === 2) {
    let timeout
  }
  return function () {
    let context = this
    let args = arguments
    if (type === 1) {
      let now = Date.now()
      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
```

