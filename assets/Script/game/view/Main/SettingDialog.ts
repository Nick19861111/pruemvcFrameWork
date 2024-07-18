// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 设置相关操作
 */


const DEF_SOUND_VALUE = 1;

@ccclass
export default class SettingDialog extends cc.Component {

    @property(cc.ProgressBar)
    progressMusic: cc.ProgressBar = null; //背景音乐

    @property(cc.Slider)
    sliderMusic: cc.Slider = null;

    @property(cc.ProgressBar)
    progSound: cc.ProgressBar = null;

    @property(cc.Slider)
    sliderSound: cc.Slider = null;



    onLoad() {

        //获得缓存数据
        let musicValue = cc.sys.localStorage.getItem("MusicVolume");
        let soundValue = cc.sys.localStorage.getItem("SoundVolume");

        if (!!musicValue && !!soundValue) {
            this.progressMusic.progress = musicValue;
            this.progSound.progress = soundValue;

            this.sliderMusic.progress = musicValue;
            this.sliderSound.progress = musicValue;
        }
        else {
            this.progressMusic.progress = DEF_SOUND_VALUE;
            this.progSound.progress = DEF_SOUND_VALUE;

            this.sliderMusic.progress = DEF_SOUND_VALUE;
            this.sliderSound.progress = DEF_SOUND_VALUE;
        }
    }

    onBtnClk(event, param) {
        switch (param) {
            case "close":
                Gloab.DialogManager.destroyDialog(this);
                Gloab.SoundMgr.playCommonSoundClickButton();
                break;
            case "music_slider":
                this.progressMusic.progress = event.progress;
                Gloab.SoundMgr.setMusicVolume(this.progressMusic.progress);
                break;
            case "sound_slider":
                this.progSound.progress = event.progress;
                Gloab.SoundMgr.setSoundVolume(this.progSound.progress);
                break;
        }
    }

}
