// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 添加按钮的相关控制
 */

@ccclass
export default class SZOperate extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.showOrHileNode(false);
    }

    onDestroy(): void {

    }

    /**
     * 当前界面是显示还是不显示
     * @param bool 
     */
    private showOrHileNode(bool) {
        this.node.active = bool;
    }
}
