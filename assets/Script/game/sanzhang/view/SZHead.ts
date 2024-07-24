// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RoomProto from "../../../framework/utils/api/RoomProto";
import Gloab from "../../../Gloab";
import SZModel from "../model/SZModel";

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
