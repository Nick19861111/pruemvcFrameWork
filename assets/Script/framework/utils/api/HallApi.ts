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
}
