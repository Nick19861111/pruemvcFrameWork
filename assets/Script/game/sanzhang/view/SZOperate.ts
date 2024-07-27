// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RoomProto from "../../../framework/utils/api/RoomProto";
import Gloab from "../../../Gloab";
import SZModel from "../model/SZModel";
import SZProto from "../SZProto";

const { ccclass, property } = cc._decorator;
/**
 * 添加按钮的相关控制
 */

const RoomMessageRouter = 'game.gameHandler.roomMessageNotify';
const GameMessageRouter = 'game.gameHandler.gameMessageNotify';

@ccclass
export default class SZOperate extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    private compareNodeArray = [];

    onLoad() {
        this.compareNodeArray = [];
        this.showOrHileNode(false);
        cc.find('Layout/AddScorex1/AddBtns', this.node).active = false;

        Gloab.MessageCallback.addListener('RoomMessagePush', this);
        Gloab.MessageCallback.addListener('GameMessagePush', this);
        Gloab.MessageCallback.addListener('ReConnectSuccess', this);
        Gloab.MessageCallback.addListener("DisCarads", this);
    }

    onDestroy(): void {
        Gloab.MessageCallback.removeListener('RoomMessagePush', this);
        Gloab.MessageCallback.removeListener('GameMessagePush', this);
        Gloab.MessageCallback.removeListener('ReConnectSuccess', this);
        Gloab.MessageCallback.removeListener("DisCarads", this);
    }

    //游戏的初始化
    gameInit() {
        let addScores = SZModel.getAddScores();
        let gameRule = SZModel.getGameRule();
        if (SZModel.getCurScore() >= gameRule.maxScore * gameRule.baseScore) {
            for (let i of [1, 2, 3, 4, 5, 10, 20]) {
                cc.find('Layout/AddScorex' + i, this.node).active = false;
            }
        }
        else {
            cc.find('Layout/AddScorex1', this.node).active = true;
        }
        if (SZModel.getCurChairID() == SZModel.getMyChairID() && SZModel.getGameStatus() == SZProto.gameStatus.POUR_SCORE) {
            this.node.active = true;
            let men = SZModel.getGameRule().gameFrameType;
            let userStatus = SZModel.getUserStatusByChairID(SZModel.getMyChairID());
            if ((userStatus & SZProto.userStatus.LOOK) > 0) {
                cc.find('Layout/Cuopai', this.node).active = false;
            }
            else {
                cc.find('Layout/Cuopai', this.node).active = SZModel.getGameRule().cuopai && (men < SZModel.getCurRound());
            }
            cc.find('Layout/Bipai', this.node).active = (men < SZModel.getCurRound());
        }
        else {
            this.node.active = false;
            cc.find('Layout/AddScorex1/AddBtns', this.node).active = false;
        }
    }

    messageCallbackHandler(router, msg) {
        if (!SZModel.getGameInited()) { return; }
        if (router === "DisCarads") {
            
        }
        if (router === 'RoomMessagePush') {
            if (msg.type === RoomProto.GET_ROOM_SCENE_INFO_PUSH) {
                this.gameInit();
            }
        }
        else if (router === 'GameMessagePush') {
            if (msg.type === SZProto.GAME_LOOK_PUSH) {
                if (msg.data.chairID == SZModel.getMyChairID()) {
                    this.gameInit();
                }
            }
            else if (msg.type === SZProto.GAME_TURN_PUSH) {
                this.gameInit();
            }
            else if (msg.type === SZProto.GAME_STATUS_PUSH) {
                this.gameInit();
            }
            else if (msg.type === SZProto.GAME_COMPARE_PUSH) {
                let audio = 'Game/Sanzhang/Audio/woman/cmp';
                let user = SZModel.getUserByChairID(msg.data.fromChairID);
                if (user && user.userInfo.sex == 0) {
                    audio = audio.replace(/woman/, "man");
                }
                Gloab.SoundMgr.playSound(audio);
            }
            else if (msg.type === SZProto.GAME_POUR_SCORE_PUSH) {
                let audio = "";
                if (msg.data.type == 1) {
                    audio = 'Game/Sanzhang/Audio/woman/call';
                }
                else if (msg.data.type == 2) {
                    audio = 'Game/Sanzhang/Audio/woman/raise';
                }
                let user = SZModel.getUserByChairID(msg.data.chairID);
                if (user && user.userInfo.sex == 0) {
                    audio = audio.replace(/woman/, "man");
                }
                Gloab.SoundMgr.playSound(audio);
            }
            else if (msg.type === SZProto.GAME_ABANDON_PUSH) {
                let audio = 'Game/Sanzhang/Audio/woman/fold';
                let user = SZModel.getUserByChairID(msg.data.chairID);
                if (user && user.userInfo.sex == 0) {
                    audio = audio.replace(/woman/, "man");
                }
                Gloab.SoundMgr.playSound(audio);
                if (msg.data.chairID == SZModel.getMyChairID()) {
                    while (this.compareNodeArray.length > 0) {
                        let node = this.compareNodeArray.pop();
                        node.destroy();
                    }
                    cc.find('bg', this.node).active = false;
                }
            }
        }
    }

    //添加
    onAbandonClick() {
        Gloab.NetworkManager.notify(GameMessageRouter, SZProto.gameAbandonNotify(null));
        this.node.active = false;
        cc.find('Layout/AddScorex1/AddBtns', this.node).active = false;
    }

    //比牌
    onCompareClick() {
        let szMainLogic = this.node.parent.getComponent('SZMainDialog');
        let canCompareArray = SZModel.getCanCompareChairIDs();
        let bgNode = cc.find('bg', this.node);
        bgNode.active = true;
        let compareNode = cc.find('Compare', this.node);
        let selfPos = this.node.getPosition();
        for (let chairID of canCompareArray) {
            if (chairID != SZModel.getMyChairID()) {
                let headNodePos = szMainLogic.getHeadNodeByChairID(chairID).getPosition();
                let node = cc.instantiate(compareNode);
                node.parent = this.node;
                node.active = true;
                node.setPosition(cc.v2(headNodePos.x - selfPos.x, headNodePos.y - selfPos.y));
                this.compareNodeArray.push(node);
                node.on(cc.Node.EventType.TOUCH_START, this.compare.bind(this, chairID));
            }
        }
    }

    compare(chairID) {
        while (this.compareNodeArray.length > 0) {
            let node = this.compareNodeArray.pop();
            node.destroy();
        }
        cc.find('bg', this.node).active = false;
        if (SZModel.isUnionCreate()) {
            let myScore = SZModel.getCurScoreByChairID(SZModel.getMyChairID());
            let lookCard = SZModel.getLookCardByChairID(SZModel.getMyChairID());
            let curScore = SZModel.getCurScore() * (lookCard ? 2 : 1);
            if (myScore - curScore < 0) {
                Gloab.DialogManager.addTipDialog('比牌金币不足,只能弃牌');
                return;
            }
        }
        Gloab.NetworkManager.notify(GameMessageRouter, SZProto.gameCompareNotify(chairID));
        this.node.active = false;
        cc.find('Layout/AddScorex1/AddBtns', this.node).active = false;
    }

    //搓牌
    onCuopaiClick() {
        Gloab.DialogManager.addTipDialog("暂时没有开发");
    }

    //跟住
    onGenzhuClick() {
        if (SZModel.isUnionCreate()) {
            let myScore = SZModel.getCurScoreByChairID(SZModel.getMyChairID());
            let lookCard = SZModel.getLookCardByChairID(SZModel.getMyChairID());
            let curScore = SZModel.getCurScore() * (lookCard ? 2 : 1);
            if (myScore - curScore < 0) {
                Gloab.DialogManager.addTipDialog('下注不能超过自己拥有的金币');
                return;
            }
        }
        Gloab.NetworkManager.notify(GameMessageRouter, SZProto.gamePourScoreNotify(SZModel.getCurScore(), 1));
        this.node.active = false;
        cc.find('Layout/AddScorex1/AddBtns', this.node).active = false;
    }

    //追加
    onAddScoreClick(event, param) {
        let index = parseInt(param);
        let score = SZModel.getCurScore() + index * SZModel.getGameRule().baseScore;
        let lookCard = SZModel.getLookCardByChairID(SZModel.getMyChairID());
        /* if (lookCard) { score *= 2; } */
        if (SZModel.isUnionCreate()) {
            let myScore = SZModel.getCurScoreByChairID(SZModel.getMyChairID());
            if (myScore - ((lookCard) ? score * 2 : score) < 0) {
                Gloab.DialogManager.addTipDialog('下注不能超过自己拥有的金币');
                return;
            }
        }
        Gloab.NetworkManager.notify(GameMessageRouter, SZProto.gamePourScoreNotify(score, 2));
        this.node.active = false;
        cc.find('Layout/AddScorex1/AddBtns', this.node).active = false;
    }

    //你要加多少的判断
    onShowAddBtnsClick() {
        let addBtns = cc.find('Layout/AddScorex1/AddBtns', this.node);
        addBtns.active = !addBtns.active;
        for (let i = 1; i <= 4; ++i) {
            let btnLabel = cc.find('Add' + i + '/Background/Label', addBtns);
            if (btnLabel) {
                btnLabel.getComponent(cc.Label).string = "+" + (i * SZModel.getGameRule().baseScore);
            }
        }
    }



    /**
     * 当前界面是显示还是不显示
     * @param bool 
     */
    private showOrHileNode(bool) {
        this.node.active = bool;
    }
}
