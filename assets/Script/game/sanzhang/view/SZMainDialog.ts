// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RoomApi from "../../../framework/utils/api/RoomApi";
import RoomProto from "../../../framework/utils/api/RoomProto";
import Gloab from "../../../Gloab";
import SZModel from "../model/SZModel";

const { ccclass, property } = cc._decorator;

/**
 * 三张游戏的主界面
 */

@ccclass
export default class SZMainDialog extends cc.Component {

    @property(cc.Node)
    readyButton: cc.Node = null;

    @property(cc.Node)
    lookCardsButton: cc.Node = null;

    @property(cc.Label)
    roomIdLabel: cc.Label = null;

    @property(cc.Label)
    bureauLabel: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    //暂时用不到后面在加入
    // @property(cc.Prefab)
    // cuopaiPrefab: cc.Prefab = null;

    // @property(cc.Prefab)
    // chatAnim: cc.Prefab = null;

    private headNodeArray = [];//头像节点的数组

    private cardsNodeArray = [];//牌的数组

    onLoad() {
        this.headNodeArray = [];
        this.cardsNodeArray = [];
        //数据保存
        SZModel.init();
        //获取场景数据
        this.scheduleOnce(function () {
            RoomApi.roomMessageNotify(RoomProto.getRoomSceneInfoNotify());
        }.bind(this), 0.2);
        //监听事件
        Gloab.MessageCallback.addListener("RoomMessagePush", this); //进入房间推送的消息
        //播放音乐
        Gloab.SoundMgr.startPlayBgMusic("Game/Common/Audio/game_bg_2");
    }

    onDestroy(): void {
        Gloab.MessageCallback.removeListener("RoomMessagePush", this);
    }



    //监听事件
    messageCallbackHandler(router, msg) {
        if (router == "RoomMessagePush") {
            //收到消息
            console.log("收到进入房间消息");
            if (msg.type == RoomProto.GET_ROOM_SCENE_INFO_PUSH) {
                //进入房间信息
                this.gameInit();
            }
            //离开房间
            else if (msg.type == RoomProto.USER_LEAVE_ROOM_PUSH) {
                this.hideHeadNode(msg.data.roomUserInfo.chairID);
            }
        }
    }

    //隐藏当前的头像
    hideHeadNode(chairID) {
        console.log("用户离开头像回复");
    }

    //游戏初始化和短线重连
    gameInit() {
        console.log("szMainDialog gameinit");
        //设置头像

        this.roomIdLabel.string = '房号:' + SZModel.getRoomID();
        this.bureauLabel.string = '局数:' + SZModel.getCurBureau() + "/" + SZModel.getMaxBureau();
        this.roundLabel.string = '轮数:' + SZModel.getCurRound() + "/" + SZModel.getMaxRound();

        //查找椅子
    }
}
