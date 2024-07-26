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

var RoomMessageRouter = 'game.gameHandler.roomMessageNotify';
var GameMessageRouter = 'game.gameHandler.gameMessageNotify';

@ccclass
export default class SZHead extends cc.Component {


    private seatNames;
    private msgbg;
    private headSprite;
    private nameLabel;
    private idLabel;
    private scoreNode;
    private scoreNodePos;
    private scoreLabel;
    private goldNode;
    private bankerNode;
    private readyNode;
    private readyNodePos;
    private fangzhuNode;
    private light;
    private winScoreNode;
    private loseScoreNode;
    private seatNode;
    private index;
    onLoad() {
        this.seatNames = ['北京', '上海', '广州', '天津', '重庆', '香港', '南京', '澳门', '海口', '深圳'];
        this.msgbg = cc.find('msgbg', this.node);
        this.headSprite = cc.find('head', this.node).getComponent(cc.Sprite);
        this.nameLabel = cc.find('name', this.node).getComponent(cc.Label);
        this.idLabel = cc.find('id', this.node).getComponent(cc.Label);
        this.scoreNode = cc.find('scorebg', this.node);
        this.scoreNodePos = this.scoreNode.getPosition();
        this.scoreLabel = cc.find('gold', this.scoreNode).getComponent(cc.Label);
        this.goldNode = cc.find('icon', this.scoreNode);
        this.bankerNode = cc.find('banker', this.node);
        this.readyNode = cc.find('ready', this.node);
        this.readyNodePos = this.readyNode.getPosition();
        this.fangzhuNode = cc.find('fangzhu', this.node);
        this.light = this.node.getChildByName('light');
        this.node.active = false;

        this.winScoreNode = this.node.getChildByName('winscore');
        this.loseScoreNode = this.node.getChildByName('losescore');
        Gloab.MessageCallback.addListener('RoomMessagePush', this);
        Gloab.MessageCallback.addListener('GameMessagePush', this);
        Gloab.MessageCallback.addListener('ReConnectSuccess', this);
    }

    onDestroy() {
        Gloab.MessageCallback.removeListener('RoomMessagePush', this);
        Gloab.MessageCallback.removeListener('GameMessagePush', this);
        Gloab.MessageCallback.removeListener('ReConnectSuccess', this);
    }

    /**
     * 获得消息的操作
     * @param router 
     * @param msg 
     */
    messageCallbackHandler(router, msg) {
        if (!SZModel.getGameInited()) { return; }
        if (router === 'RoomMessagePush') {
            if (msg.type === RoomProto.GET_ROOM_SCENE_INFO_PUSH) {
                this.gameInit();
            }
            else if (msg.type === RoomProto.USER_READY_PUSH) {
                if (msg.data.chairID == SZModel.getMyChairID() && SZModel.getCurBureau() == 0) {
                    this.gameInit();
                }
                if (this.node.active && msg.data.chairID == this.getChairID()) {
                    this.readyNode.active = true;
                    this.scoreNode.active = false;
                }
                if (this.node.active && msg.data.chairID == SZModel.getMyChairID()) {
                    let user = SZModel.getUserByChairID(this.getChairID());
                    if (user) {
                        this.scoreNode.active = false;
                        this.readyNode.active = (user.userStatus & RoomProto.userStatusEnum.READY);
                        this.bankerNode.active = (SZModel.getBankerChairID() == this.getChairID());
                        this.winScoreNode.active = false;
                        this.loseScoreNode.active = false;
                    }
                }
            }
            else if (msg.type === RoomProto.OTHER_USER_ENTRY_ROOM_PUSH) {
                if (msg.data.roomUserInfo.chairID == this.getChairID()) {
                    this.gameInit();
                }
            }
            else if (msg.type === RoomProto.USER_LEAVE_ROOM_PUSH) {
                if (msg.data.roomUserInfo.chairID == this.getChairID()) {
                    this.node.active = false;
                }
            }
            else if (msg.type === RoomProto.USER_CHANGE_SEAT_PUSH) {
                if (SZModel.getCurBureau() == 0) {
                    this.gameInit();
                }
                else {
                    if (SZModel.getMyUid() != msg.data.uid) {
                        if (this.getChairID() == msg.data.fromChairID || this.getChairID() == msg.data.toChairID) {
                            this.gameInit();
                        }
                    }
                    else {
                        this.gameInit();
                    }
                }
            }
            else if (msg.type === RoomProto.ROOM_USER_INFO_CHANGE_PUSH) {
                let user = SZModel.getUserByChairID(this.getChairID());
                if (this.node.active && user) {
                    /* this.idLabel.string = Math.floor(user.userInfo.score); */
                    this.idLabel.string = SZModel.getCurScoreByChairID(this.getChairID());
                }
            }
            else if (msg.type === RoomProto.USER_OFF_LINE_PUSH) {
                if (msg.data.chairID == this.getChairID()) {
                    cc.find('offline', this.node).active = true;
                }
            }
        }
        else if (router === 'GameMessagePush') {
            if (msg.type === SZProto.GAME_BANKER_PUSH) {
                this.setBanker();
            }
            else if (msg.type === SZProto.GAME_POUR_SCORE_PUSH) {
                if (msg.data.chairID == this.getChairID()) {
                    this.setPourScore(msg.data.chairScore);
                    this.idLabel.string = SZModel.getCurScoreByChairID(this.getChairID());
                }
            }
            else if (msg.type === SZProto.GAME_STATUS_PUSH) {
                if (msg.data.gameStatus != SZProto.gameStatus.NONE) {
                    this.readyNode.active = false;
                }
                else {
                    this.idLabel.string = SZModel.getCurScoreByChairID(this.getChairID());
                }
                if (msg.data.gameStatus == SZProto.gameStatus.SEND_CARDS) {
                    let user = SZModel.getUserByChairID(this.getChairID());
                    if (user) {
                        this.scoreNode.active = false;
                        /* this.readyNode.active = (user.userStatus&RoomProto.userStatusEnum.READY);  */
                        this.readyNode.active = false;
                        this.bankerNode.active = (SZModel.getBankerChairID() == this.getChairID());
                        this.winScoreNode.active = false;
                        this.loseScoreNode.active = false;
                    }
                }
                if (SZModel.getGameStatus() == SZProto.gameStatus.POUR_SCORE && this.getChairID() == SZModel.getCurChairID()) {
                    this.light.active = true;
                }
                else {
                    this.light.active = false;
                }
            }
            else if (msg.type === SZProto.GAME_RESULT_PUSH) {
                if (SZModel.getUserByChairID(this.getChairID())) {
                    this.showResultScore(true);
                    this.idLabel.string = SZModel.getCurScoreByChairID(this.getChairID());
                }
            }
            else if (msg.type === SZProto.GAME_CHAT_PUSH) {
                //this.gameChat(msg.data);
            }
            else if (msg.type === SZProto.GAME_TURN_PUSH) {
                if (SZModel.getGameStatus() == SZProto.gameStatus.POUR_SCORE && this.getChairID() == SZModel.getCurChairID()) {
                    this.light.active = true;
                }
                else {
                    this.light.active = false;
                }
            }
        }
    }

    setBanker() {
        let is_banker = (SZModel.getBankerChairID() == this.getChairID());
        this.bankerNode.active = is_banker;
    }

    /**
     * 头像的初始化
     */
    gameInit() {
        console.log("SZHead gameInit");
        if (typeof (this.index) != 'number') { return; } /* 未使用，等待销毁 */
        this.node.active = true;
        let user = SZModel.getUserByChairID(this.getChairID());
        //判断作为是否存在是的话就吧数据初始化
        if (!user) {
            let ready = (SZModel.getUserByChairID(SZModel.getMyChairID()).userStatus & RoomProto.userStatusEnum.READY);
            if ((SZModel.getCurBureau() == 0 && !ready) || (SZModel.getMyChairID() >= SZModel.getChairCount() && SZModel.getGameRule().canEnter)) {
                this.showSeat();
            }
            else {
                this.hideSeat();
                this.node.active = false;
            }
            return;
        }
        else {
            this.hideSeat();
        }

        //复制相关的操作
        this.nameLabel.string = user.userInfo.nickname;
        Gloab.CCHelper.updateSpriteFrame(user.userInfo.avatar, this.headSprite);
        this.idLabel.string = SZModel.getCurScoreByChairID(this.getChairID());
        let is_creator = (SZModel.getRoomCreatorChairID() == this.getChairID());
        this.fangzhuNode.active = is_creator; //房主的操作
        this.readyNode.active = (user.userStatus & RoomProto.userStatusEnum.READY);
        this.bankerNode.active = (this.getChairID() == SZModel.getBankerChairID());
        let score = SZModel.getPourScoreByChairID(this.getChairID());
        this.setPourScore(score);
        this.showResultScore();
        cc.find('offline', this.node).active = (user.userStatus & RoomProto.userStatusEnum.OFFLINE) > 0;
        if (SZModel.getGameStatus() == SZProto.gameStatus.POUR_SCORE && this.getChairID() == SZModel.getCurChairID()) {
            this.light.active = true;
        }
        else {
            this.light.active = false;
        }
    }

    showResultScore(animal?) {
        this.winScoreNode.active = false;
        this.loseScoreNode.active = false;
        let result = SZModel.getResult();
        if (result) {
            let score = Math.floor(result.winScores[this.getChairID()]);
            if (score > 0) {
                this.winScoreNode.active = true;
                this.winScoreNode.getComponent(cc.Label).string = '+' + Math.floor(score);
                if (animal) {
                    this.winScoreNode.x = -50;
                    this.winScoreNode.runAction(cc.moveTo(0.2, cc.v2(0, 22)).easing(cc.easeIn(3.0)));
                }
            }
            else if (score < 0) {
                this.loseScoreNode.active = true;
                this.loseScoreNode.getComponent(cc.Label).string = '' + Math.floor(score);
                if (animal) {
                    this.loseScoreNode.x = -50;
                    this.loseScoreNode.runAction(cc.moveTo(0.2, cc.v2(0, 22)).easing(cc.easeIn(3.0)));
                }
            }
            else if (result.winners.indexOf(this.getChairID()) != -1) {
                this.winScoreNode.active = true;
                this.winScoreNode.getComponent(cc.Label).string = '+' + Math.floor(score);
                if (animal) {
                    this.winScoreNode.x = -50;
                    this.winScoreNode.runAction(cc.moveTo(0.2, cc.v2(0, 22)).easing(cc.easeIn(3.0)));
                }
            }
        }
    }

    /*
     * 设置下分
     */
    setPourScore(score) {
        if (score == 0 || score == null) {
            this.scoreNode.active = false;
        }
        else {
            this.scoreLabel.string = Math.floor(score);
            this.scoreNode.active = true;
        }
    }

    showSeat() {
        let names = ['msgbg', 'head', 'headedg', 'fangzhu', 'name', 'id', 'robstate', 'scorebg', 'banker', 'winscore', 'losescore', 'light', 'text', 'ready', 'offline'];
        for (let name of names) {
            let node = this.node.getChildByName(name);
            if (node) {
                node.active = false;
            }
        }
        this.refrushName();
    }

    hideSeat() {
        if (this.seatNode) {
            this.seatNode.active = false;
        }
        let names = ['msgbg', 'head', 'headedg', 'name', 'id', 'robstate', 'scorebg', 'banker', 'winscore', 'losescore', 'ready'];
        for (let name of names) {
            let node = this.node.getChildByName(name);
            if (node) {
                node.active = true;
            }
        }
    }

    refrushName() {
        if (!this.seatNode) {
            let node = new cc.Node();
            node.setPosition(this.msgbg.getPosition());
            node.parent = this.node;

            let bgNode = new cc.Node();
            bgNode.parent = node;
            cc.loader.loadRes('Game/Common/citybg', cc.SpriteFrame, (err, spriteFrame) => {
                if (!err) {
                    bgNode.addComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                if (this.msgbg.width > this.msgbg.height) {
                    bgNode.angle = -90;
                    bgNode.width = this.msgbg.height;
                    bgNode.height = this.msgbg.width;
                }
                else {
                    bgNode.height = this.msgbg.height;
                    bgNode.width = this.msgbg.width;
                }
            });

            let labelNode = new cc.Node();
            labelNode.color = new cc.Color(255, 255, 255);
            labelNode.name = 'Label';
            labelNode.parent = node;
            labelNode.y = 10;
            let label = labelNode.addComponent(cc.Label);
            label.fontSize = 25;
            label.string = this.seatNames[this.getChairID()];

            bgNode.on(cc.Node.EventType.TOUCH_END, this.onSeatClick.bind(this), this);
            this.seatNode = node;

            let arrow = new cc.Node();
            arrow.parent = node;
            arrow.y = -15;
            cc.loader.loadRes('Game/Common/jiantou', cc.SpriteFrame, (err, spriteFrame) => {
                if (!err) { arrow.addComponent(cc.Sprite).spriteFrame = spriteFrame; }
            });
            arrow.setScale(0.8);
        }
        else {
            this.seatNode.active = true;
            cc.find('Label', this.seatNode).getComponent(cc.Label).string = this.seatNames[this.getChairID()];
        }
    }

    getChairID() {
        if (SZModel.getMyChairID() >= SZModel.getChairCount()) {
            return this.index;
        }
        else {
            return (SZModel.getMyChairID() + this.index) % SZModel.getChairCount();
        }
    }

    onSeatClick() {
        if (SZModel.isUnionCreate()) {
            let user = SZModel.getUserByChairID(SZModel.getMyChairID());
            if (user.userInfo.score < SZModel.getGameRule().scoreLowLimit) {
                Gloab.DialogManager.addTipDialog('金币不足，不能入座');
                return;
            }
        }

        Gloab.NetworkManager.notify(RoomMessageRouter, RoomProto.getUserChangeSeatNotify(SZModel.getMyChairID(), this.getChairID()));
    }

    /**
     * 设置位置
     * @param index 
     */
    setIndex(index) {
        this.index = index;
        if (this.index == 0 && cc.visibleRect.width / cc.visibleRect.height > 1.8) {
            this.readyNode.x = cc.visibleRect.width / 2 - 1334 / 2 + this.readyNodePos.x;
            this.scoreNode.x = cc.visibleRect.width / 2 - 1334 / 2 + this.scoreNodePos.x;
        }
    }
}
