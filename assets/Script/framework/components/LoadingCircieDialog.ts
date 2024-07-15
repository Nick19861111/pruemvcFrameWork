// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * loading 界面出现
 */

@ccclass
export default class LoadingCircieDialog extends cc.Component {

    @property(cc.Node)
    Circle: cc.Node = null; //循环操作的节点

    onLoad() {

    }

    /**
     * 添加loading界面
     * @param delay 
     */
    addLoadingCircle(delay) {
        cc.log("显示loading")

        this.unscheduleAllCallbacks();//停止所有的毁掉
        if (!!delay) {
            this.node.active = true;
            this.Circle.stopAllActions();//停止所有动作
            this.Circle.parent.active = false;

            this.scheduleOnce(function () {

                this.Circle.parent.active = true;
                this.Circle.runAction(cc.repeatForever(cc.rotateBy(2, 360)));

            }.bind(this), delay);
        }
        else {

            this.node.active = true;
            this.Circle.parent.active = true;
            this.Circle.stopAllActions();
            this.Circle.runAction(cc.repeatForever(cc.rotateBy(2, 360)));

        }
    }

    /**
     * 删除loading界面
     */
    removeLoadingCirle() {
        cc.log("移除loading界面");

        this.unscheduleAllCallbacks();
        this.Circle.stopAllActions();
        this.node.active = false;
    }
}
