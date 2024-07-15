// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";

const { ccclass, property } = cc._decorator;
/**
 * 登陆的相关操作UI
 */

@ccclass
export default class LoginDialog extends cc.Component {

    @property(cc.Label)
    version: cc.Label = null;   //版本



    onLoad() {
        
    }

    onBtnClick(event, param) {
        Gloab.SoundMgr.playCommonSoundClickButton();
        switch (param) {
            case "wx":
                let accountData = {
                    account: Gloab.Utils.randomString(16),
                    password: Gloab.Utils.randomString(16),
                    loginPlatform: 2,
                }

                let userInfo = {
                    nickname: "wx" + Gloab.Utils.getRandomNum(100000, 999999),
                    headimgurl: "",
                    sex: Gloab.Utils.getRandomNum(0, 1),
                }
                Gloab.DialogManager.addLoadingCircle();
                Gloab.Http.POST("http://127.0.0.1:13000/register", {
                    account: accountData.account,
                    password: accountData.password,
                    loginPlatform: accountData.loginPlatform,
                    smsCode: "",
                }, function (response, data) {
                    console.log("收到服务器给的数据", JSON.parse(data));
                    let JsonData = JSON.parse(data);
                    if (JsonData.code == 0) {
                        //成功
                        Gloab.NetworkLogic.connectToServer(JsonData.msg.serverInfo.host, JsonData.msg.serverInfo.port, function () {
                            //链接成功
                            //发送进入大厅的操作
                            //to do
                            console.log("链接服务器成功");
                            Gloab.DialogManager.removeLoadingCircle();
                        })
                    }
                })
                break;
            case "phone":
                break;
        }
    }
}
