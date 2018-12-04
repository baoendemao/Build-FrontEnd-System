#### preact
* github: https://github.com/developit/preact/
* 官网： https://preactjs.com/
#### 如何使用
* Import 引用你所需要的
```
import { h, render, Component } from 'preact';

``` 

* Preact.Component

```

import { Component } from 'preact';

// Component 是一个父类，您通常会使用子类继承的方式去创建有状态的 Preact 组件。

class MyComponent extends Component {

    // render() 方法是所有组件必需的一个方法。
    // 它可以接受组件的 porps 和 state作为参数，并且这个方法应该返回一个Preact元素或者返回null。
    
    render(props, state) {
        // props === this.props
        // state === this.state

        return <h1>Hello, {props.name}!</h1>;
    }

}

```

* 生命周期
    * componentWillMount
    * componentDidMount	
    * componentWillUnmount
    * componentWillReceiveProps
    * shouldComponentUpdate
    * componentWillUpdate
    * componentDidUpdate

* Preact.render() => render(component, containerNode, [replaceNode]) <br/> 
将一个Preact组件渲染到 containerNode 这个DOM节点上。 返回一个对渲染的DOM节点的引用。<br/>
如果提供了可选的DOM节点参数 replaceNode 并且是 containerNode 的子节点，Preact将使用它的diffing算法来更新或者替换该元素节点。否则，Preact将把渲染的元素添加到 containerNode 上

```
import { render } from 'preact';


// 下面这些例子展示了如何在具有以下HTML标记的页面中执行render()
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');


render(MyComponent, container);
// 将 MyComponent 添加到 container 中
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// 对比 MyComponent 和 <h1>My App</h1> 的不同
//
// <div id="container">
//   <MyComponent />
// </div>

```

* Preact.h() / Preact.createElement() => h(nodeName, attributes, [...children])<br/>返回具有给定 attributes 属性的Preact虚拟DOM元素。
所有的剩余参数都会被放置在一个 children 数组中， 并且是以下所列的任意一种：
    * 纯粹的值（字符串、数字、布尔值、null、undefined等）
    * 虚拟DOM元素
    * 上面两种的嵌套数组

```

import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h(
    'div',
    { id: 'foo' },
    h('span', null, 'Hello!')
);
// <div id="foo"><span>Hello!</span></div>

```