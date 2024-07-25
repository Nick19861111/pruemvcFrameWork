// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Gloab from "../../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 加入房间
 */

@ccclass
export default class JoinRoomDialog extends cc.Component {

    @property(cc.Label)
    roomNum: cc.Label[] = [];

    private index: number = 0;
    onLoad() {
        this.cleanLables();
    }

    /**
     * 晴空数据
     */
    private cleanLables() {
        for (let i = 0; i < this.roomNum.length; i++) {
            this.roomNum[i].string = "";
        }

        this.index = 0;
    }

    /**
     * 点击事件
     * @param event 
     * @param params 
     */
    onBtnClk(event, params) {
        switch (params) {
            case "close":
                Gloab.DialogManager.destroyDialog(this);
                break
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.roomNum[this.index].string = params;
                if (this.index < this.roomNum.length - 1) {
                    this.index += 1;
                }
                break;
            case "delete":
                if (this.index == this.roomNum.length - 1 && this.roomNum[this.index].string !== "") {

                } else {
                    if (this.index > 0) {
                        this.index -= 1;
                    }
                }
                this.roomNum[this.index].string = "";
                break;
            case "confirm"://提交
                let roomID = "";
                for (let i = 0; i < this.roomNum.length; i++) {
                    if (this.roomNum[i].string === '') {
                        Gloab.DialogManager.addTipDialog("请输入完整的房间号");
                        return;
                    }
                    roomID += this.roomNum[i].string;
                }

                //加载
                Gloab.DialogManager.addLoadingCircle();
                //发送消息给服务器
                Gloab.Api.hallApi.joinRoomRequest(roomID);
                //关闭当前的界面
                Gloab.DialogManager.destroyDialog(this);
                break;

        }
    }

    // update (dt) {}
}
