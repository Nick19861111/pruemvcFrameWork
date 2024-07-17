import Gloab from "../../Gloab";
import MyData from "./MyData"
/**
 * 模型层
 * 数据代理类
 */
export default class DataProxy extends puremvc.Proxy {
    public proxyName = "DataProxy";
    private static instance: DataProxy = null;

    public static getInstance() {
        if(!this.instance) {
            this.instance = new DataProxy();
        }
        return this.instance;
    }

    constructor() {
        super();
        puremvc.Proxy.NAME = "DataProxy";
        
    }

    /**
     * 注册成功
     */
    public registerSuessce(data){
        // // 初始化配置数据
        Gloab.CondigModel.init(data.msg.config);

        //映射用户数据
        Gloab.UserModel.init(data.msg.userInfo);
    }
}
