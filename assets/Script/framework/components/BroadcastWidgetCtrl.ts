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

        //广播是否有数据
        let content = Gloab.CondigModel.getData("loopBroadcastContent");
        if (!!content) {
            this.broadcastCountents.push({
                type: 1,//测试完了以后需要编写固定的节点类
                content: content
            })
        }

        this.startNext();

        //测试每个30秒进行广播一次
        this.schedule(function () {
            if (this.broadcastCountents.length > 0) return;

            let content = Gloab.CondigModel.getData("loopBroadcastContent");

            if (!!content) {
                this.broadcastCountents = [
                    {
                        type: 1,
                        content: content
                    }
                ]
            }
            this.startNext();
        }.bind(this), 30);
    }

    protected onDestroy(): void {
        Gloab.MessageCallback.removeListener("BroadcastPush", this);
    }

    private startNext() {
        //不显示的状态
        if (this.rootNode.active) return; //现在显示就不显示

        if (this.broadcastCountents.length === 0) {
            this.rootNode.active = false;
            return;
        }
        //end

        //显示状态
        this.rootNode.active = true;
        this.noticeText.node.x = 0;

        let scrollSpeed = 100;
        let distance = this.noticeText.node.width + this.noticeText.node.parent.width + 50;//滚动的宽度
        let time = distance / scrollSpeed;
        let move = cc.moveBy(time, -distance, 0);

        let broadcastContent = this.broadcastCountents.shift();//播放完成就减少数据里面的数据
        //系统和大奖
        if (broadcastContent.type == 1 || broadcastContent.type == 2) {
            this.noticeText.string = "<outline width=1 color=#000000><color=#ffffff>" + broadcastContent.content + "</c></outline>";
        }
        else if (broadcastContent.type == 3) {
            //大奖尚未完成
            let gameName = "";
            switch (broadcastContent.content.kind) {
                case 1:
                    gameName = "炸金花";
                    break;
                case 2:
                    gameName = "抢庄牛牛";
                    break;
                case 3:
                    gameName = "百人牛牛";
                    break;
            }
        }

        //移动
        let moveEnd = cc.callFunc(function () {
            this.rootNode.account = false;
            this.startNext();
        }.bind(this));

        let act = cc.sequence([move, moveEnd]);
        this.noticeText.node.runAction(act);
    }

    //监听自定义事件
    messageCallbackHandler(router, msg) {
        switch (router) {
            case "BroadcastPush":
                this.broadcastCountents.push(msg);
                if (this.broadcastCountents.length > 10) {
                    this.broadcastCountents.shift();//大于10条就进行删除
                }
                this.startNext();
                break;
        }
    }
}
