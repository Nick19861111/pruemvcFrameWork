// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 广播的相关操作类
 */

@ccclass
export default class BroadcastWidgetCtrl extends cc.Component {

    @property(cc.RichText)
    noticeText: cc.RichText = null; //滚动的文字

    @property(cc.Node)
    rootNode: cc.Node = null;

    private broadcastCountents = []; //消息的列表
    onLoad() {
        Gloab.MessageCallback.addListener("BroadcastPush", this);//监听推送事件

        this.broadcastCountents = [];

        
    }
}
