import AudioManager from "./framework/manager/AudioManager";
import DialogManager from "./framework/manager/DialogManager";

export default class Gloab {

    //声音管理器
    public static SoundMgr = null;
    //弹窗的管理
    public static DialogManager = null;


    //初始化
    public static init() {
        this.SoundMgr = new AudioManager();
        this.DialogManager = new DialogManager();
    }
}
