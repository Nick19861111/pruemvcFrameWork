import Gloab from "../../Gloab";

/**
 * 用户的数据模型
 */
export default class UserModel {

    private data: any = {};
    /**
     * 初始化数据部分
     * @param data 
     */
    public init(data) {
        this.setProperties(data);
        //事件监听
        Gloab.MessageCallback.addListener("UpdateUserInfoPush", this);//更新对应的数据
    }

    /**
     * 监听事件
     * @param router 
     * @param data 
     */
    messageCallbackHandler(router, msg) {
        switch (router) {
            case "UpdateUserInfoPush":
                delete msg.pushRouter;
                this.setProperties(msg);
                Gloab.MessageCallback.emitMessage("UpdateUserInfoUI");
                break
        }
    }

    /**
     * 用户相关的数据
     * @param Properties 
     */
    private setProperties(Properties) {
        for (let key in Properties) {
            if (Properties.hasOwnProperty(key)) {
                this.data[key] = Properties[key];
            }
        }
    }

    public getProperties(key) {
        return this.data[key];
    }
}
