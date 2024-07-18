// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 弹窗的动作，这个就是设计模式思想的把工作分开，然后在组合
 * apple
 */

@ccclass
export default class DialogActionWidgetCtrl extends cc.Component {


    @property(cc.Node)
    maskNode: cc.Node = null;   //弹窗的背景

    @property(cc.Node)
    popUpNode: cc.Node = null;  //弹窗的主体

    onLoad() {
        this.dialogIn();
    }

    /**
     * 打开的时候的效果
     */
    dialogIn() {
        if (!!this.maskNode) {
            this.maskNode.opacity = 0;//透明度
            this.maskNode.runAction(cc.fadeTo(0.3, 150));
        }

        if (!!this.popUpNode) {
            this.popUpNode.scale = 0.1;
            let action = cc.scaleTo(0.2, 1);
            action.easing(cc.easeBackOut());
            this.popUpNode.runAction(action);
        }
    }

    /**
     * 关闭方法
     */
    dialogOut(cb) {
        //如果不存在
        if (!this.maskNode && !this.popUpNode) {
            Gloab.Utils.invokeCallback(cb);
            return;
        }

        if (!!this.maskNode) {
            this.maskNode.runAction(cc.sequence([cc.fadeTo(0.3, 0), cc.callFunc(function () {
                Gloab.Utils.invokeCallback(cb);
            })]))
        }

        if (!!this.popUpNode) {
            let action = cc.scaleTo(0.2, 0);
            action.easing(cc.easeBackIn());
            if (!this.maskNode) {
                this.popUpNode.runAction(cc.sequence([action, cc.callFunc(function () {
                    Gloab.Utils.invokeCallback(cb);
                })]))
            }
            else {
                this.popUpNode.runAction(action);
            }
        }
    }
}
