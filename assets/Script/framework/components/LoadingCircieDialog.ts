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
    Circle: cc.Node = null; // Node for circular animation

    onLoad() {
    }

    /**
     * Add loading interface
     * @param delay - Delay in seconds before showing the loading circle
     */
    addLoadingCircle(delay: number) {
        cc.log("显示loading")

        this.unscheduleAllCallbacks();//// Stop all scheduled callbacks
        if (delay > 0) {
            this.node.active = true;
            this.Circle.stopAllActions();
            this.Circle.parent.active = false;

            this.scheduleOnce(() => {
                this.Circle.parent.active = true;
                this.Circle.runAction(cc.repeatForever(cc.rotateBy(2, 360)));
            }, delay);
        } else {
            this.node.active = true;
            this.Circle.parent.active = true;
            this.Circle.stopAllActions();
            this.Circle.runAction(cc.repeatForever(cc.rotateBy(2, 360)));
        }
    }

    /**
     * Remove loading interface
     */
    removeLoadingCirle() {
        cc.log("Removing loading interface");
        this.unscheduleAllCallbacks();
        this.Circle.stopAllActions();
        this.node.active = false;
    }
}
