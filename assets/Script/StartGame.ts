import ApplicationFacade from "./ApplicationFacade"
import AudioManager from "./framework/manager/AudioManager";
import Gloab from "./Gloab";
const {ccclass, property} = cc._decorator;

@ccclass
export class GameRoot extends cc.Component {


    start () {
        //创建全局的操作
        new ApplicationFacade(this.node); 
        // 初始化
        Gloab.init();
    }
}


