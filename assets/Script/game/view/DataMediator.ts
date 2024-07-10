import Gloab from "../../Gloab";
import MyData from "../model/MyData"
import MainNodeView from "./Main/MainNodeView";
export default class DataMediator extends puremvc.Mediator {
    public mediatorName = "DataMediator";
    
    

    private mainNode:MainNodeView = null;
    constructor(root: cc.Node) {
        super();
        this.mainNode = root.getChildByName("mainNode").getComponent(MainNodeView);
    }

    

    public listNotificationInterests() {
        let list: Array<string> = [];
        list.push("Msg_AddLevel");
        return list;
    }

    public handleNotification(notification: puremvc.INotification) {
        switch(notification.getName()) {
            case "Msg_AddLevel": 
                let data: MyData = notification.getBody();
                this.mainNode.setLabel(data.Level);
            break;
        }
    }
}
