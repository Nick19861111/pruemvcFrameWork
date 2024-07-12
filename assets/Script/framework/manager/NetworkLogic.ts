import Gloab from "../../Gloab";

export default class NetworkLogic {

    private isManualCloseServerConnection: boolean = false;

    /**
     * 初始化的方法
     */
    public init() {
        this.isManualCloseServerConnection = false;

        Gloab.MessageCallback.addListener('ServerDisconnection', this);
        Gloab.MessageCallback.addListener('ServerMessagePush', this);
        Gloab.MessageCallback.addListener('PopDialogContentPush', this);

        Gloab.NetworkManager.removeAllListeners();
        //推送
        //监听断开
        Gloab.NetworkManager.addReceiveListen('close', 'ServerDisconnection');
        //推动消息
        Gloab.NetworkManager.addReceiveListen('ServerMessagePush', 'ServerMessagePush');
    }

    public deInit() {
        //删除没用的消息
        Gloab.MessageCallback.removeListener('ServerDisconnection', this);
        Gloab.MessageCallback.removeListener('ServerMessagePush', this);
        Gloab.MessageCallback.removeListener('PopDialogContentPush', this);
    }

    /**
     * 链接服务器
     * @param host 
     * @param port 
     * @param cb 
     */
    public connectToServer(host, port, cb) {
        console.log(host, port);
        Gloab.NetworkManager.init({
            host: host,
            port: port
        }, cb)
    }

    /**
     * 是否自动断链接
     * @param autoReconnect 
     */
    public disconnect(autoReconnect){
        this.isManualCloseServerConnection = !autoReconnect;
        Gloab.NetworkManager.disconnect();
    }

    /**
     * 是否重新链接
     * @param cb 
     */
    public reconnection(cb){
        let token = cc.sys.localStorage.getItem('token');
        if(!token){
            //弹出已经断网要求登陆的操作
            //to do
        }
        else{
            //todo 重连操作
        }
    }

    /**
     * 监听自定义事件
     * @param router 
     * @param data 
     */
    public messageCallbackHandler(router, data){
        if (router === 'PopDialogContentPush') {
            // if (!!Global.Code[data.code]) {
            //     Global.DialogManager.addPopDialog(Global.Code[data.code]);
            // } else if (!!data.content){
            //     Global.DialogManager.addPopDialog(data.content);
            // } else{
            //     Global.DialogManager.addPopDialog('游戏错误，错误码：' + data.code);
            // }
            //推动消息出现问题
        } else if (router === 'ServerMessagePush'){
            if (!data.pushRouter){
                console.error('ServerMessagePush push router is invalid', data);
                return;
            }
            //推送消息
            console.log("收到推送消息");
            //messageCallback.emitMessage(data.pushRouter, data);
        } else if (router === 'ServerDisconnection'){
            // 检测是否是系统主动断开连接
            if(data.code === 1000 && !this.isManualCloseServerConnection){
                //Global.DialogManager.removeLoadingCircle();
                // dialogManager.addPopDialog("服务器主动断开连接，请稍后登录", function(){
                //     cc.sys.localStorage.setItem("token", "");
                //     cc.game.restart();
                // });
                //断开消息
                return;
            }
            // 如果不是手动断开则执行断线重连
            if (!this.isManualCloseServerConnection){
                // Global.DialogManager.addLoadingCircle();
                setTimeout(function () {
                    // Global.DialogManager.removeLoadingCircle();
                    this.reconnection(function (data) {
                        if (!data || data.code !== 0){
                            // dialogManager.addPopDialog("与服务器断开连接，请重新登录", function(){
                            //     cc.sys.localStorage.setItem("token", "");
                            //     cc.game.restart();
                            // });
                            console.log("断开以后的推出");
                            
                        }else{
                            this.isManualCloseServerConnection = false;
                        }
                    });
                }, 2000);
            }else{
                this.isManualCloseServerConnection = false;
            }
        }
    }
}
