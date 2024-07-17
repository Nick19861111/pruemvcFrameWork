import Gloab from "../../Gloab";
import MyData from "../model/MyData"
import HallDialog from "./Main/HallDialog";
import LoginDialog from "./Main/LoginDialog";
import MainNodeView from "./Main/MainNodeView";
export default class DataMediator extends puremvc.Mediator {
    public mediatorName = "DataMediator";

    private login: LoginDialog = null;

    private hall: HallDialog = null; //主界面

    private root: cc.Node = null;
    constructor(root: cc.Node) {
        super();
        this.root = root;
    }

    public listNotificationInterests() {
        let list: Array<string> = [];
        list.push("Msg_AddLevel");
        list.push("openUI");
        list.push("ReConnectSuccess");
        return list;
    }

    private openUI(uiName) {
        console.log("执行了打开ui的操作", uiName);
        let rootNode = this.root.getChildByName("dialogNode");
        if (rootNode.childrenCount > 0) {
            let name = rootNode.children[1].name;
            switch (name) {
                case "LoginDialog":
                    this.login = rootNode.getChildByName("LoginDialog").getComponent(LoginDialog);
                    break;
                case "HallDialog":
                    this.hall = rootNode.getChildByName("HallDialog").getComponent(HallDialog);
                    break;
            }
        }
    }

    public handleNotification(notification: puremvc.INotification) {
        switch (notification.getName()) {
            case "Msg_AddLevel":
                let data: MyData = notification.getBody();
                break;
            case "openUI":
                this.openUI(notification.getBody());
                break;
            case "ReConnectSuccess":
                if(this.hall){
                    this.hall.updatePlayerInfo();
                }
                break;
        }
    }
}
