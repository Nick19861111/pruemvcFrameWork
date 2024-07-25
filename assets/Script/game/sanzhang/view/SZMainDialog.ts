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
import SZProto from "../SZProto";

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

    //游戏初始化和短线重连
    gameInit() {
        console.log("szMainDialog gameinit");
        //设置头像
        this.setHeadAndCard();
        this.roomIdLabel.string = '房号:' + SZModel.getRoomID();
        this.bureauLabel.string = '局数:' + SZModel.getCurBureau() + "/" + SZModel.getMaxBureau();
        this.roundLabel.string = '轮数:' + SZModel.getCurRound() + "/" + SZModel.getMaxRound();

        //查找椅子
        let user = SZModel.getUserByChairID(SZModel.getMyChairID());

        if (user) {
            if (SZModel.getGameStatus() == SZProto.gameStatus.NONE && !(user.userStatus & RoomProto.userStatusEnum.READY) && SZModel.getMyChairID() < SZModel.getChairCount()) {
                this.readyButton.active = true;
            }
            else {
                this.readyButton.active = false;
            }
            this.lookCardsButton.active = false;
            if (SZModel.getGameStatus() == SZProto.gameStatus.POUR_SCORE && SZModel.getCurChairID() == SZModel.getMyChairID()) {
                let userStatus = SZModel.getUserStatusByChairID(SZModel.getMyChairID());
                if ((userStatus & SZProto.userStatus.LOOK)) {
                    let men = SZModel.getGameRule().gameFrameType;
                    this.lookCardsButton.active = (men < SZModel.getCurRound());
                }
            }
        }

        cc.find('Tuoguan', this.node).active = SZModel.getTrustByChairID(SZModel.getMyChairID());
        cc.find('Pangguan', this.node).active = (SZModel.getMyChairID() >= SZModel.getChairCount());
        cc.find('Setting/Layout/TuoButton', this.node).active = true;
        cc.find('backhall', this.node).active = (SZModel.getCurBureau() == 0);
        cc.find('Voice', this.node).active = SZModel.getGameRule().yuyin;
        this.verifyZuobi(SZModel.getUserByChairID(SZModel.getMyChairID()));

    }

    /**
     * 防止作弊根据经纬度来判断是否在一个地方
     * @param roomUserInfo 
     * @returns 
     */
    verifyZuobi(roomUserInfo) {
        if (!SZModel.getGameRule().fangzuobi) { return; }
        if (roomUserInfo.chairID >= SZModel.getGameRule().chairCount) {
            return;
        }
        let add1 = null;
        try { add1 = JSON.parse(roomUserInfo.userInfo.address); } catch (e) { }
        if (!add1) {
            Gloab.DialogManager.addPopDialog(`玩家${roomUserInfo.userInfo.nickname}定位未知！`, function () { });
            return;
        }
        for (let i = 0; i < SZModel.getChairCount(); ++i) {
            let user = SZModel.getUserByChairID(i);
            if (!user || user.chairID == roomUserInfo.chairID) { continue; }
            if (user.userInfo.lastLoginIP == roomUserInfo.userInfo.lastLoginIP) {
                Gloab.DialogManager.addPopDialog(`玩家${roomUserInfo.userInfo.nickname}与玩家${user.userInfo.nickname}IP地址相同！`, function () { });
            }
            let add2 = null;
            try { add2 = JSON.parse(user.userInfo.address); } catch (e) { }
            if (!add2) { continue; }
            let distance = Gloab.Utils.getDistance(add1.x, add1.y, add2.x, add2.y);
            if (distance < 0.1) {
                Gloab.DialogManager.addPopDialog(`玩家${roomUserInfo.userInfo.nickname}与玩家${user.userInfo.nickname}距离过近！`, function () { });
            }
        }
    }

    /**
     * 设置头像
     */
    setHeadAndCard() {
        let chairCount = SZModel.getGameRule().maxPlayerCount;
        //头像的具体位置
        let headPosArray = [cc.v2(-586, -293), cc.v2(606, -40), cc.v2(561, 141), cc.v2(199, 261), cc.v2(-37, 303), cc.v2(-261, 262), cc.v2(-568, 141), cc.v2(-605, -37)];
        let cardPosArray = [cc.v2(41, -276), cc.v2(416, -88), cc.v2(373, 92), cc.v2(166, 112), cc.v2(-42, 154), cc.v2(-275, 116), cc.v2(-470, 92), cc.v2(-508, -85)];
        //end
        let choosedArray = [1, 2, 3, 4, 5, 6, 7, 8];
        if (chairCount == 6) {
            headPosArray = [cc.v2(-586, -293), cc.v2(606, -14), cc.v2(310, 248), cc.v2(-37, 303), cc.v2(-359, 249), cc.v2(-605, -11)];
            cardPosArray = [cc.v2(41, -276), cc.v2(416, -62), cc.v2(277, 99), cc.v2(-42, 154), cc.v2(-355, 103), cc.v2(-508, -59)];
            choosedArray = [1, 2, 4, 5, 6, 8];
        }
        else if (chairCount == 10) {
            headPosArray = [cc.v2(-586, -293), cc.v2(606, -99), cc.v2(606, 29), cc.v2(561, 161), cc.v2(199, 261), cc.v2(-37, 303), cc.v2(-261, 262), cc.v2(-568, 165), cc.v2(-605, 32), cc.v2(-605, -100)];
            cardPosArray = [cc.v2(41, -276), cc.v2(416, -147), cc.v2(416, -19), cc.v2(373, 112), cc.v2(166, 112), cc.v2(-42, 154), cc.v2(-257, 116), cc.v2(-470, 116), cc.v2(-508, -16), cc.v2(-508, -148)];
            choosedArray = [1, 9, 2, 3, 4, 5, 6, 7, 8, 10];
        }
        headPosArray = this.fitIphone(headPosArray);
        cardPosArray = this.fitIphone(cardPosArray);
        for (let i = 0; i < chairCount; ++i) {
            let headNode = this.node.getChildByName('Head' + choosedArray[i]);
            let cardsNode = this.node.getChildByName('Cards' + choosedArray[i]);
            if (i > 0) {
                headNode.setPosition(headPosArray[i]);
                cardsNode.setPosition(cardPosArray[i]);
            }
            this.headNodeArray.push(headNode);
            headNode.getComponent('SZHead').setIndex(i);
            this.addHeadClickEvent(headNode.getChildByName('msgbg'));
            this.cardsNodeArray.push(cardsNode);
            cardsNode.getComponent('SZCards').setIndex(i);
        }
        for (let i = 1; i <= 10; ++i) {
            if (choosedArray.indexOf(i) == -1) {
                let headNode = this.node.getChildByName('Head' + i);
                let cardsNode = this.node.getChildByName('Cards' + i);
                if (headNode) { headNode.destroy(); }
                if (cardsNode) { cardsNode.destroy(); }
            }
        }
    }

    //苹果iphonex位置特殊处理
    private fitIphone(array) {
        let designWidth = 1334;
        let designHeight = 750;
        let visibleWidth = cc.visibleRect.width;
        let visibleHeight = cc.visibleRect.height;
        if (cc.visibleRect.width / cc.visibleRect.height > 1.8) {
            if (array.length == 6) {
                array[0] = cc.v2(-visibleWidth / 2 + array[0].x + designWidth / 2, -visibleHeight / 2 + array[0].y + designHeight / 2); // 左下 
                array[1] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[1].x, array[1].y); // 右 
                array[2] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[2].x, visibleHeight / 2 - designHeight / 2 + array[2].y); // 右上 
                array[3] = cc.v2(array[3].x, visibleHeight / 2 - designHeight / 2 + array[3].y); // 上 
                array[4] = cc.v2(-visibleWidth / 2 + array[4].x + designWidth / 2, visibleHeight / 2 - designHeight / 2 + array[4].y); // 左上 
                array[5] = cc.v2(-visibleWidth / 2 + array[5].x + designWidth / 2, array[5].y); // 左 
            }
            else if (array.length == 8) {
                array[0] = cc.v2(-visibleWidth / 2 + array[0].x + designWidth / 2, -visibleHeight / 2 + array[0].y + designHeight / 2); // 左下 
                array[1] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[1].x, -visibleHeight / 2 + array[1].y + designHeight / 2); // 右下
                array[2] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[2].x, visibleHeight / 2 - designHeight / 2 + array[2].y); // 右上 
                array[3] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[3].x, visibleHeight / 2 - designHeight / 2 + array[3].y); // 右上 
                array[4] = cc.v2(array[4].x, visibleHeight / 2 - designHeight / 2 + array[4].y); // 上 
                array[5] = cc.v2(-visibleWidth / 2 + array[5].x + designWidth / 2, visibleHeight / 2 - designHeight / 2 + array[5].y); // 左上 
                array[6] = cc.v2(-visibleWidth / 2 + array[6].x + designWidth / 2, visibleHeight / 2 - designHeight / 2 + array[6].y); // 左上 
                array[7] = cc.v2(-visibleWidth / 2 + array[7].x + designWidth / 2, -visibleHeight / 2 + array[7].y + designHeight / 2); // 左下
            }
            else if (array.length == 10) {
                array[0] = cc.v2(-visibleWidth / 2 + array[0].x + designWidth / 2, -visibleHeight / 2 + array[0].y + designHeight / 2); // 左下 
                array[1] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[1].x, -visibleHeight / 2 + array[1].y + designHeight / 2); // 右下
                array[2] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[2].x, visibleHeight / 2 - designHeight / 2 + array[2].y); // 右上 
                array[3] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[3].x, visibleHeight / 2 - designHeight / 2 + array[3].y); // 右上 
                array[4] = cc.v2(visibleWidth / 2 - designWidth / 2 + array[4].x, visibleHeight / 2 - designHeight / 2 + array[4].y); // 右上 
                array[5] = cc.v2(array[5].x, visibleHeight / 2 - designHeight / 2 + array[5].y); // 上 
                array[6] = cc.v2(-visibleWidth / 2 + array[6].x + designWidth / 2, visibleHeight / 2 - designHeight / 2 + array[6].y); // 左上 
                array[7] = cc.v2(-visibleWidth / 2 + array[7].x + designWidth / 2, visibleHeight / 2 - designHeight / 2 + array[7].y); // 左上 
                array[8] = cc.v2(-visibleWidth / 2 + array[8].x + designWidth / 2, visibleHeight / 2 - designHeight / 2 + array[8].y); // 左上 
                array[9] = cc.v2(-visibleWidth / 2 + array[9].x + designWidth / 2, -visibleHeight / 2 + array[9].y + designHeight / 2); // 左下
            }
        }
        return array;
    }

    /**
     * 点击事件
     * @param node 
     */
    addHeadClickEvent(node) {
        node.on(cc.Node.EventType.TOUCH_START, () => {
            if (SZModel.getMyChairID() >= SZModel.getChairCount()) {
                Gloab.DialogManager.addTipDialog('观战玩家无法查看详细信息');
                return;
            }
            if (node.lastClick && Date.now() - node.lastClick < 500) { /* 防止重复点击 */
                return;
            }
            node.lastClick = Date.now();
            let logic = node.parent.getComponent('SZHead');
            let user = SZModel.getUserByChairID(logic.getChairID());
            let address = null;
            try { address = JSON.parse(user.userInfo.address); } catch (e) { }
            let params = {
                fromChairID: SZModel.getMyChairID(),
                toChairID: logic.getChairID(),
                avatar: user.userInfo.avatar,
                id: user.userInfo.uid,
                ip: user.userInfo.lastLoginIP,
                location: user.userInfo.location,
                x: address ? address.x : '未知',
                y: address ? address.y : '未知',
                gold: user.userInfo.score,
                name: user.userInfo.nickname,
            };
            Gloab.DialogManager.createDialog('Chat/HeadDetail', params);
        }, this);
    }

    /**
     * 根据座位号进行id显示
     * @param chairID 
     */
    showHeadNode(chairID) {

    }

    /**
     * 根据座位号进行隐藏
     * @param chairID 
     */
    hideHeadNode(chairID) {
        let isMyHeadId = SZModel.getMyChairID();
        if (chairID == isMyHeadId) {
            this.enterHall();
        }
    }

    enterHall() {
        //没有房间数据的时候哦则什么都不做
        if (!SZModel.getGameInited()) { return; };
        let roomCreartorInfo = SZModel.getRoomCreator();
        Gloab.DialogManager.destroyDialog("Game/Sanzhang/SZMainDialog");
        if (roomCreartorInfo.creatorType == Gloab.Enum.roomCreatorType.UNION_CREATE) {
            Gloab.DialogManager.createDialog("UI/Union?UnionMain/UnionMainlog", { unionID: roomCreartorInfo.unionID });
        }
        else {
            Gloab.DialogManager.createDialog("UI/Hall/HallDialog", null, function () {
                Gloab.DialogManager.removeLoadingCircle();
            })
        }
    }

    //==============================点击按钮部分================================

    //点击发送语音
    onVoice() {
        this.checkButton();
        console.log("点击语音部分");
    }

    //点击发送聊天语音（固有的）
    onChat(fromChairID, toChairID, msg) {
        this.checkButton();
        //todo 聊天操作
        console.log("点击了聊天");
    }

    //回看
    onReview() {
        this.checkButton();
        console.log("点击了会看");
    }

    //刷新
    onRefrush() {
        this.checkButton();
    }

    //点击了设置按钮
    onSwitchClick() {
        this.checkButton();
    }

    //托管
    onTrustClick() {
        this.checkButton();
    }

    //返回大厅
    onExitClick(event, params) {
        this.checkButton();
        if (params != "backhall") {
            this.onSwitchClick();
        }
        let user = SZModel.getUserByChairID(SZModel.getMyChairID());
        if (!SZModel.getGameStatus() || (user.userStatus & RoomProto.userStatusEnum.DISMISS) == 0 || user.chairID >= SZModel.getChairCount()) {
            //我还没有准备状态
            Gloab.DialogManager.addPopDialog("确认退出游戏?", function () {
                //发送消息要拖出
                Gloab.DialogManager.addLoadingCircle();
            }, function () { });
        }
        else {
            Gloab.DialogManager.addPopDialog("是否确定要发出解散申请？", function () {
                //发送解散的消息
                Gloab.DialogManager.addLoadingCircle();
            }, function () { })
        }
    }

    //准备开始游戏
    onReadyClick(){
        if (!SZModel.getGameInited()) { return; };
        Gloab.SoundMgr.playCommonSoundClickButton();
    }

    //========================================================================


    private checkButton(){
        if (!SZModel.getGameInited()) { return; };
        Gloab.SoundMgr.playCommonSoundClickButton();
    }
}
