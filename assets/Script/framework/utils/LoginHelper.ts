
/**
 * 登陆相关的辅助类
 */

import Gloab from "../../Gloab";

export default class LoginHelper {

    /**
     * 注册相关的登陆方式
     * @param data 
     * @param userInfo 
     * @param cbSuccess 
     * @param cbFail 
     */
    public register(data, userInfo, cbSuccess, cbFail) {
        Gloab.Http.POST("http://127.0.0.1:13000/register", {
            account: data.account,
            password: data.password,
            loginPlatform: data.loginPlatform,
            smsCode: "",
        }, function (response, data) {
            console.log("收到服务器给的数据", JSON.parse(data));
            let JsonData = JSON.parse(data);
            if (JsonData.code == 0) {
                //成功
                Gloab.NetworkLogic.connectToServer(JsonData.msg.serverInfo.host, JsonData.msg.serverInfo.port, function () {
                    //链接成功
                    console.log("链接服务器成功");

                    //用户的相关数据
                    cc.sys.localStorage.setItem("accountDataArr", JSON.stringify([{
                        account: data.account,
                        password: data.password,
                        loginPlatform: data.loginPlatform,
                        smsCode: "",
                    }]));

                    cc.sys.localStorage.setItem("token", JsonData.token); //缓存token操作
                    this.loginHall(JsonData.msg.token, userInfo, cbSuccess);

                }.bind(this))
            }
            else {
                cbFail(JsonData.code)
            }
        }.bind(this))
    }

    /**
     * 登陆到大厅的消息
     * @param token 
     * @param userInfo 
     * @param cbSuccess 
     */
    private loginHall(token, userInfo, cbSuccess) {
        console.log("loginHall call..");
        userInfo = userInfo || {};
        Gloab.Api.hallApi.entry(token, userInfo, function (data) {
            console.log(data);

            // 初始化配置数据
            Gloab.CondigModel.init(data.msg.config);

            //映射用户数据
            Gloab.UserModel.init(data.msg.userInfo);

            Gloab.DialogManager.removeLoadingCircle();

            Gloab.Utils.invokeCallback(cbSuccess, data);

        }, function () {
            Gloab.NetworkManager.disconnect();
            Gloab.DialogManager.addTipDialog("进入大厅失败");
        })
    }
}
