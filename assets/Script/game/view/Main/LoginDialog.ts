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

                Gloab.LoginHelper.register(accountData, null, function () {
                    //成功的话
                    this.enterGame();
                }.bind(this), function (data) {
                    let err = data.code;
                    if (err == Gloab.Code.ACCOUNT_OR_PASSWORD_ERROR) {
                        Gloab.DialogManager.addPopDialog("账号密码错误，是否清理当前账号", function () {
                            cc.sys.localStorage.setItem("accountDataArr", "");
                        }.bind(this))
                    }
                    else {
                        Gloab.DialogManager.addPopDialog("登陆失败请检查网络");
                    }
                })
                break;
            case "phone":
                break;
        }
    }

    //进入游戏操作
    enterGame() {
        Gloab.DialogManager.createDialog("UI/Hall/HallDialog", { lastDialog: "login" }, function () {
            Gloab.DialogManager.destroyDialog(this);
            puremvc.Facade.getInstance().sendNotification("openUI", "HallDialog");
        }.bind(this));
    }
}
