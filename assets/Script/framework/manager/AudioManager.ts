// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 音乐管理
 */
@ccclass
export default class AudioManager extends cc.Component {

    private soundVolume: number = 1; //设置声音

    private musicVolume: number = 1; //设置声音

    private currentBgMusic: number = 0; //当前背景音乐大小

    private commonSoundPath: string = "Common/button"; //具体地址

    private clickButton = null; //声音的引用

    /**
     * 初始化
     */
    public init() {
        this.currentBgMusic = -1;

        //判断声音是否有缓存
        if (!cc.sys.localStorage.getItem("MusicVolume")) {
            this.musicVolume = 1;
            this.soundVolume = 1;
            cc.sys.localStorage.setItem("MusicVolume", this.musicVolume.toString());
            cc.sys.localStorage.setItem("SoundVolume", this.soundVolume.toString());
        }
        else {
            this.musicVolume = parseFloat(cc.sys.localStorage.getItem("MusicVolume"));
            this.soundVolume = parseFloat(cc.sys.localStorage.getItem("SoundVolume"));
        }
    }

    /**
     * 播放声音
     * @param url url 
     * @param cb  返回的事件
     */
    public startPlayBgMusic(url: string, cb) {
        if (!url) {
            cc.error("startPlayBgMusic", "url:" + url);
            Gloab.Utils.invokeCallback(cb, Gloab.Code.FAIL);
            return;
        }
        this.stopBgMusic();
        //加载音乐
        cc.resources.load(url, cc.AudioClip, function (err, clip) {
            if (!!err) {
                cc.error("startPlayBgMuisc faied" + err);
            }
            else {
                //加载音乐
                this.currentBgMusic = cc.audioEngine.play(clip, true, this.musicVolume);
                if (!this.musicVolume) {
                    cc.audioEngine.pause(this.currentBgMusic);
                }
            }
            Gloab.Utils.invokeCallback(cb, err);
        }.bind(this))
    }

    /**
     * 声音音效
     * @param url   url
     * @param loop  是否是循环
     */
    public playSound(url: string, loop: boolean) {
        if (!url || !this.soundVolume) return;
        if (loop !== true) loop = false;

        //加载音乐
        cc.resources.load(url, cc.AudioClip, function (err, clip) {
            if (!!err) {
                cc.error("playSound failed:" + url);
            }
            else {
                cc.audioEngine.play(clip, loop, this.soundVolume);
            }
        }.bind(this));
    }

    /**
     * 播放按钮声音
     */
    public playCommonSoundClickButton() {
        if (!this.soundVolume) return;

        if (this.clickButton !== null && this.clickButton.isValid) {
            cc.audioEngine.play(this.clickButton, false, this.soundVolume);
        }
        else {
            //加载
            cc.resources.load(this.commonSoundPath, cc.AudioClip, function (err, clip) {
                if (!!err) {
                    cc.error("playCommonClickButton failed");
                } else {
                    this.clickButton = clip;
                    cc.audioEngine.play(this.clickButton, false, this.soundVolume);
                }
            }.bind(this));
        }
    }

    /**
     * 停止音乐
     * @returns 
     */
    private stopBgMusic() {
        if (this.currentBgMusic < 0) return;
        cc.audioEngine.stop(this.currentBgMusic);
        this.currentBgMusic = -1;
    }

    /**
     * 设置背景音乐
     * @param volume 设置声音具体
     */
    public setMusicVolume(volume) {
        this.musicVolume = parseFloat(volume);
        cc.sys.localStorage.setItem("MusicVolume", this.musicVolume);

        if (volume === 0) {
            cc.audioEngine.pause(this.currentBgMusic);
        } else {
            if (this.currentBgMusic >= 0) {
                cc.audioEngine.setVolume(this.currentBgMusic, this.musicVolume);
            }
        }
    }

    /**
     * 设置声音
     * @param volume 声音的音量 
     */
    public setSoundVolume(volume) {
        this.soundVolume = parseFloat(volume);
        cc.sys.localStorage.setItem("SoundVolume", this.soundVolume );
    }

    /**
     * 获得声音
     */
    public getSoundVolume() {
        return this.soundVolume;
    }

}
