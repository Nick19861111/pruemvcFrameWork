

import CodeInstance from "./framework/constant/Code";
import AudioManager from "./framework/manager/AudioManager";
import DialogManager from "./framework/manager/DialogManager";
import HttpManager from "./framework/manager/HttpManager";
import MessageCallback from "./framework/manager/MessageCallback";
import NetworkLogic from "./framework/manager/NetworkLogic";
import NetworkManager from "./framework/manager/NetworkManager";
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
    }

    public static init(){
        this.DialogManager.init();
        this.NetworkLogic.init();
    }
}
