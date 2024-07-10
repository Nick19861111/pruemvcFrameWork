## 游戏框架的说明

------

#### 核心的框架

Framework 框架说明

components：组件

list，listiem虚拟列表的基础使用

使用方式把list挂入到sv组件上，然后在要复刻的子组件进行放入到列表中

下面为核心的代码

```typescript
//创建三个字节点
onLoad() {
    this.data = [];
    for (let n: number = 0; n < 3; n++) {
        this.data.push(n);
    }
    this.listH.numItems = this.data.length;
    this.listV.numItems = this.data.length;
}
 
onListRender(item: cc.Node, idx: number) {
    item.getComponentInChildren(cc.Label).string = this.data[idx] + '';
}
```

