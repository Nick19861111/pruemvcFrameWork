import ApplicationFacade from "./ApplicationFacade"
const {ccclass, property} = cc._decorator;

@ccclass
export class GameRoot extends cc.Component {


    start () {
        //创建全局的操作
        new ApplicationFacade(this.node); 
    }
}


