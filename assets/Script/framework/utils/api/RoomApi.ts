import Gloab from "../../../Gloab";

/**
 * 房间内部消息
 */
export default class RoomApi {

    /**
     * 房间消息
     * @param data 
     */
    public static roomMessageNotify(data) {
        let router = "game.gameHandler.roomMessageNotify";
        let requestData = data;
        Gloab.NetworkManager.send(router, requestData);
    }

    /**
     * 进入游戏部分
     * @param data 
     */
    public static gameMessageNotify(data){
        let router = "game.gameHandler.gameMessageNotify";
        Gloab.NetworkManager.send(router, data);
    }
}
