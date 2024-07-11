// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";

const { ccclass, property } = cc._decorator;


/**
 * 主场景
 */

@ccclass
export default class MainNodeView extends cc.Component {

    private text: cc.Label;
    private btn: cc.Button;

    protected onLoad(): void {
        
        //初始化设置
        cc.debug.setDisplayStats(true);
        
        //如果是网页版，则降低帧率
        if(cc.sys.isBrowser) cc.game.setFrameRate(30);
        
        //全局初始化
        Gloab.init();

        //进入游戏
        this.enterGame();

        this.text = this.node.getChildByName("label").getComponent(cc.Label);
        this.btn = this.node.getChildByName("addNum").getComponent(cc.Button);

        this.btn.node.on('click', this.clickCallBack, this);
    }

    private enterGame(){

    }

    clickCallBack() {
        console.log("点击了按钮了啊");

        Gloab.SoundMgr.playCommonSoundClickButton();
        puremvc.Facade.getInstance().sendNotification("Reg_StartDataCommand");
    }

    /**
     * 设置文字
     * @param str 
     */
    public setLabel(value: number) {
        this.text.string = value + "";
    }

}
