// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";
import SZModel from "../model/SZModel";
import SZProto from "../SZProto";

const { ccclass, property } = cc._decorator;

/**
 * 比拍的控制类
 */

@ccclass
export default class SZCompare extends cc.Component {



    onLoad() {
        this.node.active = false;

        Gloab.MessageCallback.addListener('RoomMessagePush', this);
        Gloab.MessageCallback.addListener('GameMessagePush', this);
        Gloab.MessageCallback.addListener('ReConnectSuccess', this);
    }

    onDisable(): void {
        Gloab.MessageCallback.removeListener('RoomMessagePush', this);
        Gloab.MessageCallback.removeListener('GameMessagePush', this);
        Gloab.MessageCallback.removeListener('ReConnectSuccess', this);
    }

    messageCallbackHandler(router, msg) {
        if (!SZModel.getGameInited()) { return; }
        if (router === 'GameMessagePush') {
            if (msg.type === SZProto.GAME_COMPARE_PUSH) {
                this.compare(msg.data.fromChairID, msg.data.toChairID, msg.data.loseChairID);
            }
        }
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

    setCards(cards, node) {
        for (let i = 0; i < cards.length; ++i) {
            let url = 'Game/Cards/' + cards[i];
            if (cards[i] == 0) { url = this.getCard0Url(); }
            let sprite = node.getChildByName('card' + (i + 1)).getComponent(cc.Sprite);
            Gloab.CCHelper.updateSpriteFrame(url, sprite);
        }
    }

    compare(fromChairID, toChairID, loseChairID) {
        let leftCards = SZModel.getHandCardsByChairID(fromChairID);
        let leftUser = SZModel.getUserByChairID(fromChairID);
        let rightCards = SZModel.getHandCardsByChairID(toChairID);
        let rightUser = SZModel.getUserByChairID(toChairID);
        let leftCardsNode = cc.find('cardsleft', this.node);
        let rightCardsNode = cc.find('cardsright', this.node);
        this.setCards(leftCards, leftCardsNode);
        this.setCards(rightCards, rightCardsNode);

        cc.find('nameleft', this.node).getComponent(cc.Label).string = leftUser.userInfo.nickname;
        cc.find('nameright', this.node).getComponent(cc.Label).string = rightUser.userInfo.nickname;
        let leftAvatar = leftUser.userInfo.avatar;
        let rightAvatar = rightUser.userInfo.avatar;
        if (!leftAvatar || leftAvatar.length == 0) {
            leftAvatar = "Game/Common/morentouxiang";
        }
        if (!rightAvatar || rightAvatar.length == 0) {
            rightAvatar = "Game/Common/morentouxiang";
        }
        Gloab.CCHelper.updateSpriteFrame(leftAvatar, cc.find('headleft', this.node).getComponent(cc.Sprite));
        Gloab.CCHelper.updateSpriteFrame(rightAvatar, cc.find('headright', this.node).getComponent(cc.Sprite));
        cc.find('loseleft', this.node).active = false;
        cc.find('loseright', this.node).active = false;

        let pos = leftCardsNode.getPosition();
        if (loseChairID == toChairID) {
            pos = rightCardsNode.getPosition();
        }
        let failedNode = cc.find('failed', this.node);
        failedNode.setPosition(pos);
        this.showShandian();
        this.showBoom(() => {
            cc.find('loseleft', this.node).active = (fromChairID == loseChairID);
            cc.find('loseright', this.node).active = (toChairID == loseChairID);
        });
    }

    showShandian() {
        let sandianNode = cc.find('shandian', this.node);
        sandianNode.active = true;
        if (!sandianNode.getComponent(cc.Animation)) {
            let animation = sandianNode.addComponent(cc.Animation);
            let urls = [];
            for (let i = 1; i <= 6; ++i) {
                urls.push('Game/Sanzhang/SZCompare/shandian_0' + i);
            }
            cc.loader.loadResArray(urls, cc.SpriteFrame, (err, frames) => {
                if (err) {
                    return;
                }
                let clip = cc.AnimationClip.createWithSpriteFrames(frames, 6);
                clip.name = 'shandian';
                clip.wrapMode = cc.WrapMode.Loop;
                animation.addClip(clip);
                animation.play('shandian');
            });
        }
        else {
            sandianNode.getComponent(cc.Animation).play('shandian');
        }
        Gloab.SoundMgr.playSound('Game/Sanzhang/Audio/bipai_power');
        this.scheduleOnce(() => { sandianNode.active = false; }, 3);
    }

    showBoom(cb) {
        this.node.active = true;
        let failedNode = cc.find('failed', this.node);
        failedNode.active = true;
        let bomNode = cc.find('bom', failedNode);
        bomNode.active = true;
        if (!bomNode.getComponent(cc.Animation)) {
            let animation = bomNode.addComponent(cc.Animation);
            let urls = [];
            for (let i = 1; i <= 8; ++i) {
                urls.push('Game/Sanzhang/SZCompare/boom_eff_0' + i);
            }
            cc.loader.loadResArray(urls, cc.SpriteFrame, (err, frames) => {
                if (err) {
                    console.log(urls, 'load error');
                    return;
                }
                let clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
                clip.name = 'boom';
                clip.speed = 0.5;
                animation.addClip(clip);
                animation.play('boom');
            });
        }
        else {
            bomNode.getComponent(cc.Animation).play('boom');
        }
        Gloab.SoundMgr.playSound('Game/Sanzhang/Audio/bipai_bomb');
        this.node.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(() => {
                if (cb) cb();
                let animation = bomNode.addComponent(cc.Animation);
                animation.stop('boom');
                bomNode.active = false;
            }),
            cc.delayTime(1.5),
            cc.callFunc(() => { this.node.active = false; })
        ));
    }
}
