# css2

## 子组合选择器和同层组合选择器：>、+和~;

### >
子组合选择器>选择一个元素的直接子元素
```css
article > section { border: 1px solid #ccc }
```
### +
用同层相邻组合选择器+选择header元素后紧跟的p元素
```css
header + p { font-size: 1.1em }
```
### ~
同层全体组合选择器~，选择所有跟在article后的同层article元素
```css
article ~ article { border-top: 1px dashed #ccc }
```