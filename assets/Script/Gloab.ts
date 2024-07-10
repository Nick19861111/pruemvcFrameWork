import AudioManager from "./framework/manager/AudioManager";

export default class Gloab {

    public static SoundMgr = null;

    //初始化
    public static init(){
        this.SoundMgr = new AudioManager();
    }
}
