// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallDialog extends cc.Component {


    @property(cc.Label)
    nickName: cc.Label = null;   //姓名

    @property(cc.Sprite)
    headIcon: cc.Sprite = null;  //头像

    @property(cc.Sprite)
    headFrame: cc.Sprite = null; //头像的背景

    @property(cc.Label)
    soreText: cc.Label = null;   //成绩的说明

    @property(cc.Label)
    uidLabel: cc.Label = null;   //id

    @property(cc.Node)
    inviteBtn: cc.Node = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    broadcastNode: cc.Node = null;

    @property(cc.Prefab)
    broadcastWidget: cc.Prefab = null;


    protected onLoad(): void {
        //监听事件
        Gloab.MessageCallback.addListener("SelfEntryRoomPush", this);
        Gloab.MessageCallback.addListener("UpdateUserInfoUI", this);
        Gloab.MessageCallback.addListener("ReConnectSuccess", this);
        //end

        //初始化广播
        let node = cc.instantiate(this.broadcastWidget);
        node.parent = this.broadcastNode;
        //end

        //播放背景音乐
        Gloab.SoundMgr.startPlayBgMusic("UI/Hall/Sound/hall_bg_music1");

        //声音设置大小
        //获得缓存数据
        let musicValue = cc.sys.localStorage.getItem("MusicVolume");
        let soundValue = cc.sys.localStorage.getItem("SoundVolume");
        if (!!musicValue && !!soundValue) {
            Gloab.SoundMgr.setMusicVolume(musicValue);
            Gloab.SoundMgr.setSoundVolume(soundValue);
        }
        else {
            Gloab.SoundMgr.setMusicVolume(1);
            Gloab.SoundMgr.setSoundVolume(1);
        }


        //登陆获得定位信息
        Gloab.PlatformHelper.getLocation(function (err, result) {
            if (!err) {
                Gloab.Api.hallApi.updateUserAddressRequest(result.address || "", result.location || "", null);
            }
        })

        //是否进入房间
        this.checkJoinRoom();

        //更新用户信息
        this.updatePlayerInfo();

        //移动位置
        this.maskNode.runAction(cc.repeatForever(cc.sequence([cc.moveTo(2, cc.v2(200, -300)), cc.delayTime(2), cc.callFunc(function () {
            this.maskNode.x = -200;
            this.maskNode.y = 300;
        }.bind(this))])))
    }

    protected onDestroy(): void {
        Gloab.MessageCallback.removeListener("SelfEntryRoomPush", this);
        Gloab.MessageCallback.removeListener("UpdateUserInfoUI", this);
        Gloab.MessageCallback.removeListener("ReConnectSuccess", this);
    }

    //事件监听
    messageCallbackHandler(router, data) {
        switch (router) {
            case "SelfEntryRoomPush":
                //进入房间的操作发送进入游戏消息
                Gloab.GameHelper.enterGame(data.gameType, function (err, gameInfo) {
                    if (!err) {
                        Gloab.DialogManager.destroyAllDialog([gameInfo.gameDialog]);//删除所有ui节点上的子对象
                    }
                }.bind(this));
                break;
            case "UpdateUserInfoUI":
                console.log("收到更新用户ui信息");
            case "ReConnectSuccess":
                console.log("服务器连接成功");
                this.updatePlayerInfo()
                break;
        }
    }

    checkJoinRoom() {

    }

    /**
     * 更新用户数据
     */
    updatePlayerInfo() {
        console.log("执行更新用户信息", Gloab.UserModel.getProperties("nickname"));
        this.nickName.string = Gloab.UserModel.getProperties("nickname");
        this.uidLabel.string = "ID:" + Gloab.UserModel.getProperties("uid");
        this.soreText.string = Gloab.UserModel.getProperties("gold");
        this.inviteBtn.active = Gloab.UserModel.getProperties("inviteMsg").length > 0;
    }

    onBtnClick(event, param) {
        Gloab.SoundMgr.playCommonSoundClickButton();
        switch (param) {
            case "head":
                break;
            case "shop":
                break;
            case "addGold":
                break;
            case "createRoom":
                Gloab.DialogManager.createDialog("UI/Room/CreateRoomDialog", { type: "hall" });
                break;
            case "joinRoom":
                Gloab.DialogManager.createDialog("UI/Room/JoinRoomDialog", { type: "hall" });
                break;
            case "friends":
                break;
            case "union":
                break;
            case "settings":
                Gloab.DialogManager.createDialog("UI/Setting/SettingDialog", { type: "hall" });
                break;
            case "realname":
                break;
            case "email":
                break;
            case "share":
                break;
            case "notice":
                break;
            case "inviteMsg":
                break
            case "record":
                break;
        }
    }
}
