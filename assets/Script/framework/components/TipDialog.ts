// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 弹出文字信息
 */

@ccclass
export default class TipDialog extends cc.Component {

    @property(cc.Node)
    rootNode: cc.Node = null;    //主节点

    @property(cc.Node)
    tipWidget: cc.Node = null;  //tip主类

    onLoad() {

    }

    /**
     * 添加文字的方法
     * @param content 放入的文字 
     */
    addTip(content) {
        //把节点的所有的都跟着运行
        for (let i = 0; i < this.rootNode.childrenCount; ++i) {
            let child = this.rootNode.children[i];
            child.runAction(cc.moveBy(0.1, cc.v2(0, 65)));
        }

        let tipWidget = cc.instantiate(this.tipWidget);//创建
        tipWidget.getChildByName("content").getComponent(cc.Label).string = content;
        tipWidget.active = true;//显示
        tipWidget.scale = 1.05;

        //组合动画
        tipWidget.parent = this.rootNode;
        let scaleAction = cc.scaleTo(0.2, 1);//缩放
        scaleAction.easing(cc.easeBackIn());
        tipWidget.runAction(cc.sequence([scaleAction, cc.delayTime(1.5), cc.fadeOut(0.3), cc.removeSelf()]));
    }
}
