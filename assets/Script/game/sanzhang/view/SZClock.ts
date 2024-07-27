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
const GameMessageRouter = 'game.gameHandler.gameMessageNotify';
@ccclass
export default class SZClock extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    onLoad() {
        this.node.active = false;

        Gloab.MessageCallback.addListener('RoomMessagePush', this);
        Gloab.MessageCallback.addListener('GameMessagePush', this);
        Gloab.MessageCallback.addListener('ReConnectSuccess', this);
    }

    onDestroy(): void {
        Gloab.MessageCallback.removeListener('RoomMessagePush', this);
        Gloab.MessageCallback.removeListener('GameMessagePush', this);
        Gloab.MessageCallback.removeListener('ReConnectSuccess', this);
    }

    messageCallbackHandler(router, msg) {
        if (!SZModel.getGameInited()) { return; }
        if (router === 'RoomMessagePush') {
            if (msg.type === RoomProto.GET_ROOM_SCENE_INFO_PUSH) {
                this.gameInit();
            }
        }
        if (router === 'GameMessagePush') {
            if (msg.type === SZProto.GAME_STATUS_PUSH) {
                this.node.active = (SZModel.getTick() > 0);
            }
        }
    }

    gameInit() {
        this.node.active = (SZModel.getTick() > 0);
    }

    update(dt: number): void {
        if (SZModel.isDismissing()) { return; }
        let tick = Math.floor(SZModel.getTick());
        if (tick > 0) {
            this.node.active = true;
            this.label.string = ((tick <= 9) ? '0' + tick : tick) + "";
            SZModel.subTick(dt);
            let curTick = Math.floor(SZModel.getTick());
            if (curTick <= 3 && tick != curTick) {
                Gloab.SoundMgr.playSound('Game/Common/Audio/daojishi1');
            }
        }
        else {
            this.node.active = false;
            //如果一直没有动作就当放弃处理
            Gloab.MessageCallback.emitMessage("DisCarads");
        }
    }
}
