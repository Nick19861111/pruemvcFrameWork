// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 创建房间规则操作
 */

@ccclass
export default class CreateRoomDialog extends cc.Component {

    @property(cc.Node)
    pkRuleNode: cc.Node = null; //扑克规则节点

    @property(cc.Node)
    nnRuleNode: cc.Node = null;//牛牛规则

    @property(cc.Node)
    dgnRuleNode: cc.Node = null;

    @property(cc.Node)
    sgRuleNode: cc.Node = null; //3公

    @property(cc.Node)
    szRuleNode: cc.Node = null; //3张

    @property(cc.Node)
    znmjRuleNode: cc.Node = null;//麻将


    //左边的按钮部分
    @property(cc.Toggle)
    leftPdkToggle: cc.Toggle = null; //跑的快

    @property(cc.Toggle)
    leftPszToggle: cc.Toggle = null;

    @property(cc.Toggle)
    leftNnToggle: cc.Toggle = null;

    @property(cc.Toggle)
    leftDgnToggle: cc.Toggle = null;

    @property(cc.Toggle)
    leftSgToggle: cc.Toggle = null;

    @property(cc.Toggle)
    leftZnmjToggle: cc.Toggle = null;

    private gameType: number = -1;

    onLoad() {
        this.gameType = Gloab.Enum.gameType.PDK;
    }


    //点击事件
    onGameTypeClick(event, params) {

    }

    //点击事件
    onBtnClk(event,params){
        switch(params){
            case "close":
                Gloab.DialogManager.destroyDialog(this);
                break;
        }
    }
}
