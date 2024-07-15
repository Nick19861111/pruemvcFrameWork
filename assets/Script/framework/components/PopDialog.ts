// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 弹出提示框
 */

@ccclass
export default class PopDialog extends cc.Component {

    //UI部分
    @property(cc.Label)
    contentLabel: cc.Label = null;   //文字显示

    @property(cc.Node)
    okBtn: cc.Node = null;           //确定按钮

    @property(cc.Node)
    cancelBtn: cc.Node = null;       //取消

    // LIFE-CYCLE CALLBACKS:

    private originalPostionX = 0;

    private popDialogArr = [];

    onLoad() {
        this.originalPostionX = Math.abs(this.okBtn.x);
        this.popDialogArr = [];
    }

    /**
     * 按钮事件
     * @param event 
     * @param param 
     */
    onBtnCick(event, param) {
        Gloab.SoundMgr.playCommonSoundClickButton();
        switch (param) {
            case "ok":
                if (!!this.popDialogArr[0] && !!this.popDialogArr[0].cbOK) {
                    this.popDialogArr[0].cbOK();
                }
                break;
            case "cancel":
                if (!!this.popDialogArr[0].CbCancel && !!this.popDialogArr[0]) {
                    this.popDialogArr[0].CbCancel();
                }
                break;
        }
        this.removeLastPopDialog();
    }

    /**
     * 添加当前面板
     * @param content 
     * @param cbOK 
     * @param CbCancel 
     * @param isRotate 
     */
    addPopDilog(content, cbOK, CbCancel, isRotate) {
        if (!content) return;
        this.popDialogArr.splice(0,0, { content: content, cbOK: cbOK, CbCancel: CbCancel, isRotate: isRotate });

        this.showNextPopDialog();
    }

    /**
     * 根据条件显示取消的按钮
     */
    showNextPopDialog() {
        if (this.popDialogArr.length > 0) {
            let popData = this.popDialogArr[0];
            this.node.active = true;

            //弹出效果
            this.contentLabel.string = popData.content;
            this.cancelBtn.active = !!popData.CbCancel;
            this.okBtn.active = !!popData.cbOK;

            if (!!popData.CbCancel && !!popData.cbOK) {
                this.cancelBtn.x = -1 * this.originalPostionX;
                this.okBtn.x = this.originalPostionX;
            }
            else {
                this.cancelBtn.x = 0;
                this.okBtn.x = 0;
                if (!popData.cbOK && !popData.CbCancel) {
                    this.okBtn.active = true;
                }
            }
        }
    }

    removeLastPopDialog() {
        if (this.popDialogArr.length > 0) {
            this.popDialogArr.splice(0, 1);

            this.showNextPopDialog();
        }
    }

}
