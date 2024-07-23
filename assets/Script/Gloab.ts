import CodeInstance from "./framework/constant/Code";
import Constant from "./framework/constant/Constant";
import enumeration from "./framework/constant/enumeration";
import AudioManager from "./framework/manager/AudioManager";
import DialogManager from "./framework/manager/DialogManager";
import HttpManager from "./framework/manager/HttpManager";
import MessageCallback from "./framework/manager/MessageCallback";
import NetworkLogic from "./framework/manager/NetworkLogic";
import NetworkManager from "./framework/manager/NetworkManager";
import ConfigModel from "./framework/models/ConfigModel";
import Api from "./framework/utils/Api";
import CCHelper from "./framework/utils/CCHelper";
import GameHelper from "./framework/utils/GameHelper";
import LoginHelper from "./framework/utils/LoginHelper";
import PlanformHelper from "./framework/utils/PlanformHelper";
import utils from "./framework/utils/utils";
import UserModel from "./game/model/UserModel";

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
    public static Api: Api = null;
    //用户模型数据
    public static UserModel: UserModel = null;
    //各种类型
    public static Enum: enumeration = null;
    //一些常用帮助类
    public static PlatformHelper: PlanformHelper = null;
    //游戏的辅助类
    public static GameHelper: GameHelper = null;
    //常量
    public static Constant: Constant = null;
    //常见的助手
    public static CCHelper:CCHelper = null;

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
        this.UserModel = new UserModel();
        this.Enum = new enumeration();
        this.PlatformHelper = new PlanformHelper();
        this.GameHelper = new GameHelper();
        this.Constant = new Constant();
        this.CCHelper = new CCHelper();
    }

    public static init(rootNode: cc.Node) {
        this.DialogManager.init(rootNode);
        this.NetworkLogic.init();
    }
}
