

import CodeInstance from "./framework/constant/Code";
import AudioManager from "./framework/manager/AudioManager";
import DialogManager from "./framework/manager/DialogManager";
import HttpManager from "./framework/manager/HttpManager";
import MessageCallback from "./framework/manager/MessageCallback";
import NetworkLogic from "./framework/manager/NetworkLogic";
import NetworkManager from "./framework/manager/NetworkManager";
import ConfigModel from "./framework/models/ConfigModel";
import Api from "./framework/utils/Api";
import LoginHelper from "./framework/utils/LoginHelper";
import utils from "./framework/utils/utils";

export default class Gloab {

    //声音管理器
    public static SoundMgr = null;
    //弹窗的管理
    public static DialogManager = null;
    //utils操作
    public static Utils = null;
    //错误码
    public static Code = null;
    //networkManager
    public static NetworkManager = null;
    //网络的应用层
    public static NetworkLogic = null;
    //事件管理
    public static MessageCallback = null;
    //http请求类
    public static Http = null;
    //配置表相关
    public static CondigModel = null;
    //登陆辅助类
    public static LoginHelper: LoginHelper = null;
    //api相关的辅助
    public static Api:Api = null;

    //初始化
    public static create() {
        this.SoundMgr = new AudioManager();
        this.DialogManager = new DialogManager();
        this.Utils = new utils();
        this.Code = CodeInstance;
        this.NetworkManager = new NetworkManager();
        this.NetworkLogic = new NetworkLogic();
        this.MessageCallback = new MessageCallback();
        this.Http = new HttpManager();
        this.CondigModel = new ConfigModel();
        this.LoginHelper = new LoginHelper();
        this.Api = new Api();
    }

    public static init(rootNode: cc.Node) {
        this.DialogManager.init(rootNode);
        this.NetworkLogic.init();
    }
}
