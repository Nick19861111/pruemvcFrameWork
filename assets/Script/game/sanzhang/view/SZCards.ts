// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";
import SZLogic from "../model/SZLogic";
import SZModel from "../model/SZModel";
import SZProto from "../SZProto";

const { ccclass, property } = cc._decorator;

/**
 * 牌的控制
 */
@ccclass
export default class SZCards extends cc.Component {

    private cardsNode: cc.Node = null;

    private cardTypeNode: cc.Node = null;

    private stateNode: cc.Node = null;

    private cardsNodeArray = [];

    private cardsNodePosArray = [];

    private cardTypeNodePos;

    private index;

    onLoad() {
        this.cardsNode = cc.find('cards', this.node);
        this.cardTypeNode = cc.find('typebg', this.node);
        this.stateNode = cc.find('state', this.node);

        this.cardsNode.active = false;
        this.cardTypeNode.active = false;
        this.stateNode.active = false;

        this.cardsNodeArray = [];
        this.cardsNodePosArray = [];

        for (let i = 1; i <= 5; i += 2) {
            let node = this.cardsNode.getChildByName('card' + i);
            this.cardsNodeArray.push(node);
            this.cardsNodePosArray.push(node.getPosition());
        }
        this.cardTypeNodePos = this.cardTypeNode.getPosition();

        Gloab.MessageCallback.addListener('RoomMessagePush', this);
        Gloab.MessageCallback.addListener('GameMessagePush', this);
        Gloab.MessageCallback.addListener('ReConnectSuccess', this);
        Gloab.MessageCallback.addListener('UpdateGameCardBg', this);
    }

    setIndex(index) {
        this.index = index;
    }

    getChairID() {
        if (SZModel.getMyChairID() >= SZModel.getChairCount()) {
            return this.index;
        }
        else {
            return (SZModel.getMyChairID() + this.index) % SZModel.getChairCount();
        }
    }

    gameInit() {
        console.log("SZCards gameInit");
        if (typeof (this.index) != 'number') { return; }
        let cards = SZModel.getHandCardsByChairID(this.getChairID());
        this.cardsNode.active = false;
        this.cardTypeNode.active = false;
        if (cards) {
            for (let i = 0; i < this.cardsNodeArray.length; ++i) {
                this.cardsNodeArray[i].setPosition(this.cardsNodePosArray[i]);
                this.cardsNodeArray[i].setScale(1);
            }
            this.node.active = true;
            this.sendCards();
            let canShowType = true;
            for (let i = 0; i < cards.length; ++i) {
                if (cards[i] == 0) {
                    canShowType = false;
                }
            }
            if (canShowType) {
                this.showType();
            }
        }
        this.updateStateSprite();
    }

    updateStateSprite() {
        let userStatus = SZModel.getUserStatusByChairID(this.getChairID());
        if (userStatus == 0 || SZModel.getGameStatus() == SZProto.gameStatus.RESULT) {
            this.stateNode.active = false;
            return;
        }
        this.stateNode.active = true;
        let url = 'Game/Sanzhang/';
        if ((userStatus & SZProto.userStatus.LOSE) > 0) {
            url += 'bipaishibai';
        }
        else if ((userStatus & SZProto.userStatus.TIMEOUTABANDON) > 0) {
            /* url += 'chaoshiqipai'; */
            url += 'yiqipai';
        }
        else if ((userStatus & SZProto.userStatus.ABANDON) > 0) {
            url += 'yiqipai';
        }
        else if ((userStatus & SZProto.userStatus.LOOK) > 0) {
            url += 'yikanpai';
            if (this.getChairID() == SZModel.getMyChairID()) {
                this.stateNode.active = false;
            }
        }
        Gloab.CCHelper.updateSpriteFrame(url, this.stateNode.getComponent(cc.Sprite));
    }

    getCard0Url() {
        let cardbg = cc.sys.localStorage.getItem('cardBg');
        let url = 'Game/Common/card_back_0';
        if (cardbg == 'cardBg1') {
            url = 'Game/Common/card_back_0';
        }
        else if (cardbg == 'cardBg2') {
            url = 'Game/Common/card_back_1';
        }
        else if (cardbg == 'cardBg3') {
            url = 'Game/Common/card_back_2';
        }
        else if (cardbg == 'cardBg4') {
            url = 'Game/Common/card_back_3';
        }
        return url;
    }

    sendCards(animal = null) {
        let cards = SZModel.getHandCardsByChairID(this.getChairID());
        if (cards == null) { return; }
        for (let i = 0; i < this.cardsNodeArray.length; ++i) {
            let url = 'Game/Cards/' + cards[i];
            if (cards[i] == 0) { url = this.getCard0Url(); }
            Gloab.CCHelper.updateSpriteFrame(url, this.cardsNodeArray[i].getComponent(cc.Sprite));
            this.cardsNodeArray[i].stopAllActions();
            this.cardsNodeArray[i].setPosition(this.cardsNodePosArray[i]);
        }
        this.cardsNode.active = true;
        this.node.active = true;
        if (animal) {
            let node_pos = this.node.getPosition();
            let audio_func = cc.callFunc(() => {
                Gloab.SoundMgr.playSound('Game/Common/Audio/foldpai');
            });
            for (let i = 0; i < this.cardsNodeArray.length; ++i) {
                let card_node = this.cardsNodeArray[i];
                let card_node_pos = card_node.getPosition();
                card_node.setPosition(cc.v2(
                    card_node_pos.x - node_pos.x,
                    card_node_pos.y - node_pos.y
                ));
                card_node.setScale(0);
                card_node.runAction(cc.sequence(
                    cc.delayTime(0.1 * i),
                    cc.moveTo(0.2, this.cardsNodePosArray[i]),
                    audio_func
                ));
                card_node.runAction(cc.sequence(
                    cc.delayTime(0.1 * i),
                    cc.scaleTo(0.2, 1)
                ));
            }
        }
    }

    showType(animal?) {
        this.stateNode.active = false;
        let cards = SZModel.getHandCardsByChairID(this.getChairID());
        if (!cards || cards[0] + cards[1] + cards[2] == 0) {
            return;
        }
        this.cardTypeNode.active = true;
        let type = SZLogic.getCardsType(cards);
        let url = 'Game/Sanzhang/';
        let array = ['', 'danzhang', 'duizi', 'shunzi', 'jinhua', 'shunjin', 'baozi'];
        url += array[type];

        let audio = 'Game/Sanzhang/Audio/woman/';
        let user = SZModel.getUserByChairID(this.getChairID());
        if (user && user.userInfo.sex == 0) {
            audio = audio.replace(/woman/, "man");
        }
        let audios = ['', '', 'paiType1', 'paiType2', 'paiType3', 'paiType4', 'paiType5'];

        let typeNode = this.cardTypeNode.getChildByName('type');
        Gloab.CCHelper.updateSpriteFrame(url, typeNode.getComponent(cc.Sprite));
        this.cardTypeNode.stopAllActions();
        this.cardTypeNode.setPosition(this.cardTypeNodePos);
        if (animal) {
            let x = this.cardTypeNodePos.x;
            let y = this.cardTypeNodePos.y;
            let offx = (this.index == 0) ? 125 : 50;
            this.cardTypeNode.x = x + offx;
            this.cardTypeNode.stopAllActions();
            this.cardTypeNode.runAction(cc.moveTo(0.2, cc.v2(x, y)).easing(cc.easeIn(3.0)));
            if (audios[type].length > 0) {
                audio += audios[type];
                this.scheduleOnce(() => {
                    Gloab.SoundMgr.playSound(audio);
                }, 0.5);
            }
        }
    }


}
