import Gloab from "../../../Gloab";

export default class HallApi {

    //进入大厅
    public entry(token, userInfo, cbRouter, cbFail) {
        let router = "connector.entryHandler.entry";//你要找到的对应的路径是那个
        let requestData = {
            token: token,
            userInfo: userInfo
        }
        Gloab.NetworkManager.send(router, requestData, cbRouter || "EntryHallResponse", cbFail);
    }

    //实名认真
    public updateUserAddressRequest(address, location, cbRouter) {
        let router = "hall.userHandler.updateUserAddress";//对应的路径
        let requestData = {
            address: address,
            location: location
        }
        Gloab.NetworkManager.send(router, requestData, cbRouter);
    }

    //----------------------------房间相关------------------------------
    /**
     * 创建房间相关操作
     * @param gameRule      游戏规则
     * @param gameRuleID    游戏规则id
     * @param unionID       联盟id
     * @param cbRouter      返回事件
     */
    public createRoomRequest(gameRule, gameRuleID, unionID, cbRouter:string="") {
        let router = "game.unionHandler.createRoom";
        let requestData = {
            unionID: unionID,
            gameRule: gameRule,
            gameRuleID: gameRuleID
        }
        Gloab.NetworkManager.send(router, requestData, cbRouter || "CreateRoomResponse");
    }

    //------------------------------end--------------------------------
}
