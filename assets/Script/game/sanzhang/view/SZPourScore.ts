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
 * 用户的骰子的显示类
 */

@ccclass
export default class SZPourScore extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    private pourNodeArray = [];

    //ui部分
    private areaNode: cc.Node = null;
    private label: cc.Label = null;
    onLoad() {
        this.pourNodeArray = [];

        this.areaNode = cc.find("area", this.node);
        this.label = cc.find("pool/Label", this.node).getComponent(cc.Label);

        this.node.active = false;

        Gloab.MessageCallback.addListener('RoomMessagePush', this);
        Gloab.MessageCallback.addListener('GameMessagePush', this);
        Gloab.MessageCallback.addListener('ReConnectSuccess', this);
    }

    protected onDestroy(): void {
        Gloab.MessageCallback.removeListener('RoomMessagePush', this);
        Gloab.MessageCallback.removeListener('GameMessagePush', this);
        Gloab.MessageCallback.removeListener('ReConnectSuccess', this);
    }

    //监听事件 
    messageCallbackHandler(router, msg) {
        if (!SZModel.getGameInited()) { return; }

        if (router === 'RoomMessagePush') {
            if (msg.type === RoomProto.GET_ROOM_SCENE_INFO_PUSH) {
                this.gameInit();
            }
        }
        else if (router === 'GameMessagePush') {
            if (msg.type === SZProto.GAME_STATUS_PUSH) {
                if (msg.data.gameStatus == SZProto.gameStatus.NONE) {
                    this.label.string = '金池：0';
                }
                else {
                    this.node.active = true;
                }
            }
            else if (msg.type === SZProto.GAME_POUR_SCORE_PUSH) {
                this.pourScores(msg.data.chairID, msg.data.score);
                this.label.string = '金池：' + msg.data.scores;
            }
            else if (msg.type === SZProto.GAME_RESULT_PUSH) {
                this.winScores(msg.data.result.winners);
            }
        }
    }

    //数据进行初始化操作
    gameInit() {
        console.log("SZPourScore gameInit");
        if (this.pourNodeArray.length > 0) {
            for (let node of this.pourNodeArray) {
                node.destroy();
            }
            this.pourNodeArray = [];
        }
        if (SZModel.getGameStatus() == SZProto.gameStatus.POUR_SCORE || SZModel.getGameStatus() == SZProto.gameStatus.RESULT) {
            this.node.active = true;
            let num = 0;
            for (let scores of SZModel.getPourScores()) {
                if (scores) {
                    for (let score of scores) {
                        if (!SZModel.getResult()) {
                            this.pourScores(null, score);
                        }
                        num += score;
                    }
                }
            }
            this.label.string = '金池：' + num;
        }
        else {
            this.node.active = false;
        }
    }

    //当前添加的是那个骰子
    pourScores(chairID, score) {
        let array = [1, 2, 3, 4, 5, 10, 20];
        while (array.length > 0) {
            let item = array.pop();
            while (score >= item) {
                score -= item;
                this.pourScore(chairID, item);
            }
        }
    }

    //添加骰子的核心方法
    pourScore(chairID, score) {
        let url = 'Game/Sanzhang/' + score;
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        Gloab.CCHelper.updateSpriteFrame(url, sprite);
        node.parent = this.areaNode;
        this.pourNodeArray.push(node);
        if (chairID == null) {
            node.setScale(0.5);
            node.setPosition(this.getRandomPos());
        }
        else {
            let headNode = this.node.parent.getComponent('SZMainDialog').getHeadNodeByChairID(chairID);
            if (headNode != null) {
                node.setPosition(headNode.getPosition());
            }
            else {
                node.setPosition(cc.v2(0, 0));
            }
            node.setScale(0.2);
            node.runAction(cc.moveTo(0.25, this.getRandomPos()));
            node.runAction(cc.scaleTo(0.25, 0.5));
            this.scheduleOnce(() => {
                Gloab.SoundMgr.playSound('Game/Common/Audio/down_coin');
            }, 0.25);
        }
    }

    getRandomPos() {
        let x = 250 - Math.random() * 500;
        let y = 100 - Math.random() * 200;
        while ((x > -110 && x < 110) && (y >= -100 && y < 55)) {
            x = 250 - Math.random() * 500;
            y = 100 - Math.random() * 200;
        }
        return cc.v2(x, y);
    }

    winScores(chairIDs) {
        let posList = [];
        for (let chairID of chairIDs) {
            let headNode = this.node.parent.getComponent('SZMainDialog').getHeadNodeByChairID(chairID);
            let pos = headNode.getPosition();
            posList.push(pos);
        }
        let i = 0;
        for (let node of this.pourNodeArray) {
            let pos = posList[i % posList.length];
            ++i;
            node.runAction(cc.sequence(
                cc.moveTo(0.25, pos),
                cc.removeSelf()
            ));
        }
        this.scheduleOnce(() => {
            Gloab.SoundMgr.playSound('Game/Common/Audio/shoujin');
        }, 0.25);
        this.pourNodeArray = [];
    }
}
