import Gloab from "../../Gloab";

/**
 * 游戏相关的操作
 */
export default class GameHelper {

    /**
     * 进入房间的消息
     * @param gameType 
     * @param cb 
     */
    enterGame(gameType, cb) {
        let gameList = Gloab.Constant.gameDialogList;//获取当前游戏的配置

        for (let i = 0; i < gameList.length; i++) {
            let gameInfo = gameList[i];
            if (gameInfo.gameType == gameType) {
                Gloab.CCHelper.loadRes(gameInfo.gameDialog, function (err) {
                    Gloab.DialogManager.createDialog(gameInfo.gameDialog, null, function () {
                        Gloab.DialogManager.removeLoadingCircle();
                        Gloab.Utils.invokeCallback(cb, null, gameInfo);
                    })
                });
                return;
            }
        }
        cc.error("进入游戏出现错误，游戏类型没有找到 gameType=", gameType);
        Gloab.Utils.invokeCallback(cb, true);
    }
}
