
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
                cbSuccess(JsonData);
                Gloab.NetworkLogic.connectToServer(JsonData.msg.serverInfo.host, JsonData.msg.serverInfo.port, function () {
                    //链接成功
                    console.log("链接服务器成功");
                    Gloab.DialogManager.removeLoadingCircle();
                    //用户的相关数据
                    cc.sys.localStorage.setItem("accountDataArr", JSON.stringify([{
                        account: data.account,
                        password: data.password,
                        loginPlatform: data.loginPlatform,
                        smsCode: "",
                    }]));

                    cc.sys.localStorage.setItem("token", JsonData.token); //缓存token操作

                }.bind(this))
            }
            else {
                cbFail(JsonData.code)
            }
        }.bind(this))
    }
}
