import Gloab from "../../Gloab";

/**
 * 网络管理器
 * 使用的pomelo这个框架服务器使用的go
 */
export default class NetworkManager {

    //全局变量
    private pomelo = window.pomelo;

    /**
     * 初始化网络
     * @param params 进行传输的对象 
     * @param cb     返回参数
     */
    public init(params, cb) {
        console.log("初始化网络", params);
        this.pomelo.init({
            host: params.host,
            port: params.port,
            log: true
        },cb)
    }

    /**
     * 关闭操作
     */
    public disconnect() {
        this.pomelo.disconnect();
    }

    /**
     * 发送消息
     * @param route         路由 
     * @param msg           消息
     * @param cbSuccess     返回成功
     * @param cbFail        返回参数
     */
    private request(route, msg, cbSuccess, cbFail) {
        console.log("send:" + route, msg);
        this.pomelo.request(route, msg, function (data) {
            console.log('Receive:' + (((typeof cbSuccess) === 'string') ? cbSuccess : route), data);

            // 如果含有updateUserData字段，则是更新数据
            if ("updateUserData" in data) {
                Gloab.MessageCallback.emitMessage("UpdateUserInfoPush", data.updateUserData);
                //发送事件操作
            }

            //判断是否成功
            if (data.code !== Gloab.Code.OK) {
                if (!!cbFail && (typeof (cbFail) === 'function')) {
                    cbFail(data);
                    return;
                }

                //报错
                if (!!Gloab.Code.getErrorMessage[data.code]) {
                    console.log("报错");
                } else {
                    console.log("游戏错误吗" + data.code);
                }
            }
            else {
                if (!!cbSuccess) {
                    if (typeof (cbSuccess) === 'function') {
                        cbSuccess(data)
                    }
                    else {
                        //发送事件
                        console.log("需要发送发事件");
                        Gloab.MessageCallback.emitMessage(cbSuccess, data);
                    }
                }
            }
        })
    }

    /**
     * 发送
     * @param route 
     * @param msg 
     * @param cbRoute 
     * @param cbFail 
     */
    public send(route, msg, cbRoute, cbFail) {
        this.request(route, msg, cbRoute, cbFail);
    }

    notify(route, msg) {
        console.log('Notify:' + route, msg);
        this.pomelo.notify(route, msg);
    }

    addReceiveListen(route, cbRoute) {
        cbRoute = cbRoute || route;
        let pushCallback = function (msg) {
            if (!!cbRoute) {
                console.log('push:' + cbRoute, msg);
                Gloab.MessageCallback.emitMessage(cbRoute, msg);
            }
        };
        this.pomelo.on(route, pushCallback);
        return pushCallback;
    }

    /**
     * 删除注册相关的操作
     * @param route 
     * @param callback 
     */
    removeListener(route, callback) {
        this.pomelo.removeListener(route, callback);
    }

    /**
     * 删除全部
     */
    removeAllListeners(){
        this.pomelo.removeAllListeners();
    }
}
