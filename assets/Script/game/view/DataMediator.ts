import Gloab from "../../Gloab";
import MyData from "../model/MyData"
import LoginDialog from "./Main/LoginDialog";
import MainNodeView from "./Main/MainNodeView";
export default class DataMediator extends puremvc.Mediator {
    public mediatorName = "DataMediator";

    private login: LoginDialog = null;

    private root:cc.Node = null;
    constructor(root: cc.Node) {
        super();
        this.root = root;
    }



    public listNotificationInterests() {
        let list: Array<string> = [];
        list.push("Msg_AddLevel");
        list.push("openUI");
        return list;
    }

    private openUI(uiName) {
        console.log("执行了打开ui的操作", uiName);
        if (this.root.getChildByName("dialogNode").childrenCount > 0) {
            if (this.root.getChildByName("dialogNode").children[1].name == "LoginDialog") {
                console.log("此时是login");
                this.login = this.root.getChildByName("dialogNode").getChildByName("LoginDialog").getComponent(LoginDialog);
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
        }
    }
}
