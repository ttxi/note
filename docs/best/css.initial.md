---
sidebarDepth: 2
---

# css initial 和 inherit

- `initial` 默认
- `inherit` 继承
- `unset` 更新
- `revert` 更新

## initial

initial 关键字用于设置 CSS 属性为它的默认值，可作用于任何 CSS 样式。（IE 不支持该关键字）

## inherit

每一个 CSS 属性都有一个特性就是，这个属性必然是默认继承的 (inherited: Yes) 或者是默认不继承的 (inherited: no)其中之一，我们可以在 MDN[1] 上通过这个索引查找，判断一个属性的是否继承特性。

譬如，以 background-color 为例，由下图所示，表明它并不会继承父元素的 background-color

### 可继承属性

最后罗列一下默认为 inherited: Yes 的属性：

- 所有元素可继承：visibility 和 cursor
- 内联元素可继承：letter-spacing、word-spacing、white-space、line-height、color、font、 font-family、font-size、font-style、font-variant、font-weight、text- decoration、text-transform、direction
- 块状元素可继承：text-indent 和 text-align
- 列表元素可继承：list-style、list-style-type、list-style-position、list-style-image
- 表格元素可继承：border-collapse

> 利用 inherit 实现图片倒影功能

## unset

名如其意，`unset` 关键字我们可以简单理解为不设置。其实，它是关键字 `initial` 和 `inherit` 的组合。
什么意思呢？也就是当我们给一个 CSS 属性设置了 `unset` 的话：

1. 如果该属性是默认继承属性，该值等同于 inherit
2. 如果该属性是非继承属性，该值等同于 initial
   举个例子，先列举一些 CSS 中默认继承父级样式的属性：

- 部分可继承样式: `font-size`, `font-family`, `color`, `text-indent`
- 部分不可继承样式: `border`, `padding`, `margin`, `width`, `height`

## revert

revert 是更为新的一个关键字。源自于 CSS Cascading and Inheritance Level 3 (CSS Cascading 3)[6]，直接意译的意思为 -- 恢复。

它与关键字 unset 非常类似，在大部分情况下，他们的作用是一模一样的！唯一的区别是：

- revert：属性应用了该值后，将还原到具有由浏览器或用户创建的自定义样式表（在浏览器侧设置）设置的值
- unset: 属性应用了该值后，样式将完全被还原
