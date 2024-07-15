// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";

const { ccclass, property } = cc._decorator;


/**
 * 主场景
 */

@ccclass
export default class MainNodeView extends cc.Component {

    private text: cc.Label;
    private btn: cc.Button;

    protected onLoad(): void {

        //初始化设置
        cc.debug.setDisplayStats(true);

        //如果是网页版，则降低帧率
        if (cc.sys.isBrowser) cc.game.setFrameRate(30);

        //全局初始化
        Gloab.create();
        Gloab.init(this.node.parent);

        //初始化网络
        Gloab.NetworkLogic.init();

        //进入游戏
        //this.enterGame();


        this.text = this.node.getChildByName("label").getComponent(cc.Label);
        this.btn = this.node.getChildByName("addNum").getComponent(cc.Button);

        this.btn.node.on('click', this.clickCallBack, this);
    }

    private enterGame() {
        let loadDirArr = [
            "Common"
        ];//加载相关操作
        Gloab.DialogManager.createDialog("UI/Loading/LoadingDialog", {
            loadDirArr: loadDirArr, cb: function () {
                console.log("加载资源完成");
                Gloab.DialogManager.destroyDialog("UI/Loading/LoadingDialog");
            }.bind(this)
        });
    }

    clickCallBack() {
        console.log("点击了按钮了啊");

        Gloab.SoundMgr.playCommonSoundClickButton();
        // //测试
        // let accountData = {
        //     account: Gloab.Utils.randomString(16),
        //     password: Gloab.Utils.randomString(16),
        //     loginPlatform: 2,
        // }

        // let userInfo = {
        //     nickname: "wx" + Gloab.Utils.getRandomNum(100000, 999999),
        //     headimgurl: "",
        //     sex: Gloab.Utils.getRandomNum(0, 1),
        // }


        // Gloab.Http.POST("http://127.0.0.1:13000/register", {
        //     account:accountData.account,
        //     password:accountData.password,
        //     loginPlatform:accountData.loginPlatform,
        //     smsCode:"",
        // }, function (response, data) {
        //     console.log("收到服务器给的数据", JSON.parse(data));
        //     let JsonData = JSON.parse(data);
        //     if(JsonData.code == 0){
        //         //成功
        //         Gloab.NetworkLogic.connectToServer(JsonData.msg.serverInfo.host,JsonData.msg.serverInfo.port,function(){
        //             //链接成功
        //             //发送进入大厅的操作
        //             //to do
        //             console.log("链接服务器成功");
        //         })
        //     }
        // })
        //puremvc.Facade.getInstance().sendNotification("Reg_StartDataCommand");
        //测试文字提示
        //Gloab.DialogManager.addTipDialog("helloworld");
        //测试弹窗操作
        // Gloab.DialogManager.addPopDialog("与服务器断开链接，请重新登陆",function(){
        //     cc.game.restart();
        // })
        //测试
        // Gloab.DialogManager.addLoadingCircle()
        // this.scheduleOnce(()=>{
        //     Gloab.DialogManager.removeLoadingCircle();
        // },2);
    }

    /**
     * 设置文字
     * @param str 
     */
    public setLabel(value: number) {
        this.text.string = value + "";
    }

}
