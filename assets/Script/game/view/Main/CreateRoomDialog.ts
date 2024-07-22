// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";
import SZProto from "../../sanzhang/SZProto";

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

    private szGameRule: any = {};

    onLoad() {
        this.gameType = Gloab.Enum.gameType.PDK;
        this.szGameRule = {
            bureau: 6,
            minPlayerCount: 2,
            maxPlayerCount: 6,
            gameType: Gloab.Enum.gameType.SZ,
            gameFrameType: SZProto.gameType.NONE,
            roundType: SZProto.roundType.ROUND10,
            fangzuobi: false, /* 防作弊 */
            addScores: [1], /* 加注分 */
            maxScore: 4, /* 最大加注分 */
            canTrust: false,
            canEnter: false,
            cuopai: false,
            canWatch: false,
            yuyin: false,
            baseScore: 1,

        };//初始化所有规则
    }


    //点击事件
    onGameTypeClick(event, params) {
        if (params == "PDK") {
            this.gameType = Gloab.Enum.gameType.PDK;
        }
        else if (params == "NN") {
            this.gameType = Gloab.Enum.gameType.NN;
        } else if (params == "SG") {
            this.gameType = Gloab.Enum.gameType.SG;
        } else if (params == "SZ") {
            this.gameType = Gloab.Enum.gameType.SZ;
        }
        else if (params == "ZNMJ") {
            this.gameType = Gloab.Enum.gameType.ZNMJ;
        }
        else if (params == "DGN") {
            this.gameType = Gloab.Enum.gameType.DGN;
        }

        this.pkRuleNode.active = (params == "PDK");
        this.nnRuleNode.active = (params == "NN");
        this.sgRuleNode.active = (params == "SG");
        this.szRuleNode.active = (params == "SZ");
        this.znmjRuleNode.active = (params == "ZNMJ");
        this.dgnRuleNode.active = (params == "DGN");
    }

    //点击事件
    onBtnClk(event, params) {
        switch (params) {
            case "close":
                Gloab.DialogManager.destroyDialog(this);
                break;
            case "createRoom":
                this.createRoomFun();
                break;
        }
    }

    /**
     * 创建房间的方法
     */
    createRoomFun() {
        let gameRule: any = {};
        if (this.gameType == Gloab.Enum.gameType.SZ) {
            console.log("点击了三张以后的创建");
            gameRule = this.szGameRule;
        }

        Gloab.DialogManager.addLoadingCircle();
        gameRule.roomType = this.gameType;
        if (!gameRule.payType) gameRule.payType = Gloab.Enum.roomPayType.AAZHIFU;
        //实际支付需要计算钻石数量
        //发送消息
        Gloab.Api.hallApi.createRoomRequest(gameRule, null, 1);
    }
}
