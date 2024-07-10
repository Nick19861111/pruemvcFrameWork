import DataCommand from "../Script/game/ctrl/DataCommand"
import DataMediator from "../Script/game/view/DataMediator";
import DataProxy from "./game/model/DataProxy";
/**
 * pureMVC 框架Demo
 * facade 全局控制类
 */
export default class ApplicationFacade extends puremvc.Facade {
    public constructor(gameRoot: cc.Node) {
        super();
        this.registerCommand("Reg_StartDataCommand", DataCommand);
        this.registerMediator(new DataMediator(gameRoot));
        this.registerProxy(DataProxy.getInstance());
    } 
}
