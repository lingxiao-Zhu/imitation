# css 常见问题

## 1.尽量使用尽可能多的方式实现子元素的垂直水平居中

```html
<div class="father">
  <div class="child"></div>
</div>
<style>
  .father {
    width: 300px;
    height: 300px;
  }
  .child {
  }
</style>
```

### 1.1 行内元素：inline + text-align

```css
.father {
  text-align: center;
  line-height: 300px;
}
.child {
  display: inline-block;
}
```

### 1.2 绝对定位：margin

```css
.father {
  position: relative;
}
.child {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

### 1.3 绝对定位：trasnform

```css
.father {
  position: relative;
}
.child {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%, 0);
}
```

### 1.4 flex 布局

```css
.father {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 1.5 table 布局

```css
.father {
  display: table;
}
.child {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
```

## 2.尽可能多的方式实现如下三栏布局，要求 .main 在中间显示

```html
<div class="container">
  <div class="main"></div>
  <div class="sub"></div>
  <div class="extra"></div>
</div>
```

### flex 布局 + order

```css
.container {
  display: flex;
}
.sub {
  order: 1;
}
.extra {
  order: 3;
}
.main {
  order: 2;
}
```

### gird 布局

```css
```

### 圣杯布局和双飞翼布局
