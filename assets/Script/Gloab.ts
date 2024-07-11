

import CodeInstance from "./framework/constant/Code";
import AudioManager from "./framework/manager/AudioManager";
import DialogManager from "./framework/manager/DialogManager";
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


    //初始化
    public static create() {
        this.SoundMgr = new AudioManager();
        this.DialogManager = new DialogManager();
        this.Utils = new utils();
        this.Code = CodeInstance;
    }

    public static init(){
        this.DialogManager.init();
    }
}
